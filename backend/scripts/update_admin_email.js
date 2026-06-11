const prisma = require('../src/prismaClient');

(async () => {
  try {
    const newEmail = 'nabilvisuels@gmail.com';

    let admin = await prisma.user.findFirst({ where: { isAdmin: true } });
    if (!admin) {
      console.log('No admin user found. Creating one...');
      await prisma.user.create({
        data: {
          email: newEmail,
          password: '$2a$10$Jj0qNy5QO7WjJC4RPHBtKe5STxh2u6I3f987xgD1MoPItq4Lq4oi6', // hashed Admin123!
          role: 'teacher',
          isAdmin: true,
        },
      });
      console.log('Created admin user:', newEmail);
    } else {
      const existingNewEmailUser = await prisma.user.findUnique({ where: { email: newEmail } });
      if (existingNewEmailUser && existingNewEmailUser.id !== admin.id) {
        const backupEmail = `${newEmail}.backup.${existingNewEmailUser.id}`;
        await prisma.user.update({ where: { id: existingNewEmailUser.id }, data: { email: backupEmail } });
        console.log(`Renamed existing non-admin user email from ${newEmail} to ${backupEmail}`);
      }
      const oldEmail = admin.email;
      await prisma.user.update({
        where: { id: admin.id },
        data: { email: newEmail },
      });
      console.log(`Updated admin email from ${oldEmail} to ${newEmail}`);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Failed to update admin email:', error);
    process.exit(1);
  }
})();
