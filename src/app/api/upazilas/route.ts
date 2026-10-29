import { NextResponse } from 'next/server';
import { UPAZILAS } from '@/data/kurigramData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const upazila = UPAZILAS.find((u) => u.slug === slug || u.id === slug);
    if (!upazila) {
      return NextResponse.json({ success: false, message: 'উপজেলা পাওয়া যায়নি' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: upazila });
  }

  return NextResponse.json({
    success: true,
    count: UPAZILAS.length,
    data: UPAZILAS
  });
}
