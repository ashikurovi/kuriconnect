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
  Heart
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { activeTab, setActiveTab, searchQuery, triggerAlert } = useAdmin();

  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [newsList, setNewsList] = useState(NEWS_ARTICLES);
  const [donorsList, setDonorsList] = useState<any[]>([]);
  const [bloodRequestsList, setBloodRequestsList] = useState<BloodRequest[]>([]);
  const [scamsList, setScamsList] = useState<any[]>([]);
  const [lostNotices, setLostNotices] = useState<LostNotice[]>([]);

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
  useEffect(() => {
    // Reports
    fetch('/api/reports')
      .then((r) => r.json())
      .then((d) => setReports(d.data ?? []))
      .catch(() => triggerAlert('রিপোর্ট লোডে ত্রুটি', 'error'));

    // Blood donors (Admin sees all donors, including pending)
    fetch('/api/blood-donors?admin=true')
      .then((r) => r.json())
      .then((d) => setDonorsList(d.data ?? []))
      .catch(() => triggerAlert('রক্তদাতা লোডে ত্রুটি', 'error'));

    // Blood requests (জরুরি রক্তের আবেদন)
    fetch('/api/blood-requests')
      .then((r) => r.json())
      .then((d) => setBloodRequestsList(d.data ?? []))
      .catch(() => triggerAlert('রক্তের আবেদন লোডে ত্রুটি', 'error'));

    // Scam alerts (Admin sees all scams, including pending)
    fetch('/api/scam-alerts?admin=true')
      .then((r) => r.json())
      .then((d) => setScamsList(d.data ?? []))
      .catch(() => triggerAlert('প্রতারণা লোডে ত্রুটি', 'error'));

    // Lost & Found notices
    fetch('/api/lost-notices')
      .then((r) => r.json())
      .then((d) => setLostNotices(d.data ?? []))
      .catch(() => triggerAlert('বিজ্ঞপ্তি লোডে ত্রুটি', 'error'));
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

  const updateReportStatus = (id: string, newStatus: CommunityReport['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: 'আজ' } : r))
    );
    triggerAlert('স্ট্যাটাস আপডেট হয়েছে।', 'success');
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
    if (confirm('মুছে ফেলতে চান?')) {
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
        triggerAlert(!currentStatus ? 'রক্তদাতা অনুমোদিত হয়েছে (ল্যান্ডিং পেজে প্রদর্শিত হবে)।' : 'রক্তদাতা অনুমোদন স্থগিত করা হয়েছে।', 'success');
      }
    } catch {
      triggerAlert('অনুমোদন স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।', 'error');
    }
  };

  const toggleNoticeStatus = (id: string) => {
    setLostNotices((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: n.status === 'active' ? 'resolved' : 'active' } : n
      )
    );
    triggerAlert('বিজ্ঞপ্তির স্ট্যাটাস আপডেট হয়েছে।', 'success');
  };

  const deleteNotice = (id: string) => {
    if (confirm('বিজ্ঞপ্তিটি মুছে ফেলতে চান?')) {
      setLostNotices((prev) => prev.filter((n) => n.id !== id));
      triggerAlert('বিজ্ঞপ্তি মুছে ফেলা হয়েছে।', 'info');
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">উপজেলা</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">৯টি</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">সংবাদ</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{newsList.length}</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">নাগরিক রিপোর্ট</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-bold text-amber-700">{reports.length}</span>
                {pendingReportsCount > 0 && (
                  <span className="text-[10px] text-amber-600 font-semibold">({pendingReportsCount} পেন্ডিং)</span>
                )}
              </div>
            </div>

            <div
              onClick={() => setActiveTab('donors')}
              className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <span className="text-[11px] text-slate-500 font-medium">রক্তদাতা</span>
              <span className="text-xl font-bold text-rose-700 mt-1 block">{donorsList.length} জন</span>
            </div>

            <div
              onClick={() => setActiveTab('blood_requests')}
              className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <span className="text-[11px] text-slate-500 font-medium">রক্তের আবেদন</span>
              <span className="text-xl font-bold text-rose-700 mt-1 block">{bloodRequestsList.length}টি</span>
            </div>

            <div
              onClick={() => setActiveTab('lost_found')}
              className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <span className="text-[11px] text-slate-500 font-medium">হারানো বিজ্ঞপ্তি</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{lostNotices.length}টি</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium">হাসপাতাল</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{HEALTHCARE_FACILITIES.length}টি</span>
            </div>

            <div
              onClick={() => setActiveTab('scams')}
              className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
            >
              <span className="text-[11px] text-slate-500 font-medium">প্রতারণা</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">{scamsList.length}টি</span>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('news')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন সংবাদ</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>রিপোর্ট পর্যালোচনা ({pendingReportsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('lost_found')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>হারানো বিজ্ঞপ্তি</span>
            </button>
          </div>

          {/* Recent Reports & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Recent Reports */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-bold text-xs text-slate-800">সাম্প্রতিক নাগরিক রিপোর্ট</h2>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs text-emerald-700 hover:underline font-medium"
                >
                  সবগুলো →
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-1">
                {reports.slice(0, 5).map((rep) => (
                  <div key={rep.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-medium text-slate-900 block truncate">{rep.titleBn}</span>
                      <span className="text-[11px] text-slate-500">{rep.upazilaNameBn} • {rep.submittedAt}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : rep.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {rep.status === 'resolved'
                        ? 'সমাধানকৃত'
                        : rep.status === 'in_progress'
                        ? 'চলমান'
                        : 'জমা'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status / Recent Logs */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-bold text-xs text-slate-800">সাম্প্রতিক অডিট লগ</h2>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-xs text-emerald-700 hover:underline font-medium"
                >
                  সবগুলো →
                </button>
              </div>

              <div className="space-y-2 mt-2 text-xs font-mono">
                {[
                  { time: '০৯:৪৫', actor: 'Admin', action: 'STATUS_UPDATE', detail: 'রিপোর্ট #rep-1 আপডেট' },
                  { time: '০৮:২২', actor: 'Editor', action: 'NEWS_PUBLISH', detail: 'নতুন সংবাদ প্রকাশ' },
                  { time: 'গতকাল', actor: 'Moderator', action: 'DONOR_VERIFY', detail: 'রক্তদাতা #donor-1 যাচাই' },
                  { time: 'গতকাল', actor: 'System', action: 'BACKUP', detail: 'স্বয়ংক্রিয় ব্যাকআপ' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-100 rounded text-[11px] flex items-center justify-between gap-2">
                    <span className="text-slate-500">{item.time}</span>
                    <span className="font-bold text-slate-700">{item.actor}</span>
                    <span className="text-emerald-700 font-semibold">{item.action}</span>
                    <span className="text-slate-600 truncate flex-1 text-right">{item.detail}</span>
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
        <div className="space-y-4">
          {/* Create News Form */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <h2 className="font-bold text-xs text-slate-800 mb-3 pb-2 border-b border-slate-100">
              নতুন সংবাদ প্রকাশ
            </h2>

            <form onSubmit={handleCreateNews} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    required
                    value={newTitleBn}
                    onChange={(e) => setNewTitleBn(e.target.value)}
                    placeholder="সংবাদের শিরোনাম..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as 'district' | 'upazila' | 'river-erosion' | 'agriculture' | 'education')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="district">জেলা সংবাদ</option>
                    <option value="upazila">উপজেলা</option>
                    <option value="river-erosion">নদী ও চর</option>
                    <option value="agriculture">কৃষি</option>
                    <option value="education">শিক্ষা</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>প্রকাশ করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'district', 'upazila', 'river-erosion', 'agriculture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setNewsCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  newsCategoryFilter === cat
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'all'
                  ? 'সকল'
                  : cat === 'district'
                  ? 'জেলা'
                  : cat === 'upazila'
                  ? 'উপজেলা'
                  : cat === 'river-erosion'
                  ? 'নদী ও চর'
                  : 'কৃষি'}
              </button>
            ))}
          </div>

          {/* News Table */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 text-xs">
            {filteredNews.length === 0 ? (
              <div className="p-6 text-center text-slate-500">কোনো সংবাদ নেই।</div>
            ) : (
              filteredNews.map((article) => (
                <div key={article.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="min-w-0">
                    <span className="font-medium text-slate-900 block truncate">{article.titleBn}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      {article.category} • {article.publishedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/news/${article.slug}`}
                      target="_blank"
                      className="p-1 text-slate-500 hover:text-slate-900 rounded"
                      title="দেখুন"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteNews(article.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: REPORTS */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'সকল' },
              { id: 'submitted', label: 'জমা' },
              { id: 'under_review', label: 'তদন্তাধীন' },
              { id: 'in_progress', label: 'চলমান' },
              { id: 'resolved', label: 'সমাধানকৃত' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setReportStatusFilter(item.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  reportStatusFilter === item.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Reports List */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 text-xs">
            {filteredReports.length === 0 ? (
              <div className="p-6 text-center text-slate-500">কোনো রিপোর্ট নেই।</div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="p-4 space-y-2 hover:bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{report.titleBn}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                        <span>{report.upazilaNameBn} • {report.submittedAt}</span>
                        {report.userId && (
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                            ইউজার আইডি: {report.userId}
                          </span>
                        )}
                      </p>
                    </div>

                    <select
                      value={report.status}
                      onChange={(e) => updateReportStatus(report.id, e.target.value as CommunityReport['status'])}
                      className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      <option value="submitted">জমা (Submitted)</option>
                      <option value="under_review">তদন্তাধীন (Under Review)</option>
                      <option value="in_progress">চলমান (In Progress)</option>
                      <option value="resolved">সমাধানকৃত (Resolved)</option>
                    </select>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">{report.descriptionBn}</p>
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
        <div className="space-y-4">
          {/* Blood Group Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['all', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((grp) => (
              <button
                key={grp}
                onClick={() => setBloodGroupFilter(grp)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  bloodGroupFilter === grp
                    ? 'bg-rose-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {grp === 'all' ? 'সকল' : grp}
              </button>
            ))}
          </div>

          {/* Donors List */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 text-xs">
            {filteredDonors.length === 0 ? (
              <div className="p-6 text-center text-slate-500">কোনো রক্তদাতা নেই।</div>
            ) : (
              filteredDonors.map((donor) => (
                <div key={donor.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {donor.bloodGroup}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{donor.donorNameBn}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {donor.upazilaNameBn} • {donor.contactNumberMasked}
                        {donor.lastDonationDate && ` • শেষ রক্তদান: ${donor.lastDonationDate}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        donor.isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {donor.isApproved ? 'অনুমোদিত' : 'অপেক্ষমাণ (Pending)'}
                    </span>
                    <button
                      onClick={() => toggleDonorVerification(donor.id, donor.isApproved)}
                      className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                        donor.isApproved
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{donor.isApproved ? 'অনুমোদন বাতিল' : 'অনুমোদন দিন'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: EMERGENCY BLOOD REQUESTS (আলাদা পেজ) */}
      {/* ======================================================== */}
      {activeTab === 'blood_requests' && (
        <div className="space-y-4">
          {/* Header & Metrics Strip */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Heart className="w-5 h-5 fill-current animate-pulse" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <span>জরুরি রক্তের আবেদনসমূহ ({bloodRequestsList.length}টি)</span>
                  </h2>
                  <p className="text-xs text-slate-500">রোগীর রক্তের প্রয়োজন, হাসপাতালের বিবরণ ও সরাসরি স্ট্যাটাস ব্যবস্থাপনা</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
                মোট আবেদন: <strong className="text-slate-800">{bloodRequestsList.length}</strong>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">মোট আবেদন</span>
                <span className="text-lg font-bold text-slate-900">{bloodRequestsList.length}টি</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                <span className="text-[11px] text-rose-700 block">খোঁজা হচ্ছে (Active)</span>
                <span className="text-lg font-bold text-rose-700">
                  {bloodRequestsList.filter((r) => r.status === 'approved').length}টি
                </span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[11px] text-emerald-700 block">সংগ্রহ সম্পন্ন (Managed)</span>
                <span className="text-lg font-bold text-emerald-700">
                  {bloodRequestsList.filter((r) => r.status === 'managed').length}টি
                </span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                <span className="text-[11px] text-amber-700 block">অপেক্ষমাণ (Pending)</span>
                <span className="text-lg font-bold text-amber-700">
                  {bloodRequestsList.filter((r) => r.status === 'pending').length}টি
                </span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-600 mr-1">রক্তের গ্রুপ:</span>
                {['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <button
                    key={group}
                    onClick={() => setRequestGroupFilter(group)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      requestGroupFilter === group
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {group === 'all' ? 'সকল' : group}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-56">
                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-rose-600"
                >
                  <option value="all">সকল স্ট্যাটাস</option>
                  <option value="approved">অনুমোদিত ও খোঁজা হচ্ছে (Active)</option>
                  <option value="managed">রক্ত সংগ্রহ সম্পন্ন (Managed)</option>
                  <option value="pending">অপেক্ষমাণ (Pending)</option>
                  <option value="cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 text-xs">
            {filteredBloodRequests.length === 0 ? (
              <div className="p-10 text-center text-slate-500 space-y-1">
                <Heart className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-sm text-slate-700">কোনো রক্তের আবেদন পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400">ফিল্টার পরিবর্তন করে দেখুন অথবা নতুন আবেদন জমা হওয়ার অপেক্ষা করুন।</p>
              </div>
            ) : (
              filteredBloodRequests.map((req) => (
                <div key={req.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {req.bloodGroup}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">{req.patientNameBn}</h3>
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {req.bagsNeeded} ব্যাগ প্রয়োজন
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>হাসপাতাল: <strong className="text-slate-900 font-semibold">{req.hospitalNameBn}</strong> ({req.upazilaNameBn})</span>
                          {req.userId && (
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                              ইউজার আইডি: {req.userId}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Status Selector & Actions */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <select
                        value={req.status}
                        onChange={(e) => updateBloodRequestStatus(req.id, e.target.value as BloodRequest['status'])}
                        className={`border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer ${
                          req.status === 'managed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : req.status === 'approved'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : req.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="approved">✓ অনুমোদিত ও সক্রিয় (Active)</option>
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

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <p className="text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">রোগীর সমস্যা / কারণ:</strong> {req.problemDescription}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
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
      {/* TAB: LOST & FOUND */}
      {/* ======================================================== */}
      {activeTab === 'lost_found' && (
        <div className="space-y-4">
          {/* Quick Create Notice Form */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <h2 className="font-bold text-xs text-slate-800 mb-3 pb-2 border-b border-slate-100">
              নতুন হারানো বা প্রাপ্তি বিজ্ঞপ্তি প্রকাশ
            </h2>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="বিজ্ঞপ্তির শিরোনাম (যেমন: মানিব্যাগ হারানো)..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <select
                    value={newNoticeType}
                    onChange={(e) => setNewNoticeType(e.target.value as 'lost' | 'found')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="lost">হারানো (Lost)</option>
                    <option value="found">প্রাপ্তি (Found)</option>
                  </select>
                </div>
                <div>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as LostNotice['category'])}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="person">নিখোঁজ ব্যক্তি</option>
                    <option value="document">আইডি কার্ড ও সনদ</option>
                    <option value="vehicle">যানবাহন ও সাইকেল</option>
                    <option value="valuable">মোবাইল ও মূল্যবান জিনিস</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <input
                  type="text"
                  value={newNoticeContact}
                  onChange={(e) => setNewNoticeContact(e.target.value)}
                  placeholder="যোগাযোগকারীর নাম..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
                />
                <input
                  type="text"
                  value={newNoticePhone}
                  onChange={(e) => setNewNoticePhone(e.target.value)}
                  placeholder="মোবাইল নম্বর..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
                />
                <select
                  value={newNoticeUpazila}
                  onChange={(e) => setNewNoticeUpazila(e.target.value as UpazilaId)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                >
                  {UPAZILAS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>প্রকাশ করুন</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'সকল' },
                { id: 'lost', label: 'হারানো' },
                { id: 'found', label: 'প্রাপ্তি' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLostTypeFilter(t.id as 'all' | 'lost' | 'found')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    lostTypeFilter === t.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}

              <span className="text-slate-300">|</span>

              <select
                value={lostCategoryFilter}
                onChange={(e) => setLostCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[11px] text-slate-700 font-medium"
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
                  onClick={() => setLostStatusFilter(s.id as 'all' | 'active' | 'resolved')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    lostStatusFilter === s.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-500">মোট: {filteredLostNotices.length}টি</span>
          </div>

          {/* Notices List */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100 text-xs">
            {filteredLostNotices.length === 0 ? (
              <div className="p-6 text-center text-slate-500">কোনো বিজ্ঞপ্তি নেই।</div>
            ) : (
              filteredLostNotices.map((notice) => (
                <div key={notice.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          notice.type === 'lost'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {notice.type === 'lost' ? 'হারানো' : 'প্রাপ্তি'}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium border border-slate-200/50">
                        {LOST_NOTICE_CATEGORY_LABELS[notice.category] || notice.categoryLabelBn || 'অন্যান্য'}
                      </span>
                      <span className="font-semibold text-slate-900 truncate">{notice.titleBn}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>{notice.upazilaNameBn} • যোগাযোগ: {notice.contactName} ({notice.contactPhone}) • {notice.date}</span>
                      {notice.userId && (
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                          ইউজার আইডি: {notice.userId}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleNoticeStatus(notice.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
                        notice.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{notice.status === 'resolved' ? 'সমাধানকৃত' : 'চলমান'}</span>
                    </button>

                    <Link
                      href="/lost-and-found"
                      target="_blank"
                      className="p-1 text-slate-400 hover:text-slate-800 rounded"
                      title="পাবলিক ভিউ"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: SCAMS */}
      {/* ======================================================== */}
      {activeTab === 'scams' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <h2 className="font-bold text-xs text-slate-800 mb-3 pb-2 border-b border-slate-100">
              নতুন প্রতারণা সংক্রান্ত অ্যালার্ট
            </h2>

            <form onSubmit={handleCreateScam} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    value={newScamTitle}
                    onChange={(e) => setNewScamTitle(e.target.value)}
                    placeholder="প্রতারণার শিরোনাম..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <select
                    value={newScamSeverity}
                    onChange={(e) => setNewScamSeverity(e.target.value as 'critical' | 'high' | 'medium')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={2}
                value={newScamSummary}
                onChange={(e) => setNewScamSummary(e.target.value)}
                placeholder="বিবরণ..."
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>জারি করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-2.5">
            {filteredScams.map((scam) => (
              <div key={scam.id} className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{scam.titleBn}</span>
                    {scam.userId && (
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                        ইউজার আইডি: {scam.userId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        scam.isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {scam.isApproved ? 'অনুমোদিত' : 'অপেক্ষমাণ (Pending)'}
                    </span>
                    <button
                      onClick={() => toggleScamApproval(scam.id, scam.isApproved)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        scam.isApproved
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {scam.isApproved ? 'অনুমোদন বাতিল' : 'অনুমোদন দিন'}
                    </button>
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {scam.severity}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600">{scam.summaryBn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: HEALTHCARE */}
      {/* ======================================================== */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {filteredFacilities.map((facility) => (
            <div key={facility.id} className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{facility.nameBn}</h3>
                <p className="text-[11px] text-slate-500">{facility.upazilaNameBn}</p>
              </div>
              <span className="text-slate-700 flex items-center gap-1 font-mono font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{facility.emergencyPhone}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: POLICE */}
      {/* ======================================================== */}
      {activeTab === 'police' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {filteredPolice.map((item) => (
            <div key={item.id} className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{item.officeNameBn}</h3>
                <p className="text-[11px] text-slate-500">{item.designationBn} • {item.upazilaNameBn}</p>
              </div>
              <span className="text-slate-700 flex items-center gap-1 font-mono font-medium">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.phone}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: ROLES */}
      {/* ======================================================== */}
      {activeTab === 'roles' && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
              <tr>
                <th className="p-3">ভূমিকা (Role)</th>
                <th className="p-3">দায়িত্ব</th>
                <th className="p-3 text-right">অনুমতি</th>
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
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{r.role}</td>
                  <td className="p-3 text-slate-600">{r.scope}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
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
      {/* TAB 9: LOGS */}
      {/* ======================================================== */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-xs text-slate-800">অডিট ইতিহাস</span>
            <button
              onClick={() => triggerAlert('লগ ফাইল ডাউনলোড প্রস্তুত।', 'info')}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>এক্সপোর্ট</span>
            </button>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {[
              { time: '2026-10-31 09:45', actor: 'SuperAdmin', action: 'STATUS_UPDATE', detail: 'Report #rep-1 আপডেট' },
              { time: '2026-10-31 08:22', actor: 'Editor_Shafiq', action: 'ARTICLE_PUBLISH', detail: 'সংবাদ প্রকাশ' },
              { time: '2026-10-30 19:10', actor: 'Moderator_Aziz', action: 'DONOR_VERIFY', detail: 'Donor #donor-1 ভেরিফাই' },
              { time: '2026-10-30 14:05', actor: 'DirManager_Hasan', action: 'HOSPITAL_AUDIT', detail: 'সদর হাসপাতাল নম্বর চেক' },
              { time: '2026-10-29 09:15', actor: 'SystemScheduler', action: 'AUTO_BACKUP', detail: 'ডাটাবেজ ব্যাকআপ সম্পন্ন' }
            ].map((log, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded flex items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-400">{log.time}</span>
                <span className="font-bold text-blue-700">{log.actor}</span>
                <span className="font-semibold text-emerald-700">{log.action}</span>
                <span className="text-slate-600">{log.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 10: SETTINGS */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs space-y-4 max-w-xl">
          <div className="space-y-1">
            <label className="font-medium text-xs text-slate-700 block">জরুরি নোটিশ ব্যানার</label>
            <input
              type="text"
              value={emergencyTicker}
              onChange={(e) => setEmergencyTicker(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-xs text-slate-700 block">অ্যাডমিন ইমেইল</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
            <span className="font-medium text-slate-800">রক্ষণাবেক্ষণ মোড</span>
            <button
              onClick={() => {
                setSiteMaintenance(!siteMaintenance);
                triggerAlert(`মেইনটেন্যান্স মোড ${!siteMaintenance ? 'চালু' : 'বন্ধ'}।`, 'info');
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                siteMaintenance ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {siteMaintenance ? 'চালু' : 'বন্ধ'}
            </button>
          </div>

          <button
            onClick={() => triggerAlert('সেটিংস সংরক্ষিত হয়েছে।', 'success')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-medium"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      )}
    </div>
  );
}
