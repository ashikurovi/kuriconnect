import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

/**
 * POST /api/auth/register
 * Body: { name, phone, email, password, role?: 'admin' | 'user' }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, nid, email, password, role } = body;

    if (!name || !phone || !nid || !password) {
      return NextResponse.json(
        { success: false, message: 'পুরো নাম, মোবাইল নম্বর, জাতীয় পরিচয়পত্র (NID) নম্বর এবং পাসওয়ার্ড আবশ্যক।' },
        { status: 400 }
      );
    }

    const cleanNid = nid.toString().trim().replace(/[\s-]/g, '');
    if (cleanNid.length < 10) {
      return NextResponse.json(
        { success: false, message: 'সঠিক জাতীয় পরিচয়পত্র (NID) নম্বর প্রদান করুন (কমপক্ষে ১০ ডিজিট)।' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { success: false, message: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' },
        { status: 400 }
      );
    }

    const result = await serverStore.registerUser({
      name,
      phone,
      nid: cleanNid,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user'
    });

    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, message: result.error || 'নিবন্ধন সম্পন্ন করা যায়নি।' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'অভিনন্দন! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।',
      user: result.user
    }, { status: 201 });

    response.cookies.set({
      name: 'kc_user',
      value: JSON.stringify(result.user),
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'সার্ভার ত্রুটি।' },
      { status: 500 }
    );
  }
}

