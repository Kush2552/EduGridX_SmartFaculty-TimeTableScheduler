import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  getTokenFromRequest,
  getAuthCookieName,
  getAuthCookieOptions,
} from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      const response = NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
      response.cookies.set(getAuthCookieName(), '', getAuthCookieOptions(0));
      return response;
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-password -otp -otpExpiry');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Account is not verified' },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

