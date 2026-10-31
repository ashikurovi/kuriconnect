'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UPAZILAS } from '@/data/kurigramData';
import DonorModal from '@/components/DonorModal';
import type { BloodRequest } from '@/types';
import {
  Heart,
  Search,
  Filter,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Droplet
} from 'lucide-react';

export default function BloodRequestsPage() {
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedUpazila, setSelectedUpazila] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBloodRequests = () => {
    setLoading(true);
    fetch('/api/blood-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBloodRequests(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const filteredRequests = bloodRequests.filter((req) => {
    const matchesGroup = selectedGroup === 'all' || req.bloodGroup === selectedGroup;
    const matchesUpazila = selectedUpazila === 'all' || req.upazilaId === selectedUpazila;
    const matchesStatus =
      selectedStatus === 'all'
        ? req.status !== 'cancelled'
        : req.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      req.patientNameBn.toLowerCase().includes(q) ||
      req.hospitalNameBn.toLowerCase().includes(q) ||
      req.problemDescription.toLowerCase().includes(q) ||
      req.upazilaNameBn.toLowerCase().includes(q);

    return matchesGroup && matchesUpazila && matchesStatus && matchesSearch;
  });

  const activeCount = bloodRequests.filter((r) => r.status === 'approved' || r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-bengali">
      {/* Header & Breadcrumb */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-emerald-700">হোম</Link>
          <span>/</span>
          <Link href="/blood-bank" className="hover:text-emerald-700">ব্লাড ব্যাংক</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">জরুরি রক্তের আবেদনসমূহ</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                জরুরি রক্তের তাৎক্ষণিক আবেদনসমূহ
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              কুড়িগ্রাম জেলার ৯টি উপজেলার বিভিন্ন হাসপাতালে চিকিৎসাধীন রোগীদের তাৎক্ষণিক রক্তের চাহিদা। সরাসরি রোগীর পরিবারের সাথে ফোনে কথা বলে রক্তদানে এগিয়ে আসুন।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>জরুরি রক্তের আবেদন করুন</span>
            </button>
            <Link
              href="/blood-bank"
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>রক্তদাতা তালিকা</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Alert */}
      <div className="bg-gradient-to-r from-rose-50 via-red-50 to-amber-50/50 border border-rose-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Heart className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                তাৎক্ষণিক সরাসরি যোগাযোগ ও সহায়তা
              </h3>
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeCount}টি সক্রিয় আবেদন
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              কোনো ওটিপি বা মধ্যস্থতাকারী নেই। যেকোনো রক্তের প্রয়োজনে সরাসরি যোগাযোগ করুন অথবা আবেদন পোস্ট করুন।
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto bg-white border border-rose-600 text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
        >
          <Droplet className="w-3.5 h-3.5 text-rose-600" />
          <span>নতুন আবেদন যোগ করুন</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3.5">
        {/* Search & Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="রোগীর নাম, হাসপাতাল বা সমস্যা লিখে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
            />
          </div>

          {/* Upazila Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
            >
              <option value="all">সকল উপজেলা ({UPAZILAS.length}টি)</option>
              {UPAZILAS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-600 focus:bg-white"
            >
              <option value="all">সকল সক্রিয় আবেদন</option>
              <option value="approved">জরুরি প্রয়োজন</option>
              <option value="managed">রক্ত সংগ্রহ হয়েছে</option>
            </select>
          </div>
        </div>

        {/* Blood Groups Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>রক্তের গ্রুপ:</span>
          </span>
          {['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedGroup === group
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {group === 'all' ? 'সকল গ্রুপ' : group}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          রক্তের আবেদনগুলো লোড হচ্ছে...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">
            বর্তমানে কোনো জরুরি রক্তের আবেদন পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            আপনার বা আপনার পরিচিত কারও জরুরি রক্তের প্রয়োজন হলে এখনই বিনামূল্যে আবেদন পোস্ট করতে পারেন। এটি তাৎক্ষণিকভাবে ওয়েবসাইটে প্রদর্শিত হবে।
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>জরুরি রক্তের আবেদন করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-rose-300 hover:shadow-sm transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Top Badge & Group */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-slate-900">{req.patientNameBn}</h3>
                        <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                          {req.bagsNeeded} ব্যাগ
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {req.upazilaNameBn}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      req.status === 'managed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                    }`}
                  >
                    {req.status === 'managed' ? '✓ রক্ত সংগ্রহ হয়েছে' : 'জরুরি প্রয়োজন'}
                  </span>
                </div>

                {/* Details Card */}
                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-500 shrink-0">হাসপাতাল:</span>
                    <span className="text-slate-900 font-medium">{req.hospitalNameBn}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-500 shrink-0">রোগীর সমস্যা:</span>
                    <span className="text-slate-800">{req.problemDescription}</span>
                  </p>
                  {req.urgencyDate && (
                    <p className="flex items-center gap-1.5 text-rose-700 font-semibold text-xs pt-0.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>প্রয়োজন: {req.urgencyDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action: Direct Call Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${req.contactNumber}`}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-98"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>সরাসরি কল দিন ({req.contactNumber})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <DonorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="request"
        onSuccess={fetchBloodRequests}
      />
    </div>
  );
}

