const mongoose = require('mongoose');

const gameStageSchema = new mongoose.Schema({
  stageNumber: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['puzzle', 'riddle', 'math', 'logic', 'word', 'other']
  },
  puzzleText: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  hints: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameStage', gameStageSchema);