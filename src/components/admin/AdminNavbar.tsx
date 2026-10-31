'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin, AdminTab } from './AdminContext';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Plus,
  ExternalLink,
  ChevronDown,
  LogOut,
  Settings,
  FileText,
  X
} from 'lucide-react';

const TAB_TITLES: Record<AdminTab, string> = {
  overview: 'ড্যাশবোর্ড',
  news: 'সংবাদ',
  reports: 'নাগরিক রিপোর্ট',
  donors: 'রক্তদাতা',
  blood_requests: 'জরুরি রক্তের আবেদনসমূহ',
  lost_found: 'হারানো বিজ্ঞপ্তি',
  scams: 'প্রতারণা',
  facilities: 'হাসপাতাল',
  police: 'পুলিশ ও থানা',
  roles: 'পারমিশন',
  logs: 'অডিট লগ',
  settings: 'সেটিংস',
};

export default function AdminNavbar() {
  const {
    activeTab,
    setActiveTab,
    toggleMobileSidebar,
    searchQuery,
    setSearchQuery,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
    triggerAlert,
  } = useAdmin();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitle = TAB_TITLES[activeTab] || 'ড্যাশবোর্ড';

  const handleClearNotifications = () => {
    setUnreadNotificationsCount(0);
    triggerAlert('সব নোটিফিকেশন পঠিত।', 'info');
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6">
      {/* Left side: Hamburger and Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleMobileSidebar}
          className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md lg:hidden"
          title="মেনু"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-slate-900 truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Middle side: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="খুঁজুন..."
            className="w-full pl-8 pr-7 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('news')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors"
          title="নতুন সংবাদ"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">নতুন সংবাদ</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="নোটিফিকেশন"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">নোটিফিকেশন</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-[11px] text-emerald-700 hover:underline font-medium"
                  >
                    সব পঠিত
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div
                  onClick={() => {
                    setActiveTab('reports');
                    setNotificationsOpen(false);
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">নতুন নাগরিক রিপোর্ট জমা পড়েছে</p>
                    <span className="text-[10px] text-slate-400">১৫ মিনিট আগে</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('donors');
                    setNotificationsOpen(false);
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5"
                >
                  <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">১ জন রক্তদাতা যাচাইয়ের অপেক্ষায়</p>
                    <span className="text-[10px] text-slate-400">৪০ মিনিট আগে</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('logs');
                    setNotificationsOpen(false);
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer flex gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">সিস্টেম ব্যাকআপ সম্পন্ন</p>
                    <span className="text-[10px] text-slate-400">২ ঘণ্টা আগে</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
              A
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs py-1">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-800">সুপার অ্যাডমিন</p>
                <p className="text-[10px] text-slate-400">admin@kuriconnect.org</p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 text-left"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>সেটিংস</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('logs');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 text-left"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>লগস</span>
              </button>

              <div className="border-t border-slate-100 pt-1">
                <Link
                  href="/"
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>ওয়েবসাইট দেখুন</span>
                </Link>

                <button
                  onClick={() => {
                    triggerAlert('লগআউট করা হয়েছে।', 'info');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
