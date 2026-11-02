'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminContext';
import { NEWS_ARTICLES, HEALTHCARE_FACILITIES, POLICE_CONTACTS, UPAZILAS } from '@/data/kurigramData';
import { CommunityReport, LostNotice, UpazilaId, BloodRequest, LOST_NOTICE_CATEGORIES, LOST_NOTICE_CATEGORY_LABELS } from '@/types';
import {
  Plus,
  Trash2,
  Phone,
  Eye,
  Check,
  Download,
  AlertTriangle,
  Send,
  BellRing,
  FileQuestion,
  Heart,
  Droplet,
  MapPin,
  Building2,
  Newspaper,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  RefreshCw,
  Activity,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { activeTab, setActiveTab, searchQuery, triggerAlert } = useAdmin();

  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [newsList, setNewsList] = useState(NEWS_ARTICLES);
  const [donorsList, setDonorsList] = useState<any[]>([]);
  const [bloodRequestsList, setBloodRequestsList] = useState<BloodRequest[]>([]);
  const [scamsList, setScamsList] = useState<any[]>([]);
  const [lostNotices, setLostNotices] = useState<LostNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('all');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>('all');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('all');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  const [requestGroupFilter, setRequestGroupFilter] = useState<string>('all');
  const [lostTypeFilter, setLostTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [lostCategoryFilter, setLostCategoryFilter] = useState<string>('all');
  const [lostStatusFilter, setLostStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');

  // Load data from APIs on component mount
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.allSettled([
        fetch('/api/reports')
          .then((r) => r.json())
          .then((d) => setReports(d.data ?? [])),
        fetch('/api/blood-donors?admin=true')
          .then((r) => r.json())
          .then((d) => setDonorsList(d.data ?? [])),
        fetch('/api/blood-requests')
          .then((r) => r.json())
          .then((d) => setBloodRequestsList(d.data ?? [])),
        fetch('/api/scam-alerts?admin=true')
          .then((r) => r.json())
          .then((d) => setScamsList(d.data ?? [])),
        fetch('/api/lost-notices')
          .then((r) => r.json())
          .then((d) => setLostNotices(d.data ?? []))
      ]);
    } catch {
      triggerAlert('ডাটা লোডে কিছু সমস্যা হয়েছে', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // News form
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newCategory, setNewCategory] = useState<'district' | 'upazila' | 'river-erosion' | 'agriculture' | 'education'>('district');

  // Scam form
  const [newScamTitle, setNewScamTitle] = useState('');
  const [newScamSeverity, setNewScamSeverity] = useState<'critical' | 'high' | 'medium'>('high');
  const [newScamSummary, setNewScamSummary] = useState('');

  // Lost Notice form
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeType, setNewNoticeType] = useState<'lost' | 'found'>('lost');
  const [newNoticeCategory, setNewNoticeCategory] = useState<LostNotice['category']>('document');
  const [newNoticeUpazila, setNewNoticeUpazila] = useState<UpazilaId>('kurigram-sadar');
  const [newNoticeContact, setNewNoticeContact] = useState('');
  const [newNoticePhone, setNewNoticePhone] = useState('');

  // Settings
  const [siteMaintenance, setSiteMaintenance] = useState(false);
  const [emergencyTicker, setEmergencyTicker] = useState('ধরলা ও দুধকুমার নদীর পানি বিপদসীমার নিচে প্রবাহিত হচ্ছে।');
  const [adminEmail, setAdminEmail] = useState('admin@kuriconnect.org');

  const updateReportStatus = async (id: string, newStatus: CommunityReport['status']) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: 'আজ' } : r))
        );
        triggerAlert('রিপোর্টের স্ট্যাটাস আপডেট হয়েছে।', 'success');
      } else {
        triggerAlert(data.message || 'আপডেট ব্যর্থ হয়েছে।', 'error');
      }
    } catch {
      triggerAlert('সার্ভার সংযোগ সমস্যা।', 'error');
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই রিপোর্টটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/reports', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        triggerAlert('রিপোর্ট মুছে ফেলা হয়েছে।', 'info');
      } else {
        triggerAlert(data.message || 'মুছে ফেলতে ব্যর্থ হয়েছে।', 'error');
      }
    } catch {
      triggerAlert('মুছে ফেলতে সমস্যা হয়েছে।', 'error');
    }
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleBn.trim()) return;
    const newArticle = {
      id: `news-${Date.now()}`,
      slug: `news-${Date.now()}`,
      titleBn: newTitleBn,
      titleEn: '',
      excerptBn: newTitleBn,
      contentBn: newTitleBn,
      category: newCategory,
      upazilaNameBn: 'কুড়িগ্রাম সদর',
      author: {
        nameBn: 'বার্তা বিভাগ',
        roleBn: 'মডারেটর'
      },
      publishedAt: 'আজ',
      readTimeMinutes: 3,
      featuredImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      source: 'KuriConnect',
      tags: ['সংবাদ']
    };
    setNewsList([newArticle, ...newsList]);
    setNewTitleBn('');
    triggerAlert('সংবাদ প্রকাশিত হয়েছে।', 'success');
  };

  const deleteNews = (id: string) => {
    if (confirm('সংবাদটি মুছে ফেলতে চান?')) {
      setNewsList(newsList.filter((n) => n.id !== id));
      triggerAlert('সংবাদ মুছে ফেলা হয়েছে।', 'info');
    }
  };

  const handleCreateScam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScamTitle.trim()) return;
    try {
      const res = await fetch('/api/scam-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleBn: newScamTitle,
          severity: newScamSeverity,
          summaryBn: newScamSummary || newScamTitle,
          detailsBn: newScamSummary,
          scamCategory: 'fake-jobs',
          scamCategoryLabelBn: 'প্রতারণা',
          isApproved: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setScamsList([data.data, ...scamsList]);
        setNewScamTitle('');
        setNewScamSummary('');
        triggerAlert('প্রতারণা সতর্কতা সফলভাবে জারি ও অনুমোদন হয়েছে।', 'success');
      }
    } catch {
      triggerAlert('প্রতারণা তথ্য যুক্ত করা যায়নি।', 'error');
    }
  };

  const toggleScamApproval = async (id: string, currentStatus?: boolean) => {
    try {
      const res = await fetch('/api/scam-alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setScamsList((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isApproved: !currentStatus } : s))
        );
        triggerAlert(!currentStatus ? 'সতর্কতা অনুমোদিত হয়েছে।' : 'সতর্কতা অনুমোদন স্থগিত করা হয়েছে।', 'success');
      }
    } catch {
      triggerAlert('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteScam = async (id: string) => {
    if (!confirm('প্রতারণা সতর্কতাটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/scam-alerts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setScamsList((prev) => prev.filter((s) => s.id !== id));
        triggerAlert('প্রতারণা সতর্কতা মুছে ফেলা হয়েছে।', 'info');
      }
    } catch {
      triggerAlert('মুছে ফেলতে সমস্যা হয়েছে।', 'error');
    }
  };

  const updateBloodRequestStatus = async (id: string, status: BloodRequest['status']) => {
    try {
      const res = await fetch('/api/blood-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setBloodRequestsList((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status } : req))
        );
        triggerAlert('রক্তের আবেদনের স্ট্যাটাস আপডেট হয়েছে।', 'success');
      }
    } catch {
      triggerAlert('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteBloodRequest = async (id: string) => {
    if (!confirm('আবেদনটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/blood-requests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setBloodRequestsList((prev) => prev.filter((r) => r.id !== id));
        triggerAlert('আবেদনটি মুছে ফেলা হয়েছে।', 'info');
      }
    } catch {
      triggerAlert('মুছে ফেলতে সমস্যা হয়েছে।', 'error');
    }
  };

  const toggleDonorVerification = async (id: string, currentStatus?: boolean) => {
    try {
      const res = await fetch('/api/blood-donors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setDonorsList((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isApproved: !currentStatus, verifiedDate: !currentStatus ? 'অনুমোদিত' : 'অপেক্ষমাণ' } : d))
        );
        triggerAlert(!currentStatus ? 'রক্তদাতা অনুমোদিত হয়েছে।' : 'রক্তদাতা অনুমোদন স্থগিত করা হয়েছে।', 'success');
      }
    } catch {
      triggerAlert('অনুমোদন স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteDonor = async (id: string) => {
    if (!confirm('রক্তদাতার তালিকা থেকে মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/blood-donors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setDonorsList((prev) => prev.filter((d) => d.id !== id));
        triggerAlert('রক্তদাতা মুছে ফেলা হয়েছে।', 'info');
      }
    } catch {
      triggerAlert('মুছে ফেলতে সমস্যা হয়েছে।', 'error');
    }
  };

  const toggleNoticeStatus = async (id: string) => {
    const notice = lostNotices.find((n) => n.id === id);
    if (!notice) return;
    const newStatus = notice.status === 'active' ? 'resolved' : 'active';
    try {
      const res = await fetch('/api/lost-notices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLostNotices((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
        );
        triggerAlert('বিজ্ঞপ্তির অবস্থা আপডেট হয়েছে।', 'success');
      }
    } catch {
      triggerAlert('আপডেট ব্যর্থ হয়েছে।', 'error');
    }
  };

  const deleteNotice = async (id: string) => {
    if (!confirm('বিজ্ঞপ্তিটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch('/api/lost-notices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setLostNotices((prev) => prev.filter((n) => n.id !== id));
        triggerAlert('বিজ্ঞপ্তি মুছে ফেলা হয়েছে।', 'info');
      }
    } catch {
      triggerAlert('মুছে ফেলতে সমস্যা হয়েছে।', 'error');
    }
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;
    const item: LostNotice = {
      id: `lost-${Date.now()}`,
      type: newNoticeType,
      category: newNoticeCategory,
      categoryLabelBn: LOST_NOTICE_CATEGORY_LABELS[newNoticeCategory] || 'অন্যান্য',
      titleBn: newNoticeTitle,
      descriptionBn: newNoticeTitle,
      upazilaId: newNoticeUpazila,
      upazilaNameBn: UPAZILAS.find((u) => u.id === newNoticeUpazila)?.nameBn || 'কুড়িগ্রাম সদর',
      locationDetailsBn: 'কুড়িগ্রাম সদর',
      date: 'আজ',
      contactName: newNoticeContact || 'প্রশাসক',
      contactPhone: newNoticePhone || '০১৭১০-০০০০০০',
      status: 'active'
    };
    setLostNotices([item, ...lostNotices]);
    setNewNoticeTitle('');
    setNewNoticeContact('');
    setNewNoticePhone('');
    triggerAlert('হারানো বিজ্ঞপ্তি যুক্ত হয়েছে।', 'success');
  };

  const q = searchQuery.toLowerCase().trim();

  const filteredNews = newsList.filter((n) => {
    const matchesSearch = !q || n.titleBn.toLowerCase().includes(q);
    const matchesCat = newsCategoryFilter === 'all' || n.category === newsCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredReports = reports.filter((r) => {
    const matchesSearch = !q || r.titleBn.toLowerCase().includes(q) || r.upazilaNameBn.toLowerCase().includes(q);
    const matchesStatus = reportStatusFilter === 'all' || r.status === reportStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDonors = donorsList.filter((d) => {
    const matchesSearch = !q || d.donorNameBn.toLowerCase().includes(q) || d.upazilaNameBn.toLowerCase().includes(q);
    const matchesGroup = bloodGroupFilter === 'all' || d.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesGroup;
  });

  const filteredBloodRequests = bloodRequestsList.filter((req) => {
    const matchesSearch =
      !q ||
      req.patientNameBn.toLowerCase().includes(q) ||
      req.hospitalNameBn.toLowerCase().includes(q) ||
      req.contactNumber.includes(q) ||
      req.upazilaNameBn.toLowerCase().includes(q) ||
      req.problemDescription.toLowerCase().includes(q);

    const matchesStatus = requestStatusFilter === 'all' || req.status === requestStatusFilter;
    const matchesGroup = requestGroupFilter === 'all' || req.bloodGroup === requestGroupFilter;

    return matchesSearch && matchesStatus && matchesGroup;
  });

  const filteredLostNotices = lostNotices.filter((n) => {
    const matchesSearch = !q || n.titleBn.toLowerCase().includes(q) || n.contactName.toLowerCase().includes(q);
    const matchesType = lostTypeFilter === 'all' || n.type === lostTypeFilter;
    const matchesStatus = lostStatusFilter === 'all' || n.status === lostStatusFilter;
    const matchesCategory = lostCategoryFilter === 'all' || n.category === lostCategoryFilter;
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const filteredScams = scamsList.filter((s) => !q || s.titleBn.toLowerCase().includes(q));
  const filteredFacilities = HEALTHCARE_FACILITIES.filter((f) => !q || f.nameBn.toLowerCase().includes(q) || f.upazilaNameBn.toLowerCase().includes(q));
  const filteredPolice = POLICE_CONTACTS.filter((p) => !q || p.officeNameBn.toLowerCase().includes(q) || p.upazilaNameBn.toLowerCase().includes(q));

  const pendingReportsCount = reports.filter((r) => r.status === 'submitted').length;
  const pendingDonorsCount = donorsList.filter((d) => !d.isApproved).length;
  const activeBloodRequestsCount = bloodRequestsList.filter((r) => r.status === 'approved').length;
  const activeLostCount = lostNotices.filter((n) => n.status === 'active').length;
  const pendingScamsCount = scamsList.filter((s) => !s.isApproved).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-bengali">
      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>সেন্ট্রাল অ্যাডমিন কন্ট্রোল রুম • কুড়িগ্রাম জেলা</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  স্বাগতম, অ্যাডমিন প্যানেলে
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  কুড়িগ্রাম জেলার নাগরিক সমস্যা, জরুরি রক্তের আবেদন, প্রতারণা প্রতিরোধ ও হারানো বিজ্ঞপ্তিসমূহ এখান থেকে সরাসরি পরিচালনা ও নিয়ন্ত্রণ করুন।
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                <button
                  onClick={loadDashboardData}
                  className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-600/60 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                  title="ডাটা রিফ্রেশ করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>ডাটা রিফ্রেশ</span>
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <span>মূল ওয়েবসাইট দেখুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 8 Modern KPI Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Upazilas */}
            <div className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">উপজেলা সংখ্যা</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">৯টি</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">কুড়িগ্রামের সকল উপজেলা</span>
              </div>
            </div>

            {/* Card 2: Reports */}
            <div
              onClick={() => setActiveTab('reports')}
              className="bg-white border border-slate-200/90 hover:border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">নাগরিক রিপোর্ট</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-amber-700">{reports.length}টি</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {pendingReportsCount > 0 ? (
                      <span className="text-amber-600 font-bold">({pendingReportsCount}টি অপেক্ষমাণ)</span>
                    ) : (
                      'সকল রিপোর্ট সমাধানকৃত'
                    )}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Card 3: Blood Donors */}
            <div
              onClick={() => setActiveTab('donors')}
              className="bg-white border border-slate-200/90 hover:border-rose-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">নিবন্ধিত রক্তদাতা</span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Droplet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-rose-700">{donorsList.length} জন</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {pendingDonorsCount > 0 ? (
                      <span className="text-amber-600 font-bold">({pendingDonorsCount} জন নতুন)</span>
                    ) : (
                      'সকলেই অনুমোদিত'
                    )}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Card 4: Emergency Blood Requests */}
            <div
              onClick={() => setActiveTab('blood_requests')}
              className="bg-white border border-slate-200/90 hover:border-red-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">রক্তের আবেদন</span>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 fill-red-100" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-red-700">{bloodRequestsList.length}টি</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    <span className="text-red-600 font-bold">{activeBloodRequestsCount}টি জরুরি প্রয়োজন</span>
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Card 5: Lost & Found */}
            <div
              onClick={() => setActiveTab('lost_found')}
              className="bg-white border border-slate-200/90 hover:border-teal-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">হারানো ও প্রাপ্তি</span>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileQuestion className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{lostNotices.length}টি</span>
                  <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">{activeLostCount}টি সন্ধান চলমান</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Card 6: Scam Alerts */}
            <div
              onClick={() => setActiveTab('scams')}
              className="bg-white border border-slate-200/90 hover:border-purple-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">প্রতারণা সতর্কতা</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-purple-900">{scamsList.length}টি</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {pendingScamsCount > 0 ? `${pendingScamsCount}টি অপেক্ষমাণ` : 'সতর্কতা সক্রিয়'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Card 7: News */}
            <div
              onClick={() => setActiveTab('news')}
              className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">সংবাদ ও বার্তা</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Newspaper className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{newsList.length}টি</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">প্রকাশিত জেলা খবর</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Card 8: Healthcare */}
            <div
              onClick={() => setActiveTab('facilities')}
              className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">স্বাস্থ্যসেবা কেন্দ্র</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{HEALTHCARE_FACILITIES.length}টি</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">হাসপাতাল ও ক্লিনিক</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('news')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সংবাদ লিখুন</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>রিপোর্ট পর্যালোচনা ({pendingReportsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('blood_requests')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>রক্তের আবেদন তদারকি ({activeBloodRequestsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('lost_found')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <FileQuestion className="w-4 h-4" />
              <span>হারানো বিজ্ঞপ্তি তালিকা</span>
            </button>
          </div>

          {/* Recent Reports & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reports Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="font-bold text-sm text-slate-900">সাম্প্রতিক নাগরিক সমস্যা</h2>
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
                >
                  <span>সবগুলো দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {reports.slice(0, 5).map((rep) => (
                  <div key={rep.id} className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition-colors px-2 rounded-xl">
                    <div className="min-w-0 space-y-0.5">
                      <span className="font-bold text-slate-900 block truncate">{rep.titleBn}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{rep.upazilaNameBn}</span>
                        <span>•</span>
                        <span>{rep.submittedAt}</span>
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0 border ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : rep.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {rep.status === 'resolved'
                        ? 'সমাধানকৃত'
                        : rep.status === 'in_progress'
                        ? 'চলমান'
                        : 'অপেক্ষমাণ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Audit / Status Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <h2 className="font-bold text-sm text-slate-900">অ্যাডমিন অডিট লগ ও কার্যকলাপ</h2>
                </div>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
                >
                  <span>সব লগ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 mt-3 text-xs">
                {[
                  { time: '০৯:৪৫', actor: 'Admin', action: 'STATUS_UPDATE', detail: 'রিপোর্ট #rep-1 স্ট্যাটাস আপডেট' },
                  { time: '০৮:২২', actor: 'Editor', action: 'NEWS_PUBLISH', detail: 'নতুন জেলা সংবাদ প্রকাশ' },
                  { time: 'গতকাল', actor: 'Moderator', action: 'DONOR_VERIFY', detail: 'রক্তদাতা প্রোফাইল যাচাইকৃত' },
                  { time: 'গতকাল', actor: 'System', action: 'DB_SYNC', detail: 'Neon ডাটাবেজ অটো-সিঙ্ক সম্পন্ন' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100/90 rounded-xl text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] text-slate-400 font-mono">{item.time}</span>
                      <span className="font-bold text-slate-800 text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">{item.actor}</span>
                      <span className="text-slate-600 truncate text-[11px]">{item.detail}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: NEWS */}
      {/* ======================================================== */}
      {activeTab === 'news' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Create News Form */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <h2 className="font-bold text-sm text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>নতুন সংবাদ প্রকাশ</span>
            </h2>

            <form onSubmit={handleCreateNews} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    required
                    value={newTitleBn}
                    onChange={(e) => setNewTitleBn(e.target.value)}
                    placeholder="সংবাদের আকর্ষণীয় শিরোনাম..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="district">জেলা সংক্রান্ত</option>
                    <option value="upazila">উপজেলা</option>
                    <option value="river-erosion">নদীভাঙন ও বন্যা</option>
                    <option value="agriculture">কৃষি ও অর্থনীতি</option>
                    <option value="education">শিক্ষা ও সংস্কৃতি</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>সংবাদ প্রকাশ করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* News List */}
          <div className="space-y-3">
            {filteredNews.map((article) => (
              <div key={article.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{article.publishedAt}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{article.titleBn}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{article.excerptBn}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => deleteNews(article.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors"
                    title="সংবাদ মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: REPORTS */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Header & Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="font-bold text-sm text-slate-900">নাগরিক সমস্যা ও অভিযোগসমূহ</h2>
                <p className="text-xs text-slate-500">কুড়িগ্রামের বিভিন্ন এলাকা থেকে নাগরিকগণের জমা দেওয়া অভিযোগ</p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'সকল রিপোর্ট' },
                { id: 'submitted', label: 'অপেক্ষমাণ' },
                { id: 'under_review', label: 'তদন্তাধীন' },
                { id: 'in_progress', label: 'চলমান' },
                { id: 'resolved', label: 'সমাধানকৃত' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setReportStatusFilter(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reportStatusFilter === item.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Modern Cards */}
          <div className="space-y-3.5">
            {filteredReports.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-800">কোনো রিপোর্ট পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400 mt-0.5">ফিল্টার পরিবর্তন করে দেখুন।</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3 ${
                    report.status === 'resolved'
                      ? 'border-emerald-200/80 bg-gradient-to-r from-emerald-50/20 to-white'
                      : report.status === 'in_progress'
                      ? 'border-blue-200/80 bg-gradient-to-r from-blue-50/20 to-white'
                      : 'border-amber-200/80 bg-gradient-to-r from-amber-50/20 to-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{report.upazilaNameBn}</span>
                        </span>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                          report.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : report.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {report.status === 'resolved' ? '✓ সমাধানকৃত' : report.status === 'in_progress' ? '⏳ চলমান' : '📋 অপেক্ষমাণ (Submitted)'}
                        </span>

                        <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>সমর্থন: {report.upvotesCount || 1}</span>
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {report.submittedAt}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 mt-1">{report.titleBn}</h3>
                    </div>

                    {/* Status Changer & Delete Action */}
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <select
                        value={report.status}
                        onChange={(e) => updateReportStatus(report.id, e.target.value as CommunityReport['status'])}
                        className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-600 bg-white shadow-2xs"
                      >
                        <option value="submitted">অপেক্ষমাণ (Submitted)</option>
                        <option value="under_review">তদন্তাধীন (Under Review)</option>
                        <option value="in_progress">চলমান (In Progress)</option>
                        <option value="resolved">সমাধানকৃত (Resolved)</option>
                      </select>

                      <button
                        onClick={() => deleteReport(report.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors"
                        title="রিপোর্টটি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/80 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
                    {report.descriptionBn}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-medium">স্থান: {report.locationDetailsBn || report.upazilaNameBn}</span>
                    {report.userId && (
                      <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        ইউজার আইডি: {report.userId}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DONORS */}
      {/* ======================================================== */}
      {activeTab === 'donors' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Header & Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
              <div>
                <h2 className="font-bold text-sm text-slate-900">নিবন্ধিত রক্তদাতাবৃন্দ ({donorsList.length} জন)</h2>
                <p className="text-xs text-slate-500">ওটিপি যাচাইকৃত রক্তদাতা তালিকা ও পরিচালনা</p>
              </div>
            </div>

            {/* Blood Group Filter */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {['all', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((grp) => (
                <button
                  key={grp}
                  onClick={() => setBloodGroupFilter(grp)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    bloodGroupFilter === grp
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grp === 'all' ? 'সকল' : grp}
                </button>
              ))}
            </div>
          </div>

          {/* Donors Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredDonors.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500">
                <Droplet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-800">কোনো রক্তদাতা পাওয়া যায়নি</p>
              </div>
            ) : (
              filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white border border-slate-200/90 hover:border-rose-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Blood Group Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white font-black text-base flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <Droplet className="w-3.5 h-3.5 fill-white mb-0.5" />
                      <span>{donor.bloodGroup}</span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-sm text-slate-900 truncate">{donor.donorNameBn}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                            donor.isApproved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {donor.isApproved ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{donor.upazilaNameBn}</span>
                        {donor.areaBn && <span>• {donor.areaBn}</span>}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-600">
                        <a
                          href={`tel:${donor.contactNumberMasked || donor.phone}`}
                          className="inline-flex items-center gap-1 text-slate-800 hover:text-rose-600 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{donor.phone || donor.contactNumberMasked}</span>
                        </a>
                        {donor.lastDonationDate && (
                          <span className="text-[11px] text-slate-400">শেষ দান: {donor.lastDonationDate}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">মোট দান: {donor.totalDonationsCount || 1} বার</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDonorVerification(donor.id, donor.isApproved)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          donor.isApproved
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{donor.isApproved ? 'অনুমোদন বাতিল' : 'অনুমোদন দিন'}</span>
                      </button>

                      <button
                        onClick={() => deleteDonor(donor.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors"
                        title="রক্তদাতা মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: EMERGENCY BLOOD REQUESTS */}
      {/* ======================================================== */}
      {activeTab === 'blood_requests' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Header & Metrics Strip */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">
                    জরুরি রক্তের আবেদনসমূহ ({bloodRequestsList.length}টি)
                  </h2>
                  <p className="text-xs text-slate-500">রোগীর রক্তের প্রয়োজন, হাসপাতালের বিবরণ ও সরাসরি স্ট্যাটাস ব্যবস্থাপনা</p>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-600 mr-1">রক্তের গ্রুপ:</span>
                {['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <button
                    key={group}
                    onClick={() => setRequestGroupFilter(group)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      requestGroupFilter === group
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {group === 'all' ? 'সকল' : group}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-60">
                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-600"
                >
                  <option value="all">সকল অবস্থা</option>
                  <option value="approved">অনুমোদিত ও খোঁজা হচ্ছে (Active)</option>
                  <option value="managed">রক্ত সংগ্রহ সম্পন্ন (Managed)</option>
                  <option value="pending">অপেক্ষমাণ (Pending)</option>
                  <option value="cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-3.5">
            {filteredBloodRequests.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500">
                <Heart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-800">কোনো রক্তের আবেদন পাওয়া যায়নি</p>
              </div>
            ) : (
              filteredBloodRequests.map((req) => (
                <div key={req.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">{req.patientNameBn}</h3>
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            {req.bagsNeeded} ব্যাগ প্রয়োজন
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{req.hospitalNameBn} ({req.upazilaNameBn})</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Selector & Actions */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <select
                        value={req.status}
                        onChange={(e) => updateBloodRequestStatus(req.id, e.target.value as BloodRequest['status'])}
                        className={`border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer ${
                          req.status === 'managed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : req.status === 'approved'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : req.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="approved">✓ সক্রিয় ও অনুমোদিত (Active)</option>
                        <option value="managed">✓ রক্ত সংগ্রহ সম্পন্ন (Managed)</option>
                        <option value="pending">⏳ অপেক্ষমাণ (Pending)</option>
                        <option value="cancelled">✕ বাতিল (Cancelled)</option>
                      </select>

                      <a
                        href={`tel:${req.contactNumber}`}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                        title="সরাসরি কল দিন"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => deleteBloodRequest(req.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors"
                        title="আবেদনটি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <p className="text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">রোগীর সমস্যা:</strong> {req.problemDescription}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-1.5 border-t border-slate-200/60 text-[11px]">
                      <span className="font-mono text-slate-900 font-bold">যোগাযোগ: {req.contactNumber}</span>
                      <span>প্রয়োজনের সময়: <strong className="text-rose-700">{req.urgencyDate}</strong></span>
                      <span className="text-slate-400">আইডি: {req.id}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: LOST & FOUND */}
      {/* ======================================================== */}
      {activeTab === 'lost_found' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Quick Create Notice Form */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <h2 className="font-bold text-sm text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-teal-600" />
              <span>নতুন হারানো বা প্রাপ্তি বিজ্ঞপ্তি প্রকাশ</span>
            </h2>

            <form onSubmit={handleCreateNotice} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="বিজ্ঞপ্তির শিরোনাম (যেমন: মানিব্যাগ হারানো)..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <select
                    value={newNoticeType}
                    onChange={(e) => setNewNoticeType(e.target.value as 'lost' | 'found')}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="lost">হারানো (Lost)</option>
                    <option value="found">প্রাপ্তি (Found)</option>
                  </select>
                </div>
                <div>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as LostNotice['category'])}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="person">নিখোঁজ ব্যক্তি</option>
                    <option value="document">আইডি কার্ড ও সনদ</option>
                    <option value="vehicle">যানবাহন ও সাইকেল</option>
                    <option value="valuable">মোবাইল ও মূল্যবান জিনিস</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newNoticeContact}
                  onChange={(e) => setNewNoticeContact(e.target.value)}
                  placeholder="যোগাযোগকারীর নাম..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
                />
                <input
                  type="text"
                  value={newNoticePhone}
                  onChange={(e) => setNewNoticePhone(e.target.value)}
                  placeholder="মোবাইল নম্বর..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
                />
                <select
                  value={newNoticeUpazila}
                  onChange={(e) => setNewNoticeUpazila(e.target.value as UpazilaId)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>বিজ্ঞপ্তি প্রকাশ</span>
                </button>
              </div>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: 'সকল' },
                { id: 'lost', label: 'হারানো' },
                { id: 'found', label: 'প্রাপ্তি' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLostTypeFilter(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    lostTypeFilter === t.id
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}

              <span className="text-slate-300">|</span>

              <select
                value={lostCategoryFilter}
                onChange={(e) => setLostCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                {LOST_NOTICE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.labelBn}
                  </option>
                ))}
              </select>

              <span className="text-slate-300">|</span>

              {[
                { id: 'all', label: 'সব অবস্থা' },
                { id: 'active', label: 'চলমান' },
                { id: 'resolved', label: 'সমাধানকৃত' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setLostStatusFilter(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    lostStatusFilter === s.id
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-600">মোট: {filteredLostNotices.length}টি</span>
          </div>

          {/* Notices Cards */}
          <div className="space-y-3.5">
            {filteredLostNotices.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500">
                <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-800">কোনো বিজ্ঞপ্তি নেই</p>
              </div>
            ) : (
              filteredLostNotices.map((notice) => (
                <div key={notice.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          notice.type === 'lost'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-teal-100 text-teal-800 border-teal-200'
                        }`}
                      >
                        {notice.type === 'lost' ? 'হারানো' : 'প্রাপ্তি'}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold border border-slate-200">
                        {LOST_NOTICE_CATEGORY_LABELS[notice.category] || notice.categoryLabelBn || 'অন্যান্য'}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{notice.titleBn}</h3>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>স্থান: {notice.upazilaNameBn}</span>
                      <span>•</span>
                      <span>যোগাযোগ: <strong>{notice.contactName}</strong> ({notice.contactPhone})</span>
                      <span>•</span>
                      <span>{notice.date}</span>
                    </p>

                    {/* Image Thumbnails Gallery */}
                    {notice.images && notice.images.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        {notice.images.map((img, idx) => (
                          <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                            <img
                              src={img}
                              alt="সংযুক্ত ছবি"
                              className="w-12 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs hover:scale-105 transition-transform"
                            />
                          </a>
                        ))}
                        <span className="text-[11px] text-slate-400 font-medium">({notice.images.length}টি ছবি)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <button
                      onClick={() => toggleNoticeStatus(notice.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        notice.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{notice.status === 'resolved' ? '✓ সমাধানকৃত' : '⏳ চলমান'}</span>
                    </button>

                    <Link
                      href="/lost-and-found"
                      target="_blank"
                      className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      title="পাবলিক পেজে দেখুন"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: SCAMS */}
      {/* ======================================================== */}
      {activeTab === 'scams' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <h2 className="font-bold text-sm text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              <span>নতুন প্রতারণা সংক্রান্ত অ্যালার্ট জারি</span>
            </h2>

            <form onSubmit={handleCreateScam} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    value={newScamTitle}
                    onChange={(e) => setNewScamTitle(e.target.value)}
                    placeholder="প্রতারণার শিরোনাম..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <select
                    value={newScamSeverity}
                    onChange={(e) => setNewScamSeverity(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 bg-white font-bold"
                  >
                    <option value="critical">গুরুত্বপূর্ণ (Critical)</option>
                    <option value="high">উচ্চ ঝুঁকি (High)</option>
                    <option value="medium">মাঝারি (Medium)</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={2}
                value={newScamSummary}
                onChange={(e) => setNewScamSummary(e.target.value)}
                placeholder="প্রতারণার বিস্তারিত বিবরণ ও সতর্কবার্তা..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>সতর্কবার্তা জারি করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredScams.map((scam) => (
              <div key={scam.id} className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2 text-xs hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{scam.titleBn}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      scam.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      ঝুঁকি: {scam.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        scam.isApproved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {scam.isApproved ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                    </span>

                    <button
                      onClick={() => toggleScamApproval(scam.id, scam.isApproved)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                        scam.isApproved
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {scam.isApproved ? 'অনুমোদন বাতিল' : 'অনুমোদন দিন'}
                    </button>

                    <button
                      onClick={() => deleteScam(scam.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">{scam.summaryBn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: HEALTHCARE */}
      {/* ======================================================== */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs animate-in fade-in duration-200">
          {filteredFacilities.map((facility) => (
            <div key={facility.id} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-slate-900">{facility.nameBn}</h3>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{facility.upazilaNameBn}</span>
                </p>
              </div>
              <a
                href={`tel:${facility.emergencyPhone}`}
                className="text-slate-800 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{facility.emergencyPhone}</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: POLICE */}
      {/* ======================================================== */}
      {activeTab === 'police' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs animate-in fade-in duration-200">
          {filteredPolice.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-slate-900">{item.officeNameBn}</h3>
                <p className="text-slate-500">{item.designationBn} • {item.upazilaNameBn}</p>
              </div>
              <a
                href={`tel:${item.phone}`}
                className="text-slate-800 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.phone}</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 10: ROLES */}
      {/* ======================================================== */}
      {activeTab === 'roles' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs text-xs animate-in fade-in duration-200">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 font-bold">
              <tr>
                <th className="p-4">ভূমিকা (Role)</th>
                <th className="p-4">দায়িত্ব ও এরিয়া</th>
                <th className="p-4 text-right">অনুমতি লেভেল</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { role: 'Super Admin', scope: 'সম্পূর্ণ সিস্টেম ও সেটিংস', level: 'Full Access' },
                { role: 'Editor', scope: 'সংবাদ প্রকাশ ও সম্পাদনা', level: 'Content' },
                { role: 'Moderator', scope: 'নাগরিক রিপোর্ট ও রক্তদাতা যাচাই', level: 'Moderate' },
                { role: 'Directory Manager', scope: 'হাসপাতাল ও পুলিশ নম্বর', level: 'Directory' },
                { role: 'Reporter', scope: 'খসড়া সংবাদ জমা', level: 'Draft' },
              ].map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{r.role}</td>
                  <td className="p-4 text-slate-600">{r.scope}</td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-bold">
                      {r.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 11: LOGS */}
      {/* ======================================================== */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-900">অডিট ইতিহাস ও কার্যকলাপ লগ</span>
            <button
              onClick={() => triggerAlert('লগ ফাইল ডাউনলোড প্রস্তুত।', 'info')}
              className="text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>এক্সপোর্ট লগ</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { time: '2026-10-31 09:45', actor: 'SuperAdmin', action: 'STATUS_UPDATE', detail: 'Report #rep-1 স্ট্যাটাস পরিবর্তন' },
              { time: '2026-10-31 08:22', actor: 'Editor_Shafiq', action: 'ARTICLE_PUBLISH', detail: 'নতুন জেলা সংবাদ প্রকাশ' },
              { time: '2026-10-30 19:10', actor: 'Moderator_Aziz', action: 'DONOR_VERIFY', detail: 'রক্তদাতা প্রোফাইল ভেরিফাই' },
              { time: '2026-10-30 14:05', actor: 'DirManager_Hasan', action: 'HOSPITAL_AUDIT', detail: 'সদর হাসপাতাল তথ্য যাচাই' },
              { time: '2026-10-29 09:15', actor: 'SystemScheduler', action: 'AUTO_BACKUP', detail: 'ডাটাবেজ ব্যাকআপ সম্পন্ন' }
            ].map((log, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                <span className="text-slate-400 font-mono text-[11px]">{log.time}</span>
                <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{log.actor}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{log.action}</span>
                <span className="text-slate-600 flex-1 text-right truncate">{log.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 12: SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5 max-w-xl animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <label className="font-bold text-xs text-slate-800 block">জরুরি নোটিশ ব্যানার টেক্সট</label>
            <input
              type="text"
              value={emergencyTicker}
              onChange={(e) => setEmergencyTicker(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-xs text-slate-800 block">অ্যাডমিন ইমেইল</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">ওয়েবসাইট রক্ষণাবেক্ষণ মোড</span>
              <span className="text-[11px] text-slate-500">চালু থাকলে সাধারণ ভিজিটরদের নোটিশ দেখানো হবে</span>
            </div>
            <button
              onClick={() => {
                setSiteMaintenance(!siteMaintenance);
                triggerAlert(`মেইনটেন্যান্স মোড ${!siteMaintenance ? 'চালু' : 'বন্ধ'}।`, 'info');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                siteMaintenance ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {siteMaintenance ? 'চালু আছে' : 'বন্ধ'}
            </button>
          </div>

          <button
            onClick={() => triggerAlert('সেটিংস সফলভাবে সংরক্ষিত হয়েছে।', 'success')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            পরিবর্তন সংরক্ষণ করুন
          </button>
        </div>
      )}
    </div>
  );
}
