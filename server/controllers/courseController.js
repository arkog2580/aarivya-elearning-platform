const Course = require('../models/Course');

// @desc    Get all published courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .populate('instructorId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      level,
      price,
      instructorId: req.user.id
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check ownership
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ success: true, message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor courses
// @route   GET /api/courses/instructor
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses
};