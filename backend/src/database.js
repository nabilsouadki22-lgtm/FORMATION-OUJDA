const prisma = require('./prismaClient');

const db = {
  prisma,

  product: {
    findAll: () => prisma.product.findMany(),
    findById: (id) => prisma.product.findUnique({ where: { id } }),
    createMany: (data) => prisma.product.createMany({ data }),
  },

  user: {
    findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    findById: (id) => prisma.user.findUnique({ where: { id } }),
    create: (data) => prisma.user.create({ data }),
    update: (where, data) => prisma.user.update({ where, data }),
  },

  course: {
    findAll: () => prisma.course.findMany(),
    findById: (id) => prisma.course.findUnique({ where: { id } }),
    create: (data) => prisma.course.create({ data }),
  },

  order: {
    findById: (id) => prisma.order.findUnique({ where: { id }, include: { items: true } }),
    create: (data) => prisma.order.create({ data }),
    update: (where, data) => prisma.order.update({ where, data }),
  },

  enrollment: {
    findByStudent: (studentId) => prisma.enrollment.findMany({ where: { studentId } }),
    create: (data) => prisma.enrollment.create({ data }),
  },

  transaction: (callback) => prisma.$transaction(callback),
  disconnect: () => prisma.$disconnect(),
};

module.exports = db;
