import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/otp/verify
 * Body: { phone: string, otp: string }
 */
export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'মোবাইল নম্বর এবং ওটিপি কোড প্রয়োজন' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Check latest active OTP for this phone number
    const rows = await db.query<any>(
      `SELECT * FROM otp_verifications 
       WHERE phone = $1 AND otp_code = $2 AND is_verified = false AND expires_at > NOW() 
       ORDER BY created_at DESC LIMIT 1`,
      [cleanPhone, otp.trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'ভুল অথবা মেয়াদোত্তীর্ণ ওটিপি কোড' },
        { status: 400 }
      );
    }

    // Mark as verified
    await db.query(`UPDATE otp_verifications SET is_verified = true WHERE id = $1`, [rows[0].id]);

    return NextResponse.json({
      success: true,
      message: 'মোবাইল নম্বর সফলভাবে যাচাই করা হয়েছে'
    });
  } catch (err: any) {
    console.error('OTP Verify Error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'যাচাইকরণে ত্রুটি হয়েছে' },
      { status: 500 }
    );
  }
}

