import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot-reloads
 * in development and serverless function executions on Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables.');
    return null;
  }

  // If already connected, return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB connected successfully to database:', mongooseInstance.connection.name);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      console.error('❌ MongoDB connection failed:', err.message);
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.conn || mongoose.connection.readyState !== 1) {
      cached.promise = null;
      cached.conn = null;
      return null;
    }
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error('❌ Error awaiting MongoDB connection promise:', error.message);
    return null;
  }

  return cached.conn;
}
