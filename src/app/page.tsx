'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UPAZILAS,
  HERITAGE_SITES,
  HEALTHCARE_FACILITIES,
  BLOOD_DONORS,
  POLICE_CONTACTS,
  COMMUNITY_REPORTS,
  SCAM_ALERTS,
  EMERGENCY_HELPLINES
} from '@/data/kurigramData';
import DistrictMap from '@/components/DistrictMap';
import ReportModal from '@/components/ReportModal';
import DonorModal from '@/components/DonorModal';
import {
  Compass,
  ArrowRight,
  Landmark,
  Hospital,
  HeartHandshake,
  ShieldAlert,
  AlertTriangle,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Search,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  Map,
  PlusCircle,
  HelpCircle,
  Building,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [donorFilterGroup, setDonorFilterGroup] = useState<string>('all');

  const filteredDonors = donorFilterGroup === 'all'
    ? BLOOD_DONORS.slice(0, 4)
    : BLOOD_DONORS.filter((d) => d.bloodGroup === donorFilterGroup).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 🚀 MODERN HERO SECTION: Digital District Platform with Banner Background */}
      <section className="relative overflow-hidden border-b border-slate-200/80 pt-10 pb-14 sm:pt-14 sm:pb-20">
        {/* Banner image with overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/kurigram-mosque-banner.jpg"
            alt="কুড়িগ্রামের ঐতিহ্যবাহী চণ্ডামারী শাহী মসজিদ"
            fill
            sizes="100vw"
            className="object-cover object-[center_50%] opacity-35 sm:opacity-40"
            priority
          />
          {/* Subtle gradient overlay allowing the photo to be visible while keeping elements readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/55 to-[#f8fafc]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Tagline / Motto Badge from Banner */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>কুড়িগ্রামকে জানুন, আপন করে চিনুন</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
              কুড়িগ্রামের প্রতিটি উপজেলা ও নাগরিক সেবা <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600">এখন এক প্ল্যাটফর্মে</span>
            </h1>

            {/* Description */}
            {/* <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              ৯টি উপজেলার আধুনিক ইন্টারেক্টিভ মানচিত্র, সার্বক্ষণিক হাসপাতাল ও জরুরি রক্তদাতা নেটওয়ার্ক, থানা প্রশাসন এবং নাগরিক সমস্যা ট্র্যাকিংয়ের একক ডিজিটাল সংযোগস্থল।
            </p> */}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#map"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-emerald-700/20 active:scale-95"
              >
                <Map className="w-4 h-4" />
                <span>ইন্টারেক্টিভ মানচিত্র খুলুন</span>
              </a>
              <Link
                href="/blood-bank"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-rose-700/20 active:scale-95"
              >
                <Heart className="w-4 h-4" />
                <span>জরুরি রক্তদাতা খুঁজুন</span>
              </Link>
              <button
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-2xs transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>নাগরিক সমস্যা জানান</span>
              </button>
            </div>
          </div>

          {/* 🎛️ 5 Quick Service Launchers (Digital Hub Tiles) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-10">
            <a
              href="#map"
              className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700">
                জেলা মানচিত্র
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">৯টি উপজেলা GIS</span>
            </a>

            <Link
              href="/blood-bank"
              className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-rose-500/50 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-700">
                ব্লাড ব্যাংক
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">স্বেচ্ছাসেবী রক্তদাতা</span>
            </Link>

            <Link
              href="/scam-alerts"
              className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-500/50 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-700">
                প্রতারণা সতর্কতা
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">সচেতনতা ও পরামর্শ</span>
            </Link>

            <Link
              href="/reports"
              className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-500/50 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-700">
                সমস্যা ট্র্যাকার
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">রাস্তা ও বাঁধ রিপোর্ট</span>
            </Link>

            <Link
              href="/heritage"
              className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-purple-500/50 hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 group-hover:text-purple-700">
                ঐতিহ্য ও পর্যটন
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">দর্শনীয় স্থানসমূহ</span>
            </Link>
          </div>

          {/* 📊 Live Platform Metrics Strip */}
          <div className="mt-8 pt-6 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/80 backdrop-blur-xs py-3 px-4 rounded-xl border border-slate-200/60 shadow-2xs">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 block">৯টি</span>
              <span className="text-xs text-slate-500 mt-0.5">উপজেলা ও ৭৩টি ইউনিয়ন</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs py-3 px-4 rounded-xl border border-slate-200/60 shadow-2xs">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-rose-600 block">১,২০০+</span>
              <span className="text-xs text-slate-500 mt-0.5">নিবন্ধিত রক্তদাতা</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs py-3 px-4 rounded-xl border border-slate-200/60 shadow-2xs">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-emerald-600 block">২৪/৭</span>
              <span className="text-xs text-slate-500 mt-0.5">জরুরি হাসপাতাল ও সেবা</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs py-3 px-4 rounded-xl border border-slate-200/60 shadow-2xs">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-purple-600 block">৫০+</span>
              <span className="text-xs text-slate-500 mt-0.5">ঐতিহাসিক ও দর্শনীয় স্থান</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ SECTION: Interactive Kurigram District Map (GIS Command Hub) */}
      <section className="max-w-7xl mx-auto px-4" id="map">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1 border border-emerald-200">
              <Compass className="w-3.5 h-3.5" />
              <span>ভৌগোলিক ও ডিজিটাল ম্যাপিং হাব</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              কুড়িগ্রাম জেলা ইন্টারেক্টিভ মানচিত্র
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              উপজেলায় ক্লিক করে বিস্তারিত ভৌগোলিক, ঐতিহাসিক ও জনসেবা তথ্য পর্যবেক্ষণ করুন।
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-lg border border-emerald-200 transition-colors self-start sm:self-auto"
          >
            <span>পূর্ণাঙ্গ ম্যাপ ভিউয়ার খুলুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6">
          <DistrictMap initialUpazilaId="kurigram-sadar" />
        </div>
      </section>

      {/* 🏛️ SECTION: Explore by 9 Upazilas */}
      <section className="max-w-7xl mx-auto px-4" id="upazilas">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>প্রশাসনিক বিভাজন</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              কুড়িগ্রামের ৯টি উপজেলা এক নজরে
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">মোট আয়তন: ২,২৭৬ বর্গ কিমি</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {UPAZILAS.map((upazila) => (
            <Link
              key={upazila.id}
              href={`/upazila/${upazila.slug}`}
              className="group bg-white border border-slate-200/90 rounded-xl p-5 hover:border-emerald-500/60 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {upazila.nameBn}
                  </h3>
                  <span className="text-xs text-slate-400 font-sans px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                    {upazila.nameEn}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {upazila.overviewBn}
                </p>
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50/80 rounded-lg text-center text-xs border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">আয়তন</span>
                    <span className="font-semibold text-slate-800">{upazila.areaKm2} কিমি²</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">ইউনিয়ন</span>
                    <span className="font-semibold text-slate-800">{upazila.unionsCount}টি</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">স্বাক্ষরতা</span>
                    <span className="font-semibold text-emerald-700">{upazila.keyStats.literacyRate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                <span>উপজেলা তথ্যবাতায়ন দেখুন</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🩸 SECTION: Blood Donor Network */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Healthcare Facilities — HIDDEN as requested */}
        {/*
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          ...
        </div>
        */}

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক</h3>
                <p className="text-xs text-slate-500">জরুরি রক্তের প্রয়োজনে ৯টি উপজেলার যাচাইকৃত রক্তদাতা সন্ধান</p>
              </div>
            </div>
            <button
              onClick={() => setDonorModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
            >
              + রক্তদাতা হিসেবে যুক্ত হন
            </button>
          </div>

          {/* Blood Group Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {['all', 'A+', 'B+', 'O+', 'AB+', 'O-', 'A-', 'B-'].map((bg) => (
              <button
                key={bg}
                onClick={() => setDonorFilterGroup(bg)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${donorFilterGroup === bg
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {bg === 'all' ? 'সকল গ্রুপ' : bg}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredDonors.map((donor) => (
              <div
                key={donor.id}
                className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs hover:bg-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                    {donor.bloodGroup}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block truncate">{donor.donorNameBn}</span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {donor.upazilaNameBn} • {donor.areaBn}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium inline-block mb-1">
                    প্রস্তুত
                  </span>
                  <button
                    onClick={() => setDonorModalOpen(true)}
                    className="text-[11px] text-rose-600 font-semibold hover:underline block"
                  >
                    অনুরোধ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] text-slate-400">ব্যক্তিগত মোবাইল নম্বর সংরক্ষিত ও নিরাপদ</span>
            <Link href="/blood-bank" className="text-rose-600 font-semibold hover:underline">
              সকল উপজেলা রক্তদাতা ডিরেক্টরি →
            </Link>
          </div>
        </div>
      </section>

      {/* 📢 SECTION: Citizen Reports Tracker */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Police Directory — HIDDEN as requested */}
        {/*
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
          ...
        </div>
        */}

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">স্থানীয় নাগরিক সমস্যা ট্র্যাকার</h3>
                <p className="text-xs text-slate-500">ভাঙা রাস্তা, নদী ভাঙন ও নাগরিক ভোগান্তির অগ্রগতি ও সমাধান ট্র্যাকিং</p>
              </div>
            </div>
            <button
              onClick={() => setReportModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
            >
              + সমস্যা জানান
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMUNITY_REPORTS.slice(0, 3).map((rep) => (
              <div
                key={rep.id}
                className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-xs text-slate-900 line-clamp-1">
                      {rep.titleBn}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${rep.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : rep.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                    >
                      {rep.status === 'resolved'
                        ? '✓ সমাধানকৃত'
                        : rep.status === 'in_progress'
                          ? '⏳ কাজ চলমান'
                          : '🔍 তদন্তাধীন'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {rep.descriptionBn}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{rep.upazilaNameBn} • {rep.locationDetailsBn}</span>
                  <span className="font-medium text-slate-600 font-mono">{rep.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">সকল নাগরিক রিপোর্ট সার্বক্ষণিক মনিটরিং করা হয়</span>
            <Link href="/reports" className="text-emerald-700 font-semibold hover:underline">
              সকল নাগরিক রিপোর্ট ও রেজোল্যুশন টাইমলাইন →
            </Link>
          </div>
        </div>
      </section>

      {/* 🏛️ SECTION: Popular Heritage Sites & Tourism */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
              <Landmark className="w-3.5 h-3.5" />
              <span>ইতিহাস, স্থাপত্য ও দর্শনীয় স্থান</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              কুড়িগ্রামের দর্শনীয় ও ঐতিহাসিক নিদর্শন
            </h2>
          </div>
          <Link
            href="/heritage"
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>সকল দর্শনীয় স্থান ({HERITAGE_SITES.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HERITAGE_SITES.slice(0, 3).map((site) => (
            <article
              key={site.id}
              className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={site.mainImage}
                    alt={site.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {site.categoryLabelBn}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {site.upazilaNameBn}
                  </span>
                </div>

                <div className="p-5">
                  <Link href={`/heritage/${site.slug}`}>
                    <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {site.nameBn}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {site.historyBn}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[170px]">{site.addressBn}</span>
                </span>
                <Link
                  href={`/heritage/${site.slug}`}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  বিস্তারিত দেখুন
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ⚠️ SECTION: Verified Scam & Cyber Alert */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-2xl p-6 sm:p-7 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-amber-950">
                  যাচাইকৃত জনস্বার্থ ও প্রতারণা সতর্কতা (Scam Alerts)
                </h3>
                <p className="text-xs text-amber-800">
                  সীমান্তে ভুয়া চাকরির ফাঁদ ও চরাঞ্চলের ভুয়া পুনর্বাসন থেকে সতর্ক থাকুন
                </p>
              </div>
            </div>
            <Link
              href="/scam-alerts"
              className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3.5 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
            >
              সকল সতর্কতা দেখুন
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCAM_ALERTS.slice(0, 2).map((scam) => (
              <div key={scam.id} className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {scam.severity === 'critical' ? 'জরুরি সতর্কতা' : 'সচেতনতা'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{scam.publishedDate}</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-1.5">{scam.titleBn}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                  {scam.summaryBn}
                </p>
                <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <strong>পরামর্শ:</strong> {scam.preventionTipsBn[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📞 SECTION: 24/7 District Emergency Hotline Strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                সার্বক্ষণিক সহায়তা নেটওয়ার্ক
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
                কুড়িগ্রাম জরুরি হেল্পলাইন ও নিয়ন্ত্রণ কক্ষ
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              যেকোনো চিকিৎসা সংকট, অগ্নিকাণ্ড বা জরুরি আইনগত সহায়তায় সরাসরি যোগাযোগ করুন।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 text-xs">
            {EMERGENCY_HELPLINES.slice(0, 4).map((hp, idx) => (
              <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <span className="text-slate-300 font-medium block">{hp.nameBn}</span>
                  <span className="text-xl font-heading font-extrabold text-emerald-400 font-mono block mt-1">
                    {hp.number}
                  </span>
                </div>
                <a
                  href={`tel:${hp.number}`}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded-lg text-center transition-colors font-medium shadow-xs"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>সরাসরি কল দিন</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🤝 SECTION: Community Contribution CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            আপনার এলাকার তথ্য যোগ করুন বা সমস্যা জানান
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            কুড়িগ্রামের যেকোনো প্রান্তের রক্তদান সেবা, ঐতিহ্যবাহী স্থান বা নাগরিক সমস্যা সম্পর্কে সরাসরি প্ল্যাটফর্মে যুক্ত হয়ে ডিজিটাল কুড়িগ্রামের অংশীদার হোন।
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setReportModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              জনসমস্যার তথ্য জানান
            </button>
            <button
              onClick={() => setDonorModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              রক্তদাতা হিসেবে যুক্ত হোন
            </button>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Donor Modal */}
      <DonorModal
        isOpen={donorModalOpen}
        onClose={() => setDonorModalOpen(false)}
      />
    </div>
  );
}
