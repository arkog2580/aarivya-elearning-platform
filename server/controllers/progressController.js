const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/progress/enroll/:courseId
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = await Progress.findOne({
      studentId: req.user.id,
      courseId: req.params.courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create progress entry
    const progress = await Progress.create({
      studentId: req.user.id,
      courseId: req.params.courseId
    });

    // Update enrolled count
    await Course.findByIdAndUpdate(req.params.courseId, {
      $inc: { enrolledCount: 1 }
    });

    res.status(201).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student progress for all courses
// @route   GET /api/progress
const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ studentId: req.user.id })
      .populate('courseId', 'title description thumbnail category');

    res.json({ success: true, count: progress.length, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get progress for specific course
// @route   GET /api/progress/:courseId
const getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      studentId: req.user.id,
      courseId: req.params.courseId
    }).populate('courseId', 'title lectures');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lecture completion
// @route   PUT /api/progress/:courseId/lecture/:lectureId
const updateLectureProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      studentId: req.user.id,
      courseId: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // Add lecture if not already completed
    if (!progress.completedLectures.includes(req.params.lectureId)) {
      progress.completedLectures.push(req.params.lectureId);
    }

    // Get course to calculate percentage
    const course = await Course.findById(req.params.courseId);
    const totalLectures = course.lectures.length;
    const completedCount = progress.completedLectures.length;

    // Update progress percentage
    progress.progressPercent = totalLectures > 0
      ? Math.round((completedCount / totalLectures) * 100)
      : 0;

    // Check if course completed
    progress.isCompleted = progress.progressPercent === 100;
    progress.lastAccessed = Date.now();

    await progress.save();

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enrollCourse,
  getMyProgress,
  getCourseProgress,
  updateLectureProgress
};