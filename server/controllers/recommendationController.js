const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Smart scoring algorithm
const scoreCourse = (course, userInterests, completedCategories) => {
  let score = 0;
  const reasons = [];

  // Interest match scoring (highest priority)
  userInterests.forEach(interest => {
    if (course.category.toLowerCase().includes(interest.toLowerCase()) ||
        course.title.toLowerCase().includes(interest.toLowerCase())) {
      score += 40;
      reasons.push(`Matches your interest in ${interest}`);
    }
  });

  // Completed category bonus (learn related topics)
  completedCategories.forEach(category => {
    if (course.category.toLowerCase().includes(category.toLowerCase())) {
      score += 20;
      reasons.push(`Related to courses you completed`);
    }
  });

  // Popularity scoring
  if (course.enrolledCount > 100) { score += 15; reasons.push('Very popular course'); }
  else if (course.enrolledCount > 50) { score += 10; reasons.push('Popular course'); }
  else if (course.enrolledCount > 10) { score += 5; }

  // Rating scoring
  if (course.rating >= 4.5) { score += 15; reasons.push('Highly rated'); }
  else if (course.rating >= 4.0) { score += 10; }

  // Level scoring (beginners start with beginner courses)
  if (completedCategories.length === 0 && course.level === 'beginner') {
    score += 10;
    reasons.push('Perfect for beginners');
  }

  return {
    score,
    reason: reasons.length > 0
      ? reasons[0]
      : `Popular ${course.category} course`
  };
};

// @desc    Get smart recommendations for student
// @route   GET /api/recommendations
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const progressData = await Progress.find({ studentId: req.user.id })
      .populate('courseId', 'title category');

    const enrolledCourseIds = progressData.map(p => p.courseId._id.toString());
    const completedCategories = progressData
      .filter(p => p.isCompleted)
      .map(p => p.courseId.category);

    // Get available courses not yet enrolled
    const availableCourses = await Course.find({
      status: 'published',
      _id: { $nin: enrolledCourseIds }
    }).populate('instructorId', 'name');

    if (availableCourses.length === 0) {
      return res.json({
        success: true,
        recommendations: [],
        message: 'No new courses available'
      });
    }

    // Score and rank all courses
    const scoredCourses = availableCourses.map(course => {
      const { score, reason } = scoreCourse(
        course,
        user.interests || [],
        completedCategories
      );
      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        enrolledCount: course.enrolledCount,
        rating: course.rating,
        instructorName: course.instructorId?.name || 'Instructor',
        reason,
        matchScore: Math.min(score, 100)
      };
    });

    // Sort by score descending
    scoredCourses.sort((a, b) => b.matchScore - a.matchScore);

    // Return top 6 recommendations
    const recommendations = scoredCourses.slice(0, 6);

    res.json({
      success: true,
      count: recommendations.length,
      userInterests: user.interests || [],
      recommendations
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user interests
// @route   PUT /api/recommendations/interests
const updateInterests = async (req, res) => {
  try {
    const { interests } = req.body;
    await User.findByIdAndUpdate(req.user.id, { interests });
    res.json({ success: true, message: 'Interests updated!', interests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending courses
// @route   GET /api/recommendations/trending
const getTrending = async (req, res) => {
  try {
    const trending = await Course.find({ status: 'published' })
      .sort({ enrolledCount: -1 })
      .limit(5)
      .populate('instructorId', 'name');
    res.json({ success: true, trending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendations, updateInterests, getTrending };