const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function setupDatabase() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escape-room-app';

  try {
    // Connect to MongoDB with modern options
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected');

    // Initialize indexes for all models
    const models = require('./backend/src/models');
    const initPromises = Object.values(models).map(model => {
      if (typeof model.init === 'function') {
        return model.init();
      }
      return Promise.resolve();
    });
    await Promise.all(initPromises);
    console.log('Model indexes initialized');

    // Seed default settings if none exist
    const { Settings } = models;
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      const defaultSettings = new Settings({
        settings: {
          quizEnabled: true,
          leaderboardEnabled: true,
          gameEnabled: true,
          maxTeamSize: 4
        }
      });
      await defaultSettings.save();
      console.log('Default settings seeded');
    } else {
      console.log('Settings already exist; skipping seed');
    }

    console.log('MongoDB setup completed successfully');
  } catch (error) {
    console.error('MongoDB setup error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

setupDatabase();