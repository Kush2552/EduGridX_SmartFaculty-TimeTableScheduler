import mongoose from 'mongoose';

/**
 * MongoDB Connection Manager
 * 
 * This module provides a centralized, production-ready MongoDB connection
 * that works seamlessly with both local MongoDB and MongoDB Atlas.
 * 
 * Features:
 * - Environment-based configuration (.env.local)
 * - Connection caching to prevent multiple connections
 * - Hot reload safe (Next.js development mode)
 * - Production-ready error handling
 * - Automatic SSL for MongoDB Atlas
 */

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error(
    '❌ MONGODB_URI is not defined. Please add it to your .env.local file.\n' +
    '   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name'
  );
}

// Detect if we're using MongoDB Atlas (SRV connection string)
const isAtlas = MONGODB_URI.startsWith('mongodb+srv://');

// Extract database name for logging (without exposing credentials)
const getDatabaseName = (uri: string): string => {
  try {
    if (isAtlas) {
      // For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname
      const match = uri.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/);
      return match ? match[1] : 'unknown';
    } else {
      // For local: mongodb://localhost:27017/dbname
      const match = uri.match(/mongodb:\/\/[^/]+\/([^?]+)/);
      return match ? match[1] : 'unknown';
    }
  } catch {
    return 'unknown';
  }
};

const databaseName = getDatabaseName(MONGODB_URI);
const connectionType = isAtlas ? 'MongoDB Atlas' : 'Local MongoDB';

// Connection cache interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global type for Next.js hot reload support
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize cache (use global in development to prevent multiple connections during hot reload)
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB Database
 * 
 * This function establishes a connection to MongoDB (local or Atlas).
 * It uses connection caching to prevent multiple simultaneous connections,
 * which is especially important in Next.js serverless environments.
 * 
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 * @throws {Error} If connection fails
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if one doesn't exist
  if (!cached.promise) {
    // Connection options optimized for both local and Atlas
    const connectionOptions: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Additional options for MongoDB Atlas
    if (isAtlas) {
      // Atlas automatically uses SSL, but we can be explicit
      console.log(`🔗 Connecting to ${connectionType} (Database: ${databaseName})...`);
    } else {
      console.log(`🔗 Connecting to ${connectionType} (Database: ${databaseName})...`);
    }

    cached.promise = mongoose
      .connect(MONGODB_URI!, connectionOptions)
      .then((mongooseInstance) => {
        console.log(`✅ Successfully connected to ${connectionType}`);
        console.log(`   Database: ${databaseName}`);
        console.log(`   Ready State: ${mongooseInstance.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        return mongooseInstance;
      })
      .catch((error) => {
        console.error(`❌ MongoDB connection error:`);
        console.error(`   Type: ${connectionType}`);
        console.error(`   Database: ${databaseName}`);
        console.error(`   Error: ${error.message}`);
        
        // Provide helpful error messages
        if (isAtlas) {
          console.error(`\n💡 Troubleshooting tips for MongoDB Atlas:`);
          console.error(`   1. Verify your IP address is whitelisted in Atlas Network Access`);
          console.error(`   2. Check your username and password are correct`);
          console.error(`   3. Ensure your cluster is running and accessible`);
          console.error(`   4. Verify the database name in your connection string`);
        } else {
          console.error(`\n💡 Troubleshooting tips for Local MongoDB:`);
          console.error(`   1. Ensure MongoDB is running locally`);
          console.error(`   2. Check the connection string format`);
          console.error(`   3. Verify the port (default: 27017) is correct`);
        }
        
        // Clear the promise on error so we can retry
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Export the connection function
export default connectDB;

