const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve course
// @route   PUT /api/admin/courses/:id/approve
const approveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.status = 'published';
    await course.save();
    res.json({ success: true, message: 'Course approved', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject course
// @route   PUT /api/admin/courses/:id/reject
const rejectCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    course.status = 'draft';
    await course.save();
    res.json({ success: true, message: 'Course rejected', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'published' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const totalEnrollments = await Progress.countDocuments();
    const completedCourses = await Progress.countDocuments({ isCompleted: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        pendingCourses,
        totalEnrollments,
        completedCourses
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending courses
// @route   GET /api/admin/courses/pending
const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' })
      .populate('instructorId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  approveCourse,
  rejectCourse,
  getPlatformStats,
  getPendingCourses
};