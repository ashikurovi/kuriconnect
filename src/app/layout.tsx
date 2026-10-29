import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'KuriConnect — কুড়িগ্রাম জেলার ডিজিটাল প্ল্যাটফর্ম',
  description: 'কুড়িগ্রাম জেলার ৯টি উপজেলা, ঐতিহাসিক ঐতিহ্য, সার্বক্ষণিক স্বাস্থ্যসেবা, রক্তদাতা ডিরেক্টরি, থানা ও পুলিশ যোগাযোগ, স্থানীয় জনসমস্যা এবং নিরপেক্ষ বস্তুনিষ্ঠ সংবাদের একক ডিজিটাল পোর্টাল।',
  keywords: ['কুড়িগ্রাম', 'KuriConnect', 'Kurigram District', 'কুড়িগ্রাম সংবাদ', 'ধরলা সেতু', 'চিলমারী বন্দর', 'রক্তদাতা কুড়িগ্রাম', 'কুড়িগ্রাম হাসপাতাল'],
  authors: [{ name: 'KuriConnect সম্পাদকীয় পরিষদ' }],
  metadataBase: new URL('https://hamarkurigram.org'),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'KuriConnect — কুড়িগ্রাম জেলার ডিজিটাল প্ল্যাটফর্ম',
    description: 'কুড়িগ্রামের সংবাদ, মানচিত্র, ঐতিহ্য, গণসেবা ও জনসমস্যার ডিজিটাল সংযোগ কেন্দ্র।',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-bengali selection:bg-emerald-500 selection:text-white antialiased">
        <TopBar />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
