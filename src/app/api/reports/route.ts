import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import type { CommunityReport, UpazilaId } from '@/types';

type NewReportInput = {
  userId?: string;
  titleBn: string;
  descriptionBn: string;
  locationDetailsBn: string;
  category?: CommunityReport['category'];
  upazilaId?: UpazilaId;
  reporterName?: string;
  reporterPhone?: string;
  priority?: CommunityReport['priority'];
  images?: string[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const upazilaId = searchParams.get('upazilaId');
  const category = searchParams.get('category');
  const userId = searchParams.get('userId');
  const search = searchParams.get('search');

  const list = await serverStore.getReports({
    status: status ?? undefined,
    upazilaId: upazilaId ?? undefined,
    category: category ?? undefined,
    userId: userId ?? undefined,
    search: search ?? undefined,
  });

  return NextResponse.json({ success: true, count: list.length, data: list });
}

export async function POST(request: Request) {
  try {
    const body: NewReportInput = await request.json();
    if (!body.titleBn || !body.descriptionBn || !body.locationDetailsBn) {
      return NextResponse.json(
        { success: false, message: 'প্রয়োজনীয় ফিল্ডগুলো প্রদান করুন' },
        { status: 400 },
      );
    }
    const newReport = await serverStore.addReport({
      userId: body.userId || undefined,
      titleBn: body.titleBn,
      descriptionBn: body.descriptionBn,
      locationDetailsBn: body.locationDetailsBn,
      category: body.category as any,
      upazilaId: body.upazilaId,
      reporterName: body.reporterName,
      reporterPhone: body.reporterPhone,
      priority: body.priority as any,
      images: body.images || [],
    });
    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID দরকার' }, { status: 400 });
    }
    const updated = await serverStore.updateReport(id, updates as Partial<CommunityReport>);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await serverStore.deleteReport(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
