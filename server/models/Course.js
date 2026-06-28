const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  order: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  lectures: [lectureSchema],
  status: {
    type: String,
    enum: ['draft', 'pending', 'published'],
    default: 'draft'
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);