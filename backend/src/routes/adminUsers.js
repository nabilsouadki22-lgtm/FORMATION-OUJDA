const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../database');

// GET /api/admin/users - list all users
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await db.prisma.user.findMany({
      select: { id: true, email: true, role: true, isAdmin: true }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PATCH /api/admin/users/:id - update role/isAdmin
router.patch('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isAdmin } = req.body;
    const updates = {};

    if (role && !['student', 'teacher'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (typeof isAdmin === 'boolean') {
      updates.isAdmin = isAdmin;
    }
    if (role) {
      updates.role = role;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const user = await db.prisma.user.update({
      where: { id: parseInt(id) },
      data: updates,
      select: { id: true, email: true, role: true, isAdmin: true }
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
