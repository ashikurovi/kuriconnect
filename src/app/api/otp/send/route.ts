import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendSms } from '@/lib/sms';

/**
 * POST /api/otp/send
 * Body: { phone: string }
 */
export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'মোবাইল নম্বর প্রদান করুন' },
        { status: 400 }
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      return NextResponse.json(
        { success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন' },
        { status: 400 }
      );
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Format requested by bulk SMS provider:
    // (Your {Brand/Company Name} OTP is XXXX)
    const smsMessage = `Your Hamar Kurigram OTP is ${otp}`;

    // Save OTP to DB
    await db.query(
      `INSERT INTO otp_verifications (phone, otp_code, expires_at, is_verified) VALUES ($1, $2, $3, $4)`,
      [cleanPhone, otp, expiresAt, false]
    );

    // Send SMS via BulkSMSBD API
    const smsResult = await sendSms({
      number: cleanPhone,
      message: smsMessage
    });

    console.log(`OTP sent to ${cleanPhone}: ${otp}, SMS Result:`, smsResult);

    return NextResponse.json({
      success: true,
      message: 'ওটিপি কোড আপনার মোবাইলে পাঠানো হয়েছে',
      smsStatus: smsResult.success
    });
  } catch (err: any) {
    console.error('OTP Send Error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'ওটিপি পাঠাতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

