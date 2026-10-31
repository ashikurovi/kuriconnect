import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'সফলভাবে লগআউট করা হয়েছে।'
  });

  response.cookies.set({
    name: 'kc_user',
    value: '',
    path: '/',
    maxAge: 0
  });

  return response;
}

export async function GET() {
  return POST();
}

