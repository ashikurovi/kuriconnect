'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  UPAZILAS,
  NEWS_ARTICLES,
  HERITAGE_SITES,
  HEALTHCARE_FACILITIES,
  POLICE_CONTACTS,
  DIRECTORY_ITEMS,
  COMMUNITY_REPORTS
} from '@/data/kurigramData';
import {
  Search,
  MapPin,
  Newspaper,
  Landmark,
  Hospital,
  Shield,
  Building2,
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'upazila' | 'heritage' | 'healthcare' | 'police' | 'directories'>('all');

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const q = query.trim().toLowerCase();

  // Search through all entities
  const matchedUpazilas = q
    ? UPAZILAS.filter(
        (u) =>
          u.nameBn.toLowerCase().includes(q) ||
          u.nameEn.toLowerCase().includes(q) ||
          u.overviewBn.toLowerCase().includes(q) ||
          u.unions.some((un) => un.toLowerCase().includes(q))
      )
    : [];

  const matchedNews = q
    ? NEWS_ARTICLES.filter(
        (n) =>
          n.titleBn.toLowerCase().includes(q) ||
          n.titleEn.toLowerCase().includes(q) ||
          n.excerptBn.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const matchedHeritage = q
    ? HERITAGE_SITES.filter(
        (h) =>
          h.nameBn.toLowerCase().includes(q) ||
          h.nameEn.toLowerCase().includes(q) ||
          h.historyBn.toLowerCase().includes(q)
      )
    : [];

  const matchedHealthcare = q
    ? HEALTHCARE_FACILITIES.filter(
        (hc) =>
          hc.nameBn.toLowerCase().includes(q) ||
          hc.nameEn.toLowerCase().includes(q) ||
          hc.addressBn.toLowerCase().includes(q) ||
          hc.availableServices.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  const matchedPolice = q
    ? POLICE_CONTACTS.filter(
        (p) =>
          p.officeNameBn.toLowerCase().includes(q) ||
          p.officeNameEn.toLowerCase().includes(q) ||
          p.phone.includes(q)
      )
    : [];

  const matchedDirectories = q
    ? DIRECTORY_ITEMS.filter(
        (d) =>
          d.nameBn.toLowerCase().includes(q) ||
          d.nameEn.toLowerCase().includes(q) ||
          d.addressBn.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchedUpazilas.length +
    matchedNews.length +
    matchedHeritage.length +
    matchedHealthcare.length +
    matchedPolice.length +
    matchedDirectories.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Search Input */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
          কুড়িগ্রাম সমন্বিত তথ্য অনুসন্ধান (Unified District Search)
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          সংবাদ, উপজেলা, ঐতিহ্য, হাসপাতাল, রক্তদাতা, থানা বা যেকোনো পাবলিক ডিরেক্টরি একযোগে খুঁজুন।
        </p>

        <div className="relative max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="উদাহরণ: ধরলা, উলিপুর, সোনাহাট, হাসপাতাল, অ্যাম্বুলেন্স, চিলমারী..."
            className="w-full bg-white border border-[#d2ccc1] rounded-lg py-3 pl-10 pr-4 text-sm text-[#1a1d1f] shadow-2xs focus:outline-none focus:border-[#14532d] focus:ring-1 focus:ring-[#14532d]"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Tabs Filter */}
      {query && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#e7e3db] text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
              activeTab === 'all' ? 'bg-[#14532d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            সকল ফলাফল ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
              activeTab === 'news' ? 'bg-[#14532d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            সংবাদ ({matchedNews.length})
          </button>
          <button
            onClick={() => setActiveTab('upazila')}
            className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
              activeTab === 'upazila' ? 'bg-[#14532d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            উপজেলা ({matchedUpazilas.length})
          </button>
          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
              activeTab === 'heritage' ? 'bg-[#14532d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ঐতিহ্য ও পর্যটন ({matchedHeritage.length})
          </button>
          <button
            onClick={() => setActiveTab('healthcare')}
            className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
              activeTab === 'healthcare' ? 'bg-[#14532d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            হাসপাতাল ({matchedHealthcare.length})
          </button>
          <button
            onClick={() => setActiveTab('police')}
            className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
              activeTab === 'police' ? 'bg-[#14532d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            থানা ও সেবা ({matchedPolice.length})
          </button>
          <button
            onClick={() => setActiveTab('directories')}
            className={`px-3 py-1.5 rounded-sm font-semibold transition-colors ${
              activeTab === 'directories' ? 'bg-[#14532d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            অন্যান্য প্রতিষ্ঠান ({matchedDirectories.length})
          </button>
        </div>
      )}

      {/* Results Render Area */}
      {!query ? (
        <div className="p-12 text-center bg-white border border-[#e7e3db] rounded-lg space-y-2">
          <Search className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-gray-800">অনুসন্ধান শুরু করুন</h3>
          <p className="text-xs text-gray-500">
            উপরে সার্চ বক্সে যেকোনো শব্দ লিখে খুঁজুন। যেমন: &quot;সোনাহাট&quot;, &quot;ধরলা&quot;, &quot;উলিপুর&quot; বা &quot;অ্যাম্বুলেন্স&quot;।
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="p-12 text-center bg-white border border-[#e7e3db] rounded-lg space-y-2">
          <Search className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-gray-800">&quot;{query}&quot; সংক্রান্ত কোনো তথ্য মেলেনি</h3>
          <p className="text-xs text-gray-500">বানান সঠিক আছে কিনা দেখুন অথবা অন্য শব্দ লিখে অনুসন্ধান করুন।</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upazilas Section */}
          {(activeTab === 'all' || activeTab === 'upazila') && matchedUpazilas.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-1 border-b border-gray-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#14532d]" />
                <span>উপজেলা সংক্রান্ত ফলাফল ({matchedUpazilas.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedUpazilas.map((u) => (
                  <Link
                    key={u.id}
                    href={`/upazila/${u.slug}`}
                    className="p-3.5 bg-white border border-[#e7e3db] rounded-lg hover:border-[#14532d] hover:shadow-xs transition-all block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{u.nameBn}</span>
                      <span className="text-xs text-gray-500">{u.nameEn}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">{u.overviewBn}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* News Section */}
          {(activeTab === 'all' || activeTab === 'news') && matchedNews.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-1 border-b border-gray-200 flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-[#14532d]" />
                <span>সংবাদ প্রতিবেদন ({matchedNews.length})</span>
              </h2>
              <div className="space-y-2">
                {matchedNews.map((n) => (
                  <Link
                    key={n.id}
                    href={`/news/${n.slug}`}
                    className="p-3 bg-white border border-[#e7e3db] rounded-lg hover:border-[#14532d] transition-colors block"
                  >
                    <span className="text-xs font-bold text-[#14532d] block">{n.category}</span>
                    <h3 className="text-sm font-bold text-gray-900 mt-0.5">{n.titleBn}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">{n.excerptBn}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Heritage Section */}
          {(activeTab === 'all' || activeTab === 'heritage') && matchedHeritage.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-1 border-b border-gray-200 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-amber-700" />
                <span>ঐতিহ্য ও দর্শনীয় স্থান ({matchedHeritage.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedHeritage.map((h) => (
                  <Link
                    key={h.id}
                    href={`/heritage/${h.slug}`}
                    className="p-3 bg-white border border-[#e7e3db] rounded-lg hover:border-amber-400 transition-colors block"
                  >
                    <span className="text-xs font-bold text-gray-900 block">{h.nameBn}</span>
                    <span className="text-[11px] text-gray-500">{h.upazilaNameBn} • {h.addressBn}</span>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">{h.historyBn}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Healthcare Section */}
          {(activeTab === 'all' || activeTab === 'healthcare') && matchedHealthcare.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-1 border-b border-gray-200 flex items-center gap-1.5">
                <Hospital className="w-4 h-4 text-red-600" />
                <span>হাসপাতাল ও চিকিৎসাসেবা ({matchedHealthcare.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedHealthcare.map((hc) => (
                  <div key={hc.id} className="p-3 bg-white border border-[#e7e3db] rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{hc.nameBn}</span>
                      <span className="text-[11px] text-gray-500">{hc.upazilaNameBn} • {hc.addressBn}</span>
                    </div>
                    <a
                      href={`tel:${hc.phone}`}
                      className="text-xs bg-red-600 text-white px-2.5 py-1 rounded font-bold hover:bg-red-700"
                    >
                      কল দিন
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Police Section */}
          {(activeTab === 'all' || activeTab === 'police') && matchedPolice.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-1 border-b border-gray-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>থানা ও প্রশাসনিক যোগাযোগ ({matchedPolice.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedPolice.map((p) => (
                  <div key={p.id} className="p-3 bg-white border border-[#e7e3db] rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{p.officeNameBn}</span>
                      <span className="text-[11px] text-gray-500">{p.designationBn} • {p.upazilaNameBn}</span>
                    </div>
                    <a
                      href={`tel:${p.phone}`}
                      className="text-xs bg-blue-700 text-white px-2.5 py-1 rounded font-bold hover:bg-blue-800"
                    >
                      কল দিন
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Directories Section */}
          {(activeTab === 'all' || activeTab === 'directories') && matchedDirectories.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider pb-1 border-b border-gray-200 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>অন্যান্য শিক্ষা ও সরকারি প্রতিষ্ঠান ({matchedDirectories.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedDirectories.map((d) => (
                  <div key={d.id} className="p-3 bg-white border border-[#e7e3db] rounded-lg">
                    <span className="text-xs font-bold text-gray-900 block">{d.nameBn}</span>
                    <span className="text-[11px] text-gray-500">{d.categoryLabelBn} • {d.addressBn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">সার্চ ইঞ্জিন প্রস্তুত হচ্ছে...</div>}>
      <SearchContent />
    </Suspense>
  );
}
