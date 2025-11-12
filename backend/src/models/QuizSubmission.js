const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  answers: [{
    questionOrder: Number,
    answer: String,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  score: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: Date.now
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  }
});

// Calculate percentage and total time before saving
quizSubmissionSchema.pre('save', function(next) {
  if (this.answers.length > 0) {
    const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
    this.percentage = Math.round((correctAnswers / this.answers.length) * 100);
  }
  
  if (this.startTime && this.endTime) {
    this.totalTimeSpent = Math.round((this.endTime - this.startTime) / 1000);
  }
  
  next();
});

// Index to support leaderboard and results queries
quizSubmissionSchema.index({ quiz: 1, score: -1, submittedAt: 1 });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);