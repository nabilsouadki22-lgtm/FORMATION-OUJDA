require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const adminOrdersRouter = require('./routes/adminOrders');
const prisma = require('./prismaClient');

const app = express();
const PORT = process.env.PORT || 4000;
const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');

app.use(cors());
app.use(express.json());

async function ensureInitialData() {
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    console.log('Seeding example products...');
    await prisma.product.createMany({
      data: [
        { name: 'Forfait web complet', description: 'Un package complet pour votre projet web.', price: 49.99 },
        { name: 'Support de cours PDF', description: 'Document pédagogique détaillé pour les étudiants.', price: 19.99 },
        { name: 'Soutien privé', description: 'Session de mentorat privé en ligne.', price: 29.99 },
        { name: 'Atelier en direct', description: 'Atelier pratique de groupe pour les formateurs.', price: 39.99 }
      ]
    });
  }

  let admin = await prisma.user.findFirst({ where: { isAdmin: true } });
  if (!admin) {
    console.log('Creating default admin user...');
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    admin = await prisma.user.create({
      data: {
        email: 'admin@centreoujda.com',
        password: hashedPassword,
        role: 'teacher',
        isAdmin: true
      }
    });
    console.log('Default admin created: admin@centreoujda.com / Admin123!');
  }

  let teacher = await prisma.user.findFirst({ where: { role: 'teacher', isAdmin: false } });
  if (!teacher) {
    console.log('Creating default teacher account...');
    const hashedPassword = await bcrypt.hash('Teacher123!', 10);
    teacher = await prisma.user.create({
      data: {
        email: 'teacher@centreoujda.com',
        password: hashedPassword,
        role: 'teacher'
      }
    });
    console.log('Default teacher created: teacher@centreoujda.com / Teacher123!');
  }

  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    console.log('Seeding example courses...');
    await prisma.course.createMany({
      data: [
        { title: 'Développement Web', description: 'Apprenez les bases HTML, CSS et JavaScript.', price: 199.99, teacherId: teacher.id },
        { title: 'Marketing Digital', description: 'Stratégies marketing adaptées aux formations.', price: 149.99, teacherId: teacher.id },
        { title: 'Gestion de projet', description: 'Méthodes agiles pour piloter des formations.', price: 129.99, teacherId: teacher.id }
      ]
    });
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin/orders', adminOrdersRouter);

if (fs.existsSync(frontendDistPath)) {
  console.log(`Serving frontend from ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.log(`Frontend dist not found at ${frontendDistPath}`);
}

ensureInitialData().catch((err) => {
  console.error('Failed to seed initial data:', err);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
