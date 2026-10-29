import React from 'react';
import Link from 'next/link';
import { Clock, User, ArrowUpRight } from 'lucide-react';
import { NewsArticle } from '@/types';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'hero' | 'standard' | 'compact';
}

export default function NewsCard({ article, variant = 'standard' }: NewsCardProps) {
  if (variant === 'hero') {
    return (
      <article className="group bg-white border border-[#e7e3db] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row">
        <div className="lg:w-7/12 relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={article.featuredImage}
            alt={article.titleBn}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-[#14532d] text-white text-xs font-semibold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider">
              প্রধান সংবাদ
            </span>
            {article.upazilaNameBn && (
              <span className="bg-black/70 backdrop-blur-xs text-white text-xs px-2 py-1 rounded">
                {article.upazilaNameBn}
              </span>
            )}
          </div>
        </div>

        <div className="lg:w-5/12 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-[#575e65] mb-2">
              <span className="font-medium text-[#14532d]">{article.source}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTimeMinutes} মিনিট পাঠ
              </span>
            </div>

            <Link href={`/news/${article.slug}`}>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1d1f] tracking-tight group-hover:text-[#14532d] transition-colors leading-snug">
                {article.titleBn}
              </h1>
            </Link>

            <p className="text-sm text-[#4a5056] mt-3 leading-relaxed line-clamp-3">
              {article.excerptBn}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e7e3db] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {article.author.avatar ? (
                <img
                  src={article.author.avatar}
                  alt={article.author.nameBn}
                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                  {article.author.nameBn.charAt(0)}
                </div>
              )}
              <div>
                <span className="text-xs font-semibold text-[#1a1d1f] block leading-none">
                  {article.author.nameBn}
                </span>
                <span className="text-[11px] text-gray-500">{article.author.roleBn}</span>
              </div>
            </div>

            <Link
              href={`/news/${article.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532d] group-hover:underline"
            >
              <span>বিস্তারিত পড়ুন</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 p-3 bg-white border border-[#e7e3db] rounded hover:border-[#14532d] transition-all">
        <div className="w-24 h-20 shrink-0 rounded overflow-hidden bg-gray-100">
          <img
            src={article.featuredImage}
            alt={article.titleBn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
              <span className="text-[#14532d] font-semibold">{article.upazilaNameBn || 'কুড়িগ্রাম'}</span>
              <span>•</span>
              <span>{article.publishedAt.split(',')[0]}</span>
            </div>
            <Link href={`/news/${article.slug}`}>
              <h2 className="text-xs sm:text-sm font-bold text-[#1a1d1f] line-clamp-2 group-hover:text-[#14532d] leading-snug">
                {article.titleBn}
              </h2>
            </Link>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">{article.readTimeMinutes} মিনিট পাঠ</span>
        </div>
      </article>
    );
  }

  // Standard Variant
  return (
    <article className="group bg-white border border-[#e7e3db] rounded-lg overflow-hidden shadow-2xs hover:shadow-sm hover:border-[#14532d] transition-all flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={article.featuredImage}
            alt={article.titleBn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {article.upazilaNameBn && (
              <span className="bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                {article.upazilaNameBn}
              </span>
            )}
            {article.isTrending && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                আলোচিত
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
            <span>{article.publishedAt.split(',')[0]}</span>
            <span>•</span>
            <span className="text-[#14532d] font-medium">{article.readTimeMinutes} মিনিট পাঠ</span>
          </div>

          <Link href={`/news/${article.slug}`}>
            <h2 className="text-base font-bold text-[#1a1d1f] group-hover:text-[#14532d] transition-colors leading-snug line-clamp-2">
              {article.titleBn}
            </h2>
          </Link>

          <p className="text-xs text-[#575e65] mt-2 line-clamp-2 leading-relaxed">
            {article.excerptBn}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 bg-[#faf8f5] border-t border-[#e7e3db] flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">{article.author.nameBn}</span>
        <Link
          href={`/news/${article.slug}`}
          className="text-[#14532d] font-semibold inline-flex items-center gap-0.5 hover:underline"
        >
          <span>পড়ুন</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
