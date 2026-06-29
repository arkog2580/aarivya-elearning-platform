const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  deleteUser,
  approveCourse,
  rejectCourse,
  getPlatformStats,
  getPendingCourses
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes are admin only
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/users/:id', protect, adminOnly, getUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.get('/stats', protect, adminOnly, getPlatformStats);
router.get('/courses/pending', protect, adminOnly, getPendingCourses);
router.put('/courses/:id/approve', protect, adminOnly, approveCourse);
router.put('/courses/:id/reject', protect, adminOnly, rejectCourse);

module.exports = router;