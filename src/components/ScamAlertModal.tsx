'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  ShieldAlert,
  CheckCircle,
  Loader2,
  User,
  Building,
  Image as ImageIcon,
  Trash2,
  Upload
} from 'lucide-react';

interface ScamAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const categoryLabelMap: Record<string, string> = {
  'fake-jobs': 'ভুয়া নিয়োগ প্রতারণা',
  'microcredit-fraud': 'এনজিও বা ঋণের কিস্তি প্রতারণা',
  'land-char-compensation': 'জমি বা ক্ষতিপূরণ সংক্রান্ত ফাঁদ',
  'online-shopping': 'অনলাইন শপিং প্রতারণা',
  'lottery-sms': 'লটারি বা ওটিপি প্রতারণা',
  'visa-fraud': 'ভিসা বা পাসপোর্ট প্রতারণা',
  'impersonation': 'প্রশাসনিক কর্মকর্তা পরিচয় প্রতারণা',
  'other': 'সাধারণ প্রতারণা'
};

export default function ScamAlertModal({ isOpen, onClose, onSuccess }: ScamAlertModalProps) {
  const { user } = useAuth();
  const [titleBn, setTitleBn] = useState('');
  const [scamCategory, setScamCategory] = useState('fake-jobs');
  const [targetType, setTargetType] = useState<'individual' | 'company'>('individual');
  const [suspectName, setSuspectName] = useState('');
  const [suspectContact, setSuspectContact] = useState('');
  const [detailsBn, setDetailsBn] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (images.length >= 4) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => (prev.length < 4 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleReportScam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!titleBn.trim() || !detailsBn.trim()) {
      setErrorMessage('অনুগ্রহ করে প্রতারণার বিষয়/শিরোনাম এবং বিস্তারিত বিবরণ লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/scam-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          titleBn,
          summaryBn: detailsBn.slice(0, 150),
          detailsBn,
          scamCategory,
          scamCategoryLabelBn: categoryLabelMap[scamCategory] || 'প্রতারণা সতর্কতা',
          targetType,
          suspectName,
          suspectContact,
          images,
          severity: 'high',
          isApproved: false // Citizens reports go to admin verification
        })
      });

      const data = await res.json();
      if (data.success) {
        setReportSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setReportSuccess(false);
          setTitleBn('');
          setSuspectName('');
          setSuspectContact('');
          setDetailsBn('');
          setImages([]);
          onClose();
        }, 2200);
      } else {
        setErrorMessage(data.message || 'রিপোর্ট জমা দিতে সমস্যা হয়েছে');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-bengali">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-sm sm:text-base tracking-tight">
              সন্দেহভাজন প্রতারণার তথ্য জানান
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {reportSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-lg text-slate-900">তথ্যটি সফলভাবে গৃহীত হয়েছে!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার দেওয়া তথ্য ও প্রমাণাদি অ্যাডমিন প্যানেল ও সাইবার টিম যাচাই-বাছাই করে দ্রুত প্রয়োজনীয় ব্যবস্থা গ্রহণ করবে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleReportScam} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto text-xs sm:text-sm">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-xl">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                প্রতারণার বিষয় / শিরোনাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: ফেসবুকে সোনাহাট স্থলবন্দরে নিয়োগের নামে টাকা দাবি"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রতারণার ক্ষেত্র <span className="text-rose-500">*</span>
                </label>
                <select
                  value={scamCategory}
                  onChange={(e) => setScamCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                >
                  <option value="fake-jobs">ভুয়া নিয়োগ প্রতারণা</option>
                  <option value="microcredit-fraud">এনজিও বা ঋণের কিস্তি প্রতারণা</option>
                  <option value="impersonation">কর্মকর্তা সেজে অনুদান প্রতারণা</option>
                  <option value="online-shopping">অনলাইন শপিং / বিকাশ প্রতারণা</option>
                  <option value="land-char-compensation">জমি বা পুনর্বাসন প্রতারণা</option>
                  <option value="lottery-sms">লটারি / পুরস্কার এসএমএস</option>
                  <option value="other">অন্যান্য প্রতারণা</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রতারক পক্ষ <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setTargetType('individual')}
                    className={`py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      targetType === 'individual'
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>ব্যক্তি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType('company')}
                    className={`py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      targetType === 'company'
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>কোম্পানি</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {targetType === 'company' ? 'কোম্পানি বা পেজের নাম' : 'অভিযুক্ত ব্যক্তির নাম'}
                </label>
                <input
                  type="text"
                  value={suspectName}
                  onChange={(e) => setSuspectName(e.target.value)}
                  placeholder="নাম জানা থাকলে লিখুন"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোবাইল নম্বর বা ফেসবুক লিংক
                </label>
                <input
                  type="text"
                  value={suspectContact}
                  onChange={(e) => setSuspectContact(e.target.value)}
                  placeholder="যেমন: ০১৭১১... বা লিংক"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                প্রতারণার বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={detailsBn}
                onChange={(e) => setDetailsBn(e.target.value)}
                placeholder="কীভাবে প্রতারণার চেষ্টা করা হয়েছে? কত টাকা দাবি করেছে বা কী প্রস্তাব দিয়েছে? বিস্তারিত লিখুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-amber-600"
              ></textarea>
            </div>

            {/* 📸 Multi-image Upload (Optional) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>প্রমাণ / স্ক্রিনশট সংযুক্ত করুন (ঐচ্ছিক, সর্বোচ্চ ৪টি)</span>
                </label>
                <span className="text-[11px] text-slate-400">{images.length}/৪টি ছবি</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-1.5">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
                    <img src={img} alt={`স্ক্রিনশট ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-full opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 4 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 rounded-xl aspect-video flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-amber-800 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-amber-600" />
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
              <p className="text-[10px] text-slate-400">মেসেজ, ফেসবুক পোস্ট বা বিকাশ স্টেটমেন্টের স্ক্রিনশট দিতে পারেন।</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>জমা হচ্ছে...</span>
                  </>
                ) : (
                  <span>রিপোর্ট জমা দিন</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

