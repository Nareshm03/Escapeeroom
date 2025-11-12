const express = require('express');
const { QuizSubmission, Quiz } = require('../models');

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const submissions = await QuizSubmission.find()
      .populate('quiz', 'title')
      .sort({ score: -1, submittedAt: 1 })
      .limit(10)
      .lean();

    const leaderboard = submissions.map(submission => ({
      team_name: submission.teamName,
      score: submission.score,
      submitted_at: submission.submittedAt,
      quiz_title: submission.quiz?.title,
      total_questions: submission.answers?.length || 0,
      percentage: submission.percentage
    }));

    console.log('Leaderboard query result:', leaderboard);
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard: ' + error.message });
  }
});

module.exports = router;