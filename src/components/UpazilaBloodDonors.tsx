'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  PhoneCall,
  Droplet,
  PlusCircle,
  Filter,
  CheckCircle2,
  Clock,
  Heart,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { BloodDonor } from '@/types';
import DonorModal from '@/components/DonorModal';

interface UpazilaBloodDonorsProps {
  upazilaId: string;
  upazilaNameBn: string;
  initialDonors?: BloodDonor[];
}

const BLOOD_GROUPS = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function UpazilaBloodDonors({
  upazilaId,
  upazilaNameBn,
  initialDonors = []
}: UpazilaBloodDonorsProps) {
  const [donors, setDonors] = useState<BloodDonor[]>(initialDonors);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'request'>('register');

  const fetchDonorsFromApi = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blood-donors?upazilaId=${encodeURIComponent(upazilaId)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDonors(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch upazila donors from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorsFromApi();
  }, [upazilaId]);

  const filteredDonors = useMemo(() => {
    if (selectedGroup === 'all') return donors;
    return donors.filter((d) => d.bloodGroup === selectedGroup);
  }, [donors, selectedGroup]);

  return (
    <div className="bg-white border border-[#e7e3db] rounded-xl p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 leading-tight">
              {upazilaNameBn} উপজেলার রক্তদাতা
            </h3>
            <span className="text-[11px] text-gray-500">
              মোট তালিকাভুক্ত: <span className="font-semibold text-red-700">{donors.length}</span> জন
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalMode('register');
            setDonorModalOpen(true);
          }}
          className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors"
          title="রক্তদাতা হিসেবে নিবন্ধন করুন"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ রক্তদাতা হন</span>
        </button>
      </div>

      {/* Blood Group Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {BLOOD_GROUPS.map((grp) => {
          const isSelected = selectedGroup === grp;
          const count = grp === 'all'
            ? donors.length
            : donors.filter((d) => d.bloodGroup === grp).length;

          return (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`shrink-0 px-2.5 py-1 rounded-md font-bold text-[11px] transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-[#faf8f5] text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{grp === 'all' ? 'সকল' : grp}</span>
              {count > 0 && (
                <span className={`text-[9px] px-1 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Donors List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => {
            const isAvailable = donor.availabilityStatus === 'available';
            const isBusy = donor.availabilityStatus === 'busy';
            const isRecentlyDonated = donor.availabilityStatus === 'recently_donated';

            return (
              <div
                key={donor.id}
                className="p-3 bg-[#faf8f5] hover:bg-red-50/30 border border-gray-200 rounded-lg transition-colors text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Blood Group Badge */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                      {donor.bloodGroup}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-[13px]">{donor.donorNameBn}</span>
                        {donor.isApproved && (
                          <span title="যাচাইকৃত">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 block">
                        {donor.unionNameBn ? `${donor.unionNameBn}, ` : ''}
                        {donor.areaBn || upazilaNameBn}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isBusy
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAvailable ? 'bg-emerald-500 animate-pulse' : isBusy ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                    />
                    <span>
                      {isAvailable ? 'রক্তদানে প্রস্তুত' : isBusy ? 'আপাতত ব্যস্ত' : 'সম্প্রতি দিয়েছেন'}
                    </span>
                  </span>
                </div>

                {/* Sub details: donations count & emergency */}
                <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {donor.totalDonationsCount && (
                      <span className="text-gray-500">
                        রক্তদান: <strong className="text-gray-800">{donor.totalDonationsCount} বার</strong>
                      </span>
                    )}
                    {donor.emergencyAvailable && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        জরুরি প্রস্তুত
                      </span>
                    )}
                  </div>

                  {/* Phone Call Link */}
                  {donor.phone ? (
                    <a
                      href={`tel:${donor.phone}`}
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-md text-[11px] transition-colors"
                      title="সরাসরি কল করুন"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{donor.contactNumberMasked || donor.phone}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode('request');
                        setDonorModalOpen(true);
                      }}
                      className="text-red-700 hover:underline font-semibold"
                    >
                      আবেদন করুন
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 px-4 bg-[#faf8f5] border border-dashed border-gray-200 rounded-xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Heart className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-gray-800">
              {selectedGroup === 'all'
                ? `এই উপজেলায় এখনও কোনো রক্তদাতা তালিকাভুক্ত হননি`
                : `${selectedGroup} গ্রুপের কোনো রক্তদাতা পাওয়া যায়নি`}
            </p>
            <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
              জরুরি মুহূর্তে রোগীদের জীবন বাঁচাতে আপনার রক্তের গ্রুপটি যুক্ত করে রাখুন।
            </p>
            <button
              type="button"
              onClick={() => {
                setModalMode('register');
                setDonorModalOpen(true);
              }}
              className="mt-2 inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>প্রথম রক্তদাতা হিসেবে যুক্ত হন</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            setModalMode('request');
            setDonorModalOpen(true);
          }}
          className="text-red-700 font-bold hover:underline inline-flex items-center gap-1"
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>জরুরি রক্তের আবেদন</span>
        </button>

        <Link
          href="/blood-bank"
          className="text-gray-600 hover:text-red-700 inline-flex items-center gap-1 font-medium transition-colors"
        >
          <span>সকল রক্তদাতা</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Donor Modal (Register / Request) */}
      <DonorModal
        isOpen={donorModalOpen}
        onClose={() => setDonorModalOpen(false)}
        mode={modalMode}
        onSuccess={() => {
          fetchDonorsFromApi();
        }}
      />
    </div>
  );
}

