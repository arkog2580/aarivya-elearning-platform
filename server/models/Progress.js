const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  lectureId: { type: mongoose.Schema.Types.ObjectId },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  attemptedAt: { type: Date, default: Date.now }
});

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLectures: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  progressPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quizScores: [quizScoreSchema],
  isCompleted: {
    type: Boolean,
    default: false
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate progress entries
progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);