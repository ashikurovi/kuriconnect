'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, CloudSun, HeartHandshake, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: System Status & Weather Telemetry */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>কুড়িগ্রাম ডিজিটাল হাব লাইভ</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-3">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>কুড়িগ্রাম: ২৮° সে. • মেঘমুক্ত আকাশ</span>
          </div>
        </div>

        {/* Right: Quick Emergency Services */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <a
            href="tel:999"
            className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>জরুরি হেল্পলাইন: ৯৯৯ / ০২৫৮৯৯৬৫২১২</span>
          </a>
          <Link
            href="/blood-bank"
            className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-0.5 rounded-full transition-all font-medium shadow-sm hover:shadow-rose-900/30"
          >
            <HeartHandshake className="w-3 h-3" />
            <span>জরুরি রক্তদাতা খুঁজুন</span>
          </Link>
          <Link
            href="/scam-alerts"
            className="hidden lg:inline-flex items-center gap-1 text-amber-300 hover:text-white transition-colors"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>প্রতারণা</span>
          </Link>
          <Link
            href="/admin"
            className="text-slate-400 hover:text-slate-200 transition-colors border-l border-slate-800 pl-2.5"
          >
            অ্যাডমিন
          </Link>
        </div>
      </div>
    </div>
  );
}
