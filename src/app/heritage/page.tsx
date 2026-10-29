'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HERITAGE_SITES, UPAZILAS } from '@/data/kurigramData';
import { Landmark, MapPin, Search, Filter, Calendar, ExternalLink, ChevronRight } from 'lucide-react';

export default function HeritageDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSites = HERITAGE_SITES.filter((site) => {
    const matchesSearch =
      site.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.historyBn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUpazila = selectedUpazila === 'all' || site.upazilaId === selectedUpazila;
    const matchesCategory = selectedCategory === 'all' || site.category === selectedCategory;

    return matchesSearch && matchesUpazila && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">ঐতিহ্য ও দর্শনীয় স্থান</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলার প্রত্নতাত্ত্বিক ঐতিহ্য ও দর্শনীয় স্থান
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              মুঘল স্থাপত্য, শতবর্ষী ব্রিটিশ রেল সেতু, প্রাচীন জমিদার বাড়ি ও নদী বন্দরের সমৃদ্ধ ইতিহাস।
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-900 px-3 py-1.5 rounded border border-amber-200 font-semibold self-start sm:self-auto">
            মোট তালিকাভুক্ত স্থান: {HERITAGE_SITES.length}টি
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ঐতিহ্যবাহী স্থানের নাম বা ইতিহাস খুঁজুন..."
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#14532d]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Upazila Filter */}
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

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#14532d]"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              <option value="historical-monument">ঐতিহাসিক স্থাপনা</option>
              <option value="mosque-temple">মসজিদ ও মন্দির</option>
              <option value="river-port">নদীবন্দর ও ঘাট</option>
              <option value="natural-beauty">প্রাকৃতিক সৌন্দর্য</option>
              <option value="archaeological">প্রত্নতাত্ত্বিক ধ্বংসাবশেষ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <article
              key={site.id}
              className="group bg-white border border-[#e7e3db] rounded-lg overflow-hidden shadow-2xs hover:shadow-md hover:border-[#14532d] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={site.mainImage}
                    alt={site.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-[#14532d] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                    {site.categoryLabelBn}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    {site.upazilaNameBn}
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-[11px] text-gray-400 mb-1 font-sans">{site.nameEn}</div>
                  <Link href={`/heritage/${site.slug}`}>
                    <h2 className="font-bold text-lg text-[#1a1d1f] group-hover:text-[#14532d] transition-colors leading-snug">
                      {site.nameBn}
                    </h2>
                  </Link>

                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {site.historyBn}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{site.addressBn}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>যাচাইকৃত: {site.verifiedDate}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#faf8f5] border-t border-[#e7e3db] flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{site.officialSource}</span>
                <Link
                  href={`/heritage/${site.slug}`}
                  className="text-xs font-semibold text-[#14532d] inline-flex items-center gap-1 hover:underline"
                >
                  <span>সম্পূর্ণ ভ্রমণ গাইড</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#e7e3db] rounded-lg">
          <Landmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-gray-800">কোনো দর্শনীয় স্থান খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-gray-500 mt-1">অনুগ্রহ করে সার্চ কীওয়ার্ড অথবা ফিল্টার পরিবর্তন করে দেখুন।</p>
        </div>
      )}
    </div>
  );
}
