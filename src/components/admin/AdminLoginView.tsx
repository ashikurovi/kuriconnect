'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function AdminLoginView() {
  const { user, login, logout } = useAuth();
  const [identifier, setIdentifier] = useState('kuriconnect@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড উভয়ই পূরণ করুন।');
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(identifier.trim(), password);
      if (!res.success) {
        setErrorMessage(res.message || 'ভুল ইমেইল বা পাসওয়ার্ড। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।');
      } else if (res.user?.role !== 'admin') {
        setErrorMessage('এই একাউন্টটির প্রশাসনিক (Admin) এক্সেস অনুমতি নেই। শুধুমাত্র অনুমোদিত অ্যাডমিন একাউন্ট দিয়ে লগইন করুন।');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e17] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-bengali">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Website link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>মূল ওয়েবসাইটে ফিরে যান</span>
        </Link>
        <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
          প্রশাসনিক পোর্টাল
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0b131f] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-900/30 mb-3">
            <div className="w-full h-full bg-[#070e17] rounded-[14px] flex items-center justify-center text-emerald-400">
              <Shield className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            KuriConnect অ্যাডমিন কন্ট্রোল প্যানেল
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            কুড়িগ্রাম জেলা ডিজিটাল প্ল্যাটফর্মের তথ্য ও সেবা ব্যবস্থাপনা পোর্টাল
          </p>
        </div>

        {/* Regular user warning banner if logged in as citizen */}
        {user && user.role !== 'admin' && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">নাগরিক একাউন্ট সনাক্ত হয়েছে</p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  আপনি বর্তমানে সাধারণ ব্যবহারকারী হিসেবে লগইন আছেন ({user.name})। অ্যাডমিন প্যানেলে প্রবেশের জন্য অ্যাডমিন ক্রেডেনশিয়াল ব্যবহার করুন।
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full py-1 text-center bg-amber-900/60 hover:bg-amber-800/60 text-amber-100 rounded text-[11px] font-medium transition-colors"
            >
              বর্তমান সেশন থেকে লগআউট করুন
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              অ্যাডমিন ইমেইল / ব্যবহারকারী
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="kuriconnect@gmail.com"
                required
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#070e17] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                গোপন পাসওয়ার্ড
              </label>
              <span className="text-[11px] text-slate-500">সুরক্ষিত সংযোগ</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                required
                className="w-full pl-9 pr-10 py-2.5 bg-[#070e17] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                title={showPassword ? 'লুকান' : 'দেখুন'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
              </>
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" />
          <span>২৫৬-বিট এনক্রিপ্টেড প্রশাসনিক সুরক্ষা</span>
        </div>
      </div>
    </div>
  );
}

