'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  ChevronDown,
  ChevronRight,
  PlusCircle,
  FileQuestion,
  Heart,
  User,
  LogIn,
  LogOut,
  Shield
} from 'lucide-react';
import { UPAZILAS } from '@/data/kurigramData';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
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
    { nameBn: 'জরুরি রক্তের আবেদন', href: '/blood-requests', icon: Heart },
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

        {/* Right: CTA & User Auth & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/reports#submit"
            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all hover:shadow-emerald-700/20 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>সমস্যা রিপোর্ট করুন</span>
          </Link>

          {/* User Auth Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors group"
                title="আমার ড্যাশবোর্ড"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800 group-hover:text-emerald-700 max-w-[110px] truncate">{user.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                  ড্যাশবোর্ড
                </span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2 py-0.5 rounded ml-1 transition-colors"
                  title="অ্যাডমিন ড্যাশবোর্ড"
                >
                  প্যানেল
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-800 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span>লগইন</span>
              </Link>
              <Link
                href="/register"
                className="hidden md:inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95"
              >
                <span>নিবন্ধন</span>
              </Link>
            </div>
          )}

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
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-md px-4 py-4 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="উপজেলা, রক্তদাতা বা নাগরিক তথ্য খুঁজুন..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-2 top-2 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-1 rounded-md"
              >
                খুঁজুন
              </button>
            )}
          </form>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const isLast = idx === navLinks.length - 1 && navLinks.length % 2 !== 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium text-xs transition-all border ${
                    isLast ? 'col-span-2' : ''
                  } ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold shadow-2xs'
                      : 'bg-slate-50/80 hover:bg-emerald-50/80 text-slate-700 hover:text-emerald-700 border-slate-200/70'
                  }`}
                >
                  <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="truncate">{link.nameBn}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile User Profile / Login Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-xs">
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 min-w-0 group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block truncate group-hover:text-emerald-700">{user.name}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                      <span>আমার ড্যাশবোর্ড</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </Link>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                  >
                    ড্যাশবোর্ড
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                    >
                      প্যানেল
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold p-1.5 rounded-lg flex items-center"
                    title="লগআউট"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600 text-[11px]">আইডি যুক্ত করতে প্রবেশ করুন</span>
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>লগইন</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    নিবন্ধন
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/reports#submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ নাগরিক সমস্যা রিপোর্ট করুন</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
