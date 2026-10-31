'use client';

import React, { useState, useRef } from 'react';
import { X, Send, AlertCircle, CheckCircle, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';
import { UpazilaId } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (newReport: any) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmitSuccess }: ReportModalProps) {
  const { user } = useAuth();
  const [titleBn, setTitleBn] = useState('');
  const [category, setCategory] = useState('damaged-road');
  const [upazilaId, setUpazilaId] = useState<UpazilaId>('kurigram-sadar');
  const [locationDetailsBn, setLocationDetailsBn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Multi-image upload via Base64 (supports up to 4 images)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 4 - images.length;
    const fileList = Array.from(files).slice(0, remainingSlots);

    fileList.forEach((file) => {
      // Limit file size to 2MB per image
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} ফাইলটি ২MB-এর বেশি। অনুগ্রহ করে ছোট আকারের ছবি নির্বাচন করুন।`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn || !descriptionBn || !locationDetailsBn || !consent) {
      alert('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য প্রদান করুন এবং সম্মতি বাক্সে টিক দিন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          titleBn,
          descriptionBn,
          locationDetailsBn,
          category,
          upazilaId,
          reporterName,
          reporterPhone,
          images
        })
      });

      const data = await res.json();
      if (data.success) {
        if (onSubmitSuccess) {
          onSubmitSuccess(data.data);
        }
        setIsSubmitting(false);
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
          // reset form
          setTitleBn('');
          setDescriptionBn('');
          setLocationDetailsBn('');
          setReporterName('');
          setReporterPhone('');
          setImages([]);
          setConsent(false);
          onClose();
        }, 2200);
      } else {
        alert(data.message || 'রিপোর্ট জমা দিতে সমস্যা হয়েছে');
        setIsSubmitting(false);
      }
    } catch {
      alert('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-bengali">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-300 shrink-0" />
            <h3 className="font-heading font-bold text-sm sm:text-base tracking-tight">আপনার এলাকার জনসমস্যা বা তথ্য জানান</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg transition-colors hover:bg-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {successMessage ? (
          <div className="p-6 sm:p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-heading font-bold text-lg text-slate-900">আপনার সমস্যাটি সফলভাবে জমা নেওয়া হয়েছে!</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              আমাদের টিম এটি যাচাই করে জনসমস্যা ট্র্যাকারে প্রকাশ করবে এবং প্রয়োজনে সংশ্লিষ্ট প্রশাসনিক দপ্তরে অবহিত করবে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                সমস্যার শিরোনাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="উদাহরণ: সোনাহাট সড়কে কালভার্ট ভেঙে যোগাযোগ বিচ্ছিন্ন"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  উপজেলা নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={upazilaId}
                  onChange={(e) => setUpazilaId(e.target.value as UpazilaId)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn} ({u.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সমস্যার ধরন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সুনির্দিষ্ট অবস্থান / গ্রাম ও মোড়ের নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={locationDetailsBn}
                onChange={(e) => setLocationDetailsBn(e.target.value)}
                placeholder="উদাহরণ: হলোখানা ইউনিয়ন, ৪ নম্বর ওয়ার্ড, নদীঘাট মোড়"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সমস্যার বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                placeholder="কবে থেকে সমস্যাটি তৈরি হয়েছে? কতজন মানুষ ক্ষতিগ্রস্ত হচ্ছে? প্রশাসনকে আগে জানানো হয়েছিল কিনা?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              ></textarea>
            </div>

            {/* 📸 Multi-image Upload Section (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>সমস্যার ছবি সংযুক্ত করুন (ঐচ্ছিক, সর্বোচ্চ ৪টি)</span>
                </label>
                <span className="text-[11px] text-slate-400">{images.length}/৪টি ছবি</span>
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
                    <img src={img} alt={`সংযুক্ত ছবি ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-full opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      title="ছবি মুছুন"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 4 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl aspect-video flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-700 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-medium">+ ছবি যোগ</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-[10px] text-slate-400">জেপিজি বা পিএনজি ফরম্যাটের ছবি আপলোড করুন (প্রতিটি সর্বোচ্চ ২MB)।</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  আপনার নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="নাম গোপন রাখতে চাইলে খালি রাখুন"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  মোবাইল নম্বর (যাচাইয়ের জন্য গোপন রাখা হবে)
                </label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <label htmlFor="consent" className="cursor-pointer select-none leading-relaxed">
                আমি ঘোষণা করছি যে প্রদত্ত তথ্যটি সত্য এবং কোনো ব্যক্তি বা প্রতিষ্ঠানকে ভিত্তিহীনভাবে দোষারোপ করার উদ্দেশ্যে নয়।
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:shadow-emerald-700/20 active:scale-95 disabled:opacity-50"
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
