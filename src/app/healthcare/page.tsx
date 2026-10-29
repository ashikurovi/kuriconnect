'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HEALTHCARE_FACILITIES, UPAZILAS } from '@/data/kurigramData';
import {
  Hospital,
  PhoneCall,
  Search,
  Filter,
  Ambulance,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function HealthcarePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFacilities = HEALTHCARE_FACILITIES.filter((f) => {
    const matchesSearch =
      f.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.availableServices.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUpazila = selectedUpazila === 'all' || f.upazilaId === selectedUpazila;
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;

    return matchesSearch && matchesUpazila && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">হাসপাতাল ও জরুরি স্বাস্থ্যসেবা</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা হাসপাতাল ও জরুরি চিকিৎসাসেবা ডিরেক্টরি
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              সরকারি হাসপাতাল, উপজেলা স্বাস্থ্য কমপ্লেক্স, প্রাইভেট ক্লিনিক এবং ২৪ ঘণ্টা জরুরি অ্যাম্বুলেন্স তালিকা।
            </p>
          </div>
          <a
            href="tel:০২৫৮৯৯৬৫২১২"
            className="self-start sm:self-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>জরুরি সদর হাসপাতাল: ০২৫৮৯৯৬৫২১২</span>
          </a>
        </div>
      </div>

      {/* Emergency Strip (Highlighted) */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="emergency">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-600 text-white rounded">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base text-red-900">
              জরুরি অ্যাম্বুলেন্স ও অক্সিজেন সহায়তা (কুড়িগ্রাম জেলা)
            </h2>
            <p className="text-xs text-red-800 mt-0.5">
              মুমূর্ষু রোগী স্থানান্তর, রংপুর মেডিকেল বা ঢাকা রেফার্ড সার্ভিসের জন্য সার্বক্ষণিক হটলাইন।
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="tel:০১৭২৮-১১২২৩৩"
            className="bg-red-700 hover:bg-red-800 text-white text-xs px-3.5 py-2 rounded font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>সেন্ট্রাল অ্যাম্বুলেন্স: ০১৭২৮-১১২২৩৩</span>
          </a>
          <a
            href="tel:৯৯৯"
            className="bg-gray-900 hover:bg-black text-white text-xs px-3.5 py-2 rounded font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>জাতীয় জরুরি সেবা (৯৯৯)</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="হাসপাতাল, আইসিইউ, ডায়ালিসিস বা সেবা খুঁজুন..."
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-red-600"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Upazila Filter */}
          <div>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-red-600"
            >
              <option value="all">সকল উপজেলা ({UPAZILAS.length}টি)</option>
              {UPAZILAS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-red-600"
            >
              <option value="all">সকল স্বাস্থ্য প্রতিষ্ঠান</option>
              <option value="govt-hospital">সরকারি জেলা সদর হাসপাতাল</option>
              <option value="upazila-health-complex">উপজেলা স্বাস্থ্য কমপ্লেক্স</option>
              <option value="private-clinic">প্রাইভেট ক্লিনিক ও মাতৃসদন</option>
              <option value="ambulance">অ্যাম্বুলেন্স সার্ভিস</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      {filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs hover:border-red-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {fac.categoryLabelBn}
                    </span>
                    <h2 className="text-base font-bold text-gray-900 mt-1.5 leading-snug">
                      {fac.nameBn}
                    </h2>
                    <span className="text-[11px] text-gray-500 font-sans">{fac.nameEn}</span>
                  </div>
                  {fac.is24x7 && (
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
                      ২৪ ঘণ্টা খোলা
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{fac.addressBn} • <strong className="text-gray-800">{fac.upazilaNameBn}</strong></span>
                  </p>
                  {fac.bedCount && (
                    <p className="text-[11px] text-gray-500">
                      শয্যা সংখ্যা: <strong className="text-gray-800">{fac.bedCount} শয্যা</strong>
                    </p>
                  )}
                </div>

                {/* Available Services Pills */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                    উপলব্ধ প্রধান সেবাসমূহ:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {fac.availableServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#faf8f5] border border-gray-200 px-2 py-0.5 rounded text-gray-700"
                      >
                        ✓ {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action & Verification */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-gray-400">
                  <span>উৎস: {fac.officialSource}</span>
                  <span className="block text-[10px]">যাচাই: {fac.verifiedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  {fac.emergencyPhone && (
                    <a
                      href={`tel:${fac.emergencyPhone}`}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2.5 py-1.5 rounded font-medium shadow-xs"
                    >
                      জরুরি
                    </a>
                  )}
                  <a
                    href={`tel:${fac.phone}`}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3.5 py-1.5 rounded font-bold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>সরাসরি কল ({fac.phone})</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#e7e3db] rounded-lg">
          <Hospital className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-gray-800">কোনো স্বাস্থ্য প্রতিষ্ঠান খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-gray-500 mt-1">অনুগ্রহ করে ভিন্ন উপজেলা বা ফিল্টার নির্বাচন করে চেষ্টা করুন।</p>
        </div>
      )}
    </div>
  );
}
