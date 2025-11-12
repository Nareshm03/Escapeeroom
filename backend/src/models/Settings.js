const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  settings: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  event_status: {
    type: String,
    enum: ['active', 'paused'],
    default: 'paused'
  },
  event_start_time: {
    type: Date,
    default: null
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

settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);