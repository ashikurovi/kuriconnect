'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Phone, User, Mail, CreditCard, ArrowRight, AlertCircle, CheckCircle2, Home, LogIn, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UPAZILAS } from '@/data/kurigramData';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nid, setNid] = useState('');
  const [email, setEmail] = useState('');
  const [jela, setJela] = useState('কুড়িগ্রাম');
  const [upazila, setUpazila] = useState('');
  const [union, setUnion] = useState('');
  const [gram, setGram] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedUpazilaObj = UPAZILAS.find((u) => u.nameBn === upazila || u.id === upazila);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !nid.trim() || !password) {
      setError('অনুগ্রহ করে নাম, মোবাইল নম্বর, NID নম্বর এবং পাসওয়ার্ড পূরণ করুন');
      return;
    }

    const cleanNid = nid.trim().replace(/[\s-]/g, '');
    if (cleanNid.length < 10) {
      setError('সঠিক জাতীয় পরিচয়পত্র (NID) নম্বর প্রদান করুন (১০, ১৩ বা ১৭ ডিজিট)');
      return;
    }

    if (password.length < 4) {
      setError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }

    setIsSubmitting(true);
    // Role is always default 'user'
    const res = await register({
      name: name.trim(),
      phone: phone.trim(),
      nid: cleanNid,
      email: email.trim() ? email.trim() : undefined,
      password,
      role: 'user',
      jela: jela.trim() || 'কুড়িগ্রাম',
      upazila: upazila.trim() || undefined,
      union: union.trim() || undefined,
      gram: gram.trim() || undefined
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('অভিনন্দন! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। অপেক্ষা করুন...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 900);
    } else {
      setError(res.message || 'নিবন্ধন সম্পন্ন করা যায়নি');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-bengali">
      <div className="w-full max-w-lg">
        {/* Register Card */}
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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">নাগরিক অ্যাকাউন্ট নিবন্ধন</h1>
            <p className="text-xs text-slate-500">
              জরুরি রক্তের আবেদন, হারানো বিজ্ঞপ্তি ও নাগরিক সমস্যা যুক্ত করতে অ্যাকাউন্ট তৈরি করুন
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

          {/* Form - Role is strictly default 'user', no role selector shown */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                আপনার পুরো নাম <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মোঃ কামরুল হাসান"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="০১৭১১-২২৩৩৪৪"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                জাতীয় পরিচয়পত্র নম্বর (NID) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="১০, ১৩ বা ১৭ ডিজিটের NID নম্বর"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                নাগরিক সেবা ও তথ্য ভেরিফিকেশনের জন্য NID নম্বর প্রদান বাধ্যতামূলক।
              </p>
            </div>

            {/* ঠিকানা (জেলা, উপজেলা, ইউনিয়ন, গ্রাম) */}
            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>আপনার ঠিকানা (জেলা, উপজেলা, ইউনিয়ন, গ্রাম)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    জেলা <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jela}
                    onChange={(e) => setJela(e.target.value)}
                    placeholder="যেমন: কুড়িগ্রাম"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    উপজেলা <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={upazila}
                    onChange={(e) => {
                      setUpazila(e.target.value);
                      setUnion('');
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  >
                    <option value="">-- উপজেলা নির্বাচন করুন --</option>
                    {UPAZILAS.map((u) => (
                      <option key={u.id} value={u.nameBn}>
                        {u.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ইউনিয়ন / পৌরসভা
                  </label>
                  {selectedUpazilaObj && selectedUpazilaObj.unions.length > 0 ? (
                    <select
                      value={union}
                      onChange={(e) => setUnion(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    >
                      <option value="">-- ইউনিয়ন নির্বাচন করুন --</option>
                      {selectedUpazilaObj.unions.map((un) => (
                        <option key={un} value={un}>
                          {un}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={union}
                      onChange={(e) => setUnion(e.target.value)}
                      placeholder="ইউনিয়ন / ওয়ার্ড"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    গ্রাম / এলাকা / মহল্লা
                  </label>
                  <input
                    type="text"
                    value={gram}
                    onChange={(e) => setGram(e.target.value)}
                    placeholder="যেমন: কলেজ মোড়, করিমের খামার"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                ইমেইল ঠিকানা (ঐচ্ছিক)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                পাসওয়ার্ড <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 text-emerald-800 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>আপনার তথ্যের শতভাগ নিরাপত্তা নিশ্চিত। অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে অ্যাক্টিভ হবে।</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-95"
            >
              <span>{isSubmitting ? 'নিবন্ধন করা হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
            <span className="text-slate-500">ইতিমধ্যে অ্যাকাউন্ট আছে?</span>
            <Link
              href="/login"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন করুন</span>
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

