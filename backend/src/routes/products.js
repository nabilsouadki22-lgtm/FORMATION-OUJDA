const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Seed sample products
router.post('/seed', async (req, res) => {
  try {
    const items = [
      { name: 'Sample App A', description: 'Great app A', price: 4.99 },
      { name: 'Sample App B', description: 'Awesome app B', price: 9.99 },
      { name: 'Sample App C', description: 'Utility app C', price: 0.0 }
    ];
    const created = [];
    for (const i of items) {
      const p = await prisma.product.create({ data: i });
      created.push(p);
    }
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Seed failed' });
  }
});

module.exports = router;
