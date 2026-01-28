import mongoose from 'mongoose';
import dns from 'dns';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Prefer public DNS resolvers to reduce intermittent SRV lookup failures
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (err) {
      // non-fatal
      console.warn('Could not set DNS servers:', err?.message || err);
    }

    const opts = {
      bufferCommands: false,
      // shorten server selection timeout so failures surface quickly
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    } as any;

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      return cached;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
