import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

/**
 * POST /api/reports/upvote
 * Body: { id: string }
 * Atomically increments upvotes_count in Neon PostgreSQL and returns the updated count.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'রিপোর্ট আইডি (id) আবশ্যক।' },
        { status: 400 }
      );
    }

    const count = await serverStore.incrementReportUpvote(id);
    if (count === null) {
      return NextResponse.json(
        { success: false, message: 'রিপোর্ট পাওয়া যায়নি বা আপডেট সম্ভব হয়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id,
      upvotesCount: count,
      message: 'গুরুত্ব সমর্থন সফলভাবে রেকর্ড করা হয়েছে।'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'সার্ভার ত্রুটি।' },
      { status: 500 }
    );
  }
}

