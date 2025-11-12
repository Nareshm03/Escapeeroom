const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Settings = require('../models/Settings');

const router = express.Router();

let io; // Socket.io instance
router.setSocketIO = (socketIO) => { io = socketIO; };

// Get all teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get teams: ' + error.message });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [teams, quizzes, submissions, settings] = await Promise.all([
      Team.countDocuments(),
      Quiz.countDocuments({ is_published: true }),
      QuizSubmission.find(),
      Settings.findOne()
    ]);

    const avgScore = submissions.length > 0
      ? submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / submissions.length
      : 0;

    // Generate 24-hour trend data (mock for now)
    const now = Date.now();
    const trends = {
      teams: Array.from({ length: 24 }, (_, i) => ({
        time: now - (23 - i) * 3600000,
        value: Math.max(0, teams - Math.floor(Math.random() * 5))
      })),
      games: Array.from({ length: 24 }, (_, i) => ({
        time: now - (23 - i) * 3600000,
        value: Math.max(0, quizzes - Math.floor(Math.random() * 3))
      })),
      score: Array.from({ length: 24 }, (_, i) => ({
        time: now - (23 - i) * 3600000,
        value: Math.max(0, avgScore - Math.random() * 10)
      }))
    };

    res.json({
      totalTeams: teams,
      activeGames: quizzes,
      completedSessions: submissions.length,
      averageScore: parseFloat(avgScore.toFixed(2)),
      trends,
      eventStatus: settings?.event_status || 'paused',
      eventStartTime: settings?.event_start_time || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats: ' + error.message });
  }
});

// Toggle event status
router.post('/event/toggle', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'paused'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    settings.event_status = status;
    if (status === 'active' && !settings.event_start_time) {
      settings.event_start_time = new Date();
    }
    await settings.save();

    res.json({ 
      status: settings.event_status, 
      startTime: settings.event_start_time,
      message: `Event ${status === 'active' ? 'started' : 'paused'}` 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle event: ' + error.message });
  }
});

// Start event
router.post('/event/start', async (req, res) => {
  try {
    if (io) io.emit('startGame');
    res.json({ message: 'Event started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pause event
router.post('/event/pause', async (req, res) => {
  try {
    if (io) io.emit('pauseGame');
    res.json({ message: 'Event paused' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset event
router.post('/event/reset', async (req, res) => {
  try {
    if (io) io.emit('resetGame');
    res.json({ message: 'Event reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disqualify team
router.post('/teams/:id/disqualify', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { disqualified: true },
      { new: true }
    );
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team disqualified', team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;