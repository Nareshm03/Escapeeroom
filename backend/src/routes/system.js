const express = require('express');
const { Settings } = require('../models');

const router = express.Router();

// Get system status
router.get('/status', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    
    res.json({
      timeLimit: settings?.settings?.timeLimit || 0,
      antiCheat: !settings?.settings?.allowCopy && !settings?.settings?.allowPaste,
      sebMode: settings?.settings?.sebMode || false
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system status: ' + error.message });
  }
});

module.exports = router;
