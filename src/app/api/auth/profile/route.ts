import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serverStore } from '@/lib/serverStore';

/**
 * PUT /api/auth/profile
 * Body: { userId, name, phone, email, nid, currentPassword, newPassword }
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('kc_user');
    let authenticatedId: string | null = null;

    if (userCookie?.value) {
      try {
        const parsed = JSON.parse(userCookie.value);
        authenticatedId = parsed.id;
      } catch {}
    }

    const body = await request.json();
    const targetUserId = body.userId || authenticatedId;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: 'প্রোফাইল আপডেট করতে অনুগ্রহ করে লগইন করুন।' },
        { status: 401 }
      );
    }

    const { name, phone, email, nid, jela, upazila, union, gram, currentPassword, newPassword } = body;

    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'আপনার নাম খালি রাখা যাবে না।' },
        { status: 400 }
      );
    }

    if (phone !== undefined && !phone.trim()) {
      return NextResponse.json(
        { success: false, message: 'মোবাইল নম্বর খালি রাখা যাবে না।' },
        { status: 400 }
      );
    }

    const result = await serverStore.updateUserProfile(targetUserId, {
      name,
      phone,
      email,
      nid,
      jela,
      upazila,
      union,
      gram,
      currentPassword,
      newPassword
    });

    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, message: result.error || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে।' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।',
      user: result.user
    });

    // Update session cookie
    response.cookies.set({
      name: 'kc_user',
      value: JSON.stringify(result.user),
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'সার্ভার ত্রুটি।' },
      { status: 500 }
    );
  }
}

