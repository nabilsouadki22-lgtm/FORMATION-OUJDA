const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../database');

router.get('/', async (req, res) => {
  try {
    const courses = await db.prisma.course.findMany({
      include: {
        teacher: { select: { id: true, email: true, role: true } },
        enrollments: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses.map((course) => ({
      ...course,
      studentCount: course.enrollments.length,
      enrollments: undefined
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/my/enrollments', auth, async (req, res) => {
  try {
    const enrollments = await db.prisma.enrollment.findMany({
      where: { studentId: req.user.id },
      include: {
        course: { include: { teacher: { select: { id: true, email: true, role: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

router.get('/my/courses', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Only teachers can view their own courses' });
    }

    const courses = await db.prisma.course.findMany({
      where: { teacherId: req.user.id },
      include: {
        enrollments: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(courses.map((course) => ({
      ...course,
      studentCount: course.enrollments.length,
      enrollments: undefined
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teacher courses' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Only teachers can create courses' });
    }

    const { title, description, price } = req.body;
    if (!title) return res.status(400).json({ error: 'Course title is required' });

    const course = await db.prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        teacherId: req.user.id
      },
      include: {
        teacher: { select: { id: true, email: true, role: true } }
      }
    });

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.post('/:id/enroll', auth, async (req, res) => {
  try {
    if (req.user.role === 'teacher' && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Teachers cannot enroll as students' });
    }

    const courseId = parseInt(req.params.id);
    const course = await db.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const exists = await db.prisma.enrollment.findFirst({
      where: { courseId, studentId: req.user.id }
    });
    if (exists) return res.status(400).json({ error: 'Already enrolled in this course' });

    const enrollment = await db.prisma.enrollment.create({
      data: { courseId, studentId: req.user.id }
    });

    res.status(201).json({ enrollment, message: 'Enrollment completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

router.get('/:id/enrollments', auth, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await db.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (req.user.id !== course.teacherId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Only the course teacher or admin can view enrollments' });
    }

    const enrollments = await db.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: { select: { id: true, email: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await db.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: { select: { id: true, email: true, role: true } },
        enrollments: { select: { id: true } }
      }
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    res.json({
      ...course,
      studentCount: course.enrollments.length,
      enrollments: undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await db.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (req.user.id !== course.teacherId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Only the course teacher or admin can update this course' });
    }

    const { title, description, price } = req.body;
    const updated = await db.prisma.course.update({
      where: { id: courseId },
      data: {
        title: title ?? course.title,
        description: description ?? course.description,
        price: price !== undefined ? parseFloat(price) : course.price
      },
      include: {
        teacher: { select: { id: true, email: true, role: true } },
        enrollments: { select: { id: true } }
      }
    });

    res.json({
      ...updated,
      studentCount: updated.enrollments.length,
      enrollments: undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

module.exports = router;
