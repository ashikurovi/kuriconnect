'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SCAM_ALERTS } from '@/data/kurigramData';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  PhoneCall,
  Search,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function ScamAlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedText, setReportedText] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const filteredAlerts = SCAM_ALERTS.filter((alert) =>
    alert.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.summaryBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.detailsBn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReportScam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedText.trim()) return;
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportedText('');
      setReportModalOpen(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">প্রতারণা ও প্রতারক চক্র সতর্কতা</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা প্রতারণা সতর্কতা ও সাইবার সচেতনতা বাতায়ন
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              স্থলবন্দরের ভুয়া নিয়োগ, চরাঞ্চলের ভুয়া পুনর্বাসন অনুদান ও ফেসবুক শপিং ফাঁদ সম্পর্কে সচেতন থাকুন।
            </p>
          </div>
          <button
            onClick={() => setReportModalOpen(true)}
            className="self-start sm:self-auto bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>সন্দেহভাজন প্রতারণা রিপোর্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Legal & Neutrality Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-amber-900 block">
            সচেতনতামূলক তথ্যের আইনি অবস্থান ও সতর্কতা নীতি:
          </strong>
          <p className="leading-relaxed text-amber-800">
            এখানে প্রকাশিত সতর্কবার্তাগুলো জেলা প্রশাসন, পুলিশ বিভাগ ও স্থলবন্দর কর্তৃপক্ষের আনুষ্ঠানিক নির্দেশনার আলোকে জনস্বার্থে প্রচারিত। তদন্ত সাপেক্ষ অভিযোগ ও আইনানুগ সিদ্ধান্তের মধ্যে পার্থক্য বজায় রাখা হয়। ব্যক্তিগত প্রতিহিংসা বা ভিত্তিহীন অভিযোগ এখানে প্রশ্রয় দেওয়া হয় না।
          </p>
        </div>
      </div>

      {/* Cyber Crime Helpline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e7e3db] rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-900 block">সাইবার পুলিশ হটলাইন (সিআইডি)</span>
            <span className="text-sm font-mono font-bold text-[#14532d]">০১৩২০-০০১২২২</span>
          </div>
          <a
            href="tel:০১৩২০-০০১২২২"
            className="text-xs bg-[#14532d] text-white px-3 py-1.5 rounded font-semibold"
          >
            কল দিন
          </a>
        </div>

        <div className="bg-white border border-[#e7e3db] rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-900 block">জাতীয় ভোক্তা অধিকার হটলাইন</span>
            <span className="text-sm font-mono font-bold text-red-700">১৬১২১</span>
          </div>
          <a
            href="tel:16121"
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded font-semibold"
          >
            অভিযোগ দিন
          </a>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white border border-[#e7e3db] rounded-lg p-6 shadow-2xs hover:border-amber-400 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                    alert.severity === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {alert.scamCategoryLabelBn}
                </span>
                <span className="text-xs text-gray-500">• {alert.publishedDate}</span>
              </div>
              <span className="text-xs font-semibold text-[#14532d] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                যাচাইকারী: {alert.verifiedBy}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                {alert.titleBn}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-amber-900 bg-amber-50/60 p-3 rounded border border-amber-200/60 leading-relaxed">
                {alert.summaryBn}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mt-3 leading-relaxed">
                {alert.detailsBn}
              </p>
            </div>

            {/* Prevention Checklist */}
            <div className="bg-[#faf8f5] border border-gray-200 rounded p-4">
              <h3 className="font-bold text-xs text-gray-900 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#14532d]" />
                <span>প্রতারণা এড়াতে করণীয় পদক্ষেপ:</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {alert.preventionTipsBn.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#14532d] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Report Suspicious Activity Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-lg w-full border border-gray-200 shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>সন্দেহভাজন প্রতারণার তথ্য জানান</span>
            </h3>

            {reportSuccess ? (
              <div className="p-4 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                <h4 className="font-bold text-sm text-gray-900">তথ্যটি সফলভাবে গৃহীত হয়েছে!</h4>
                <p className="text-xs text-gray-600">আমাদের ফ্যাক্ট-চেক টিম এটি খতিয়ে দেখবে।</p>
              </div>
            ) : (
              <form onSubmit={handleReportScam} className="space-y-3">
                <p className="text-xs text-gray-600">
                  কোনো প্রতিষ্ঠান বা চাকরির নামে ভুয়া বিজ্ঞপ্তি বা অগ্রিম টাকা দাবি করলে বিস্তারিত লিখুন।
                </p>
                <textarea
                  required
                  rows={4}
                  value={reportedText}
                  onChange={(e) => setReportedText(e.target.value)}
                  placeholder="বিজ্ঞপ্তির বিবরণ, যোগাযোগের নম্বর বা ফেসবুক পেজের লিঙ্ক..."
                  className="w-full border border-gray-300 rounded p-2.5 text-xs focus:outline-none focus:border-[#14532d]"
                ></textarea>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#14532d] text-white rounded text-xs font-bold hover:bg-[#0f3d21]"
                  >
                    জমা দিন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
