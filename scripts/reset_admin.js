const prisma = require('../backend/src/prismaClient');
const bcrypt = require('bcryptjs');

(async ()=>{
  try {
    const email = 'admin@centreoujda.com';
    const password = 'Admin123!';
    const hashed = await bcrypt.hash(password, 10);

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({ where: { email }, data: { password: hashed, role: 'teacher', isAdmin: true } });
      console.log('Updated existing admin user:', email);
    } else {
      await prisma.user.create({ data: { email, password: hashed, role: 'teacher', isAdmin: true } });
      console.log('Created new admin user:', email);
    }
    await prisma.$disconnect();
  } catch (e) {
    console.error('Error resetting admin:', e);
    process.exit(1);
  }
})();
