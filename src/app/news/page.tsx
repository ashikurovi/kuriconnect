'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NEWS_ARTICLES, UPAZILAS } from '@/data/kurigramData';
import NewsCard from '@/components/NewsCard';
import { Newspaper, Search, Filter, Clock, Flame, ArrowRight } from 'lucide-react';

export default function NewsIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUpazila, setSelectedUpazila] = useState('all');

  const filteredNews = NEWS_ARTICLES.filter((article) => {
    const matchesSearch =
      article.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerptBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesUpazila = selectedUpazila === 'all' || article.upazilaId === selectedUpazila;

    return matchesSearch && matchesCategory && matchesUpazila;
  });

  const heroArticle = NEWS_ARTICLES.find((a) => a.isHeroFeatured) || NEWS_ARTICLES[0];
  const trendingArticles = NEWS_ARTICLES.filter((a) => a.isTrending);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">জেলা ও উপজেলা সংবাদ</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা সংবাদ বাতায়ন ও অনুসন্ধানী প্রতিবেদন
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              উন্নয়ন, চরাঞ্চলের জীবনগাথা, কৃষি বৈচিত্র্য, নদী ভাঙন ও জনস্বার্থের নির্ভরযোগ্য সংবাদ।
            </p>
          </div>
          <span className="text-xs bg-green-50 text-green-900 px-3 py-1.5 rounded border border-green-200 font-semibold self-start sm:self-auto">
            বস্তুনিষ্ঠ সাংবাদিকতা ও সত্যতা যাচাই
          </span>
        </div>
      </div>

      {/* Featured Lead Story */}
      <section>
        <NewsCard article={heroArticle} variant="hero" />
      </section>

      {/* Category Pills & Filters */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'সকল সংবাদ' },
            { id: 'district', label: 'জেলা সংবাদ' },
            { id: 'upazila', label: 'উপজেলা সংবাদ' },
            { id: 'river-erosion', label: 'নদী ভাঙন ও বন্দর' },
            { id: 'agriculture', label: 'কৃষি ও উৎপাদন' },
            { id: 'education', label: 'শিক্ষা ও তরুণ' },
            { id: 'heritage', label: 'ঐতিহ্য ও সংস্কৃতি' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#14532d] text-white shadow-xs'
                  : 'bg-[#faf8f5] text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Upazila Select */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খবরের শিরোনাম বা ট্যাগ খুঁজুন..."
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#14532d]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
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

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <NewsCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#e7e3db] rounded-lg">
          <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-gray-800">কোনো সংবাদ প্রতিবেদন পাওয়া যায়নি</h3>
          <p className="text-xs text-gray-500 mt-1">অনুগ্রহ করে সার্চ কীওয়ার্ড বা ফিল্টার পরিবর্তন করুন।</p>
        </div>
      )}
    </div>
  );
}
