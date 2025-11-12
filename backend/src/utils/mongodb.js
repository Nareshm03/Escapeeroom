const mongoose = require('mongoose');

// Prefer strict query parsing to avoid silent coercions
mongoose.set('strictQuery', true);

// Retry logic with exponential backoff for MongoDB connections
const connectDB = async ({ maxRetries = 5, baseDelayMs = 500 } = {}) => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escape-room-app';

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      await mongoose.connect(mongoURI, {
        // Modern driver options
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 20000,
        maxPoolSize: 20,
        minPoolSize: 5,
        retryWrites: true,
        w: 'majority',
      });
      console.log('MongoDB connected successfully');

      // Connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      // Graceful shutdown
      process.once('SIGINT', async () => {
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed due to app termination');
        } catch (err) {
          console.error('Error during MongoDB shutdown:', err.message);
        } finally {
          process.exit(0);
        }
      });
      return;
    } catch (error) {
      attempt += 1;
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), 10000);
      const sanitizedURI = mongoURI.replace(/:\S+@/, ':****@');
      console.error(`MongoDB connection attempt ${attempt} failed for ${sanitizedURI}:`, error.message);
      if (attempt > maxRetries) {
        console.error('Exceeded maximum MongoDB connection attempts. Exiting.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;