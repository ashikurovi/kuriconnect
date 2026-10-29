import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NEWS_ARTICLES } from '@/data/kurigramData';
import NewsCard from '@/components/NewsCard';
import {
  Clock,
  User,
  Share2,
  Bookmark,
  Calendar,
  Tag,
  ShieldCheck,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NEWS_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = NEWS_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: 'সংবাদ পাওয়া যায়নি' };

  return {
    title: `${article.titleBn} | KuriConnect`,
    description: article.excerptBn,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = NEWS_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = NEWS_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#14532d]">প্রচ্ছদ</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-[#14532d]">সংবাদ</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-xs">{article.titleBn}</span>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-[#e7e3db] pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-[#14532d] text-white px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider">
            {article.source}
          </span>
          {article.upazilaNameBn && (
            <Link
              href={`/upazila/${article.upazilaId}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded font-medium transition-colors"
            >
              {article.upazilaNameBn}
            </Link>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#1a1d1f] tracking-tight leading-snug">
          {article.titleBn}
        </h1>

        <p className="text-sm sm:text-base text-gray-500 font-sans italic">
          {article.titleEn}
        </p>

        {/* Byline & Dateline */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {article.author.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.nameBn}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 text-[#14532d] font-bold flex items-center justify-center text-sm">
                {article.author.nameBn.charAt(0)}
              </div>
            )}
            <div>
              <span className="font-bold text-gray-900 block text-sm">{article.author.nameBn}</span>
              <span>{article.author.roleBn}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedAt}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes} মিনিট পাঠ</span>
            </span>
          </div>
        </div>
      </header>

      {/* Featured Hero Image */}
      <div className="rounded-lg overflow-hidden border border-[#e7e3db] aspect-[16/10] bg-gray-100">
        <img
          src={article.featuredImage}
          alt={article.titleBn}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-sm sm:prose-base max-w-none text-[#272a2e] leading-relaxed space-y-4 whitespace-pre-line text-justify font-bengali">
        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed border-l-4 border-[#14532d] pl-4 py-1 bg-green-50/40 rounded-r">
          {article.excerptBn}
        </p>
        <div className="pt-2">
          {article.contentBn}
        </div>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2 text-xs">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700">ট্যাগ:</span>
          {article.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Editorial Standards & Corrections Policy Note */}
      <div className="bg-[#faf8f5] border border-[#e7e3db] rounded-lg p-4 text-xs text-gray-600 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <ShieldCheck className="w-4 h-4 text-[#14532d]" />
          <span>KuriConnect সম্পাদকীয় ও সংশোধনী প্রতিশ্রুতি</span>
        </div>
        <p className="leading-relaxed">
          এই প্রতিবেদনটি নিরপেক্ষ সাংবাদিকতার মানদণ্ড ও স্থানীয় প্রত্যক্ষদর্শীদের সাক্ষ্যের ভিত্তিতে প্রস্তুত। কোনো তথ্যে অনিচ্ছাকৃত ভুলত্রুটি পরিলক্ষিত হলে বা কোনো পক্ষের দ্বিমত থাকলে আমাদের বার্তা বিভাগে ইমেইল (news@hamarkurigram.org) করুন। আমরা দ্রুত সত্যতা যাচাই করে প্রয়োজনীয় সংশোধনী প্রকাশে অঙ্গীকারবদ্ধ।
        </p>
      </div>

      {/* Related News Section */}
      <section className="pt-8 border-t-2 border-[#14532d] space-y-4">
        <h3 className="font-bold text-lg text-gray-900">
          আরও পড়ুন / সংশ্লিষ্ট সংবাদ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedArticles.map((rel) => (
            <NewsCard key={rel.id} article={rel} variant="compact" />
          ))}
        </div>
      </section>
    </article>
  );
}
