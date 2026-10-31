'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Phone, ArrowRight, AlertCircle, CheckCircle2, Home, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError('মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড লিখুন');
      return;
    }

    setIsSubmitting(true);
    const res = await login(identifier, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      setSuccessMsg('সফলভাবে লগইন হয়েছে! অপেক্ষা করুন...');
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 800);
    } else {
      setError(res.message || 'মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-bengali">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                <Image
                  src="/logo.png"
                  alt="KuriConnect Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">KuriConnect</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">অ্যাকাউন্টে লগইন করুন</h1>
            <p className="text-xs text-slate-500">
              রক্তের আবেদন, হারানো বিজ্ঞপ্তি ও নাগরিক সমস্যা জানাতে আপনার অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                মোবাইল নম্বর বা ইমেইল <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="যেমন: 01711111111 বা admin@kuriconnect.org"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">
                  পাসওয়ার্ড <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-95"
            >
              <span>{isSubmitting ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
            <span className="text-slate-500">অ্যাকাউন্ট নেই?</span>
            <Link
              href="/register"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>নতুন অ্যাকাউন্ট নিবন্ধন করুন</span>
            </Link>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>হোমপেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

