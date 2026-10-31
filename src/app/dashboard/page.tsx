'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Award,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  AlertCircle,
  FileQuestion,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  MapPin,
  UserCheck,
  LogOut,
  RefreshCw,
  Shield,
  UserCog,
  X,
  Lock,
  Mail,
  Phone,
  CreditCard,
  User,
  Droplet,
  Heart,
  Edit,
  Activity,
  Check
} from 'lucide-react';
import type { BloodRequest, LostNotice, CommunityReport, ScamAlert, BloodDonor } from '@/types';
import DonorModal from '@/components/DonorModal';
import ScamAlertModal from '@/components/ScamAlertModal';
import ReportModal from '@/components/ReportModal';
import LostNoticeModal from '@/components/LostNoticeModal';
import { UPAZILAS } from '@/data/kurigramData';

type TabType = 'all' | 'blood' | 'scam' | 'report' | 'lost';

interface ContributionData {
  summary: {
    totalPoints: number;
    level: {
      tier: string;
      badgeName: string;
      nextTierTarget: number;
      progressPercent: number;
      color: string;
    };
    counts: {
      bloodRequests: number;
      scamAlerts: number;
      reports: number;
      lostNotices: number;
      total: number;
    };
    pointsBreakdown: {
      blood: number;
      scam: number;
      report: number;
      lost: number;
    };
  };
  data: {
    bloodRequests: BloodRequest[];
    scamAlerts: ScamAlert[];
    reports: CommunityReport[];
    lostNotices: LostNotice[];
    donorProfile: BloodDonor | null;
  };
}

export default function UserDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout, updateProfile, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPointRules, setShowPointRules] = useState(false);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);

  // Profile Edit State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNid, setEditNid] = useState('');
  const [editJela, setEditJela] = useState('কুড়িগ্রাম');
  const [editUpazila, setEditUpazila] = useState('');
  const [editUnion, setEditUnion] = useState('');
  const [editGram, setEditGram] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Submission Modals State
  const [bloodModalOpen, setBloodModalOpen] = useState(false);
  const [scamModalOpen, setScamModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [lostModalOpen, setLostModalOpen] = useState(false);

  // Donor Profile State & Modal
  const [donorRegisterModalOpen, setDonorRegisterModalOpen] = useState(false);
  const [showDonorEditModal, setShowDonorEditModal] = useState(false);
  const [donorAvailability, setDonorAvailability] = useState<'available' | 'busy' | 'recently_donated'>('available');
  const [donorLastDate, setDonorLastDate] = useState('');
  const [donorTotalDonations, setDonorTotalDonations] = useState(1);
  const [donorEmergencyAvailable, setDonorEmergencyAvailable] = useState(true);
  const [donorArea, setDonorArea] = useState('');
  const [donorUnion, setDonorUnion] = useState('');
  const [isUpdatingDonor, setIsUpdatingDonor] = useState(false);
  const [donorUpdateMsg, setDonorUpdateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openDonorEditModal = (donor: BloodDonor) => {
    setDonorAvailability(donor.availabilityStatus || 'available');
    setDonorLastDate(donor.lastDonationDate || '');
    setDonorTotalDonations(donor.totalDonationsCount || 1);
    setDonorEmergencyAvailable(donor.emergencyAvailable ?? true);
    setDonorArea(donor.areaBn || '');
    setDonorUnion(donor.unionNameBn || '');
    setDonorUpdateMsg(null);
    setShowDonorEditModal(true);
  };

  const handleDonorUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const donor = contributionData?.data?.donorProfile;
    if (!donor) return;

    setIsUpdatingDonor(true);
    setDonorUpdateMsg(null);

    try {
      const res = await fetch('/api/blood-donors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: donor.id,
          availabilityStatus: donorAvailability,
          lastDonationDate: donorLastDate || null,
          totalDonationsCount: donorTotalDonations,
          emergencyAvailable: donorEmergencyAvailable,
          areaBn: donorArea,
          unionNameBn: donorUnion
        })
      });
      const data = await res.json();
      setIsUpdatingDonor(false);

      if (data.success) {
        setDonorUpdateMsg({ type: 'success', text: 'রক্তদাতার প্রাপ্যতা ও তথ্য সফলভাবে আপডেট হয়েছে!' });
        if (user?.id) fetchContributions(user.id);
        setTimeout(() => {
          setShowDonorEditModal(false);
        }, 1200);
      } else {
        setDonorUpdateMsg({ type: 'error', text: data.message || 'আপডেট ব্যর্থ হয়েছে।' });
      }
    } catch {
      setIsUpdatingDonor(false);
      setDonorUpdateMsg({ type: 'error', text: 'সার্ভার সংযোগ সমস্যা।' });
    }
  };

  const handleQuickAvailabilityChange = async (newStatus: 'available' | 'busy' | 'recently_donated') => {
    const donor = contributionData?.data?.donorProfile;
    if (!donor) return;

    try {
      const res = await fetch('/api/blood-donors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: donor.id,
          availabilityStatus: newStatus
        })
      });
      const data = await res.json();
      if (data.success && user?.id) {
        fetchContributions(user.id);
      }
    } catch (err) {
      console.error('Failed to change donor availability', err);
    }
  };

  const openProfileModal = () => {
    if (!user) return;
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditEmail(user.email || '');
    setEditNid(user.nid || '');
    setEditJela(user.jela || 'কুড়িগ্রাম');
    setEditUpazila(user.upazila || '');
    setEditUnion(user.union || '');
    setEditGram(user.gram || '');
    setCurrentPassword('');
    setNewPassword('');
    setShowPasswordChange(false);
    setProfileMsg(null);
    setShowProfileModal(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!editName.trim() || !editPhone.trim()) {
      setProfileMsg({ type: 'error', text: 'নাম ও মোবাইল নম্বর আবশ্যক।' });
      return;
    }

    if (editNid && editNid.trim().replace(/[\s-]/g, '').length < 10) {
      setProfileMsg({ type: 'error', text: 'সঠিক জাতীয় পরিচয়পত্র (NID) নম্বর দিন (কমপক্ষে ১০ ডিজিট)।' });
      return;
    }

    if (showPasswordChange) {
      if (!currentPassword) {
        setProfileMsg({ type: 'error', text: 'বর্তমান পাসওয়ার্ড প্রদান করুন।' });
        return;
      }
      if (!newPassword || newPassword.length < 4) {
        setProfileMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' });
        return;
      }
    }

    setIsUpdatingProfile(true);
    const res = await updateProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim() || undefined,
      nid: editNid.trim() || undefined,
      jela: editJela.trim() || 'কুড়িগ্রাম',
      upazila: editUpazila.trim() || undefined,
      union: editUnion.trim() || undefined,
      gram: editGram.trim() || undefined,
      currentPassword: showPasswordChange ? currentPassword : undefined,
      newPassword: showPasswordChange ? newPassword : undefined
    });
    setIsUpdatingProfile(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: res.message || 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' });
      setTimeout(() => {
        setShowProfileModal(false);
      }, 1200);
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে।' });
    }
  };

  const fetchContributions = async (userId: string, userPhone?: string) => {
    try {
      setLoading(true);
      const targetPhone = userPhone || user?.phone || '';
      const phoneParam = targetPhone ? `&phone=${encodeURIComponent(targetPhone)}` : '';
      const res = await fetch(`/api/user/contributions?userId=${encodeURIComponent(userId)}${phoneParam}`);
      const json = await res.json();
      if (json.success) {
        setContributionData(json);
      }
    } catch (err) {
      console.error('Failed to load user contributions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user?.id) {
        fetchContributions(user.id, user.phone);
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  // Combine items for the feed
  const unifiedItems = useMemo(() => {
    if (!contributionData) return [];

    const items: Array<{
      id: string;
      type: 'blood' | 'scam' | 'report' | 'lost';
      title: string;
      description?: string;
      date: string;
      status: string;
      statusColor: string;
      points: number;
      badgeText: string;
      badgeColor: string;
      location?: string;
      href: string;
    }> = [];

    // Blood Requests
    contributionData.data.bloodRequests.forEach((item) => {
      items.push({
        id: item.id,
        type: 'blood',
        title: `জরুরি রক্ত প্রয়োজন: ${item.bloodGroup} (${item.patientNameBn})`,
        description: `${item.hospitalNameBn} • ${item.problemDescription || ''}`,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('bn-BD') : 'আজ',
        status: item.status === 'approved' ? 'অনুমোদিত' : item.status === 'managed' ? 'রক্তদাতা প্রাপ্ত' : item.status === 'cancelled' ? 'বাতিল' : 'অপেক্ষমাণ',
        statusColor: item.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : item.status === 'managed' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-amber-50 text-amber-700 border-amber-200',
        points: 20,
        badgeText: 'রক্তের আবেদন',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        location: item.hospitalNameBn,
        href: '/blood-requests'
      });
    });

    // Scam Alerts
    contributionData.data.scamAlerts.forEach((item) => {
      items.push({
        id: item.id,
        type: 'scam',
        title: item.titleBn,
        description: item.summaryBn,
        date: item.publishedDate || 'আজ',
        status: item.isApproved ? 'অনুমোদিত ও প্রকাশিত' : 'যাচাইাধীন (অপেক্ষমাণ)',
        statusColor: item.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
        points: 25,
        badgeText: 'প্রতারণা সতর্কতা',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        location: item.suspectName ? `সন্দেহভাজন: ${item.suspectName}` : 'অনলাইন / অজ্ঞাত',
        href: '/scam-alerts'
      });
    });

    // Community Reports
    contributionData.data.reports.forEach((item) => {
      items.push({
        id: item.id,
        type: 'report',
        title: item.titleBn,
        description: item.descriptionBn,
        date: item.submittedAt || 'আজ',
        status: item.status === 'resolved' ? 'সমাধানকৃত' : item.status === 'in_progress' ? 'প্রক্রিয়াধীন' : 'পর্যালোচনায়',
        statusColor: item.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200',
        points: 15,
        badgeText: 'নাগরিক সমস্যা',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        location: item.locationDetailsBn,
        href: '/reports'
      });
    });

    // Lost Notices
    contributionData.data.lostNotices.forEach((item) => {
      items.push({
        id: item.id,
        type: 'lost',
        title: `${item.type === 'lost' ? 'হারানো:' : 'প্রাপ্তি:'} ${item.titleBn}`,
        description: item.descriptionBn || item.categoryLabelBn,
        date: item.date || 'আজ',
        status: item.status === 'resolved' ? 'উদ্ধারকৃত' : 'প্রকাশিত',
        statusColor: item.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200',
        points: 10,
        badgeText: item.type === 'lost' ? 'হারানো বিজ্ঞপ্তি' : 'প্রাপ্তি বিজ্ঞপ্তি',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        location: item.locationDetailsBn,
        href: '/lost-and-found'
      });
    });

    return items;
  }, [contributionData]);

  // Filtered items based on tab and search
  const filteredItems = useMemo(() => {
    let result = unifiedItems;
    if (activeTab !== 'all') {
      result = result.filter((it) => it.type === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          (it.description && it.description.toLowerCase().includes(q)) ||
          (it.location && it.location.toLowerCase().includes(q))
      );
    }
    return result;
  }, [unifiedItems, activeTab, searchQuery]);

  // Loading screen
  if (authLoading || (loading && !contributionData)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mb-4" />
        <p className="text-slate-600 text-sm font-medium">ড্যাশবোর্ড প্রস্তুত করা হচ্ছে...</p>
      </div>
    );
  }

  // Not logged in guest screen
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">নাগরিক ড্যাশবোর্ড</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            আপনার করা জরুরি রক্তের আবেদন, প্রতারণার সতর্কতা, নাগরিক সমস্যা ও হারানো বিজ্ঞপ্তিগুলো এক সাথে দেখতে এবং নাগরিক পয়েন্ট অর্জন করতে লগইন করুন।
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-xs"
            >
              লগইন করুন
            </Link>
            <Link
              href="/register"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
            >
              নতুন নাগরিক নিবন্ধন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const summary = contributionData?.summary;
  const counts = summary?.counts || { bloodRequests: 0, scamAlerts: 0, reports: 0, lostNotices: 0, total: 0 };
  const totalPoints = summary?.totalPoints || 0;
  const level = summary?.level || {
    tier: '১ম স্তর',
    badgeName: 'সচেতন নাগরিক',
    nextTierTarget: 30,
    progressPercent: 0,
    color: 'emerald'
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Banner / User Welcome Header */}
      <section className="bg-white border-b border-slate-200/80 sticky top-14 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* User Profile Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900">{user.name}</h1>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    user.role === 'admin' 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {user.role === 'admin' ? 'প্রশাসক' : 'নাগরিক সদস্য'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  আইডি: <span className="font-mono text-slate-700 font-medium">{user.id}</span> • মোবাইল: {user.phone}
                  {user.nid && (
                    <span> • এনআইডি: <span className="font-mono text-slate-700 font-medium">{user.nid.length > 6 ? `${user.nid.slice(0, 3)}****${user.nid.slice(-3)}` : user.nid}</span></span>
                  )}
                </p>
                {(user.upazila || user.union || user.gram || user.jela) && (
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>
                      {[user.gram, user.union, user.upazila, user.jela || 'কুড়িগ্রাম'].filter(Boolean).join(', ')}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                onClick={openProfileModal}
                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                title="প্রোফাইল তথ্য ও পাসওয়ার্ড পরিবর্তন"
              >
                <UserCog className="w-3.5 h-3.5 text-emerald-700" />
                <span>প্রোফাইল আপডেট</span>
              </button>

              <button
                onClick={() => user?.id && fetchContributions(user.id)}
                className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>অ্যাডমিন পোর্টাল</span>
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Blood Donor Hero Profile Section (If user is a registered blood donor or invite) */}
        {contributionData?.data?.donorProfile ? (
          (() => {
            const donor = contributionData.data.donorProfile;
            const isAvailable = donor.availabilityStatus === 'available';
            const isBusy = donor.availabilityStatus === 'busy';
            const isRecentlyDonated = donor.availabilityStatus === 'recently_donated';

            return (
              <section className="bg-gradient-to-r from-rose-50 via-white to-red-50/40 rounded-2xl border border-rose-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* Left: Donor Identity & Blood Group */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex flex-col items-center justify-center shrink-0 shadow-sm border-2 border-white">
                      <Droplet className="w-4 h-4 fill-white" />
                      <span className="text-xl sm:text-2xl font-black leading-none mt-0.5">{donor.bloodGroup}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                          <span>নিবন্ধিত রক্তদাতা</span>
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          donor.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {donor.isApproved ? 'যাচাইকৃত রক্তদাতা' : 'অনুমোদন প্রক্রিয়াধীন'}
                        </span>
                        {donor.emergencyAvailable && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                            জরুরি সেবায় প্রস্তুত
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {donor.donorNameBn}
                        <span className="text-xs text-slate-500 font-normal ml-2">
                          (মোবাইল: {donor.phone})
                        </span>
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
                        <span>মোট রক্তদান: <strong className="text-slate-900">{donor.totalDonationsCount || 1} বার</strong></span>
                        <span>•</span>
                        <span>শেষ রক্তদান: <strong className="text-slate-900">{donor.lastDonationDate || 'উল্লেখ নেই'}</strong></span>
                        <span>•</span>
                        <span>এলাকা: <strong className="text-slate-900">{donor.areaBn || donor.upazilaNameBn}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Availability Toggle & Edit Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-rose-100">
                    {/* Quick Availability Selector */}
                    <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleQuickAvailabilityChange('available')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isAvailable
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                        }`}
                        title="রক্তদানের জন্য প্রস্তুত"
                      >
                        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-white' : 'bg-emerald-500'}`} />
                        <span>প্রস্তুত</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAvailabilityChange('recently_donated')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isRecentlyDonated
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                        }`}
                        title="সম্প্রতি রক্ত দিয়েছি (বিশ্রামে আছি)"
                      >
                        <span className={`w-2 h-2 rounded-full ${isRecentlyDonated ? 'bg-white' : 'bg-blue-500'}`} />
                        <span>সম্প্রতি দিয়েছি</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAvailabilityChange('busy')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isBusy
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-amber-700 hover:bg-slate-50'
                        }`}
                        title="আপাতত দিতে অপরাগ"
                      >
                        <span className={`w-2 h-2 rounded-full ${isBusy ? 'bg-white' : 'bg-amber-500'}`} />
                        <span>ব্যস্ত</span>
                      </button>
                    </div>

                    {/* Edit Details Button */}
                    <button
                      type="button"
                      onClick={() => openDonorEditModal(donor)}
                      className="inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>রক্তদাতার তথ্য পরিবর্তন</span>
                    </button>
                  </div>
                </div>
              </section>
            );
          })()
        ) : (
          /* Invitation Card if user is not yet a donor */
          <section className="bg-gradient-to-r from-rose-50/70 via-white to-rose-50/40 rounded-2xl border border-rose-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 fill-rose-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">আপনি কি রক্তদাতা হিসেবে কুড়িগ্রামবাসীর পাশে দাঁড়াতে চান?</h4>
                <p className="text-xs text-slate-500 mt-0.5">রক্তদাতা হিসেবে তালিকাভুক্ত হলে যেকোনো জরুরি মুহূর্তে রোগীর জীবন বাঁচাতে ডাক পেতে পারেন।</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDonorRegisterModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs shrink-0 active:scale-95 self-start sm:self-auto"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              <span>+ রক্তদাতা হিসেবে যুক্ত হন</span>
            </button>
          </section>
        )}

        {/* Gamified Citizen Points & Tier Card */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Total points and badge */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-600 flex flex-col items-center justify-center text-white shadow-sm shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 opacity-90" />
                <span className="text-xl sm:text-2xl font-black tracking-tight">{totalPoints}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">আপনার নাগরিক পয়েন্ট স্কোর</span>
                  <button
                    onClick={() => setShowPointRules(!showPointRules)}
                    className="text-slate-400 hover:text-emerald-700 p-0.5"
                    title="পয়েন্ট অর্জনের নিয়মাবলী"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{level.badgeName}</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                    {level.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  কুড়িগ্রামের মানুষের সেবায় আপনার সক্রিয় অংশগ্রহণের জন্য অর্জিত স্বীকৃতি।
                </p>
              </div>
            </div>

            {/* Right: Progress to next tier */}
            <div className="w-full lg:max-w-xs bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs">
              <div className="flex items-center justify-between font-medium text-slate-700 mb-1.5">
                <span>পরবর্তী লক্ষ্য: {level.nextTierTarget} পয়েন্ট</span>
                <span className="font-bold text-emerald-700">{totalPoints}/{level.nextTierTarget}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${level.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                <span>অগ্রগতি: {level.progressPercent}%</span>
                <span className="text-emerald-600 font-semibold">আরো অবদান রেখে ব্যাজ আপগ্রেড করুন</span>
              </p>
            </div>
          </div>

          {/* Point rules info dropdown / banner */}
          {showPointRules && (
            <div className="mt-5 pt-4 border-t border-slate-100 bg-emerald-50/50 rounded-xl p-4 text-xs text-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-2">
                <span className="text-rose-600 font-bold text-base leading-none">•</span>
                <div>
                  <strong className="block text-slate-900">জরুরি রক্তের আবেদন</strong>
                  <span className="text-emerald-700 font-bold">+২০ পয়েন্ট</span> প্রতি আবেদনে
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold text-base leading-none">•</span>
                <div>
                  <strong className="block text-slate-900">প্রতারণা সতর্কতা</strong>
                  <span className="text-emerald-700 font-bold">+২৫ পয়েন্ট</span> প্রতি সতর্কতায়
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold text-base leading-none">•</span>
                <div>
                  <strong className="block text-slate-900">নাগরিক সমস্যা</strong>
                  <span className="text-emerald-700 font-bold">+১৫ পয়েন্ট</span> প্রতি রিপোর্টে
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-600 font-bold text-base leading-none">•</span>
                <div>
                  <strong className="block text-slate-900">হারানো ও প্রাপ্তি</strong>
                  <span className="text-emerald-700 font-bold">+১০ পয়েন্ট</span> প্রতি বিজ্ঞপ্তিতে
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4 Category Contribution Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Blood Requests */}
          <div
            onClick={() => setActiveTab('blood')}
            className={`cursor-pointer bg-white rounded-xl border p-4 transition-all shadow-2xs hover:border-rose-300 ${
              activeTab === 'blood' ? 'ring-2 ring-rose-500/20 border-rose-400 bg-rose-50/20' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">রক্তের আবেদন</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{counts.bloodRequests}টি</span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                +{counts.bloodRequests * 20} পয়েন্ট
              </span>
            </div>
          </div>

          {/* Scam Alerts */}
          <div
            onClick={() => setActiveTab('scam')}
            className={`cursor-pointer bg-white rounded-xl border p-4 transition-all shadow-2xs hover:border-amber-300 ${
              activeTab === 'scam' ? 'ring-2 ring-amber-500/20 border-amber-400 bg-amber-50/20' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">প্রতারণা সতর্কতা</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{counts.scamAlerts}টি</span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                +{counts.scamAlerts * 25} পয়েন্ট
              </span>
            </div>
          </div>

          {/* Community Reports */}
          <div
            onClick={() => setActiveTab('report')}
            className={`cursor-pointer bg-white rounded-xl border p-4 transition-all shadow-2xs hover:border-blue-300 ${
              activeTab === 'report' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/20' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">নাগরিক সমস্যা</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{counts.reports}টি</span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                +{counts.reports * 15} পয়েন্ট
              </span>
            </div>
          </div>

          {/* Lost Notices */}
          <div
            onClick={() => setActiveTab('lost')}
            className={`cursor-pointer bg-white rounded-xl border p-4 transition-all shadow-2xs hover:border-teal-300 ${
              activeTab === 'lost' ? 'ring-2 ring-teal-500/20 border-teal-400 bg-teal-50/20' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">হারানো ও প্রাপ্তি</span>
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileQuestion className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{counts.lostNotices}টি</span>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                +{counts.lostNotices * 10} পয়েন্ট
              </span>
            </div>
          </div>
        </div>

        {/* Quick Post / New Submission Action Shortcuts */}
        <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>নতুন আবেদন বা পোস্ট যুক্ত করুন:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setBloodModalOpen(true)}
              className="bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <span>+ রক্তের আবেদন</span>
            </button>
            <button
              type="button"
              onClick={() => setScamModalOpen(true)}
              className="bg-white hover:bg-amber-50 text-amber-700 border border-slate-200 hover:border-amber-200 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <span>+ প্রতারণা সতর্কতা</span>
            </button>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <span>+ নাগরিক সমস্যা</span>
            </button>
            <button
              type="button"
              onClick={() => setLostModalOpen(true)}
              className="bg-white hover:bg-teal-50 text-teal-700 border border-slate-200 hover:border-teal-200 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-2xs active:scale-95"
            >
              <span>+ হারানো বিজ্ঞপ্তি</span>
            </button>
          </div>
        </div>

        {/* User Contributions Feed & Filters */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Tabs & Search Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                সবগুলো ({counts.total})
              </button>
              <button
                onClick={() => setActiveTab('blood')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'blood'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                রক্তের আবেদন ({counts.bloodRequests})
              </button>
              <button
                onClick={() => setActiveTab('scam')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'scam'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                প্রতারণা সতর্কতা ({counts.scamAlerts})
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'report'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                নাগরিক সমস্যা ({counts.reports})
              </button>
              <button
                onClick={() => setActiveTab('lost')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'lost'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                হারানো বিজ্ঞপ্তি ({counts.lostNotices})
              </button>
            </div>

            {/* Search filter */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম বা স্থান খুঁজুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>

          {/* List Feed */}
          <div className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">কোনো পোস্ট পাওয়া যায়নি</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  {searchQuery
                    ? 'আপনার সার্চের সাথে মিলে এমন কোনো পোস্ট নেই।'
                    : 'আপনি এখনও এই বিভাগে কোনো আবেদন বা তথ্য পোস্ট করেননি। নতুন পোস্ট যুক্ত করে নাগরিক পয়েন্ট সংগ্রহ করুন।'}
                </p>
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'blood') setBloodModalOpen(true);
                      else if (activeTab === 'scam') setScamModalOpen(true);
                      else if (activeTab === 'lost') setLostModalOpen(true);
                      else setReportModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-2xs active:scale-95"
                  >
                    + নতুন পোস্ট করুন
                  </button>
                </div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <article
                  key={`${item.type}-${item.id}`}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Top tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold border ${item.badgeColor}`}>
                        {item.badgeText}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-medium border ${item.statusColor}`}>
                        {item.status}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        +{item.points} পয়েন্ট অর্জিত
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                      <Link href={item.href} className="inline-flex items-center gap-1 group">
                        <span>{item.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </h3>

                    {/* Description snippet */}
                    {item.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Metadata: Location & Date */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{item.location}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.date}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: View link */}
                  <div className="sm:shrink-0 self-end sm:self-center">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UserCog className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">নাগরিক প্রোফাইল আপডেট</h3>
                <p className="text-xs text-slate-500">আপনার নাম, ফোন নম্বর, এনআইডি এবং পাসওয়ার্ড পরিবর্তন করুন</p>
              </div>
            </div>

            {/* Alert Messages */}
            {profileMsg && (
              <div
                className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  আপনার পুরো নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="আপনার নাম লিখুন..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="০১৭১১-২২৩৩৪৪"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  জাতীয় পরিচয়পত্র (NID) নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editNid}
                    onChange={(e) => setEditNid(e.target.value)}
                    placeholder="১০, ১৩ অথবা ১৭ ডিজিটের NID নম্বর"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ইমেইল ঠিকানা (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* ঠিকানা (জেলা, উপজেলা, ইউনিয়ন, গ্রাম) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ঠিকানা (জেলা, উপজেলা, ইউনিয়ন, গ্রাম)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">জেলা</label>
                    <input
                      type="text"
                      value={editJela}
                      onChange={(e) => setEditJela(e.target.value)}
                      placeholder="যেমন: কুড়িগ্রাম"
                      className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">উপজেলা</label>
                    <select
                      value={editUpazila}
                      onChange={(e) => {
                        setEditUpazila(e.target.value);
                        setEditUnion('');
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">ইউনিয়ন / পৌরসভা</label>
                    {(() => {
                      const selUpazila = UPAZILAS.find((u) => u.nameBn === editUpazila || u.id === editUpazila);
                      if (selUpazila && selUpazila.unions.length > 0) {
                        return (
                          <select
                            value={editUnion}
                            onChange={(e) => setEditUnion(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                          >
                            <option value="">-- ইউনিয়ন নির্বাচন করুন --</option>
                            {selUpazila.unions.map((un) => (
                              <option key={un} value={un}>
                                {un}
                              </option>
                            ))}
                          </select>
                        );
                      }
                      return (
                        <input
                          type="text"
                          value={editUnion}
                          onChange={(e) => setEditUnion(e.target.value)}
                          placeholder="ইউনিয়ন বা ওয়ার্ডের নাম"
                          className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                        />
                      );
                    })()}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">গ্রাম / এলাকা</label>
                    <input
                      type="text"
                      value={editGram}
                      onChange={(e) => setEditGram(e.target.value)}
                      placeholder="যেমন: কলেজ মোড়, তালুক শিমুলবাড়ি"
                      className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Change password toggle */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{showPasswordChange ? 'পাসওয়ার্ড পরিবর্তন বাতিল করুন' : 'পাসওয়ার্ড পরিবর্তন করতে চান?'}</span>
                </button>
              </div>

              {showPasswordChange && (
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 animate-in fade-in">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      বর্তমান পাসওয়ার্ড <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      নতুন পাসওয়ার্ড <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-xs disabled:opacity-50"
                >
                  {isUpdatingProfile ? 'সংরক্ষণ করা হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4 Action Submission Modals */}
      <DonorModal
        isOpen={bloodModalOpen}
        mode="request"
        onClose={() => setBloodModalOpen(false)}
        onSuccess={() => {
          setBloodModalOpen(false);
          if (user?.id) fetchContributions(user.id);
        }}
      />

      <ScamAlertModal
        isOpen={scamModalOpen}
        onClose={() => setScamModalOpen(false)}
        onSuccess={() => {
          setScamModalOpen(false);
          if (user?.id) fetchContributions(user.id);
        }}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmitSuccess={() => {
          setReportModalOpen(false);
          if (user?.id) fetchContributions(user.id);
        }}
      />

      <LostNoticeModal
        isOpen={lostModalOpen}
        onClose={() => setLostModalOpen(false)}
        onSuccess={() => {
          setLostModalOpen(false);
          if (user?.id) fetchContributions(user.id);
        }}
      />

      {/* Donor Profile Edit Modal */}
      {showDonorEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDonorEditModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Droplet className="w-5 h-5 fill-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">রক্তদাতার প্রাপ্যতা ও তথ্য আপডেট</h3>
                <p className="text-xs text-slate-500">আপনার রক্তদানের প্রাপ্যতা ও তথ্যাবলি পরিবর্তন করুন</p>
              </div>
            </div>

            {donorUpdateMsg && (
              <div
                className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  donorUpdateMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {donorUpdateMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{donorUpdateMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleDonorUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  বর্তমান রক্তদানের প্রাপ্যতা স্ট্যাটাস <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDonorAvailability('available')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      donorAvailability === 'available'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>প্রস্তুত</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonorAvailability('recently_donated')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      donorAvailability === 'recently_donated'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>সম্প্রতি দিয়েছি</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonorAvailability('busy')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                      donorAvailability === 'busy'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>ব্যস্ত</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  শেষ রক্তদানের তারিখ
                </label>
                <input
                  type="date"
                  value={donorLastDate}
                  onChange={(e) => setDonorLastDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:bg-white focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  মোট রক্তদানের সংখ্যা (বার)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={donorTotalDonations}
                  onChange={(e) => setDonorTotalDonations(Number(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:bg-white focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ইউনিয়ন / ওয়ার্ড
                  </label>
                  <input
                    type="text"
                    value={donorUnion}
                    onChange={(e) => setDonorUnion(e.target.value)}
                    placeholder="যেমন: ভোগডাঙ্গা"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:bg-white focus:border-rose-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    গ্রাম বা মহল্লার নাম
                  </label>
                  <input
                    type="text"
                    value={donorArea}
                    onChange={(e) => setDonorArea(e.target.value)}
                    placeholder="যেমন: কলেজ মোড়"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:bg-white focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-rose-50/70 p-3 rounded-xl border border-rose-200/80">
                  <input
                    type="checkbox"
                    checked={donorEmergencyAvailable}
                    onChange={(e) => setDonorEmergencyAvailable(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">জরুরি প্রয়োজনে যেকোনো সময় কল গ্রহণ করব</span>
                    <span className="text-[10px] text-slate-500">জরুরি রোগীদের জন্য ২৪ ঘণ্টা তালিকাভুক্ত থাকবেন</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDonorEditModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingDonor}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-xs disabled:opacity-50"
                >
                  {isUpdatingDonor ? 'সংরক্ষণ করা হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donor Registration Modal for users wanting to register as blood donor */}
      <DonorModal
        isOpen={donorRegisterModalOpen}
        mode="register"
        onClose={() => setDonorRegisterModalOpen(false)}
        onSuccess={() => {
          setDonorRegisterModalOpen(false);
          if (user?.id) fetchContributions(user.id);
        }}
      />
    </div>
  );
}
