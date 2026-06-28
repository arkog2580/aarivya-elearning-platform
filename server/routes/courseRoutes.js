const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses
} = require('../controllers/courseController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/', protect, instructorOnly, createCourse);
router.put('/:id', protect, instructorOnly, updateCourse);
router.delete('/:id', protect, instructorOnly, deleteCourse);
router.get('/instructor/mycourses', protect, instructorOnly, getInstructorCourses);

module.exports = router;