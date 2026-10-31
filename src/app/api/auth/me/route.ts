import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serverStore } from '@/lib/serverStore';

/**
 * GET /api/auth/me
 * Returns current authenticated user or null
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('kc_user');

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ success: false, user: null });
    }

    const parsed = JSON.parse(userCookie.value);
    const user = await serverStore.getUserById(parsed.id);

    return NextResponse.json({
      success: !!user,
      user: user || parsed
    });
  } catch {
    return NextResponse.json({ success: false, user: null });
  }
}

