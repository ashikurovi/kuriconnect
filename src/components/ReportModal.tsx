'use client';

import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';
import { UpazilaId } from '@/types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (newReport: any) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmitSuccess }: ReportModalProps) {
  const [titleBn, setTitleBn] = useState('');
  const [category, setCategory] = useState('damaged-road');
  const [upazilaId, setUpazilaId] = useState<UpazilaId>('kurigram-sadar');
  const [locationDetailsBn, setLocationDetailsBn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn || !descriptionBn || !locationDetailsBn || !consent) {
      alert('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য প্রদান করুন এবং সম্মতি বাক্সে টিক দিন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const upazila = UPAZILAS.find((u) => u.id === upazilaId);
      const newReport = {
        id: `rep-${Date.now()}`,
        titleBn,
        descriptionBn,
        category,
        categoryLabelBn:
          category === 'damaged-road'
            ? 'ক্ষতিগ্রস্ত সড়ক'
            : category === 'river-erosion'
            ? 'নদী ভাঙন'
            : category === 'flood-embankment'
            ? 'বন্যা নিয়ন্ত্রণ বাঁধ'
            : category === 'school-hazard'
            ? 'স্কুল ঝুঁকি'
            : 'পৌর ও নাগরিক সেবা',
        upazilaId,
        upazilaNameBn: upazila ? upazila.nameBn : 'কুড়িগ্রাম সদর',
        locationDetailsBn,
        status: 'submitted',
        submittedAt: 'আজ, ৩০ অক্টোবর ২০২৬',
        updatedAt: '৩০ অক্টোবর ২০২৬',
        reporterNameMasked: reporterName ? `${reporterName.charAt(0)}... (নাগরিক)` : 'নাম প্রকাশে অনিচ্ছুক',
        upvotesCount: 1,
        images: []
      };

      if (onSubmitSuccess) {
        onSubmitSuccess(newReport);
      }
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg max-w-xl w-full border border-[#d2ccc1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14532d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base tracking-tight">আপনার এলাকার জনসমস্যা বা তথ্য জানান</h3>
          </div>
          <button
            onClick={onClose}
            className="text-green-200 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h4 className="font-bold text-lg text-gray-900">আপনার সমস্যাটি সফলভাবে জমা নেওয়া হয়েছে!</h4>
            <p className="text-sm text-gray-600">
              আমাদের মডারেশন টিম এটি যাচাই করে জনসমস্যা ট্র্যাকারে প্রকাশ করবে এবং প্রয়োজনে সংশ্লিষ্ট সরকারি দপ্তরে অবহিত করবে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                সমস্যার শিরোনাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="উদাহরণ: সোনাহাট সড়কে কালভার্ট ভেঙে যোগাযোগ বিচ্ছিন্ন"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#14532d]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  উপজেলা নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <select
                  value={upazilaId}
                  onChange={(e) => setUpazilaId(e.target.value as UpazilaId)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#14532d]"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn} ({u.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  সমস্যার ধরন <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#14532d]"
                >
                  <option value="damaged-road">ভাঙা রাস্তা / ব্রিজ কালভার্ট</option>
                  <option value="river-erosion">নদী ভাঙন / বাঁধ ঝুঁকি</option>
                  <option value="waterlogging">জলাবদ্ধতা ও ড্রেনেজ</option>
                  <option value="school-hazard">স্কুল বা শিক্ষাপ্রতিষ্ঠান ঝুঁকি</option>
                  <option value="public-service">বিদ্যুৎ / স্বাস্থ্য / সেবা বিঘ্ন</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                সুনির্দিষ্ট অবস্থান / গ্রাম ও মোড়ের নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={locationDetailsBn}
                onChange={(e) => setLocationDetailsBn(e.target.value)}
                placeholder="উদাহরণ: হলোখানা ইউনিয়ন, ৪ নম্বর ওয়ার্ড, নদীঘাট মোড়"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#14532d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                সমস্যার বিস্তারিত বিবরণ <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="কবে থেকে সমস্যাটি তৈরি হয়েছে? কতজন মানুষ ক্ষতিগ্রস্ত হচ্ছে? প্রশাসনকে আগে জানানো হয়েছিল কিনা?"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#14532d]"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  আপনার নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="নাম গোপন রাখতে চাইলে খালি রাখুন"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#14532d]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  মোবাইল নম্বর (যাচাইয়ের জন্য গোপন রাখা হবে)
                </label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#14532d]"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 text-xs text-gray-600">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#14532d] focus:ring-[#14532d]"
              />
              <label htmlFor="consent" className="cursor-pointer">
                আমি ঘোষণা করছি যে প্রদত্ত তথ্যটি সত্য এবং কোনো ব্যক্তি বা প্রতিষ্ঠানকে ভিত্তিহীনভাবে দোষারোপ করার উদ্দেশ্যে নয়।
              </label>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'জমা হচ্ছে...' : 'রিপোর্ট জমা দিন'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
