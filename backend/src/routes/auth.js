const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Team } = require('../models');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, teamName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({
      email,
      password,
      name
    });
    await user.save();

    // Create team
    const team = new Team({
      name: teamName || `${name}'s Team`,
      createdBy: user._id,
      members: [{
        user: user._id,
        role: 'admin'
      }]
    });
    await team.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      user: { id: user._id, email: user.email, name: user.name },
      team: { id: team._id, name: team.name },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', { email, password: password ? '[HIDDEN]' : 'undefined' });
    
    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

module.exports = router;