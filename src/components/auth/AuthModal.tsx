'use client';

import React, { useState } from 'react';
import { X, Lock, User, Phone, Mail, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError('মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন');
      return;
    }

    setIsSubmitting(true);
    const res = await login(identifier, password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message || 'সফলভাবে লগইন হয়েছে!');
      setTimeout(() => {
        setSuccessMsg(null);
        closeAuthModal();
      }, 1000);
    } else {
      setError(res.message || 'লগইন ব্যর্থ হয়েছে');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !password) {
      setError('নাম, মোবাইল নম্বর ও পাসওয়ার্ড আবশ্যক');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      name,
      phone,
      email: email.trim() ? email.trim() : undefined,
      password,
      role
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message || 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      setTimeout(() => {
        setSuccessMsg(null);
        closeAuthModal();
      }, 1200);
    } else {
      setError(res.message || 'নিবন্ধন ব্যর্থ হয়েছে');
    }
  };

  const fillQuickDemo = (demoRole: 'admin' | 'user') => {
    setError(null);
    if (demoRole === 'admin') {
      setIdentifier('admin@kuriconnect.org');
      setPassword('admin123');
    } else {
      setIdentifier('01711111111');
      setPassword('user123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-bengali">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-200" />
            <h3 className="font-heading font-bold text-sm sm:text-base tracking-tight">
              {authModalTab === 'login' ? 'KuriConnect একাউন্টে প্রবেশ' : 'নতুন একাউন্ট নিবন্ধন'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setError(null);
              openAuthModal('login');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            লগইন (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              openAuthModal('register');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              authModalTab === 'register'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            নিবন্ধন (Register)
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials Helpers */}
          {authModalTab === 'login' && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 space-y-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>দ্রুত টেস্ট লগইন করুন (One-Click Demo):</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="flex-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 py-1.5 px-2 rounded-lg font-bold transition-all text-center"
                >
                  🛡️ অ্যাডমিন (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('user')}
                  className="flex-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 py-1.5 px-2 rounded-lg font-bold transition-all text-center"
                >
                  👤 সাধারণ নাগরিক (User)
                </button>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  মোবাইল নম্বর বা ইমেইল <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="যেমন: 01711111111 বা admin@kuriconnect.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  পাসওয়ার্ড <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  পুরো নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম লিখুন..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭১১-২২৩৩৪৪"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  অ্যাকাউন্টের ভূমিকা (Role) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-bold transition-all ${
                      role === 'user'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={() => setRole('user')}
                      className="hidden"
                    />
                    <span>👤 নাগরিক (User)</span>
                  </label>

                  <label
                    className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-bold transition-all ${
                      role === 'admin'
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      className="hidden"
                    />
                    <span>🛡️ প্রশাসক (Admin)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  পাসওয়ার্ড <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'নিবন্ধন করা হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-slate-500 text-[11px] border-t border-slate-100 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>লগইন থাকলে আপনার সকল আবেদন স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে ট্র্যাক হবে</span>
          </div>
        </div>
      </div>
    </div>
  );
}

