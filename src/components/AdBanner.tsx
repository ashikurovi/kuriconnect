'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdBannerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
  label?: string;
}

export default function AdBanner({
  adSlot = '1234567890',
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  label = 'বিজ্ঞাপন'
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
  const isDev = process.env.NODE_ENV === 'development' || adsenseClientId.includes('XXXX');

  useEffect(() => {
    // Only push adsbygoogle in production when a valid client ID is present
    if (typeof window !== 'undefined' && !isDev) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense push error:', err);
      }
    }
  }, [isDev]);

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* Subtle Ad Label */}
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 select-none">
        {label}
      </span>

      {isDev ? (
        /* Development Preview Placeholder */
        <div className="w-full max-w-4xl min-h-[100px] sm:min-h-[120px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-4 flex flex-col items-center justify-center text-center text-slate-500 transition-all hover:bg-slate-100/70">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google AdSense / বিজ্ঞাপন স্লট (প্রিভিউ)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Slot ID: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">{adSlot}</code> • Format: {adFormat}
          </p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1.5">
            প্রোডাকশনে আপনার Google AdSense Client ID যুক্ত হলে এখানে স্বয়ংক্রিয় বিজ্ঞাপন প্রদর্শিত হবে।
          </p>
        </div>
      ) : (
        /* Real Google AdSense Ad Unit */
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseClientId}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      )}
    </div>
  );
}

