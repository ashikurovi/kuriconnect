import { NextResponse } from 'next/server';
import { COMMUNITY_REPORTS, UPAZILAS } from '@/data/kurigramData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const upazilaId = searchParams.get('upazilaId');

  let list = [...COMMUNITY_REPORTS];

  if (status && status !== 'all') {
    list = list.filter((r) => r.status === status);
  }

  if (upazilaId && upazilaId !== 'all') {
    list = list.filter((r) => r.upazilaId === upazilaId);
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    data: list
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.titleBn || !body.descriptionBn || !body.locationDetailsBn) {
      return NextResponse.json(
        { success: false, message: 'প্রয়োজনীয় তথ্য অসম্পূর্ণ।' },
        { status: 400 }
      );
    }

    const upazila = UPAZILAS.find((u) => u.id === body.upazilaId);

    const newReport = {
      id: `rep-${Date.now()}`,
      titleBn: body.titleBn,
      descriptionBn: body.descriptionBn,
      category: body.category || 'damaged-road',
      categoryLabelBn: 'নাগরিক সেবা ও অবকাঠামো',
      upazilaId: body.upazilaId || 'kurigram-sadar',
      upazilaNameBn: upazila ? upazila.nameBn : 'কুড়িগ্রাম সদর',
      locationDetailsBn: body.locationDetailsBn,
      status: 'submitted',
      submittedAt: '৩০ অক্টোবর ২০২৬',
      updatedAt: '৩০ অক্টোবর ২০২৬',
      reporterNameMasked: body.reporterName ? `${body.reporterName.charAt(0)}... (নাগরিক)` : 'নাম প্রকাশে অনিচ্ছুক',
      upvotesCount: 1,
      images: []
    };

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
