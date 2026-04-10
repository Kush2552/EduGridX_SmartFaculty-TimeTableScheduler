import { NextResponse } from 'next/server';
import { getAuthCookieName, getAuthCookieOptions } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );

  response.cookies.set(getAuthCookieName(), '', getAuthCookieOptions(0));

  return response;
}

