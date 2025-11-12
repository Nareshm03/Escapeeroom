const mongoose = require('mongoose');

const adminAnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  announcementType: {
    type: String,
    enum: ['info', 'warning', 'success', 'error', 'urgent'],
    default: 'info'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  targetAudience: {
    type: String,
    enum: ['all', 'teams', 'admins'],
    default: 'all'
  }
});

module.exports = mongoose.model('AdminAnnouncement', adminAnnouncementSchema);