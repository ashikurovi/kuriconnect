'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Sparkles, Activity } from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';

export default function Footer() {
  return (
    <>
      {/* 🌟 Developed By Ashikur Rahman Ovi & Dedicated to Kurigram Community */}
      <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-24 mb-10 font-bengali">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 md:p-10 text-slate-800">
          {/* Top subtle decorative color bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600" />

          {/* Soft background gradient accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Developer Image */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-2xl overflow-hidden ring-4 ring-emerald-500/20 shadow-xl relative bg-white border border-slate-100">
                <Image
                  src="/ashikur-rahman-ovi.jpg"
                  alt="Ashikur Rahman Ovi"
                  fill
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                  className="object-cover object-[center_15%]"
                  priority
                />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-200 fill-current" />
                <span>উদ্যোক্তা ও নির্মাতা</span>
              </span>
            </div>

            {/* Info & Dedication */}
            <div className="space-y-3.5 text-center md:text-left flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                <span>কুড়িগ্রামবাসীর জন্য সম্পূর্ণ বিনামূল্যে উন্মুক্ত উদ্যোগ</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
                  Developed by <span className="text-emerald-700">Ashikur Rahman Ovi</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                  কারিগরি উন্নয়ন ও পরিচালনায়: <span className="text-slate-800 font-bold">আশিকুর রহমান অভি ও টিম</span>
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                কুড়িগ্রামের প্রতিটি উপজেলার সাধারণ মানুষের জরুরি স্বাস্থ্যসেবা, স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক, হারানো ও প্রাপ্তি এবং স্থানীয় সমস্যা সমাধানের লক্ষ্যে এই প্ল্যাটফর্মটি নির্মিত। এটি <strong>কুড়িগ্রামবাসীর জন্য সম্পূর্ণ ফ্রি</strong> এবং প্ল্যাটফর্মের সার্ভার ও সকল প্রকার পরিচালন ব্যয় সম্পূর্ণ বহন করছে <strong>আশিকুর রহমান অভি ও তাঁর টিম</strong>।
              </p>

              {/* Action Buttons: KuriConnect Page & Ashikur Rahman Ovi Profile */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {/* KuriConnect Facebook Page */}
                <a
                  href="https://www.facebook.com/kuriconnect1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-[#1877F2]/25 active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>KuriConnect ফেসবুক পেজ</span>
                </a>

                {/* Developer Profile Link */}
                <a
                  href="https://www.facebook.com/ashikurovi.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Ashikur Rahman Ovi (প্রোফাইল)</span>
                </a>

                {/* Free badge */}
                <div className="text-xs text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl bg-emerald-50/80 flex items-center gap-1.5 font-medium shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>কোনো ফি বা চার্জ নেই • সম্পূর্ণ উন্মুক্ত</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-slate-700 bg-white flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="KuriConnect Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl text-white tracking-tight">KuriConnect</span>
                <span className="text-[11px] text-emerald-400 font-medium">স্মার্ট ডিজিটাল কুড়িগ্রাম প্ল্যাটফর্ম</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              কুড়িগ্রাম জেলার ৯টি উপজেলার সমন্বিত ভৌগোলিক মানচিত্র, জরুরি স্বাস্থ্যসেবা নেটওয়ার্ক, রক্তদাতা সংযোগ এবং নাগরিক সেবা সহজীকরণের সর্বাধুনিক ডিজিটাল হাব।
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                <Activity className="w-3.5 h-3.5" />
                <span>সিস্টেম লাইভ ও সার্বক্ষণিক সক্রিয়</span>
              </span>
              <a
                href="https://www.facebook.com/kuriconnect1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-full transition-colors"
              >
                <svg className="w-3 h-3 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>fb.com/kuriconnect1</span>
              </a>
            </div>
          </div>

          {/* Col 2: 9 Upazilas Quick Access */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-800">
              ৯টি উপজেলা এক্সপ্লোরার
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs text-slate-400">
              {UPAZILAS.map((up) => (
                <li key={up.id}>
                  <Link
                    href={`/upazila/${up.slug}`}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 hover:bg-emerald-400"></span>
                    <span>{up.nameBn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Public Services & Citizen Resources */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-800">
              ডিজিটাল নাগরিক সেবাসমূহ
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🗺️</span>
                  <span>ইন্টারেক্টিভ ডিজিটাল মানচিত্র (GIS)</span>
                </Link>
              </li>
              {/*
              <li>
                <Link href="/healthcare" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🚑</span>
                  <span>হাসপাতাল ও ২৪ ঘণ্টা জরুরি অ্যাম্বুলেন্স</span>
                </Link>
              </li>
              */}
              <li>
                <Link href="/blood-bank" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🩸</span>
                  <span>স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক</span>
                </Link>
              </li>
              <li>
                <Link href="/blood-requests" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🚨</span>
                  <span>জরুরি রক্তের আবেদনসমূহ</span>
                </Link>
              </li>
              {/*
              <li>
                <Link href="/police-services" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>থানা, ওসি ও ইউএনও প্রশাসনিক ডিরেক্টরি</span>
                </Link>
              </li>
              */}
              <li>
                <Link href="/lost-and-found" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🔍</span>
                  <span>হারানো ও প্রাপ্তি বিজ্ঞপ্তি ড্যাশবোর্ড</span>
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>📢</span>
                  <span>নাগরিক সমস্যা ও অবকাঠামো ট্র্যাকার</span>
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🏛️</span>
                  <span>কুড়িগ্রামের দর্শনীয় ও ঐতিহাসিক স্থান</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Contact & Info */}
          <div>
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-800">
              যোগাযোগ ও প্ল্যাটফর্ম সহায়তা
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>ডিজিটাল সার্ভিস সেন্টার, কলেজ মোড়, কুড়িগ্রাম সদর, কুড়িগ্রাম - ৫৬০০</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>হেল্পলাইন: ০২৫৮৯৯৬৫০০০ / জরুরি: ৯৯৯</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ইমেইল: info@kuriconnect.org</span>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
              <p>• তথ্য সুরক্ষা ও নাগরিক নিরাপত্তা নিশ্চিত</p>
              <p>• আধুনিক ও স্মার্ট কুড়িগ্রাম গড়ে তোলার উদ্যোগ</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            © ২০২৬ <span className="text-white font-medium">KuriConnect</span>. সর্বস্বত্ব সংরক্ষিত। কুড়িগ্রামবাসীর জন্য নিবেদিত সমন্বিত ডিজিটাল প্ল্যাটফর্ম।
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/reports" className="hover:text-white transition-colors">
              ব্যবহার নির্দেশিকা
            </Link>
            <span>•</span>
            <Link href="/blood-bank" className="hover:text-white transition-colors">
              গোপনীয়তা নীতিমালা
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition-colors text-emerald-400 font-medium">
              অ্যাডমিন পোর্টাল
            </Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
