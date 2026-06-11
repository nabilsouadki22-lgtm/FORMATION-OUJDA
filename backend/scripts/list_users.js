const prisma = require('../src/prismaClient');

(async () => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, isAdmin: true } });
    console.log(JSON.stringify(users, null, 2));
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
