import type { Metadata } from 'next';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'KuriConnect অ্যাডমিন কন্ট্রোল প্যানেল — কুড়িগ্রাম জেলা',
  description: 'কুড়িগ্রাম জেলার তথ্য ব্যবস্থাপনা, সংবাদ প্রকাশ, নাগরিক সমস্যা মডারেশন ও রক্তদাতা যাচাইয়ের একক প্রশাসনিক পোর্টাল।',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

