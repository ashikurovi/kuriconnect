'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UPAZILAS,
  NEWS_ARTICLES,
  HERITAGE_SITES,
  HEALTHCARE_FACILITIES,
  BLOOD_DONORS,
  COMMUNITY_REPORTS,
  SCAM_ALERTS
} from '@/data/kurigramData';
import {
  LayoutDashboard,
  Newspaper,
  Hospital,
  HeartHandshake,
  AlertTriangle,
  ShieldAlert,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Search,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'reports' | 'donors' | 'scams' | 'roles' | 'logs'>('overview');
  const [reports, setReports] = useState(COMMUNITY_REPORTS);
  const [newsList, setNewsList] = useState(NEWS_ARTICLES);
  const [donorsList, setDonorsList] = useState(BLOOD_DONORS);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // New Article Form state
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newCategory, setNewCategory] = useState<'district' | 'upazila' | 'river-erosion' | 'agriculture' | 'education'>('district');

  const updateReportStatus = (id: string, newStatus: any) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: 'আজ, ৩০ অক্টোবর ২০২৬' } : r))
    );
    setAlertSuccess('রিপোর্টের স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে।');
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleBn.trim()) return;
    const newArticle = {
      id: `news-${Date.now()}`,
      slug: `custom-news-${Date.now()}`,
      titleBn: newTitleBn,
      titleEn: 'Published by Editorial Board',
      excerptBn: 'কুড়িগ্রাম জেলা বিষয়ক নতুন সংবাদ বার্তা।',
      contentBn: newTitleBn,
      category: newCategory,
      upazilaNameBn: 'কুড়িগ্রাম সদর',
      author: {
        nameBn: 'সম্পাদকীয় বোর্ড',
        roleBn: 'মডারেটর'
      },
      publishedAt: '৩০ অক্টোবর ২০২৬',
      readTimeMinutes: 3,
      featuredImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      source: 'KuriConnect বার্তা বিভাগ',
      tags: ['সংবাদ', 'কুড়িগ্রাম']
    };
    setNewsList([newArticle, ...newsList]);
    setNewTitleBn('');
    setAlertSuccess('নতুন সংবাদ সফলভাবে প্রকাশিত হয়েছে!');
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const deleteNews = (id: string) => {
    if (confirm('আপনি কি এই সংবাদটি মুছে ফেলতে চান?')) {
      setNewsList(newsList.filter((n) => n.id !== id));
      setAlertSuccess('সংবাদটি মুছে ফেলা হয়েছে।');
      setTimeout(() => setAlertSuccess(null), 3000);
    }
  };

  const toggleDonorVerification = (id: string) => {
    setDonorsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verifiedDate: 'আজ (অনুমোদিত)' } : d))
    );
    setAlertSuccess('রক্তদাতার প্রোফাইল সফলভাবে যাচাই ও সক্রিয় করা হয়েছে।');
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-[#1c2220] text-white rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#2e3734] shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs uppercase font-bold text-green-300 tracking-wider">
              নিরাপদ অ্যাডমিন কন্ট্রোল প্যানেল
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            KuriConnect প্রশাসন ও সম্পাদকীয় পোর্টাল
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            ব্যবহারকারী: <strong className="text-white">সুপার অ্যাডমিন (Super Admin)</strong> • সেশন সক্রিয়
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>মূল ওয়েবসাইট দেখুন</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {alertSuccess && (
        <div className="p-3 bg-green-50 border border-green-300 rounded text-xs text-green-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#e7e3db] text-xs">
        {[
          { id: 'overview', label: 'ড্যাশবোর্ড পরিসংখ্যান', icon: LayoutDashboard },
          { id: 'news', label: 'সংবাদ ও কন্টেন্ট', icon: Newspaper },
          { id: 'reports', label: 'নাগরিক সমস্যা মডারেশন', icon: AlertTriangle },
          { id: 'donors', label: 'রক্তদাতা অনুমোদন', icon: HeartHandshake },
          { id: 'scams', label: 'প্রতারণা সতর্কতা', icon: ShieldAlert },
          { id: 'roles', label: 'ভূমিকা ও পারমিশন (RBAC)', icon: Users },
          { id: 'logs', label: 'অডিট লগ ও ডেটা উৎস', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#14532d] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-[#e7e3db] rounded-lg p-4 text-center shadow-2xs">
              <span className="text-xs text-gray-500 block">মোট উপজেলা</span>
              <span className="text-2xl font-bold text-gray-900 mt-1 block">৯টি</span>
              <span className="text-[10px] text-green-700">১০০% কভারেজ</span>
            </div>
            <div className="bg-white border border-[#e7e3db] rounded-lg p-4 text-center shadow-2xs">
              <span className="text-xs text-gray-500 block">প্রকাশিত সংবাদ</span>
              <span className="text-2xl font-bold text-gray-900 mt-1 block">{newsList.length}টি</span>
              <span className="text-[10px] text-green-700">অনলাইন</span>
            </div>
            <div className="bg-white border border-[#e7e3db] rounded-lg p-4 text-center shadow-2xs">
              <span className="text-xs text-gray-500 block">নাগরিক সমস্যা</span>
              <span className="text-2xl font-bold text-amber-700 mt-1 block">{reports.length}টি</span>
              <span className="text-[10px] text-amber-800">ট্র্যাকিংয়ে</span>
            </div>
            <div className="bg-white border border-[#e7e3db] rounded-lg p-4 text-center shadow-2xs">
              <span className="text-xs text-gray-500 block">রক্তদাতা নিবন্ধিত</span>
              <span className="text-2xl font-bold text-red-700 mt-1 block">{donorsList.length} জন</span>
              <span className="text-[10px] text-red-600">গোপন নম্বর</span>
            </div>
            <div className="bg-white border border-[#e7e3db] rounded-lg p-4 text-center shadow-2xs">
              <span className="text-xs text-gray-500 block">স্বাস্থ্য ও হাসপাতাল</span>
              <span className="text-2xl font-bold text-gray-900 mt-1 block">{HEALTHCARE_FACILITIES.length}টি</span>
              <span className="text-[10px] text-gray-600">যাচাইকৃত</span>
            </div>
            <div className="bg-white border border-[#e7e3db] rounded-lg p-4 text-center shadow-2xs">
              <span className="text-xs text-gray-500 block">প্রতারণা সতর্কতা</span>
              <span className="text-2xl font-bold text-amber-700 mt-1 block">{SCAM_ALERTS.length}টি</span>
              <span className="text-[10px] text-amber-800">সতর্কীকরণ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
              <h2 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>সর্বশেষ নাগরিক রিপোর্টসমূহ</span>
                <button onClick={() => setActiveTab('reports')} className="text-xs text-[#14532d] hover:underline">
                  সবগুলো দেখুন →
                </button>
              </h2>
              <div className="space-y-3">
                {reports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="p-3 bg-[#faf8f5] border border-gray-200 rounded text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block">{rep.titleBn}</span>
                      <span className="text-[11px] text-gray-500">{rep.upazilaNameBn} • {rep.submittedAt}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
              <h2 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>তথ্য মেয়াদোত্তীর্ণ ও হালনাগাদ সতর্কতা</span>
                <span className="text-xs text-green-700 font-semibold">সব তথ্য সক্রিয়</span>
              </h2>
              <div className="space-y-2 text-xs text-gray-600">
                <p className="p-2.5 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>৯টি উপজেলার স্বাস্থ্য কমপ্লেক্সের জরুরি ফোন নম্বর সর্বশেষ ২০২৬ সালের অক্টোবরে যাচাইকৃত।</span>
                </p>
                <p className="p-2.5 bg-blue-50 border border-blue-200 rounded flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>থানা ও ওসির সরকারি নম্বর জেলা পুলিশ পোর্টালের সাথে সিঙ্ক করা হয়েছে।</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NEWS MANAGEMENT */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          {/* Create News Quick Form */}
          <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
            <h2 className="font-bold text-base text-gray-900 mb-3 pb-2 border-b border-gray-100">
              নতুন সংবাদ প্রকাশ করুন
            </h2>
            <form onSubmit={handleCreateNews} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    required
                    value={newTitleBn}
                    onChange={(e) => setNewTitleBn(e.target.value)}
                    placeholder="সংবাদের শিরোনাম লিখুন..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#14532d]"
                  />
                </div>
                <div>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#14532d]"
                  >
                    <option value="district">জেলা সংবাদ</option>
                    <option value="upazila">উপজেলা সংবাদ</option>
                    <option value="river-erosion">নদী ও চর</option>
                    <option value="agriculture">কৃষি</option>
                    <option value="education">শিক্ষা</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#14532d] hover:bg-[#0f3d21] text-white px-4 py-1.5 rounded text-xs font-semibold"
                >
                  সংবাদ প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>

          {/* News Items Table */}
          <div className="bg-white border border-[#e7e3db] rounded-lg overflow-hidden shadow-2xs">
            <div className="px-5 py-3 border-b border-gray-100 font-bold text-sm text-gray-900">
              প্রকাশিত সংবাদের তালিকা ({newsList.length}টি)
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              {newsList.map((article) => (
                <div key={article.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50">
                  <div className="min-w-0">
                    <span className="font-semibold text-gray-900 block truncate">{article.titleBn}</span>
                    <span className="text-[11px] text-gray-500">
                      ক্যাটাগরি: {article.category} • লেখক: {article.author.nameBn} • {article.publishedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/news/${article.slug}`}
                      className="px-2 py-1 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"
                    >
                      দেখুন
                    </Link>
                    <button
                      onClick={() => deleteNews(article.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY REPORTS MODERATION */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-[#e7e3db] rounded-lg overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900">নাগরিক সমস্যার স্ট্যাটাস ব্যবস্থাপনা ও অগ্রগতি</h2>
            <span className="text-xs text-gray-500">মোট রিপোর্ট: {reports.length}টি</span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {reports.map((report) => (
              <div key={report.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{report.titleBn}</h3>
                    <p className="text-[11px] text-gray-500">
                      {report.upazilaNameBn} • {report.locationDetailsBn} • দাখিল: {report.submittedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-500 text-[11px]">অবস্থা পরিবর্তন:</span>
                    <select
                      value={report.status}
                      onChange={(e) => updateReportStatus(report.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:border-[#14532d]"
                    >
                      <option value="submitted">📥 জমা হয়েছে (Submitted)</option>
                      <option value="under_review">🔍 তদন্তাধীন (Under Review)</option>
                      <option value="in_progress">⏳ কাজ চলমান (In Progress)</option>
                      <option value="resolved">✓ সমাধানকৃত (Resolved)</option>
                    </select>
                  </div>
                </div>

                <p className="text-gray-700 text-xs">{report.descriptionBn}</p>
                {report.resolutionNotesBn && (
                  <p className="text-[11px] bg-green-50 p-2 rounded text-green-900 border border-green-200">
                    <strong>প্রশাসনিক অগ্রগতি:</strong> {report.resolutionNotesBn}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BLOOD DONORS MODERATION */}
      {activeTab === 'donors' && (
        <div className="bg-white border border-[#e7e3db] rounded-lg overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900">নিবন্ধিত রক্তদাতাদের যাচাই ও প্রোফাইল নিয়ন্ত্রণ</h2>
            <span className="text-xs text-red-600 font-bold">ব্যক্তিগত মোবাইল সুরক্ষিত</span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {donorsList.map((donor) => (
              <div key={donor.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                    {donor.bloodGroup}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{donor.donorNameBn}</h3>
                    <p className="text-[11px] text-gray-500">
                      {donor.upazilaNameBn} • {donor.areaBn} • নম্বর: {donor.contactNumberMasked}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500">যাচাই: {donor.verifiedDate}</span>
                  <button
                    onClick={() => toggleDonorVerification(donor.id)}
                    className="px-2.5 py-1 bg-green-50 text-[#14532d] border border-green-300 rounded font-semibold hover:bg-green-100"
                  >
                    পুনরায় যাচাই করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SCAM ALERTS */}
      {activeTab === 'scams' && (
        <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">সতর্কবার্তা প্রকাশনা ও ব্যবস্থাপনা</h2>
            <span className="text-xs text-gray-500">মোট সক্রিয় সতর্কতা: {SCAM_ALERTS.length}টি</span>
          </div>

          <div className="space-y-3">
            {SCAM_ALERTS.map((scam) => (
              <div key={scam.id} className="p-4 bg-[#faf8f5] border border-amber-200 rounded text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{scam.titleBn}</span>
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    {scam.severity}
                  </span>
                </div>
                <p className="text-gray-700">{scam.summaryBn}</p>
                <div className="text-[11px] text-gray-500 flex items-center justify-between">
                  <span>যাচাইকারী: {scam.verifiedBy}</span>
                  <span>প্রকাশের তারিখ: {scam.publishedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ROLES & PERMISSIONS (RBAC) */}
      {activeTab === 'roles' && (
        <div className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">
              রোল-ভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ (Role-Based Access Control)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              সিস্টেমের নিরাপত্তা ও সম্পাদনার সুবিধার জন্য সার্ভার-লেভেলে পারমিশন সংজ্ঞায়িত।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#faf8f5] border border-gray-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Super Admin</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">পূর্ণ ক্ষমতা</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                সিস্টেম কনফিগ, ডাটাবেজ ব্যাকআপ, রোল অ্যাসাইনমেন্ট, অডিট লগ অ্যাক্সেস ও সর্বজনীন কর্তৃত্ব।
              </p>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-gray-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Editor (সম্পাদক)</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">কন্টেন্ট</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                সংবাদ প্রকাশ, সম্পাদন, শিডিউল পাবলিকেশন, সংশোধন নীতি বাস্তবায়ন ও মিডিয়া অনুমোদন।
              </p>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-gray-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Moderator (মডারেটর)</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">নাগরিক রিপোর্ট</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                জনসমস্যা যাচাই, রক্তদাতা সত্যতা মূল্যায়ন, প্রতারণা রিপোর্ট পরীক্ষা ও স্ট্যাটাস হালনাগাদ।
              </p>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-gray-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Directory Manager</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold">ডিরেক্টরি</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                হাসপাতাল, থানা, শিক্ষা প্রতিষ্ঠান ও সরকারি অফিস ফোন নম্বর নিয়মিত ভেরিফিকেশন।
              </p>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-gray-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Reporter (সংবাদদাতা)</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-bold">ড্রাফট</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                ৯টি উপজেলার নিজস্ব মাঠপর্যায়ের খবর ও ফিচার ড্রাফট তৈরি করে সম্পাদকের কাছে জমা দান।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">অডিট লগ ও ডেটা ট্র্যাকিং (Audit Trails)</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              প্রশাসনিক পরিবর্তন, স্ট্যাটাস আপডেট ও তথ্য যাচাইকরণের নির্ভরযোগ্য লগ।
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { time: '2026-10-30 01:45:20', actor: 'SuperAdmin', action: 'STATUS_UPDATE', detail: 'Report #rep-1 updated to IN_PROGRESS' },
              { time: '2026-10-29 18:22:10', actor: 'Editor_Shafiq', action: 'ARTICLE_PUBLISH', detail: 'Published article "ধরলা সেতুর দুপাশে অর্থনৈতিক চাঞ্চল্য"' },
              { time: '2026-10-29 14:10:05', actor: 'Moderator_Aziz', action: 'DONOR_VERIFY', detail: 'Verified donor record #donor-1 (O+)' },
              { time: '2026-10-28 11:05:40', actor: 'DirManager_Hasan', action: 'HOSPITAL_AUDIT', detail: 'Checked Sadar 250-bed contact 02589965212' },
              { time: '2026-10-27 09:30:15', actor: 'SuperAdmin', action: 'SCAM_ALERT_BROADCAST', detail: 'Published alert "সোনাহাট ও বুড়িমারী স্থলবন্দরে ভুয়া চাকরি চক্র"' }
            ].map((log, idx) => (
              <div key={idx} className="p-2.5 bg-gray-50 border border-gray-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <span className="text-gray-500">{log.time}</span>
                <span className="font-bold text-blue-700">{log.actor}</span>
                <span className="font-semibold text-green-700">{log.action}</span>
                <span className="text-gray-700">{log.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
