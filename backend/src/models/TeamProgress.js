const mongoose = require('mongoose');

const teamProgressSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    unique: true
  },
  currentStage: {
    type: Number,
    default: 1
  },
  completedStages: [{
    type: Number
  }],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  finalCodeSubmitted: {
    type: Boolean,
    default: false
  },
  finalSubmissionTime: {
    type: Date
  },
  finalCodeAttempt: {
    type: String
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lockedAt: {
    type: Date
  },
  totalScore: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Update last activity on save
teamProgressSchema.pre('save', function(next) {
  this.lastActivity = Date.now();
  next();
});

module.exports = mongoose.model('TeamProgress', teamProgressSchema);