import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bloodGroup = searchParams.get('bloodGroup') || undefined;
  const upazilaId = searchParams.get('upazilaId') || undefined;
  const search = searchParams.get('search') || undefined;
  // If 'all' is passed (from admin panel), show all. Otherwise only show approved donors on public pages
  const isAdmin = searchParams.get('admin') === 'true';

  const list = await serverStore.getBloodDonors({
    bloodGroup,
    upazilaId,
    search,
    approvedOnly: !isAdmin
  });

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
      return NextResponse.json(
        { success: false, message: 'সকল প্রয়োজনীয় তথ্য প্রদান করুন' },
        { status: 400 }
      );
    }

    const cleanPhone = body.phone.replace(/[^0-9]/g, '');

    // Check if phone number was verified via OTP in the last 15 minutes
    const verifications = await db.query<any>(
      `SELECT * FROM otp_verifications 
       WHERE phone = $1 AND is_verified = true AND created_at > NOW() - INTERVAL '15 minutes'
       ORDER BY created_at DESC LIMIT 1`,
      [cleanPhone]
    );

    if (verifications.length === 0) {
      return NextResponse.json(
        {
          success: false,
          requireOtp: true,
          message: 'মোবাইল নম্বরটি ওটিপি দিয়ে যাচাই করা হয়নি। অনুগ্রহ করে ওটিপি যাচাই করুন।'
        },
        { status: 403 }
      );
    }

    const newDonor = await serverStore.addBloodDonor(body);
    return NextResponse.json({ success: true, data: newDonor }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isApproved, availabilityStatus } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'আইডি প্রয়োজন' }, { status: 400 });
    }
    const updated = await serverStore.updateBloodDonor(id, {
      isApproved,
      availabilityStatus
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: 'আইডি প্রয়োজন' }, { status: 400 });
    }
    const deleted = await serverStore.deleteBloodDonor(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
