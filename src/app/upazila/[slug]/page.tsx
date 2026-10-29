import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  UPAZILAS,
  HERITAGE_SITES,
  HEALTHCARE_FACILITIES,
  POLICE_CONTACTS,
  DIRECTORY_ITEMS,
  NEWS_ARTICLES,
  COMMUNITY_REPORTS,
  BLOOD_DONORS
} from '@/data/kurigramData';
import NewsCard from '@/components/NewsCard';
import DistrictMap from '@/components/DistrictMap';
import {
  MapPin,
  Users,
  Compass,
  Landmark,
  Hospital,
  ShieldCheck,
  Building2,
  GraduationCap,
  Store,
  PhoneCall,
  HeartHandshake,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface UpazilaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return UPAZILAS.map((u) => ({
    slug: u.slug,
  }));
}

export async function generateMetadata({ params }: UpazilaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const upazila = UPAZILAS.find((u) => u.slug === slug);
  if (!upazila) return { title: 'উপজেলা পাওয়া যায়নি' };

  return {
    title: `${upazila.nameBn} উপজেলা (${upazila.nameEn}) — পূর্ণাঙ্গ তথ্যবাতায়ন | KuriConnect`,
    description: `${upazila.nameBn} উপজেলার ইউনিয়ন, ইতিহাস, দর্শনীয় স্থান, হাসপাতাল, থানা, শিক্ষা প্রতিষ্ঠান ও স্থানীয় সংবাদ।`,
  };
}

export default async function UpazilaDetailPage({ params }: UpazilaPageProps) {
  const { slug } = await params;
  const upazila = UPAZILAS.find((u) => u.slug === slug);

  if (!upazila) {
    notFound();
  }

  const heritage = HERITAGE_SITES.filter((h) => h.upazilaId === upazila.id);
  const hospitals = HEALTHCARE_FACILITIES.filter((h) => h.upazilaId === upazila.id);
  const police = POLICE_CONTACTS.filter((p) => p.upazilaId === upazila.id);
  const directories = DIRECTORY_ITEMS.filter((d) => d.upazilaId === upazila.id);
  const news = NEWS_ARTICLES.filter((n) => n.upazilaId === upazila.id);
  const reports = COMMUNITY_REPORTS.filter((r) => r.upazilaId === upazila.id);
  const donors = BLOOD_DONORS.filter((d) => d.upazilaId === upazila.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-[#14532d]">উপজেলা সমূহ</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{upazila.nameBn}</span>
      </div>

      {/* Upazila Header Banner */}
      <div className="relative rounded-xl overflow-hidden bg-white border border-[#e7e3db] shadow-sm">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={upazila.featuredImage}
            alt={upazila.nameBn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="inline-block bg-[#14532d] text-xs font-semibold px-2.5 py-1 rounded shadow-xs mb-2">
              কুড়িগ্রাম জেলা
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {upazila.nameBn} উপজেলা
              <span className="text-xl sm:text-2xl font-normal text-gray-300 ml-2">
                ({upazila.nameEn})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 mt-2 max-w-3xl leading-relaxed">
              {upazila.overviewBn}
            </p>
          </div>
        </div>

        {/* Key Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-4 bg-[#faf8f5] text-center text-xs divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div>
            <span className="text-gray-500 block text-[11px]">সদর দপ্তর</span>
            <span className="font-bold text-gray-900 text-sm">{upazila.headquarters}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">মোট আয়তন</span>
            <span className="font-bold text-gray-900 text-sm">{upazila.areaKm2} বর্গ কিমি</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">মোট জনসংখ্যা</span>
            <span className="font-bold text-gray-900 text-sm">{upazila.population.toLocaleString('bn-BD')}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">ইউনিয়ন সংখ্যা</span>
            <span className="font-bold text-gray-900 text-sm">{upazila.unionsCount}টি</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">গ্রাম সংখ্যা</span>
            <span className="font-bold text-gray-900 text-sm">{upazila.villagesCount}টি</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[11px]">স্বাক্ষরতার হার</span>
            <span className="font-bold text-[#14532d] text-sm">{upazila.keyStats.literacyRate}</span>
          </div>
        </div>
      </div>

      {/* Main 2-column Grid: Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          {/* History & Background */}
          <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#14532d]" />
              <span>ইতিহাস ও ঐতিহ্যের প্রেক্ষাপট</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {upazila.historyBn}
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="font-semibold text-gray-800">প্রধান নদ-নদী:</span>
              {upazila.rivers.map((river, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                  {river}
                </span>
              ))}
            </div>
          </section>

          {/* Unions & Administrative Structure */}
          <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#14532d]" />
                <span>ইউনিয়ন পরিষদ সমূহ ({upazila.unions.length}টি)</span>
              </div>
              <span className="text-xs text-gray-500 font-normal">স্থানীয় প্রশাসন</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {upazila.unions.map((union, idx) => (
                <div key={idx} className="p-2.5 bg-[#faf8f5] border border-gray-200 rounded flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-[#14532d] flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-800">{union}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Heritage & Tourist Places in this Upazila */}
          {heritage.length > 0 && (
            <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-700" />
                  <span>দর্শনীয় ও ঐতিহাসিক স্থান</span>
                </div>
                <Link href="/heritage" className="text-xs text-[#14532d] hover:underline">
                  সকল ঐতিহ্য →
                </Link>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heritage.map((site) => (
                  <div key={site.id} className="border border-gray-200 rounded overflow-hidden flex flex-col justify-between">
                    <img src={site.mainImage} alt={site.nameBn} className="h-36 w-full object-cover" />
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-900">{site.nameBn}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{site.historyBn}</p>
                      <Link
                        href={`/heritage/${site.slug}`}
                        className="mt-2 text-xs font-semibold text-[#14532d] inline-flex items-center gap-1 hover:underline"
                      >
                        <span>বিস্তারিত দেখুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Upazila Specific News — HIDDEN (data lagbe)
          {news.length > 0 && (
            <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>{upazila.nameBn} উপজেলার সর্বশেষ সংবাদ</span>
                <Link href="/news" className="text-xs text-[#14532d] hover:underline">
                  জেলা সংবাদ পাতা →
                </Link>
              </h2>
              <div className="space-y-3">
                {news.map((item) => (
                  <NewsCard key={item.id} article={item} variant="compact" />
                ))}
              </div>
            </section>
          )}
          */}

          {/* Upazila Specific Public Reports */}
          {reports.length > 0 && (
            <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs">
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <span>উপজেলার জনসমস্যা ও উন্নয়ন অগ্রগতি</span>
                </div>
                <Link href="/reports" className="text-xs text-[#14532d] hover:underline">
                  সমস্যা জানান →
                </Link>
              </h2>
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-3 bg-[#faf8f5] border border-gray-200 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span>{rep.titleBn}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{rep.descriptionBn}</p>
                    <p className="text-gray-400 text-[11px] pt-1">স্থান: {rep.locationDetailsBn}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar: Services & Emergency (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hospitals in this Upazila */}
          <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
            <h3 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-red-600" />
              <span>হাসপাতাল ও চিকিৎসাকেন্দ্র</span>
            </h3>
            {hospitals.length > 0 ? (
              <div className="space-y-3">
                {hospitals.map((hosp) => (
                  <div key={hosp.id} className="p-3 bg-[#faf8f5] border border-gray-200 rounded text-xs">
                    <h4 className="font-bold text-gray-900">{hosp.nameBn}</h4>
                    <p className="text-gray-500 mt-0.5">{hosp.addressBn}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-gray-600">{hosp.phone}</span>
                      <a
                        href={`tel:${hosp.phone}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-[11px] font-medium"
                      >
                        কল দিন
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                নিকটস্থ জেলা সদর হাসপাতাল: <a href="tel:০২৫৮৯৯৬৫২১২" className="text-red-600 font-semibold underline">০২৫৮৯৯৬৫২১২</a>
              </p>
            )}
          </div>

          {/* Police & Administration Contacts */}
          <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
            <h3 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>থানা ও প্রশাসনিক যোগাযোগ</span>
            </h3>
            {police.length > 0 ? (
              <div className="space-y-3">
                {police.map((item) => (
                  <div key={item.id} className="p-3 bg-[#faf8f5] border border-gray-200 rounded text-xs">
                    <h4 className="font-bold text-gray-900">{item.officeNameBn}</h4>
                    <p className="text-gray-500 text-[11px]">{item.designationBn}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-gray-700 font-mono">{item.phone}</span>
                      <a
                        href={`tel:${item.phone}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-1 rounded text-[11px] font-medium"
                      >
                        কল দিন
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                কুড়িগ্রাম কন্ট্রোল রুম: <a href="tel:০১৩২০-১৩৪০০০" className="text-blue-600 font-semibold underline">০১৩২০-১৩৪০০০</a>
              </p>
            )}
          </div>

          {/* Blood Donors in this Upazila */}
          <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-red-600" />
                <span>স্থানীয় রক্তদাতা</span>
              </h3>
              <Link href="/blood-bank" className="text-xs text-red-700 hover:underline">
                সকল গ্রুপ
              </Link>
            </div>
            {donors.length > 0 ? (
              <div className="space-y-2">
                {donors.map((donor) => (
                  <div key={donor.id} className="p-2 bg-[#faf8f5] border border-gray-200 rounded flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {donor.bloodGroup}
                      </span>
                      <div>
                        <span className="font-medium text-gray-900">{donor.donorNameBn}</span>
                        <span className="text-[10px] text-gray-500 block">{donor.areaBn}</span>
                      </div>
                    </div>
                    <Link href="/blood-bank" className="text-xs text-red-700 font-semibold hover:underline">
                      আবেদন
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                এই উপজেলায় নতুন রক্তদাতা হিসেবে নিবন্ধন করুন।
              </p>
            )}
          </div>

          {/* Key Educational & Market Directory Items */}
          {directories.length > 0 && (
            <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
              <h3 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>শিক্ষা প্রতিষ্ঠান ও বাজার</span>
              </h3>
              <div className="space-y-2 text-xs">
                {directories.map((dir) => (
                  <div key={dir.id} className="p-2 bg-[#faf8f5] border border-gray-200 rounded">
                    <span className="font-bold text-gray-900">{dir.nameBn}</span>
                    <span className="text-[11px] text-gray-500 block">{dir.categoryLabelBn} • {dir.addressBn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Directions Link */}
          <div className="bg-[#14532d] text-white p-4 rounded-lg text-center space-y-2">
            <h4 className="font-bold text-sm">গুগল ম্যাপে দিকনির্দেশ খুঁজুন</h4>
            <p className="text-xs text-green-100">
              সরাসরি {upazila.nameBn} উপজেলার প্রশাসনিক কেন্দ্র বা বাজারে পৌঁছাতে ম্যাপ খুলুন।
            </p>
            <Link
              href={`https://www.google.com/maps/dir/?api=1&destination=${upazila.mapCoords.lat},${upazila.mapCoords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-[#14532d] px-4 py-1.5 rounded text-xs font-semibold hover:bg-green-50 shadow-xs"
            >
              <span>গুগল ম্যাপে নেভিগেশন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
