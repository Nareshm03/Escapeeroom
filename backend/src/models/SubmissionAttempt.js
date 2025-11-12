const mongoose = require('mongoose');

const submissionAttemptSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  stageNumber: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  attemptsCount: {
    type: Number,
    default: 1
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

// Create compound index for efficient queries
submissionAttemptSchema.index({ team: 1, stageNumber: 1, submittedAt: -1 });
submissionAttemptSchema.index({ user: 1, submittedAt: -1 });

module.exports = mongoose.model('SubmissionAttempt', submissionAttemptSchema);