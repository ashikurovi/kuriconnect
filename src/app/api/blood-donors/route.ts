import { NextResponse } from 'next/server';
import { BLOOD_DONORS, UPAZILAS } from '@/data/kurigramData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bloodGroup = searchParams.get('bloodGroup');
  const upazilaId = searchParams.get('upazilaId');

  let list = [...BLOOD_DONORS];

  if (bloodGroup && bloodGroup !== 'all') {
    list = list.filter((d) => d.bloodGroup === bloodGroup);
  }

  if (upazilaId && upazilaId !== 'all') {
    list = list.filter((d) => d.upazilaId === upazilaId);
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
    if (!body.donorNameBn || !body.bloodGroup || !body.phone) {
      return NextResponse.json({ success: false, message: 'সকল প্রয়োজনীয় তথ্য প্রদান করুন' }, { status: 400 });
    }

    const upazila = UPAZILAS.find((u) => u.id === body.upazilaId);
    const masked = body.phone.length > 5
      ? `${body.phone.slice(0, 5)}-***${body.phone.slice(-3)}`
      : '০১৭১১-***৪৫৬';

    const newDonor = {
      id: `donor-${Date.now()}`,
      donorNameBn: body.donorNameBn,
      bloodGroup: body.bloodGroup,
      upazilaId: body.upazilaId || 'kurigram-sadar',
      upazilaNameBn: upazila ? upazila.nameBn : 'কুড়িগ্রাম সদর',
      areaBn: body.areaBn || 'সদর',
      contactNumberMasked: masked,
      directContactAvailable: true,
      availabilityStatus: 'available',
      verifiedDate: 'আজ, ৩০ অক্টোবর ২০২৬',
      registeredSince: '২০২৬-১০-৩০'
    };

    return NextResponse.json({ success: true, data: newDonor }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
