const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const prisma = require('../prismaClient');

// POST /api/orders - Create a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body; // items: [{productId, quantity}, ...]
    const userId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' });
    }

    // Validate all products exist and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Each item must have productId and quantity > 0' });
      }

      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) }
      });

      if (!product) {
        return res.status(404).json({ error: `Product ${productId} not found` });
      }

      totalAmount += product.price * quantity;
      orderItems.push({
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        priceAtPurchase: product.price
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders - List user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/export - Export user's orders as CSV
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const header = ['orderId', 'status', 'createdAt', 'totalAmount', 'itemCount', 'items']
    const rows = orders.map((order) => {
      const items = order.items
        .map((item) => `${item.product?.name || 'Unknown'} x${item.quantity}`)
        .join('; ')
      return [
        order.id,
        order.status,
        order.createdAt.toISOString(),
        order.totalAmount.toFixed(2),
        order.items.length,
        items
      ]
    })

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"')
    res.send(csv)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to export orders' })
  }
})

// GET /api/orders/:id - Fetch a single order (only if belongs to user)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
