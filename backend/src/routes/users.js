const express = require('express');
const { User } = require('../models');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'id email name createdAt')
      .sort({ createdAt: -1 });
    
    res.json(users.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users: ' + error.message });
  }
});

module.exports = router;