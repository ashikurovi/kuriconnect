import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import type { LostNotice, LostNoticeCategory } from '@/types';

/**
 * GET /api/lost-notices
 * Query params: type, status, upazilaId, category, search
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const list = await serverStore.getLostNotices({
    type: searchParams.get('type') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    upazilaId: searchParams.get('upazilaId') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    userId: searchParams.get('userId') ?? undefined,
    search: searchParams.get('search') ?? undefined,
  });
  return NextResponse.json({ success: true, count: list.length, data: list });
}

/**
 * POST /api/lost-notices
 * Required: type, category, titleBn, contactName, contactPhone
 */
export async function POST(request: Request) {
  try {
    const body: Partial<LostNotice> = await request.json();
    if (!body.type || !body.category || !body.titleBn || !body.contactName || !body.contactPhone) {
      return NextResponse.json(
        { success: false, message: 'প্রয়োজনীয় ফিল্ডগুলো প্রদান করুন' },
        { status: 400 },
      );
    }

    const validCategories: LostNoticeCategory[] = ['person', 'document', 'vehicle', 'valuable', 'other'];
    const category: LostNoticeCategory = validCategories.includes(body.category as any)
      ? (body.category as LostNoticeCategory)
      : 'other';
    const type: 'lost' | 'found' = body.type === 'found' ? 'found' : 'lost';

    const newNotice = await serverStore.addLostNotice({
      userId: body.userId || undefined,
      type,
      category,
      titleBn: body.titleBn,
      descriptionBn: body.descriptionBn,
      upazilaId: body.upazilaId,
      locationDetailsBn: body.locationDetailsBn,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      gdNumber: body.gdNumber,
      rewardBn: body.rewardBn,
    });
    return NextResponse.json({ success: true, data: newNotice }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/lost-notices
 */
export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const updated = await serverStore.updateLostNotice(id, updates as Partial<LostNotice>);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/lost-notices
 */
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await serverStore.deleteLostNotice(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
