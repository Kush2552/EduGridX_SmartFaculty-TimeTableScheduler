import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateOtpCode, getOtpExpiryDate } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { username, email, password, name } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedUsername = String(username || '').trim();

    // Validation
    if (!normalizedUsername || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existingByUsername = await User.findOne({ username: normalizedUsername });
    if (existingByUsername && existingByUsername.email !== normalizedEmail) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    const otp = generateOtpCode();
    const otpExpiry = getOtpExpiryDate();
    const existingByEmail = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpiry');

    let user;

    if (existingByEmail) {
      if (existingByEmail.isVerified) {
        return NextResponse.json(
          { error: 'Email is already registered' },
          { status: 409 }
        );
      }

      existingByEmail.username = normalizedUsername;
      existingByEmail.email = normalizedEmail;
      existingByEmail.password = password;
      existingByEmail.name = name || normalizedUsername;
      existingByEmail.role = 'user';
      existingByEmail.isVerified = false;
      existingByEmail.otp = otp;
      existingByEmail.otpExpiry = otpExpiry;

      user = await existingByEmail.save();
    } else {
      user = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password,
        name: name || normalizedUsername,
        role: 'user',
        isVerified: false,
        otp,
        otpExpiry,
      });
    }

    await sendOtpEmail(user.email, otp, user.username);

    return NextResponse.json(
      {
        message: 'Registration successful. Please verify your email with the OTP sent.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this username or email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

