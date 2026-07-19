const Assignment = require('../models/Assignment');

// @desc    Create assignment
// @route   POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, maxMarks } = req.body;
    const assignment = await Assignment.create({
      courseId, title, description, dueDate,
      maxMarks: maxMarks || 100,
      instructorId: req.user.id
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
const getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments for instructor
// @route   GET /api/assignments/instructor
const getInstructorAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ instructorId: req.user.id })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Check if already submitted
    const alreadySubmitted = assignment.submissions.find(
      s => s.studentId.toString() === req.user.id
    );
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'Already submitted this assignment' });
    }

    assignment.submissions.push({
      studentId: req.user.id,
      studentName: req.user.name,
      submissionText: req.body.submissionText
    });

    await assignment.save();
    res.json({ success: true, message: 'Assignment submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade assignment
// @route   PUT /api/assignments/:id/grade/:studentId
const gradeAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(
      s => s.studentId.toString() === req.params.studentId
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback || '';
    submission.status = 'graded';

    await assignment.save();
    res.json({ success: true, message: 'Assignment graded successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student submissions
// @route   GET /api/assignments/student
const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('courseId', 'title category');

    const studentAssignments = assignments.map(assignment => {
      const submission = assignment.submissions.find(
        s => s.studentId.toString() === req.user.id
      );
      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
        courseTitle: assignment.courseId?.title,
        courseId: assignment.courseId?._id,
        submission: submission || null
      };
    });

    res.json({ success: true, assignments: studentAssignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAssignment,
  getCourseAssignments,
  getInstructorAssignments,
  submitAssignment,
  gradeAssignment,
  getStudentAssignments
};