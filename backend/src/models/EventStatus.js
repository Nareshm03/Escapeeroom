const mongoose = require('mongoose');

const eventStatusSchema = new mongoose.Schema({
  eventName: {
    type: String,
    default: 'Escape Room Challenge'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  winnerTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  maxTeams: {
    type: Number,
    default: 50
  },
  maxTeamSize: {
    type: Number,
    default: 5
  },
  eventDescription: {
    type: String,
    default: 'Join the ultimate escape room challenge!'
  }
});

// Update the updatedAt timestamp before saving
eventStatusSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EventStatus', eventStatusSchema);