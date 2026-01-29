import dns from 'dns';
import mongoose from 'mongoose';

// Set DNS servers IMMEDIATELY at module load, before any network operations
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log('DNS servers set to Google DNS');
} catch (err) {
  console.warn('Could not set DNS servers:', err?.message || err);
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(retries = 3) {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      let lastError: any;
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
          } as any;

          console.log(`[DB] Connection attempt ${attempt}/${retries}...`);
          await mongoose.connect(MONGODB_URI, opts);
          console.log('[DB] Connected successfully');
          return cached;
        } catch (err: any) {
          lastError = err;
          console.warn(`[DB] Attempt ${attempt} failed:`, err?.message || err);
          
          if (attempt < retries) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          }
        }
      }
      
      throw lastError;
    })();
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
