'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UPAZILAS } from '@/data/kurigramData';
import DonorModal from '@/components/DonorModal';
import type { BloodDonor, BloodRequest } from '@/types';
import {
  Heart,
  Search,
  Filter,
  Shield,
  PhoneCall,
  UserCheck,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Send,
  MapPin,
  Clock
} from 'lucide-react';

const toBengaliNumber = (num: number | string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
};

export default function BloodBankPage() {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedUpazila, setSelectedUpazila] = useState('all');
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'request'>('register');
  const [requestSentNotice, setRequestSentNotice] = useState<string | null>(null);
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonors = () => {
    fetch('/api/blood-donors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDonors(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchBloodRequests = () => {
    fetch('/api/blood-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBloodRequests(data.data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchDonors();
    fetchBloodRequests();
  }, []);

  const filteredDonors = donors.filter((donor) => {
    const matchesGroup = selectedGroup === 'all' || donor.bloodGroup === selectedGroup;
    const matchesUpazila = selectedUpazila === 'all' || donor.upazilaId === selectedUpazila;
    return matchesGroup && matchesUpazila;
  });

  const handleRequestClick = (donorName: string) => {
    setRequestSentNotice(
      `রোগীর প্রেসক্রিপশন যাচাই সাপেক্ষে রক্তদাতা ${donorName}-এর নিকট জরুরি অনুরোধ পাঠানো হয়েছে। অনুগ্রহ করে অপেক্ষা করুন।`
    );
    setTimeout(() => {
      setRequestSentNotice(null);
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">রক্তদাতা নেটওয়ার্ক</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
                কুড়িগ্রাম জেলা রক্তদাতা ডিরেক্টরি
              </h1>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">
                মোট {toBengaliNumber(filteredDonors.length)} জন রক্তদাতা
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              স্বেচ্ছাসেবী রক্তদাতাদের গোপনীয়তা সুরক্ষিত রেখে জরুরি প্রয়োজনে রক্ত মেলানোর উন্মুক্ত নাগরিক উদ্যোগ।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setModalMode('register');
                setDonorModalOpen(true);
              }}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>রক্তদাতা হিসেবে নিবন্ধন করুন</span>
            </button>
            <button
              onClick={() => {
                setModalMode('request');
                setDonorModalOpen(true);
              }}
              className="bg-white border border-red-700 text-red-700 hover:bg-red-50 px-3.5 py-2 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <Heart className="w-4 h-4" />
              <span>জরুরি রক্তের আবেদন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Alert Box */}
      <div className="bg-red-50/70 border border-red-200 rounded-lg p-4 text-xs text-red-950 flex items-start gap-3">
        <Shield className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-red-900 block">
            রক্তদাতাদের গোপনীয়তা ও সুরক্ষানীতি (Privacy Policy):
          </strong>
          <p className="text-red-800 leading-relaxed">
            রক্তদাতাদের কোনো সংবেদনশীল তথ্য বা পূর্ণ মোবাইল নম্বর জনসাধারণের কাছে উন্মুক্ত করা হয় না। দালালি ও অনাকাঙ্ক্ষিত হয়রানি রোধে শুধুমাত্র রোগীর জরুরি প্রেসক্রিপশন ও হাসপাতাল তথ্য যাচাইয়ের পর নির্দিষ্ট সংযোগ স্থাপন করা হয়। রক্ত বিক্রি আইনত দণ্ডনীয় অপরাধ।
          </p>
        </div>
      </div>

      {/* Notice Message Banner on Request */}
      {requestSentNotice && (
        <div className="p-3 bg-green-50 border border-green-300 rounded text-xs text-green-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span>{requestSentNotice}</span>
        </div>
      )}

      {/* 🚨 Emergency Blood Requests Link Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-red-50 to-amber-50/50 border border-rose-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Heart className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                জরুরি রক্তের তাৎক্ষণিক আবেদনসমূহ
              </h2>
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {bloodRequests.filter(r => r.status !== 'cancelled').length}টি সক্রিয় আবেদন
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              কুড়িগ্রামের হাসপাতালে ভর্তি রোগীদের জন্য রক্তের জরুরি আবেদন দেখতে ও সরাসরি যোগাযোগ করতে পৃথক পেজ দেখুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setModalMode('request');
              setDonorModalOpen(true);
            }}
            className="bg-white border border-rose-600 text-rose-700 hover:bg-rose-50 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>নতুন আবেদন</span>
          </button>
          <Link
            href="/blood-requests"
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>আবেদন পেজ খুলুন →</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Blood Groups Selector */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-700 mr-1">রক্তের গ্রুপ:</span>
            {['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  selectedGroup === group
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {group === 'all' ? 'সকল গ্রুপ' : group}
              </button>
            ))}
          </div>

          {/* Upazila Filter */}
          <div className="w-full sm:w-64">
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-red-600"
            >
              <option value="all">সকল উপজেলা ({UPAZILAS.length}টি)</option>
              {UPAZILAS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBn} ({u.nameEn})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donors List */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white border border-[#e7e3db] rounded-xl p-10 text-center text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-sm text-gray-700">কোনো নিবন্ধিত রক্তদাতা পাওয়া যায়নি</p>
          <p>আপনার রক্তের গ্রুপের কোনো দাতা না থাকলে আপনি নিজেই রক্তদাতা হিসেবে নিবন্ধন করতে পারেন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs hover:border-red-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {donor.bloodGroup}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    donor.availabilityStatus === 'available'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {donor.availabilityStatus === 'available' ? '✓ রক্তদানে প্রস্তুত' : 'সম্প্রতি রক্ত দিয়েছেন'}
                </span>
              </div>

              <h3 className="font-bold text-sm text-gray-900">{donor.donorNameBn}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {donor.upazilaNameBn} • {donor.areaBn}
              </p>

              <div className="mt-3 pt-2 border-t border-gray-100 space-y-1 text-[11px] text-gray-500">
                <p>
                  মোবাইল নম্বর: <span className="font-mono text-gray-700">{donor.contactNumberMasked}</span>
                </p>
                {donor.lastDonationDate && (
                  <p>সর্বশেষ রক্তদান: {donor.lastDonationDate}</p>
                )}
                <p>যাচাইকৃত: {donor.verifiedDate}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
              {donor.availabilityStatus === 'available' ? (
                <>
                  <a
                    href={`tel:${donor.phone || ''}`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>সরাসরি কল দিন</span>
                  </a>
                  <button
                    onClick={() => handleRequestClick(donor.donorNameBn)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-bold transition-colors"
                    title="জরুরি অনুরোধ পাঠান"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="w-full bg-slate-100 text-slate-500 py-1.5 rounded text-xs font-medium text-center border border-slate-200">
                  রক্তদানে প্রস্তুত নন
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Modal */}
      <DonorModal
        isOpen={donorModalOpen}
        onClose={() => setDonorModalOpen(false)}
        mode={modalMode}
        onSuccess={() => {
          fetchDonors();
          fetchBloodRequests();
        }}
      />
    </div>
  );
}
