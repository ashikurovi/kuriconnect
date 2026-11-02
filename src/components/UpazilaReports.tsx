'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  PlusCircle,
  ThumbsUp,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import type { CommunityReport, UpazilaId } from '@/types';
import ReportModal from '@/components/ReportModal';

interface UpazilaReportsProps {
  upazilaId: string;
  upazilaNameBn: string;
  initialReports?: CommunityReport[];
}

export default function UpazilaReports({
  upazilaId,
  upazilaNameBn,
  initialReports = []
}: UpazilaReportsProps) {
  const [reports, setReports] = useState<CommunityReport[]>(initialReports);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports?upazilaId=${encodeURIComponent(upazilaId)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReports(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch upazila reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem('kc_upvoted_reports');
      if (cached) {
        setUpvotedIds(JSON.parse(cached));
      }
    } catch {}
    fetchReports();
  }, [upazilaId]);

  const handleUpvote = async (id: string) => {
    if (upvotedIds[id]) return;

    const updatedMap = { ...upvotedIds, [id]: true };
    setUpvotedIds(updatedMap);
    try {
      localStorage.setItem('kc_upvoted_reports', JSON.stringify(updatedMap));
    } catch {}

    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotesCount: (r.upvotesCount || 0) + 1 } : r))
    );

    try {
      const res = await fetch('/api/reports/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success && typeof data.upvotesCount === 'number') {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, upvotesCount: data.upvotesCount } : r))
        );
      }
    } catch (err) {
      console.error('Failed to upvote report:', err);
    }
  };

  const handleNewReport = (newReport: CommunityReport) => {
    setReports((prev) => [newReport, ...prev]);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: CommunityReport['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>সমাধানকৃত</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3" />
            <span>কাজ চলমান</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3" />
            <span>পর্যালোচনাধীন</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            <span>জমা দেওয়া হয়েছে</span>
          </span>
        );
    }
  };

  return (
    <section className="bg-white border border-[#e7e3db] rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>{upazilaNameBn} উপজেলার নাগরিক সমস্যা ও অভিযোগ</span>
              {reports.length > 0 && (
                <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {reports.length}টি
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500">
              এলাকার ভাঙা রাস্তা, নদী ভাঙন, ড্রেনেজ বা নাগরিক সমস্যা সরাসরি জানান ও ট্র্যাক করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#14532d] hover:bg-[#14532d]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>সমস্যা জানান</span>
          </button>
          <Link
            href="/reports"
            className="text-xs text-[#14532d] hover:underline font-medium inline-flex items-center gap-0.5 py-1.5 px-2"
          >
            <span>সকল সমস্যা</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Reports List */}
      {loading && reports.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-400 gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#14532d]" />
          <span>নাগরিক সমস্যা লোড হচ্ছে...</span>
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 bg-[#faf8f5] hover:bg-amber-50/40 transition-colors border border-gray-200 rounded-lg text-xs space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-gray-900">{rep.titleBn}</h3>
                  {rep.trackingCode && (
                    <span className="text-[10px] font-mono bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                      {rep.trackingCode}
                    </span>
                  )}
                </div>
                {getStatusBadge(rep.status)}
              </div>

              <p className="text-gray-700 text-xs leading-relaxed">{rep.descriptionBn}</p>

              {/* Images preview */}
              {rep.images && rep.images.length > 0 && (
                <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                  {rep.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="সমস্যার ছবি"
                      className="w-16 h-12 object-cover rounded border border-gray-200 hover:opacity-90"
                    />
                  ))}
                </div>
              )}

              {rep.resolutionNotesBn && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded p-2 text-[11px] leading-relaxed">
                  <span className="font-semibold text-emerald-800">কর্তৃপক্ষের অগ্রগতি: </span>
                  {rep.resolutionNotesBn}
                </div>
              )}

              {/* Footer info: Location, date, upvote */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200/80 text-[11px] text-gray-500">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>{rep.locationDetailsBn}</span>
                  </span>
                  {rep.submittedAt && (
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{rep.submittedAt}</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleUpvote(rep.id)}
                  disabled={upvotedIds[rep.id]}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                    upvotedIds[rep.id]
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                  title="সমস্যাটির গুরুত্ব বোঝাতে সমর্থন দিন"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{rep.upvotesCount || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-[#faf8f5] border border-dashed border-gray-300 rounded-lg space-y-2">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-semibold text-gray-800 text-xs">
            {upazilaNameBn} উপজেলায় বর্তমানে কোনো উন্মুক্ত জনসমস্যা নেই
          </h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            আপনার এলাকায় রাস্তাঘাট, ব্রিজ, ড্রেনেজ বা বিদ্যুৎ সংক্রান্ত কোনো সমস্যা থাকলে ছবিসহ সরাসরি রিপোর্ট করুন।
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#14532d] hover:bg-[#14532d]/90 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নতুন সমস্যা রিপোর্ট করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal for submitting a report with upazilaId pre-filled */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleNewReport}
        defaultUpazilaId={upazilaId as UpazilaId}
      />
    </section>
  );
}

