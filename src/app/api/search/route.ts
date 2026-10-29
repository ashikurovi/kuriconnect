import { NextResponse } from 'next/server';
import {
  UPAZILAS,
  NEWS_ARTICLES,
  HERITAGE_SITES,
  HEALTHCARE_FACILITIES,
  POLICE_CONTACTS,
  DIRECTORY_ITEMS,
  COMMUNITY_REPORTS
} from '@/data/kurigramData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  if (!q) {
    return NextResponse.json({
      success: true,
      query: '',
      results: {
        upazilas: [],
        news: [],
        heritage: [],
        healthcare: [],
        police: [],
        directories: []
      }
    });
  }

  const upazilas = UPAZILAS.filter(
    (u) =>
      u.nameBn.toLowerCase().includes(q) ||
      u.nameEn.toLowerCase().includes(q) ||
      u.overviewBn.toLowerCase().includes(q)
  );

  const news = NEWS_ARTICLES.filter(
    (n) =>
      n.titleBn.toLowerCase().includes(q) ||
      n.titleEn.toLowerCase().includes(q) ||
      n.excerptBn.toLowerCase().includes(q)
  );

  const heritage = HERITAGE_SITES.filter(
    (h) =>
      h.nameBn.toLowerCase().includes(q) ||
      h.nameEn.toLowerCase().includes(q) ||
      h.historyBn.toLowerCase().includes(q)
  );

  const healthcare = HEALTHCARE_FACILITIES.filter(
    (hc) =>
      hc.nameBn.toLowerCase().includes(q) ||
      hc.nameEn.toLowerCase().includes(q) ||
      hc.availableServices.some((s) => s.toLowerCase().includes(q))
  );

  const police = POLICE_CONTACTS.filter(
    (p) =>
      p.officeNameBn.toLowerCase().includes(q) ||
      p.officeNameEn.toLowerCase().includes(q)
  );

  const directories = DIRECTORY_ITEMS.filter(
    (d) =>
      d.nameBn.toLowerCase().includes(q) ||
      d.nameEn.toLowerCase().includes(q)
  );

  return NextResponse.json({
    success: true,
    query: q,
    results: {
      upazilas,
      news,
      heritage,
      healthcare,
      police,
      directories
    }
  });
}
