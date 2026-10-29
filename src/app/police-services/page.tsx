'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { POLICE_CONTACTS, UPAZILAS, EMERGENCY_HELPLINES } from '@/data/kurigramData';
import {
  Shield,
  ShieldCheck,
  PhoneCall,
  Search,
  Building2,
  Flame,
  LifeBuoy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function PoliceServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredContacts = POLICE_CONTACTS.filter((c) => {
    const matchesSearch =
      c.officeNameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.officeNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.designationBn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUpazila = selectedUpazila === 'all' || c.upazilaId === selectedUpazila;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;

    return matchesSearch && matchesUpazila && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">থানা, পুলিশ ও প্রশাসন</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা পুলিশ, ওসি ও প্রশাসনিক কার্যালয় ডিরেক্টরি
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              সকল উপজেলার থানা, অফিসার ইনচার্জ (ওসি), নৌ পুলিশ, ফায়ার সার্ভিস ও উপজেলা প্রশাসনের সরাসরি সরকারি যোগাযোগ।
            </p>
          </div>
          <a
            href="tel:০১৩২০-১৩৪০০০"
            className="self-start sm:self-auto bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>পুলিশ কন্ট্রোল রুম: ০১৩২০-১৩৪০০০</span>
          </a>
        </div>
      </div>

      {/* Emergency Quick Helpline Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white rounded">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-900 block">জাতীয় জরুরি সেবা (টোল ফ্রি)</span>
              <span className="text-xl font-bold text-red-700 font-mono">৯৯৯</span>
            </div>
          </div>
          <a
            href="tel:999"
            className="text-xs bg-red-600 text-white px-2.5 py-1 rounded font-bold hover:bg-red-700"
          >
            কল দিন
          </a>
        </div>

        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 text-white rounded">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-orange-900 block">কুড়িগ্রাম ফায়ার স্টেশন</span>
              <span className="text-sm font-bold text-orange-800 font-mono">০১৭৩০-০০২৪৪৫</span>
            </div>
          </div>
          <a
            href="tel:০১৭৩০-০০২৪৪৫"
            className="text-xs bg-orange-600 text-white px-2.5 py-1 rounded font-bold hover:bg-orange-700"
          >
            কল দিন
          </a>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 text-white rounded">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-900 block">চিলমারী নদী থানা (নৌ পুলিশ)</span>
              <span className="text-sm font-bold text-blue-800 font-mono">০১৩২০-১৩৪৫৫০</span>
            </div>
          </div>
          <a
            href="tel:০১৩২০-১৩৪৫৫০"
            className="text-xs bg-blue-700 text-white px-2.5 py-1 rounded font-bold hover:bg-blue-800"
          >
            কল দিন
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e7e3db] rounded-lg p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="থানা, ওসি বা কার্যালয়ের নাম খুঁজুন..."
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-blue-600"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="all">সকল উপজেলা ({UPAZILAS.length}টি)</option>
              {UPAZILAS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#faf8f5] border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="all">সকল প্রশাসনিক দপ্তর</option>
              <option value="thana">পুলিশ থানা</option>
              <option value="oc">অফিসার ইনচার্জ (ওসি)</option>
              <option value="uno">উপজেলা প্রশাসন (ইউএনও)</option>
              <option value="fire-service">ফায়ার সার্ভিস</option>
              <option value="river-police">নৌ পুলিশ</option>
              <option value="emergency-control">কন্ট্রোল রুম</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white border border-[#e7e3db] rounded-lg p-5 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                    {contact.upazilaNameBn}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-1 leading-snug">
                    {contact.officeNameBn}
                  </h3>
                  <span className="text-[11px] text-gray-500 font-sans">{contact.officeNameEn}</span>
                </div>
                <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded font-medium">
                  {contact.designationBn}
                </span>
              </div>

              {contact.officerNameBn && (
                <p className="text-xs text-gray-700 font-medium mb-1">
                  দায়িত্বপ্রাপ্ত কর্মকর্তা: {contact.officerNameBn}
                </p>
              )}

              <p className="text-xs text-gray-500 mb-3">{contact.addressBn}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-xs font-bold text-gray-800 block">{contact.phone}</span>
                {contact.altPhone && (
                  <span className="font-mono text-[11px] text-gray-500">বিকল্প: {contact.altPhone}</span>
                )}
                <span className="text-[10px] text-gray-400 block mt-0.5">যাচাই: {contact.verifiedDate}</span>
              </div>

              <a
                href={`tel:${contact.phone}`}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>সরাসরি কল দিন</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
