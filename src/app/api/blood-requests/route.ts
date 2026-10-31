import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import type { BloodRequest } from '@/types';

/**
 * GET /api/blood-requests
 * Query params: status, upazilaId, bloodGroup
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const upazilaId = searchParams.get('upazilaId') || undefined;
  const bloodGroup = searchParams.get('bloodGroup') || undefined;
  const userId = searchParams.get('userId') || undefined;

  const list = await serverStore.getBloodRequests({
    status,
    upazilaId,
    bloodGroup,
    userId
  });

  return NextResponse.json({
    success: true,
    count: list.length,
    data: list
  });
}

/**
 * POST /api/blood-requests
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.patientNameBn || !body.bloodGroup || !body.hospitalNameBn || !body.problemDescription || !body.contactNumber) {
      return NextResponse.json(
        { success: false, message: 'রোগীর নাম, রক্তের গ্রুপ, হাসপাতাল, সমস্যা এবং ফোন নম্বর প্রয়োজন' },
        { status: 400 }
      );
    }

    const newRequest = await serverStore.addBloodRequest({
      userId: body.userId || undefined,
      patientNameBn: body.patientNameBn,
      bloodGroup: body.bloodGroup,
      bagsNeeded: Number(body.bagsNeeded) || 1,
      hospitalNameBn: body.hospitalNameBn,
      problemDescription: body.problemDescription,
      upazilaId: body.upazilaId,
      contactNumber: body.contactNumber,
      urgencyDate: body.urgencyDate
    });

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/blood-requests
 */
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'আইডি এবং স্ট্যাটাস প্রয়োজন' }, { status: 400 });
    }
    const updated = await serverStore.updateBloodRequest(id, { status });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/blood-requests
 */
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await serverStore.deleteBloodRequest(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

