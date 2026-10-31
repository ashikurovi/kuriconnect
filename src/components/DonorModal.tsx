'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Shield,
  CheckCircle,
  Smartphone,
  KeyRound,
  Loader2,
  ArrowLeft,
  Calendar,
  UserCheck,
  Hospital,
  AlertCircle,
  Send,
  Droplet
} from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';
import { useAuth } from '@/context/AuthContext';
import { UpazilaId } from '@/types';

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'register' | 'request';
  onSuccess?: () => void;
}

export default function DonorModal({ isOpen, onClose, mode = 'register', onSuccess }: DonorModalProps) {
  const { user } = useAuth();
  // Donor Register State
  const [donorNameBn, setDonorNameBn] = useState('');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('A+');
  const [upazilaId, setUpazilaId] = useState<UpazilaId>('kurigram-sadar');
  const [areaBn, setAreaBn] = useState('');
  const [phone, setPhone] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'busy'>('available');
  const [consent, setConsent] = useState(false);

  // Blood Request State (জরুরি রক্তের আবেদন)
  const [patientNameBn, setPatientNameBn] = useState('');
  const [requestBloodGroup, setRequestBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('A+');
  const [bagsNeeded, setBagsNeeded] = useState<number>(1);
  const [hospitalNameBn, setHospitalNameBn] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [requestUpazilaId, setRequestUpazilaId] = useState<UpazilaId>('kurigram-sadar');
  const [contactNumber, setContactNumber] = useState('');
  const [urgencyDate, setUrgencyDate] = useState('আজকের মধ্যে জরুরি');
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0]);
  }, []);

  // OTP Step states: 'form' | 'otp' | 'success'
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  if (!isOpen) return null;

  // ==================== MODE: REGISTER (WITH OTP) ====================
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!consent) {
      setErrorMessage('অনুগ্রহ করে তথ্যের সত্যতা ও গোপনীয়তা বিধিমালার সম্মতিতে টিক দিন।');
      return;
    }

    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSentMessage(data.message || 'আপনার মোবাইলে ওটিপি কোড পাঠানো হয়েছে');
        setStep('otp');
      } else {
        setErrorMessage(data.message || 'ওটিপি পাঠাতে সমস্যা হয়েছে');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    setErrorMessage(null);
    try {
      const clean = phone.replace(/[^0-9]/g, '');
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSentMessage('নতুন ওটিপি কোড পাঠানো হয়েছে');
      } else {
        setErrorMessage(data.message || 'পুনরায় ওটিপি পাঠাতে সমস্যা হয়েছে');
      }
    } catch {
      setErrorMessage('সার্ভার ত্রুটি');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndSubmitDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMessage('সঠিক ৪ ডিজিটের ওটিপি কোড লিখুন');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const clean = phone.replace(/[^0-9]/g, '');

      // 1. Verify OTP
      const verifyRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean, otp: otpCode.trim() })
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setErrorMessage(verifyData.message || 'ভুল ওটিপি কোড');
        setIsVerifyingOtp(false);
        return;
      }

      // 2. Create Donor
      const createRes = await fetch('/api/blood-donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorNameBn,
          bloodGroup,
          upazilaId,
          areaBn,
          phone: clean,
          lastDonationDate: lastDonationDate || 'কখনও দেননি বা জানা নেই',
          availabilityStatus
        })
      });
      const createData = await createRes.json();

      if (createData.success) {
        setStep('success');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setStep('form');
          onClose();
        }, 2500);
      } else {
        setErrorMessage(createData.message || 'রক্তদাতা তৈরি করা যায়নি');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ==================== MODE: BLOOD REQUEST (জরুরি রক্তের আবেদন) ====================
  const handleBloodRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!patientNameBn.trim() || !hospitalNameBn.trim() || !problemDescription.trim() || !contactNumber.trim()) {
      setErrorMessage('অনুগ্রহ করে রোগীর নাম, রক্ত ও ব্যাগের পরিমাণ, হাসপাতাল এবং যোগাযোগের নম্বর লিখুন।');
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const res = await fetch('/api/blood-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          patientNameBn,
          bloodGroup: requestBloodGroup,
          bagsNeeded,
          hospitalNameBn,
          problemDescription,
          upazilaId: requestUpazilaId,
          contactNumber,
          urgencyDate
        })
      });

      const data = await res.json();
      if (data.success) {
        setStep('success');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setStep('form');
          onClose();
        }, 2500);
      } else {
        setErrorMessage(data.message || 'আবেদন জমা নেওয়া যায়নি');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-bengali">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-700 to-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-200 fill-current" />
            <h3 className="font-bold text-base tracking-tight">
              {mode === 'register' ? 'স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন (ওটিপি ভেরিফাইড)' : 'জরুরি রক্তের আবেদন (সরাসরি প্রকাশ - ওটিপি লাগবে না)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {step === 'success' ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-lg text-slate-900">
              {mode === 'register' ? 'নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!' : 'রক্তের আবেদন সফলভাবে জমা হয়েছে!'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {mode === 'register'
                ? 'আপনার মোবাইল নম্বরটি সফলভাবে ওটিপি দ্বারা যাচাইকৃত হয়েছে। অ্যাডমিন অনুমোদনের পর রক্তদাতা তালিকায় প্রদর্শিত হবে।'
                : 'আপনার রক্তের আবেদনটি তাৎক্ষণিকভাবে অনুমোদিত হয়ে সরাসরি ওয়েবসাইটে প্রকাশিত হয়েছে। রক্তদাতারা সরাসরি আপনাকে কল করতে পারবেন।'}
            </p>
          </div>
        ) : mode === 'request' ? (
          /* ================= BLOOD REQUEST FORM ================= */
          <form onSubmit={handleBloodRequestSubmit} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto text-xs sm:text-sm">
            <div className="bg-rose-50 border border-rose-200/80 p-3 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">
                <strong>তাত্ক্ষণিক জরুরি রক্ত সহায়তা:</strong> কোনো ওটিপি বা অনুমোদনের অপেক্ষা নেই। তথ্য দেওয়ার সাথে সাথেই আবেদনটি স্বয়ংক্রিয়ভাবে সরাসরি প্রকাশিত হবে যাতে যেকোনো রক্তদাতা দ্রুত যোগাযোগ করতে পারেন।
              </div>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                রোগীর নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={patientNameBn}
                onChange={(e) => setPatientNameBn(e.target.value)}
                placeholder="রোগীর পূর্ণ নাম"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  রক্তের গ্রুপ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={requestBloodGroup}
                  onChange={(e) => setRequestBloodGroup(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600 font-bold text-rose-700 bg-white"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  কত ব্যাগ রক্ত লাগবে? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={bagsNeeded}
                  onChange={(e) => setBagsNeeded(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  হাসপাতাল / ক্লিনিকের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hospitalNameBn}
                  onChange={(e) => setHospitalNameBn(e.target.value)}
                  placeholder="যেমন: কুড়িগ্রাম ২৫০ শয্যা জেনারেল হাসপাতাল"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  উপজেলা <span className="text-rose-500">*</span>
                </label>
                <select
                  value={requestUpazilaId}
                  onChange={(e) => setRequestUpazilaId(e.target.value as UpazilaId)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-600 bg-white"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                রোগীর সমস্যা / কি কারণে রক্ত লাগবে? <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="যেমন: ডেলিভারি রোগী / সিজারিয়ান অপারেশন / থ্যালাসেমিয়া / দুর্ঘটনা"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-600"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  যোগাযোগের ফোন নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  কখন রক্ত প্রয়োজন?
                </label>
                <input
                  type="text"
                  value={urgencyDate}
                  onChange={(e) => setUrgencyDate(e.target.value)}
                  placeholder="যেমন: আজ সন্ধ্যা ৬টা / জরুরি"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmittingRequest}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isSubmittingRequest ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>আবেদন জমা দিন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : step === 'otp' ? (
          /* Step 2: OTP Verification Screen for Donor Register */
          <form onSubmit={handleVerifyAndSubmitDonor} className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-rose-100">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900">মোবাইল নম্বর যাচাই করুন</h4>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{phone}</span> নম্বরে একটি ৪ ডিজিটের ওটিপি পাঠানো হয়েছে
              </p>
            </div>

            {otpSentMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-lg text-center">
                {otpSentMessage}
              </div>
            )}

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-lg text-center">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                ৪ ডিজিটের ওটিপি কোড দিন
              </label>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • •"
                  className="w-40 text-center tracking-[0.5em] text-2xl font-bold border-2 border-rose-300 focus:border-rose-600 rounded-xl py-2 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> নম্বর পরিবর্তন
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSendingOtp}
                className="text-rose-600 hover:text-rose-700 font-semibold disabled:opacity-50"
              >
                {isSendingOtp ? 'পাঠানো হচ্ছে...' : 'ওটিপি পুনরায় পাঠান'}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isVerifyingOtp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVerifyingOtp ? 'যাচাই করা হচ্ছে...' : 'যাচাই ও রক্তদাতা যুক্ত করুন'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 1: Donor Registration Form */
          <form onSubmit={handleInitiateRegister} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto text-xs sm:text-sm">
            <div className="bg-rose-50 border border-rose-200/80 p-3 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
              <Shield className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">
                <strong>নিরাপত্তা ও ওটিপি যাচাই:</strong> ভুয়া এন্ট্রি রোধ করতে রক্তদাতা হিসেবে যোগদানের পূর্বে আপনার মোবাইল নম্বরে ওটিপি পাঠানো হবে।
              </div>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                আপনার নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={donorNameBn}
                onChange={(e) => setDonorNameBn(e.target.value)}
                placeholder="পূর্ণ নাম লিখুন (যেমন: মোঃ রফিকুল ইসলাম)"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  রক্তের গ্রুপ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600 font-bold text-rose-700 bg-white"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  উপজেলা <span className="text-rose-500">*</span>
                </label>
                <select
                  value={upazilaId}
                  onChange={(e) => setUpazilaId(e.target.value as UpazilaId)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600 bg-white"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  এলাকা / ইউনিয়ন <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={areaBn}
                  onChange={(e) => setAreaBn(e.target.value)}
                  placeholder="যেমন: কলেজ মোড়, সদর"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>

            {/* Last Donation Date & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>সর্বশেষ কবে রক্ত দিয়েছেন? (ঐচ্ছিক)</span>
                </label>
                <input
                  type="date"
                  max={todayDate || undefined}
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-600 bg-white cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  ক্যালেন্ডার আইকন থেকে তারিখ সিলেক্ট করুন
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>বর্তমানে রক্তদানে প্রস্তুত আছেন?</span>
                </label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value as 'available' | 'busy')}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-600 bg-white font-medium"
                >
                  <option value="available">✓ হ্যাঁ, রক্তদানে প্রস্তুত (Available)</option>
                  <option value="busy">✗ বর্তমানে রক্তদানে বিরত / ব্যস্ত (Not Available)</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 text-xs text-slate-600">
              <input
                type="checkbox"
                id="donorConsent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-600"
              />
              <label htmlFor="donorConsent" className="cursor-pointer leading-tight">
                আমি স্বেচ্ছায় কুড়িগ্রাম রক্তদাতা নেটওয়ার্কে আমার তথ্য প্রদান করছি এবং জরুরি প্রয়োজনে রোগীকে বিনামূল্যে রক্তদানে সম্মতি প্রকাশ করছি।
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSendingOtp}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>ওটিপি পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>ওটিপি কোড পান</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
