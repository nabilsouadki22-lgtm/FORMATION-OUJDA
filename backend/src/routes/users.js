const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const prisma = require('../prismaClient');

// Returns the current authenticated user's public profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, isAdmin: true }
    });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
