const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../database');

// GET /api/admin/orders - list all orders
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await db.prisma.order.findMany({
      include: {
        user: {
          select: { id: true, email: true }
        },
        items: {
          include: { product: true }
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

// GET /api/admin/orders/:id - get order by id
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, email: true } },
        items: { include: { product: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/admin/orders/:id - update status
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await db.prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: { select: { id: true, email: true } },
        items: { include: { product: true } }
      }
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
