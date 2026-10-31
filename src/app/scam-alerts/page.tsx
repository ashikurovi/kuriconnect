'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { ScamAlert } from '@/types';
import ScamAlertModal from '@/components/ScamAlertModal';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  PhoneCall,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  Upload,
  Image as ImageIcon,
  Trash2,
  Building,
  User,
  X,
  Phone
} from 'lucide-react';

export default function ScamAlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alerts, setAlerts] = useState<ScamAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for suspicious scam report
  const [titleBn, setTitleBn] = useState('');
  const [scamCategory, setScamCategory] = useState<string>('fake-jobs');
  const [targetType, setTargetType] = useState<'individual' | 'company'>('individual');
  const [suspectName, setSuspectName] = useState('');
  const [suspectContact, setSuspectContact] = useState('');
  const [detailsBn, setDetailsBn] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAlerts = () => {
    fetch('/api/scam-alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAlerts(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) =>
    alert.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.summaryBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.detailsBn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Multi-image upload via Base64 (max 4 images)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 4 - images.length;
    const fileList = Array.from(files).slice(0, remainingSlots);

    fileList.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} ফাইলটি ২MB-এর বেশি। অনুগ্রহ করে ছোট আকারের ছবি নির্বাচন করুন।`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReportScam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !detailsBn.trim()) {
      alert('অনুগ্রহ করে শিরোনাম এবং বিস্তারিত বিবরণ লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryLabelMap: Record<string, string> = {
        'fake-jobs': 'ভুয়া নিয়োগ প্রতারণা',
        'microcredit-fraud': 'এনজিও বা ঋণের কিস্তি প্রতারণা',
        'land-char-compensation': 'জমি বা ক্ষতিপূরণ সংক্রান্ত ফাঁদ',
        'online-shopping': 'অনলাইন শপিং প্রতারণা',
        'lottery-sms': 'লটারি বা ওটিপি প্রতারণা',
        'visa-fraud': 'ভিসা বা পাসপোর্ট প্রতারণা',
        'impersonation': 'প্রশাসনিক কর্মকর্তা পরিচয় প্রতারণা',
        'other': 'সাধারণ প্রতারণা'
      };

      const res = await fetch('/api/scam-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleBn,
          summaryBn: detailsBn.slice(0, 150),
          detailsBn,
          scamCategory,
          scamCategoryLabelBn: categoryLabelMap[scamCategory] || 'প্রতারণা সতর্কতা',
          targetType,
          suspectName,
          suspectContact,
          images,
          severity: 'high',
          isApproved: false // Submitted by citizen -> needs admin approval
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitting(false);
        setReportSuccess(true);
        setTimeout(() => {
          setReportSuccess(false);
          setTitleBn('');
          setSuspectName('');
          setSuspectContact('');
          setDetailsBn('');
          setImages([]);
          setReportModalOpen(false);
        }, 2500);
      } else {
        alert(data.message || 'রিপোর্ট জমা দিতে সমস্যা হয়েছে');
        setIsSubmitting(false);
      }
    } catch {
      alert('সার্ভার ত্রুটি');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-bengali">
      {/* Breadcrumb & Header */}
      <div className="border-b border-[#e7e3db] pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">প্রতারণা ও প্রতারক চক্র সতর্কতা</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1d1f] tracking-tight">
              কুড়িগ্রাম জেলা প্রতারণা সতর্কতা ও সাইবার সচেতনতা বাতায়ন
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              স্থলবন্দরের ভুয়া নিয়োগ, চরাঞ্চলের ভুয়া পুনর্বাসন অনুদান ও ফেসবুক শপিং ফাঁদ সম্পর্কে সচেতন থাকুন।
            </p>
          </div>
          <button
            onClick={() => setReportModalOpen(true)}
            className="self-start sm:self-auto bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>সন্দেহভাজন প্রতারণার তথ্য জানান</span>
          </button>
        </div>
      </div>

      {/* Legal & Neutrality Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-amber-900 block">
            সচেতনতামূলক তথ্যের আইনি অবস্থান ও সতর্কতা নীতি:
          </strong>
          <p className="leading-relaxed text-amber-800">
            এখানে প্রকাশিত সতর্কবার্তাগুলো জেলা প্রশাসন, পুলিশ বিভাগ ও স্থলবন্দর কর্তৃপক্ষের আনুষ্ঠানিক নির্দেশনার আলোকে জনস্বার্থে প্রচারিত। তদন্ত সাপেক্ষ অভিযোগ ও আইনানুগ সিদ্ধান্তের মধ্যে পার্থক্য বজায় রাখা হয়। ব্যক্তিগত প্রতিহিংসা বা ভিত্তিহীন অভিযোগ এখানে প্রশ্রয় দেওয়া হয় না।
          </p>
        </div>
      </div>

      {/* Cyber Crime Helpline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e7e3db] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-900 block">সাইবার পুলিশ হটলাইন (সিআইডি)</span>
            <span className="text-xs text-gray-500">২৪/৭ অনলাইন প্রতারণা ও হয়রানি সাপোর্ট</span>
          </div>
          <a
            href="tel:01320010148"
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>০১৩২০-০১০১৪৮</span>
          </a>
        </div>

        <div className="bg-white border border-[#e7e3db] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-900 block">জাতীয় জরুরি সেবা</span>
            <span className="text-xs text-gray-500">পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস</span>
          </div>
          <a
            href="tel:999"
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>৯৯৯</span>
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#e7e3db] rounded-xl p-4 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রতারণার ধরন বা কীওয়ার্ড দিয়ে খুঁজুন (যেমন: সোনাহাট স্থলবন্দর, অনুদান, নিয়োগ)..."
            className="w-full bg-[#faf8f5] border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#14532d]"
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white border border-[#e7e3db] rounded-xl p-5 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                  {alert.scamCategoryLabelBn}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {alert.severity === 'critical' ? '🔴 অতি জরুরি' : '⚠️ উচ্চ সতর্কতা'}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900 leading-snug mb-2">
                {alert.titleBn}
              </h3>

              {alert.suspectName && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2.5 text-xs space-y-1">
                  <p className="font-medium text-slate-800">
                    <span className="text-slate-500">প্রতারক / অভিযুক্ত:</span> {alert.suspectName} ({alert.targetType === 'company' ? 'প্রতিষ্ঠান / চক্র' : 'ব্যক্তি'})
                  </p>
                  {alert.suspectContact && (
                    <p className="text-slate-600 text-[11px] font-mono">
                      যোগাযোগ / পেজ: {alert.suspectContact}
                    </p>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                {alert.summaryBn}
              </p>

              {alert.detailsBn && (
                <p className="text-xs text-gray-600 leading-relaxed bg-[#faf8f5] p-3 rounded-lg border border-gray-200 mb-3">
                  {alert.detailsBn}
                </p>
              )}

              {/* Multi-images if attached */}
              {alert.images && alert.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {alert.images.map((img, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={img} alt={`প্রমাণ স্ক্রিনশট ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Prevention Tips */}
              {alert.preventionTipsBn && alert.preventionTipsBn.length > 0 && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-xs space-y-1.5 mb-3">
                  <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>প্রতারণা এড়াতে করণীয় ও সতর্কতা:</span>
                  </span>
                  <ul className="space-y-1 text-emerald-950 text-[11px] pl-1">
                    {alert.preventionTipsBn.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>যাচাইকারী: {alert.verifiedBy}</span>
              <span>তারিখ: {alert.publishedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🛡️ Report Suspicious Activity Modal */}
      <ScamAlertModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccess={fetchAlerts}
      />
    </div>
  );
}
