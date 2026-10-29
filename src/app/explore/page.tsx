import React from 'react';
import type { Metadata } from 'next';
import DistrictMap from '@/components/DistrictMap';
import { UPAZILAS } from '@/data/kurigramData';
import Link from 'next/link';
import { Compass, MapPin, ChevronRight, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'কুড়িগ্রাম জেলা ইন্টারেক্টিভ মানচিত্র ও উপজেলা অন্বেষণ | KuriConnect',
  description: 'কুড়িগ্রামের ৯টি উপজেলার ভৌগোলিক মানচিত্র, নদীমালা, দর্শনীয় স্থান ও জরুরি সেবাসমূহের ইন্টারেক্টিভ ডিজিটাল প্ল্যাটফর্ম।',
};

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Title */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">জেলা মানচিত্র ও অন্বেষণ</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা ডিজিটাল মানচিত্র ও উপজেলা পরিচিতি
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              যাচাইকৃত সীমানা ও নদীপথের সমন্বয়ে তৈরি ইন্টারেক্টিভ মানচিত্রে ৯টি উপজেলা অনুসন্ধান করুন।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-[#14532d] text-xs font-semibold rounded border border-green-200">
              <Compass className="w-4 h-4" />
              <span>৯টি উপজেলা অন্তর্ভুক্ত</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map Component */}
      <DistrictMap initialUpazilaId="kurigram-sadar" />

      {/* Upazila Quick Directory */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs">
        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
          <span>সকল উপজেলার সংক্ষিপ্ত পরিচিতি ও সরাসরি লিঙ্ক</span>
          <span className="text-xs font-normal text-gray-500">মোট জনসংখ্যা: ২২ লাখ+</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UPAZILAS.map((upazila) => (
            <div
              key={upazila.id}
              className="p-3.5 bg-[#faf8f5] border border-gray-200 rounded hover:border-[#14532d] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-bold text-sm text-[#1a1d1f]">{upazila.nameBn}</h3>
                  <span className="text-[11px] text-gray-500 font-sans">{upazila.nameEn}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                  {upazila.overviewBn}
                </p>
                <div className="text-[11px] text-gray-500 space-y-0.5">
                  <p>• সদর: {upazila.headquarters}</p>
                  <p>• নদী: {upazila.rivers.join(', ')}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#14532d]">{upazila.unionsCount}টি ইউনিয়ন</span>
                <Link
                  href={`/upazila/${upazila.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-[#14532d] font-semibold hover:underline"
                >
                  <span>সম্পূর্ণ তথ্য</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
