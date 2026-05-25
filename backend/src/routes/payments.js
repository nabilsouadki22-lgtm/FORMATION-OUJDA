const express = require('express')
const Stripe = require('stripe')
const prisma = require('../prismaClient')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  const { items } = req.body
  const userId = req.user.id

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required.' })
  }

  try {
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const { productId, quantity } = item
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Each item requires a productId and quantity > 0.' })
      }

      const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } })
      if (!product) {
        return res.status(404).json({ error: `Product ${productId} not found` })
      }

      totalAmount += product.price * quantity
      orderItems.push({
        productId: product.id,
        quantity: parseInt(quantity),
        priceAtPurchase: product.price,
        productName: product.name,
        productDescription: product.description || ''
      })
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'pending',
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase
          }))
        }
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.priceAtPurchase * 100),
          product_data: {
            name: item.productName,
            description: item.productDescription
          }
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${FRONTEND_URL}/?checkoutSuccess=true&orderId=${order.id}`,
      cancel_url: `${FRONTEND_URL}/?checkoutCanceled=true`,
      metadata: {
        orderId: String(order.id)
      }
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create checkout session' })
  }
})

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('Stripe webhook secret is not configured')
    return res.status(500).send('Stripe webhook secret missing')
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId
    if (orderId) {
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: 'completed' }
      })
    }
  }

  res.json({ received: true })
})

module.exports = router
