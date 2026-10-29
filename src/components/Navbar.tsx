'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  MapPin,
  Newspaper,
  Compass,
  Landmark,
  Hospital,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  Building2,
  Lock,
  ChevronDown,
  PlusCircle,
  FileQuestion
} from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [upazilaDropdownOpen, setUpazilaDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { nameBn: 'হোম', href: '/', icon: Compass },
    { nameBn: 'জেলা মানচিত্র', href: '/explore', icon: Compass },
    // { nameBn: 'সংবাদ', href: '/news', icon: Newspaper }, // Hidden: data lagbe
    { nameBn: 'ঐতিহ্য ও পর্যটন', href: '/heritage', icon: Landmark },
    // { nameBn: 'জরুরি হাসপাতাল', href: '/healthcare', icon: Hospital }, // Hidden
    { nameBn: 'ব্লাড ব্যাংক', href: '/blood-bank', icon: HeartHandshake },
    { nameBn: 'হারানো বিজ্ঞপ্তি', href: '/lost-and-found', icon: FileQuestion },
    // { nameBn: 'পুলিশ ও প্রশাসন', href: '/police-services', icon: ShieldCheck }, // Hidden
    { nameBn: 'নাগরিক সমস্যা ট্র্যাকার', href: '/reports', icon: AlertCircle },
    { nameBn: 'প্রতারণা', href: '/scam-alerts', icon: AlertCircle },
    // { nameBn: 'ডিরেক্টরি', href: '/directories', icon: Building2 }, // Hidden: data lagbe
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
      {/* Brand & Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group py-0.5" title="KuriConnect - হোম">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="KuriConnect Logo"
                fill
                sizes="48px"
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md mx-4 relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="উপজেলা, হাসপাতাল, রক্তদাতা বা নাগরিক তথ্য খুঁজুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-16 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            খুঁজুন
          </button>
        </form>

        {/* Right: CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/reports#submit"
            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow-emerald-700/20 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>সমস্যা রিপোর্ট করুন</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Modern Navigation Row */}
      <nav className="border-t border-slate-100 bg-slate-50/60 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 overflow-x-auto py-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap text-xs xl:text-sm flex items-center gap-1.5 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-100/70 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100/80'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{link.nameBn}</span>
                </Link>
              );
            })}

            {/* ৯টি উপজেলা Dropdown — HIDDEN
            <div className="relative">
              <button
                onClick={() => setUpazilaDropdownOpen(!upazilaDropdownOpen)}
                onBlur={() => setTimeout(() => setUpazilaDropdownOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-2 rounded-sm font-medium text-xs xl:text-sm text-[#383d42] hover:text-[#14532d] hover:bg-[#f2efe9] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#14532d]" />
                <span>৯টি উপজেলা</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {upazilaDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-white border border-[#d2ccc1] rounded shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    উপজেলা নির্বাচন করুন
                  </div>
                  {UPAZILAS.map((upazila) => (
                    <Link
                      key={upazila.id}
                      href={`/upazila/${upazila.slug}`}
                      className="block px-3 py-1.5 text-xs text-[#1a1d1f] hover:bg-[#eef6f0] hover:text-[#14532d] transition-colors"
                    >
                      {upazila.nameBn} ({upazila.nameEn})
                    </Link>
                  ))}
                </div>
              )}
            </div>
            */}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-xs text-[#575e65] hover:text-[#14532d] px-2 py-1"
            >
              <Lock className="w-3 h-3" />
              <span>অ্যাডমিন পোর্টাল</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e7e3db] bg-white px-4 py-4 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সার্চ করুন..."
              className="w-full bg-[#f8f6f0] border border-[#d2ccc1] rounded-md py-2 pl-9 pr-3 text-sm text-[#1a1d1f]"
            />
            <Search className="w-4 h-4 text-[#81878d] absolute left-3 top-3" />
          </form>

          {/* Links */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-[#faf8f5] hover:bg-[#eef6f0] text-[#1a1d1f] hover:text-[#14532d] font-medium text-xs transition-colors"
              >
                <link.icon className="w-4 h-4 text-[#14532d]" />
                <span>{link.nameBn}</span>
              </Link>
            ))}
          </div>

          {/* 9 Upazilas Quick List — HIDDEN as requested */}
          {/*
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block mb-2">৯টি উপজেলা:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {UPAZILAS.map((upazila) => (
                <Link
                  key={upazila.id}
                  href={`/upazila/${upazila.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-1.5 px-1 bg-gray-50 hover:bg-green-50 rounded text-xs text-gray-800 hover:text-green-800 transition-colors"
                >
                  {upazila.nameBn}
                </Link>
              ))}
            </div>
          </div>
          */}

          <div className="pt-2 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100">
            <Link
              href="/reports#submit"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#14532d] font-semibold"
            >
              + নতুন তথ্য/সমস্যা জমা দিন
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              অ্যাডমিন লগইন
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
