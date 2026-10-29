'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Sparkles, Activity } from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20 text-xs sm:text-sm">
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
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                <Activity className="w-3.5 h-3.5" />
                <span>সিস্টেম লাইভ ও সার্বক্ষণিক সক্রিয়</span>
              </span>
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
  );
}
