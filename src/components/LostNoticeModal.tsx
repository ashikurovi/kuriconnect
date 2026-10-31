'use client';

import React, { useState, useEffect } from 'react';
import { X, PlusCircle, CheckCircle2, Loader2, FileQuestion, MapPin, Phone, Calendar } from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';
import { useAuth } from '@/context/AuthContext';
import type { LostNotice, UpazilaId } from '@/types';

interface LostNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const categoryLabels: Record<string, string> = {
  person: 'নিখোঁজ ব্যক্তি',
  document: 'আইডি কার্ড ও সনদ',
  vehicle: 'যানবাহন ও সাইকেল',
  valuable: 'মোবাইল ও মূল্যবান জিনিস',
  other: 'অন্যান্য'
};

export default function LostNoticeModal({ isOpen, onClose, onSuccess }: LostNoticeModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'lost' as 'lost' | 'found',
    category: 'document' as LostNotice['category'],
    titleBn: '',
    descriptionBn: '',
    upazilaId: 'kurigram-sadar' as UpazilaId,
    locationDetailsBn: '',
    date: '',
    gdNumber: '',
    contactName: '',
    contactPhone: '',
    rewardBn: ''
  });

  useEffect(() => {
    if (!formData.date) {
      setFormData((prev) => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
    }
  }, []);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.titleBn.trim() || !formData.contactPhone.trim() || !formData.contactName.trim()) {
      setErrorMessage('অনুগ্রহ করে বিজ্ঞপ্তির শিরোনাম, যোগাযোগের নাম ও মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const upazilaObj = UPAZILAS.find((u) => u.id === formData.upazilaId);
      const res = await fetch('/api/lost-notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          type: formData.type,
          category: formData.category,
          titleBn: formData.titleBn,
          descriptionBn: formData.descriptionBn,
          upazilaId: formData.upazilaId,
          locationDetailsBn: formData.locationDetailsBn,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          gdNumber: formData.gdNumber.trim() ? formData.gdNumber : undefined,
          rewardBn: formData.rewardBn.trim() ? formData.rewardBn : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
          setFormData({
            type: 'lost',
            category: 'document',
            titleBn: '',
            descriptionBn: '',
            upazilaId: 'kurigram-sadar',
            locationDetailsBn: '',
            date: new Date().toISOString().split('T')[0],
            gdNumber: '',
            contactName: '',
            contactPhone: '',
            rewardBn: ''
          });
        }, 2000);
      } else {
        setErrorMessage(data.message || 'বিজ্ঞপ্তি সংরক্ষণ করা যায়নি');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-bengali">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-indigo-200" />
            <h3 className="font-heading font-bold text-sm sm:text-base tracking-tight">
              নতুন হারানো বা প্রাপ্তি বিজ্ঞপ্তি প্রকাশ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-heading font-bold text-lg text-slate-900">বিজ্ঞপ্তি সফলভাবে প্রকাশিত হয়েছে!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার বিজ্ঞপ্তিটি ড্যাশবোর্ডে যুক্ত হয়েছে। সাধারণ মানুষ ও প্রশাসন প্রয়োজনে আপনার সাথে সরাসরি ফোনে যোগাযোগ করতে পারবে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Notice Type Radio */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">বিজ্ঞপ্তির ধরন <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold transition-all ${
                    formData.type === 'lost'
                      ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="lost"
                    checked={formData.type === 'lost'}
                    onChange={() => setFormData({ ...formData, type: 'lost' })}
                    className="hidden"
                  />
                  <span>🚨 হারানো বিজ্ঞপ্তি</span>
                </label>

                <label
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold transition-all ${
                    formData.type === 'found'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="found"
                    checked={formData.type === 'found'}
                    onChange={() => setFormData({ ...formData, type: 'found' })}
                    className="hidden"
                  />
                  <span>🟢 কুড়িয়ে পাওয়া</span>
                </label>
              </div>
            </div>

            {/* Category & Upazila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ক্যাটাগরি <span className="text-rose-500">*</span></label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                >
                  <option value="person">নিখোঁজ ব্যক্তি</option>
                  <option value="document">আইডি কার্ড ও সনদ</option>
                  <option value="vehicle">যানবাহন ও সাইকেল</option>
                  <option value="valuable">মোবাইল ও মূল্যবান জিনিস</option>
                  <option value="other">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">উপজেলা <span className="text-rose-500">*</span></label>
                <select
                  value={formData.upazilaId}
                  onChange={(e) => setFormData({ ...formData, upazilaId: e.target.value as UpazilaId })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                বিজ্ঞপ্তির শিরোনাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                placeholder="যেমন: কুড়িগ্রাম কলেজ মোড়ে জাতীয় পরিচয়পত্র হারানো"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.descriptionBn}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                placeholder="রং, বিশেষ কোনো চিহ্ন বা বিস্তারিত বিবরণ লিখুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
              />
            </div>

            {/* Location & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">স্থান / এলাকা <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.locationDetailsBn}
                  onChange={(e) => setFormData({ ...formData, locationDetailsBn: e.target.value })}
                  placeholder="যেমন: ত্রিমোহনী বাজার"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ঘটনার তারিখ</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* GD Number & Reward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">থানা জিডি নং (যদি থাকে)</label>
                <input
                  type="text"
                  value={formData.gdNumber}
                  onChange={(e) => setFormData({ ...formData, gdNumber: e.target.value })}
                  placeholder="যেমন: সদর থানা জিডি নং-৭৮৪/২৬"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">পুরস্কার ঘোষণা (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={formData.rewardBn}
                  onChange={(e) => setFormData({ ...formData, rewardBn: e.target.value })}
                  placeholder="যেমন: নগদ ২,০০০ টাকা পুরস্কৃত"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">যোগাযোগকারীর নাম <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="আপনার নাম"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="০১৭xxxxxxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-98 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <span>বিজ্ঞপ্তি প্রকাশ করুন</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
