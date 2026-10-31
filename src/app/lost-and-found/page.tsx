'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UPAZILAS
} from '@/data/kurigramData';
import { LostNotice, UpazilaId } from '@/types';
import LostNoticeModal from '@/components/LostNoticeModal';
import {
  Search,
  Filter,
  PlusCircle,
  PhoneCall,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Share2,
  X,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  User,
  HelpCircle,
  Layers
} from 'lucide-react';

export default function LostAndFoundPage() {
  const [notices, setNotices] = useState<LostNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchNotices = () => {
    setLoading(true);
    fetch('/api/lost-notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotices(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    type: 'lost' as 'lost' | 'found',
    category: 'document' as LostNotice['category'],
    titleBn: '',
    descriptionBn: '',
    upazilaId: 'kurigram-sadar' as UpazilaId,
    locationDetailsBn: '',
    date: '2026-10-30',
    gdNumber: '',
    contactName: '',
    contactPhone: '',
    rewardBn: ''
  });

  const categoryLabels: Record<string, string> = {
    all: 'সকল ক্যাটাগরি',
    person: 'নিখোঁজ ব্যক্তি',
    document: 'আইডি কার্ড ও সনদ',
    vehicle: 'যানবাহন ও সাইকেল',
    valuable: 'মোবাইল ও মূল্যবান জিনিস',
    other: 'অন্যান্য'
  };

  // Filtered notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.gdNumber && notice.gdNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      notice.locationDetailsBn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || notice.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesUpazila = selectedUpazila === 'all' || notice.upazilaId === selectedUpazila;

    return matchesSearch && matchesType && matchesCategory && matchesUpazila;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleBn.trim() || !formData.contactPhone.trim()) return;

    const upazilaObj = UPAZILAS.find((u) => u.id === formData.upazilaId);

    const newNotice: LostNotice = {
      id: `lost-${Date.now()}`,
      type: formData.type,
      category: formData.category,
      categoryLabelBn: categoryLabels[formData.category] || 'সাধারণ',
      titleBn: formData.titleBn,
      descriptionBn: formData.descriptionBn,
      upazilaId: formData.upazilaId,
      upazilaNameBn: upazilaObj ? upazilaObj.nameBn : 'কুড়িগ্রাম সদর',
      locationDetailsBn: formData.locationDetailsBn,
      date: formData.date,
      gdNumber: formData.gdNumber.trim() ? formData.gdNumber : undefined,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      rewardBn: formData.rewardBn.trim() ? formData.rewardBn : undefined,
      status: 'active'
    };

    setNotices([newNotice, ...notices]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setModalOpen(false);
      setFormData({
        type: 'lost',
        category: 'document',
        titleBn: '',
        descriptionBn: '',
        upazilaId: 'kurigram-sadar',
        locationDetailsBn: '',
        date: '2026-10-30',
        gdNumber: '',
        contactName: '',
        contactPhone: '',
        rewardBn: ''
      });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      alert('বিজ্ঞপ্তির তথ্য কপি করা হয়েছে!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-10 font-bengali">
      {/* 🌟 Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span>কুড়িগ্রাম জেলা ডিজিটাল হারানো ও প্রাপ্তি বাতায়ন</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight">
            হারানো ও প্রাপ্তি বিজ্ঞপ্তি ড্যাশবোর্ড
          </h1>

          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-2xl">
            কুড়িগ্রামের ৯টি উপজেলার জাতীয় পরিচয়পত্র, শিক্ষাগত সনদ, নিখোঁজ ব্যক্তি, যানবাহন কিংবা কুড়িয়ে পাওয়া জিনিসের তথ্য সন্ধান করুন অথবা নাগরিক হিসেবে নতুন বিজ্ঞপ্তি পোস্ট করুন।
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>+ হারানো বা প্রাপ্তি বিজ্ঞপ্তি পোস্ট করুন</span>
            </button>
            <a
              href="#guidance"
              className="inline-flex items-center gap-1.5 bg-black/20 hover:bg-black/30 border border-white/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all"
            >
              <HelpCircle className="w-4 h-4 text-emerald-300" />
              <span>জিডি করার নিয়মাবলী</span>
            </a>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20"></div>
      </div>

      {/* 🔍 Filter & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Top Filter Row: Type Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Type Toggle: All / Lost / Found */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল বিজ্ঞপ্তি ({notices.length})
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                selectedType === 'lost'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-300"></span>
              <span>হারানো ({notices.filter((n) => n.type === 'lost').length})</span>
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                selectedType === 'found'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              <span>কুড়িয়ে পাওয়া ({notices.filter((n) => n.type === 'found').length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিরোনাম, জিডি নং বা স্থান দিয়ে খুঁজুন..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bottom Filter Row: Category Pills & Upazila Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === key
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Upazila Filter Dropdown */}
          <div className="shrink-0 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs text-slate-700 font-medium focus:bg-white focus:border-emerald-500 transition-all"
            >
              <option value="all">সকল উপজেলা (৯টি)</option>
              {UPAZILAS.map((up) => (
                <option key={up.id} value={up.id}>
                  {up.nameBn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 📋 Notices Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>মোট প্রদর্শিত বিজ্ঞপ্তি: <strong className="text-slate-800 font-bold">{filteredNotices.length}টি</strong></span>
          {(selectedType !== 'all' || selectedCategory !== 'all' || selectedUpazila !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedCategory('all');
                setSelectedUpazila('all');
                setSearchQuery('');
              }}
              className="text-emerald-700 font-semibold hover:underline"
            >
              ফিল্টার রিসেট করুন
            </button>
          )}
        </div>

        {filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotices.map((notice) => (
              <article
                key={notice.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 ${
                        notice.type === 'lost'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${notice.type === 'lost' ? 'bg-rose-600' : 'bg-emerald-600'}`} />
                      <span>{notice.type === 'lost' ? 'হারানো বিজ্ঞপ্তি' : 'কুড়িয়ে পাওয়া'}</span>
                    </span>

                    <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-medium">
                      {categoryLabels[notice.category] || notice.categoryLabelBn || 'অন্যান্য'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug mb-2">
                    {notice.titleBn}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3.5 line-clamp-3">
                    {notice.descriptionBn}
                  </p>

                  {/* Reward Banner if announced */}
                  {notice.rewardBn && (
                    <div className="mb-3.5 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600 shrink-0" />
                      <span><strong>পুরস্কার:</strong> {notice.rewardBn}</span>
                    </div>
                  )}

                  {/* Meta details */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 bg-slate-50/70 p-3 rounded-xl border border-slate-100 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{notice.upazilaNameBn} • {notice.locationDetailsBn}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>তারিখ: {notice.date}</span>
                      </div>
                      {notice.gdNumber && (
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px] font-medium">
                          {notice.gdNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block">যোগাযোগ:</span>
                    <span className="font-bold text-xs text-slate-800 truncate block">
                      {notice.contactName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(`${notice.titleBn}\nযোগাযোগ: ${notice.contactPhone}`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="বিজ্ঞপ্তি তথ্য কপি করুন"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`tel:${notice.contactPhone}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>কল দিন</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-base text-slate-700">কোনো বিজ্ঞপ্তি পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              আপনার ফিল্টার কিংবা সার্চ কি-ওয়ার্ড পরিবর্তন করে দেখুন অথবা নতুন বিজ্ঞপ্তি পোস্ট করুন।
            </p>
          </div>
        )}
      </div>

      {/* 📖 Information & Guidance Card */}
      <section id="guidance" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="font-heading font-bold text-lg text-white">
            কোনো কিছু হারিয়ে গেলে বা নিখোঁজ হলে করণীয় ও আইনগত পরামর্শ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-emerald-400 block text-sm">১. থানায় দ্রুত জিডি (GD) করুন</span>
            <p>
              জাতীয় পরিচয়পত্র, ড্রাইভিং লাইসেন্স, পরীক্ষার সার্টিফিকেট কিংবা মোবাইল হারালে নিকটস্থ থানায় তাৎক্ষণিক সাধারণ ডায়েরি (GD) করুন অথবা বাংলাদেশ পুলিশের অনলাইন জিডি অ্যাপ ব্যবহার করুন।
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-emerald-400 block text-sm">২. সিম ও মোবাইল ট্র্যাকিং</span>
            <p>
              মোবাইল ফোন হারিয়ে গেলে সিম কোম্পানিকে ফোন করে সিম দ্রুত লক বা রিপ্লেস করুন এবং জিডির কপি নিয়ে পুলিশকে আইএমইআই (IMEI) নম্বর দিন যাতে ট্র্যাকিং সম্ভব হয়।
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="font-bold text-emerald-400 block text-sm">৩. জাতীয় হেল্পলাইন ৯৯৯</span>
            <p>
              শিশু বা কোনো ব্যক্তি নিখোঁজ হলে দেরি না করে সরাসরি জাতীয় জরুরি হেল্পলাইন ৯৯৯-এ কল করুন এবং আমাদের প্ল্যাটফর্মে বিজ্ঞপ্তির মাধ্যমে কুড়িগ্রামের সাধারণ মানুষের সহায়তা নিন।
            </p>
          </div>
        </div>
      </section>

      {/* 📝 New Notice Submission Modal */}
      <LostNoticeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchNotices}
      />
    </div>
  );
}
