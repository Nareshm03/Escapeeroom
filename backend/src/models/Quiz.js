const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  questionOrder: {
    type: Number,
    required: true
  },
  timeLimitSeconds: {
    type: Number,
    default: 120
  },
  options: [{
    type: String
  }],
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  quizLink: {
    type: String,
    required: true,
    unique: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  totalTimeMinutes: {
    type: Number,
    default: 30
  },
  sequential_unlock_enabled: {
    type: Boolean,
    default: true
  },
  questions: [quizQuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique quiz link before saving if not provided
quizSchema.pre('save', function(next) {
  if (!this.quizLink) {
    this.quizLink = Math.random().toString(36).substring(2, 15);
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);