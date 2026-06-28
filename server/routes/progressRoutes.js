const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyProgress,
  getCourseProgress,
  updateLectureProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/enroll/:courseId', protect, enrollCourse);
router.get('/', protect, getMyProgress);
router.get('/:courseId', protect, getCourseProgress);
router.put('/:courseId/lecture/:lectureId', protect, updateLectureProgress);

module.exports = router;