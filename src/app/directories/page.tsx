'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DIRECTORY_ITEMS, UPAZILAS } from '@/data/kurigramData';
import {
  Building2,
  GraduationCap,
  Store,
  Anchor,
  Search,
  Filter,
  PhoneCall,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function DirectoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUpazila, setSelectedUpazila] = useState('all');

  const filteredItems = DIRECTORY_ITEMS.filter((item) => {
    const matchesSearch =
      item.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.addressBn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesUpazila = selectedUpazila === 'all' || item.upazilaId === selectedUpazila;

    return matchesSearch && matchesCategory && matchesUpazila;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">নাগরিক ডিরেক্টরি</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা শিক্ষা প্রতিষ্ঠান, সরকারি দপ্তর ও হাটবাজার ডিরেক্টরি
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              কলেজ, পলিটেকনিক, উচ্চ বিদ্যালয়, জেলা ও উপজেলা প্রশাসন এবং ঐতিহ্যবাহী নদীবন্দর ঘাট।
            </p>
          </div>
          <span className="text-xs bg-green-50 text-green-900 px-3 py-1.5 rounded border border-green-200 font-semibold self-start sm:self-auto">
            যাচাইকৃত গণতথ্য ভাণ্ডার
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্রতিষ্ঠানের নাম বা এলাকা দিয়ে খুঁজুন..."
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#14532d]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#14532d]"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              <option value="college">কলেজ ও উচ্চ শিক্ষা</option>
              <option value="school">উচ্চ বিদ্যালয়</option>
              <option value="govt-office">সরকারি দপ্তর ও বন্দর</option>
              <option value="market">ঐতিহ্যবাহী গ্রামীণ হাট</option>
              <option value="ghat">নদী ঘাট ও ফেরি টার্মিনাল</option>
            </select>
          </div>

          <div>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#14532d]"
            >
              <option value="all">সকল উপজেলা ({UPAZILAS.length}টি)</option>
              {UPAZILAS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs hover:border-[#14532d] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#14532d] bg-green-50 border border-green-200 px-2 py-0.5 rounded uppercase">
                  {item.categoryLabelBn}
                </span>
                <span className="text-xs text-gray-500">{item.upazilaNameBn}</span>
              </div>

              <h3 className="font-bold text-base text-gray-900 leading-snug">
                {item.nameBn}
              </h3>
              <span className="text-[11px] text-gray-500 font-sans block mt-0.5">{item.nameEn}</span>

              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{item.addressBn}</span>
                </p>
                {item.establishedYear && (
                  <p className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>প্রতিষ্ঠা সাল: {item.establishedYear}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              {item.phone ? (
                <a
                  href={`tel:${item.phone}`}
                  className="font-mono text-xs font-semibold text-[#14532d] hover:underline flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{item.phone}</span>
                </a>
              ) : (
                <span className="text-gray-400 text-[11px]">ফোন তালিকাভুক্ত নেই</span>
              )}
              <span className="text-[10px] text-gray-400">যাচাই: {item.verifiedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
