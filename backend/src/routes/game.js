const express = require('express');
const { GameStage } = require('../models');

const router = express.Router();

// Get game stages
router.get('/stages', async (req, res) => {
  try {
    const stages = await GameStage.find().sort({ stageNumber: 1 });
    res.json(stages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stages: ' + error.message });
  }
});

// Submit answer
router.post('/submit', async (req, res) => {
  const { stageId, answer } = req.body;
  try {
    const stage = await GameStage.findById(stageId);
    if (!stage) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    
    const isCorrect = answer.toLowerCase().trim() === stage.correctAnswer.toLowerCase();
    
    res.json({ correct: isCorrect, message: isCorrect ? 'Correct!' : 'Try again!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer: ' + error.message });
  }
});



module.exports = router;