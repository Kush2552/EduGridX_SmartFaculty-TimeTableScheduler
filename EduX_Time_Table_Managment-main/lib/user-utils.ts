import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import User from '@/models/User';
import { authenticateRequest } from './auth-middleware';
import mongoose from 'mongoose';

interface GetCurrentUserOptions {
  requireAdmin?: boolean;
}

/**
 * User Utility Functions
 *
 * Provides helper functions for resolving authenticated users.
 */

/**
 * Get the current user from the request
 * Attempts to authenticate the request and return the user's ObjectId
 * 
 * @param {NextRequest} req - Next.js request object
 * @returns {Promise<mongoose.Types.ObjectId>} Authenticated user ObjectId
 */
export async function getCurrentUserId(
  req: NextRequest,
  options: GetCurrentUserOptions = {}
): Promise<mongoose.Types.ObjectId> {
  const { error, user } = await authenticateRequest(req, {
    requireAdmin: options.requireAdmin,
  });
  if (error || !user) {
    throw new Error('Unauthorized request');
  }

  await connectDB();
  const userDoc = await User.findById(user.userId);

  if (!userDoc) {
    throw new Error('Authenticated user not found');
  }

  return userDoc._id as mongoose.Types.ObjectId;
}

/**
 * Get user ObjectId from string or ObjectId
 * Helper function to safely convert user identifiers to ObjectId
 * 
 * @param {string | mongoose.Types.ObjectId} userId - User ID as string or ObjectId
 * @returns {mongoose.Types.ObjectId | null} Valid ObjectId or null
 */
export function toUserId(userId: string | mongoose.Types.ObjectId | undefined): mongoose.Types.ObjectId | null {
  if (!userId) return null;
  
  if (typeof userId === 'string') {
    // Check if it's a valid ObjectId string
    if (mongoose.Types.ObjectId.isValid(userId)) {
      return new mongoose.Types.ObjectId(userId);
    }
    return null;
  }
  
  return userId as mongoose.Types.ObjectId;
}
