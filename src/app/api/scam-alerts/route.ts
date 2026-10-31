import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import type { ScamAlert } from '@/types';

/**
 * GET /api/scam-alerts
 * Query params: severity, category, search, admin=true
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get('admin') === 'true';
  const userId = searchParams.get('userId') ?? undefined;

  const list = await serverStore.getScamAlerts({
    severity: searchParams.get('severity') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    userId,
    search: searchParams.get('search') ?? undefined,
    approvedOnly: userId ? false : !isAdmin
  });
  return NextResponse.json({ success: true, count: list.length, data: list });
}

/**
 * POST /api/scam-alerts
 * Required: titleBn, summaryBn, scamCategory
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.titleBn || !body.summaryBn) {
      return NextResponse.json(
        { success: false, message: 'প্রয়োজনীয় ফিল্ডগুলো প্রদান করুন' },
        { status: 400 },
      );
    }
    const newScam = await serverStore.addScamAlert({
      userId: body.userId || undefined,
      titleBn: body.titleBn,
      summaryBn: body.summaryBn,
      detailsBn: body.detailsBn,
      severity: body.severity as any,
      scamCategory: (body.scamCategory as any) || 'other',
      scamCategoryLabelBn: body.scamCategoryLabelBn,
      targetType: body.targetType || 'individual',
      suspectName: body.suspectName,
      suspectContact: body.suspectContact,
      images: body.images || [],
      verifiedBy: body.verifiedBy,
      preventionTipsBn: body.preventionTipsBn,
      isApproved: body.isApproved !== undefined ? body.isApproved : false // By default citizen submitted scams need approval
    });
    return NextResponse.json({ success: true, data: newScam }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/scam-alerts
 */
export async function PUT(request: Request) {
  try {
    const { id, isApproved, severity } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'আইডি প্রয়োজন' }, { status: 400 });
    }
    const updated = await serverStore.updateScamAlert(id, { isApproved, severity });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/scam-alerts
 */
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await serverStore.deleteScamAlert(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
