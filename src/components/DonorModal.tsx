'use client';

import React, { useState } from 'react';
import { X, Heart, Shield, CheckCircle } from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';
import { UpazilaId } from '@/types';

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'register' | 'request';
  onSuccess?: () => void;
}

export default function DonorModal({ isOpen, onClose, mode = 'register', onSuccess }: DonorModalProps) {
  const [donorNameBn, setDonorNameBn] = useState('');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('A+');
  const [upazilaId, setUpazilaId] = useState<UpazilaId>('kurigram-sadar');
  const [areaBn, setAreaBn] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('অনুগ্রহ করে তথ্যের সত্যতা ও গোপনীয়তা বিধিমালার সম্মতিতে টিক দিন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg max-w-lg w-full border border-[#d2ccc1] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-200 fill-current" />
            <h3 className="font-bold text-base tracking-tight">
              {mode === 'register' ? 'স্বেচ্ছাসেবী রক্তদাতা হিসেবে নিবন্ধন করুন' : 'জরুরি রক্তের আবেদন করুন'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-red-200 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h4 className="font-bold text-lg text-gray-900">
              {mode === 'register' ? 'নিবন্ধন সফল হয়েছে!' : 'রক্তের অনুরোধ পাঠানো হয়েছে!'}
            </h4>
            <p className="text-xs text-gray-600">
              আপনার মানবিক উদ্যোগের জন্য ধন্যবাদ। রোগীর জরুরি প্রয়োজনে আপনার তথ্যের সঠিকতা যাচাই সাপেক্ষে যোগাযোগ করা হবে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 p-2.5 rounded text-xs text-red-800 flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>
                <strong>গোপনীয়তা অঙ্গীকার:</strong> আপনার ব্যক্তিগত মোবাইল নম্বর সরাসরি জনসম্মুখে উন্মুক্ত করা হবে না। শুধুমাত্র রোগীর জরুরি প্রেসক্রিপশন যাচাইয়ের পর অনুমোদিত অনুরোধকারীকে এসএমএস করা হবে।
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                আপনার নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={donorNameBn}
                onChange={(e) => setDonorNameBn(e.target.value)}
                placeholder="পূর্ণ নাম লিখুন"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  রক্তের গ্রুপ <span className="text-red-500">*</span>
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as any)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-600 font-bold text-red-700"
                >
                  <option value="A+">A+ (পজেটিভ)</option>
                  <option value="A-">A- (নেগেটিভ)</option>
                  <option value="B+">B+ (পজেটিভ)</option>
                  <option value="B-">B- (নেগেটিভ)</option>
                  <option value="AB+">AB+ (পজেটিভ)</option>
                  <option value="AB-">AB- (নেগেটিভ)</option>
                  <option value="O+">O+ (পজেটিভ)</option>
                  <option value="O-">O- (নেগেটিভ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  উপজেলা <span className="text-red-500">*</span>
                </label>
                <select
                  value={upazilaId}
                  onChange={(e) => setUpazilaId(e.target.value as UpazilaId)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-600"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  এলাকা / ইউনিয়ন <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={areaBn}
                  onChange={(e) => setAreaBn(e.target.value)}
                  placeholder="যেমন: কলেজ মোড়, সদর"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="০১৭১১-XXXXXX"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 text-xs text-gray-600">
              <input
                type="checkbox"
                id="donorConsent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-600"
              />
              <label htmlFor="donorConsent" className="cursor-pointer">
                আমি স্বেচ্ছায় কুড়িগ্রাম রক্তদাতা নেটওয়ার্কে আমার তথ্য প্রদান করছি এবং জরুরি প্রয়োজনে রোগীকে বিনামূল্যে রক্তদানে সম্মতি প্রকাশ করছি।
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
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'প্রক্রিয়াধীন...' : 'নিবন্ধন সম্পন্ন করুন'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
