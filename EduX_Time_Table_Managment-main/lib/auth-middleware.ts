import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './auth';
import connectDB from './mongodb';
import User from '@/models/User';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthenticateOptions {
  requireAdmin?: boolean;
}

export async function authenticateRequest(
  req: NextRequest,
  options: AuthenticateOptions = {}
): Promise<{ error: NextResponse | null; user: AuthenticatedUser | null }> {
  const token = getTokenFromRequest(req);

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      ),
      user: null,
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      ),
      user: null,
    };
  }

  await connectDB();

  const userRecord = await User.findById(payload.userId)
    .select('email role isVerified');

  if (!userRecord) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - User not found' },
        { status: 401 }
      ),
      user: null,
    };
  }

  if (!userRecord.isVerified) {
    return {
      error: NextResponse.json(
        { error: 'Account is not verified' },
        { status: 403 }
      ),
      user: null,
    };
  }

  if (options.requireAdmin && userRecord.role !== 'admin') {
    return {
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      ),
      user: null,
    };
  }

  return {
    error: null,
    user: {
      userId: userRecord._id.toString(),
      email: userRecord.email,
      role: userRecord.role,
    },
  };
}

