const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getCourseAssignments,
  getInstructorAssignments,
  submitAssignment,
  gradeAssignment,
  getStudentAssignments
} = require('../controllers/assignmentController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

router.post('/', protect, instructorOnly, createAssignment);
router.get('/instructor', protect, instructorOnly, getInstructorAssignments);
router.get('/student', protect, getStudentAssignments);
router.get('/course/:courseId', protect, getCourseAssignments);
router.post('/:id/submit', protect, submitAssignment);
router.put('/:id/grade/:studentId', protect, instructorOnly, gradeAssignment);

module.exports = router;