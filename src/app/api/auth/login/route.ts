import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

/**
 * POST /api/auth/login
 * Body: { identifier: string (email or phone), password: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'অনুগ্রহ করে মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড প্রদান করুন।' },
        { status: 400 }
      );
    }

    const user = await serverStore.authenticate(identifier, password);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'সফলভাবে লগইন হয়েছে।',
      user
    });

    // Set user cookie (httpOnly: false so client can also sync session state seamlessly)
    response.cookies.set({
      name: 'kc_user',
      value: JSON.stringify(user),
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'লগইন ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}

