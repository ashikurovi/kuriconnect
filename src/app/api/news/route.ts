import { NextResponse } from 'next/server';
import { NEWS_ARTICLES } from '@/data/kurigramData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const upazilaId = searchParams.get('upazilaId');
  const limit = searchParams.get('limit');

  let list = [...NEWS_ARTICLES];

  if (category && category !== 'all') {
    list = list.filter((n) => n.category === category);
  }

  if (upazilaId && upazilaId !== 'all') {
    list = list.filter((n) => n.upazilaId === upazilaId);
  }

  if (limit) {
    list = list.slice(0, parseInt(limit, 10));
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
    if (!body.titleBn) {
      return NextResponse.json({ success: false, message: 'সংবাদের শিরোনাম আবশ্যক' }, { status: 400 });
    }

    const newArticle = {
      id: `news-${Date.now()}`,
      slug: body.slug || `news-${Date.now()}`,
      titleBn: body.titleBn,
      titleEn: body.titleEn || '',
      excerptBn: body.excerptBn || '',
      contentBn: body.contentBn || '',
      category: body.category || 'district',
      upazilaId: body.upazilaId,
      upazilaNameBn: body.upazilaNameBn,
      author: {
        nameBn: body.authorNameBn || 'বার্তা বিভাগ',
        roleBn: 'প্রতিবেদক'
      },
      publishedAt: '৩০ অক্টোবর ২০২৬',
      readTimeMinutes: 3,
      featuredImage: body.featuredImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      source: 'KuriConnect ডিজিটাল',
      tags: body.tags || ['কুড়িগ্রাম']
    };

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
