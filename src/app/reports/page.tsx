'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UPAZILAS } from '@/data/kurigramData';
import { CommunityReport } from '@/types';
import ReportModal from '@/components/ReportModal';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ThumbsUp,
  PlusCircle,
  Filter,
  Search,
  CheckCircle,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReports(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpvote = (id: string) => {
    if (upvotedIds[id]) return;
    setUpvotedIds((prev) => ({ ...prev, [id]: true }));
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotesCount: r.upvotesCount + 1 } : r))
    );
  };

  const handleNewReport = (newReport: CommunityReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const filteredReports = reports.filter((r) => {
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesUpazila = selectedUpazila === 'all' || r.upazilaId === selectedUpazila;
    return matchesStatus && matchesUpazila;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">স্থানীয় জনসমস্যা ট্র্যাকার</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা জনসমস্যা ও নাগরিক অভিযোগ ট্র্যাকার
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              ভাঙা রাস্তা, নদী ভাঙন, বাঁধ ধস ও ড্রেনেজ সমস্যা সরাসরি রিপোর্ট করুন এবং সমাধানের অগ্রগতি পর্যবেক্ষণ করুন।
            </p>
          </div>
          <button
            id="submit"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#14532d] hover:bg-[#0f3d21] text-white px-4 py-2 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন সমস্যা রিপোর্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Workflow Explainer Banner */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs">
        <h2 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#14532d]" />
          <span>নাগরিক সমস্যার স্বচ্ছ সমাধান প্রক্রিয়া (Resolution Workflow):</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px] font-bold mx-auto mb-1">
              ১
            </span>
            <span className="font-bold text-gray-800 block">জমা নেওয়া</span>
            <span className="text-[10px] text-gray-500">নাগরিক তথ্য এন্ট্রি</span>
          </div>
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[10px] font-bold mx-auto mb-1">
              ২
            </span>
            <span className="font-bold text-amber-900 block">তদন্ত ও যাচাই</span>
            <span className="text-[10px] text-amber-700">সরেজমিন সত্যতা যাচাই</span>
          </div>
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded">
            <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[10px] font-bold mx-auto mb-1">
              ৩
            </span>
            <span className="font-bold text-blue-900 block">প্রশাসনে প্রেরণ</span>
            <span className="text-[10px] text-blue-700">দপ্তরে কাজ চলমান</span>
          </div>
          <div className="p-2.5 bg-green-50 border border-green-200 rounded">
            <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-[10px] font-bold mx-auto mb-1">
              ৪
            </span>
            <span className="font-bold text-green-900 block">সমাধান সম্পন্ন</span>
            <span className="text-[10px] text-green-700">প্রমাণসহ নিষ্পত্তি</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="font-semibold text-gray-700 mr-1">অবস্থা:</span>
          {[
            { id: 'all', label: 'সকল সমস্যা' },
            { id: 'submitted', label: 'জমা হয়েছে' },
            { id: 'under_review', label: 'তদন্তাধীন' },
            { id: 'in_progress', label: 'কাজ চলমান' },
            { id: 'resolved', label: 'সমাধানকৃত' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                selectedStatus === st.id
                  ? 'bg-[#14532d] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Upazila Filter */}
        <div className="w-full sm:w-60">
          <select
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#14532d]"
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

      {/* Reports Timeline List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs hover:border-[#14532d] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#14532d] bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                  {report.categoryLabelBn}
                </span>
                <span className="text-xs text-gray-500">• {report.upazilaNameBn}</span>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded self-start sm:self-auto ${
                  report.status === 'resolved'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : report.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : report.status === 'under_review'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                {report.status === 'resolved'
                  ? '✓ সমাধানকৃত (Resolved)'
                  : report.status === 'in_progress'
                  ? '⏳ সংস্কার কাজ চলমান'
                  : report.status === 'under_review'
                  ? '🔍 সরেজমিনে তদন্তাধীন'
                  : '📥 জমা হয়েছে'}
              </span>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-snug mb-2">
              {report.titleBn}
            </h3>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
              {report.descriptionBn}
            </p>

            {/* Photo Gallery if attached */}
            {report.images && report.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {report.images.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                    <img src={img} alt={`ছবি ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>অবস্থান: {report.locationDetailsBn}</span>
            </div>

            {/* Resolution Progress History / Notes */}
            {report.resolutionNotesBn && (
              <div className="bg-[#faf8f5] border-l-4 border-[#14532d] p-3 rounded-r text-xs text-gray-800 mb-3 space-y-1">
                <span className="font-bold text-[#14532d] block">সর্বশেষ প্রশাসনিক অগ্রগতি ও নোট:</span>
                <p className="leading-relaxed">{report.resolutionNotesBn}</p>
                <span className="text-[10px] text-gray-400 block pt-1">হালনাগাদ: {report.updatedAt}</span>
              </div>
            )}

            {/* Footer Row */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>প্রতিবেদনকারী: {report.reporterNameMasked} • {report.submittedAt}</span>

              <button
                onClick={() => handleUpvote(report.id)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  upvotedIds[report.id]
                    ? 'bg-green-100 text-[#14532d] border border-green-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>গুরুত্ব সমর্থন ({report.upvotesCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleNewReport}
      />
    </div>
  );
}
