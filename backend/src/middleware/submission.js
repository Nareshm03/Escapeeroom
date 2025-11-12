const { Team, TeamProgress, SubmissionAttempt } = require('../models');
const mongoose = require('mongoose');

// Prevent duplicate submissions per stage
const preventDuplicateSubmission = async (req, res, next) => {
  try {
    // Validate user id format if present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: missing user context' });
    }

    const userId = req.user.id;

    // Find user's team via embedded members array
    const team = await Team.findOne({ 'members.user': userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const teamId = team._id;

    // Get team progress
    const progress = await TeamProgress.findOne({ team: teamId });
    if (!progress) {
      return res.status(404).json({ error: 'Game not started' });
    }

    const currentStage = progress.currentStage;

    // Check for recent correct submission (within last 5 seconds)
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const recentCorrect = await SubmissionAttempt.findOne({
      team: teamId,
      stageNumber: currentStage,
      isCorrect: true,
      submittedAt: { $gt: fiveSecondsAgo }
    }).lean();

    if (recentCorrect) {
      return res.status(429).json({ error: 'Stage already completed recently' });
    }

    // Check submission rate (max 3 per minute per stage)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const attemptsCount = await SubmissionAttempt.countDocuments({
      team: teamId,
      stageNumber: currentStage,
      submittedAt: { $gt: oneMinuteAgo }
    });

    if (attemptsCount >= 3) {
      return res.status(429).json({ error: 'Too many attempts for this stage. Wait 1 minute.' });
    }

    req.teamId = teamId;
    req.currentStage = currentStage;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Prevent duplicate final code submissions
const preventDuplicateFinalSubmission = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: missing user context' });
    }

    const userId = req.user.id;

    // Get user's team
    const team = await Team.findOne({ 'members.user': userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const teamId = team._id;

    // Check if final code already submitted
    const progress = await TeamProgress.findOne({ team: teamId });
    if (progress && progress.finalCodeSubmitted) {
      return res.status(400).json({ error: 'Final code already submitted' });
    }

    req.teamId = teamId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  preventDuplicateSubmission,
  preventDuplicateFinalSubmission
};