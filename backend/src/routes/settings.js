const express = require('express');
const { Settings } = require('../models');

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    const settingsDoc = await Settings.findOne();
    if (settingsDoc) {
      res.json(settingsDoc.settings);
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Settings get error:', error);
    res.status(500).json({ error: 'Failed to get settings: ' + error.message });
  }
});

// Save settings
router.post('/', async (req, res) => {
  console.log('Settings POST route hit with data:', req.body);
  try {
    const settings = req.body;
    
    // Check if settings exist
    let settingsDoc = await Settings.findOne();
    
    if (settingsDoc) {
      // Update existing settings
      settingsDoc.settings = settings;
      await settingsDoc.save();
    } else {
      // Create new settings
      settingsDoc = new Settings({ settings });
      await settingsDoc.save();
    }
    
    console.log('Settings saved successfully');
    res.json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    console.error('Settings save error:', error);
    res.status(500).json({ error: 'Failed to save settings: ' + error.message });
  }
});

module.exports = router;