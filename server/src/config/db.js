import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB using Mongoose.
 * If connection fails, it logs a warning and allows development mode to run.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/paypilot_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn('[Database] Server will continue running without database connectivity.');
    return false;
  }
};
