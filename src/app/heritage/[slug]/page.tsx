import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HERITAGE_SITES } from '@/data/kurigramData';
import {
  Landmark,
  MapPin,
  Compass,
  Bus,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Share2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface HeritageDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HERITAGE_SITES.map((site) => ({
    slug: site.slug,
  }));
}

export async function generateMetadata({ params }: HeritageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = HERITAGE_SITES.find((s) => s.slug === slug);
  if (!site) return { title: 'ঐতিহ্যবাহী স্থান পাওয়া যায়নি' };

  return {
    title: `${site.nameBn} (${site.nameEn}) — ভ্রমণ নির্দেশিকা ও ইতিহাস | KuriConnect`,
    description: site.culturalSignificanceBn,
  };
}

export default async function HeritageDetailPage({ params }: HeritageDetailPageProps) {
  const { slug } = await params;
  const site = HERITAGE_SITES.find((s) => s.slug === slug);

  if (!site) {
    notFound();
  }

  const otherSites = HERITAGE_SITES.filter((s) => s.id !== site.id).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
        <span>/</span>
        <Link href="/heritage" className="hover:text-[#14532d]">ঐতিহ্য ও দর্শনীয় স্থান</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{site.nameBn}</span>
      </div>

      {/* Main Title & Hero Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#14532d] text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            {site.categoryLabelBn}
          </span>
          <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded border border-gray-200">
            {site.upazilaNameBn} উপজেলা
          </span>
          <span className="text-xs text-gray-400">
            সর্বশেষ যাচাইকরণ: {site.verifiedDate}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1d1f] tracking-tight">
          {site.nameBn}
        </h1>
        <p className="text-base text-gray-500 font-sans">
          {site.nameEn}
        </p>

        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden border border-[#e7e3db] aspect-[16/9] max-h-[460px] bg-gray-100 relative">
          <img
            src={site.mainImage}
            alt={site.nameBn}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Full History & Cultural Story (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* History */}
          <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#14532d]" />
              <span>ঐতিহাসিক পটভূমি</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {site.historyBn}
            </p>
          </section>

          {/* Cultural Significance */}
          <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              সাংস্কৃতিক ও স্থানীয় গুরুত্ব
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {site.culturalSignificanceBn}
            </p>
          </section>

          {/* Visiting Guidance & Timing */}
          <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>দর্শনার্থী নির্দেশিকা ও উপযুক্ত সময়</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {site.visitingGuidanceBn}
            </p>
          </section>

          {/* Transport & Accessibility */}
          <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Bus className="w-5 h-5 text-blue-700" />
              <span>যাতায়াত ও পৌঁছানোর উপায়</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {site.transportInfoBn}
            </p>
          </section>

          {/* Gallery Images if available */}
          {site.galleryImages && site.galleryImages.length > 0 && (
            <section className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
                ফটোগ্যালারি
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {site.galleryImages.map((img, idx) => (
                  <div key={idx} className="rounded-md overflow-hidden aspect-[16/10] bg-gray-100 border border-gray-200">
                    <img src={img} alt={`${site.nameBn} ছবি ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar: Location, Coordinates & Map Action (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 pb-2 border-b border-gray-100">
              অবস্থান ও তথ্যসূত্র
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">ঠিকানা:</span>
                <span className="font-semibold text-gray-800">{site.addressBn}</span>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px]">উপজেলা:</span>
                <Link
                  href={`/upazila/${site.upazilaId}`}
                  className="font-semibold text-[#14532d] hover:underline"
                >
                  {site.upazilaNameBn}
                </Link>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px]">ম্যাপ স্থানাঙ্ক (Coordinates):</span>
                <span className="font-mono text-gray-700">
                  {site.mapCoords.lat}° N, {site.mapCoords.lng}° E
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px]">সরকারি তথ্যসূত্র:</span>
                <span className="text-gray-700">{site.officialSource}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`https://www.google.com/maps/dir/?api=1&destination=${site.mapCoords.lat},${site.mapCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#14532d] hover:bg-[#0f3d21] text-white py-2 rounded text-xs font-semibold shadow-xs"
              >
                <span>গুগল ম্যাপে দিকনির্দেশ খুঁজুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Community Corrections Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>তথ্য সংশোধনী অনুরোধ</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              এই স্থানের তথ্যে কোনো ঐতিহাসিক বা যাতায়াত ত্রুটি লক্ষ্য করলে আমাদের সম্পাদকীয় পরিষদকে জানান। আমরা সরেজমিনে যাচাই করে তা হালনাগাদ করব।
            </p>
            <Link
              href="/reports#submit"
              className="inline-block text-[11px] font-semibold text-[#14532d] underline"
            >
              সংশোধনী জমা দিন →
            </Link>
          </div>

          {/* Other Heritage Sites */}
          <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
              অন্যান্য দর্শনীয় স্থান
            </h4>
            <div className="space-y-2">
              {otherSites.map((item) => (
                <Link
                  key={item.id}
                  href={`/heritage/${item.slug}`}
                  className="block p-2 rounded hover:bg-gray-50 text-xs border border-transparent hover:border-gray-200 transition-colors"
                >
                  <span className="font-semibold text-gray-900 block truncate">{item.nameBn}</span>
                  <span className="text-[11px] text-gray-500">{item.upazilaNameBn}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
