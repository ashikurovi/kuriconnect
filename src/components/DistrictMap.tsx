'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UPAZILA_GEO_PATHS,
  RIVER_PATHS
} from '@/data/geoData';
import {
  UPAZILAS,
  HERITAGE_SITES,
  HEALTHCARE_FACILITIES,
  POLICE_CONTACTS,
  DIRECTORY_ITEMS,
  NEWS_ARTICLES
} from '@/data/kurigramData';
import { UpazilaId } from '@/types';
import {
  Compass,
  MapPin,
  Layers,
  List,
  Eye,
  Hospital,
  Shield,
  Landmark,
  GraduationCap,
  Store,
  ExternalLink,
  ChevronRight,
  Info,
  Navigation
} from 'lucide-react';

interface DistrictMapProps {
  initialUpazilaId?: UpazilaId;
  compact?: boolean;
}

type MapLayer = 'all' | 'heritage' | 'healthcare' | 'police' | 'education' | 'markets';

export default function DistrictMap({ initialUpazilaId = 'kurigram-sadar', compact = false }: DistrictMapProps) {
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<UpazilaId>(initialUpazilaId);
  const [hoveredUpazilaId, setHoveredUpazilaId] = useState<UpazilaId | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedUpazila = UPAZILAS.find((u) => u.id === selectedUpazilaId) || UPAZILAS[0];

  // Upazila-specific assets
  const relatedHeritage = HERITAGE_SITES.filter((h) => h.upazilaId === selectedUpazilaId);
  const relatedHospitals = HEALTHCARE_FACILITIES.filter((h) => h.upazilaId === selectedUpazilaId);
  const relatedPolice = POLICE_CONTACTS.filter((p) => p.upazilaId === selectedUpazilaId);
  const relatedDirectories = DIRECTORY_ITEMS.filter((d) => d.upazilaId === selectedUpazilaId);
  const relatedNews = NEWS_ARTICLES.filter((n) => n.upazilaId === selectedUpazilaId);

  // Markers based on active layer
  const getMarkers = () => {
    const list: {
      id: string;
      title: string;
      category: 'heritage' | 'healthcare' | 'police' | 'education' | 'market';
      x: number;
      y: number;
      color: string;
      icon: typeof Landmark;
      upazilaId: UpazilaId;
    }[] = [];

    // Map markers anchored to upazila centers with slight offset
    UPAZILA_GEO_PATHS.forEach((geo) => {
      const [cx, cy] = geo.centerSvg;

      if (activeLayer === 'all' || activeLayer === 'heritage') {
        const hs = HERITAGE_SITES.filter((h) => h.upazilaId === geo.id);
        if (hs.length > 0) {
          list.push({
            id: `marker-h-${geo.id}`,
            title: hs[0].nameBn,
            category: 'heritage',
            x: cx - 24,
            y: cy - 20,
            color: '#b45309', // amber/brown
            icon: Landmark,
            upazilaId: geo.id
          });
        }
      }

      if (activeLayer === 'all' || activeLayer === 'healthcare') {
        const hc = HEALTHCARE_FACILITIES.filter((h) => h.upazilaId === geo.id);
        if (hc.length > 0) {
          list.push({
            id: `marker-hc-${geo.id}`,
            title: hc[0].nameBn,
            category: 'healthcare',
            x: cx + 18,
            y: cy - 12,
            color: '#b91c1c', // red
            icon: Hospital,
            upazilaId: geo.id
          });
        }
      }

      if (activeLayer === 'all' || activeLayer === 'police') {
        const pc = POLICE_CONTACTS.filter((p) => p.upazilaId === geo.id);
        if (pc.length > 0) {
          list.push({
            id: `marker-p-${geo.id}`,
            title: pc[0].officeNameBn,
            category: 'police',
            x: cx + 10,
            y: cy + 22,
            color: '#1d4ed8', // blue
            icon: Shield,
            upazilaId: geo.id
          });
        }
      }

      if (activeLayer === 'all' || activeLayer === 'education') {
        const edu = DIRECTORY_ITEMS.filter((d) => d.upazilaId === geo.id && (d.category === 'college' || d.category === 'school'));
        if (edu.length > 0) {
          list.push({
            id: `marker-edu-${geo.id}`,
            title: edu[0].nameBn,
            category: 'education',
            x: cx - 18,
            y: cy + 20,
            color: '#047857', // emerald
            icon: GraduationCap,
            upazilaId: geo.id
          });
        }
      }
    });

    return list;
  };

  const markers = getMarkers();

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Header & Layer Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              কুড়িগ্রাম জেলা ইন্টারেক্টিভ মানচিত্র
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                ৯টি উপজেলা ও নদীমালা
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              উপজেলায় ক্লিক করে বিস্তারিত তথ্য দেখুন। ফিল্টার ব্যবহার করে নির্দিষ্ট সেবা পর্যবেক্ষণ করুন।
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Layer Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Pills */}
          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${activeLayer === 'all' ? 'bg-emerald-600 text-white font-medium shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              সকল লেয়ার
            </button>
            <button
              onClick={() => setActiveLayer('heritage')}
              className={`px-2.5 py-1 rounded-md transition-all ${activeLayer === 'heritage' ? 'bg-emerald-600 text-white font-medium shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              ঐতিহ্য
            </button>
            <button
              onClick={() => setActiveLayer('healthcare')}
              className={`px-2.5 py-1 rounded-md transition-all ${activeLayer === 'healthcare' ? 'bg-emerald-600 text-white font-medium shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              হাসপাতাল
            </button>
            <button
              onClick={() => setActiveLayer('police')}
              className={`px-2.5 py-1 rounded-md transition-all ${activeLayer === 'police' ? 'bg-emerald-600 text-white font-medium shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              থানা ও প্রশাসন
            </button>
          </div>

          {/* Toggle Map / List */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${viewMode === 'map' ? 'bg-emerald-600 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>মানচিত্র ভিউ</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>তালিকা ভিউ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[580px]">
          {/* Map Vector Stage (Col 7/12) */}
          <div className="lg:col-span-7 p-4 bg-slate-50/70 relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200/80 overflow-hidden select-none">
            {/* Compass Rose & Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-1.5 shadow-xs text-center text-[10px] font-bold text-slate-700">
                <span className="block text-red-600 text-xs">▲</span>
                <span>উত্তর (N)</span>
              </div>
              <div className="bg-white/95 border border-slate-200 rounded-lg p-1 flex flex-col gap-1 shadow-xs text-xs font-bold text-slate-700">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
                  className="px-2 py-0.5 hover:bg-slate-100 rounded text-center"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
                  className="px-2 py-0.5 hover:bg-slate-100 rounded text-center"
                  title="Zoom Out"
                >
                  -
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="text-[9px] px-1 py-0.5 hover:bg-slate-100 rounded text-slate-500"
                  title="Reset Zoom"
                >
                  রিসেট
                </button>
              </div>
            </div>

            {/* River Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-xs border border-[#d2ccc1] p-2.5 rounded text-[11px] shadow-xs space-y-1">
              <span className="font-semibold text-gray-800 block">নদী নেটওয়ার্ক সূচক:</span>
              <div className="flex items-center gap-1.5 text-blue-700">
                <span className="w-5 h-1.5 bg-[#4a90e2] rounded-full inline-block"></span>
                <span>ব্রহ্মপুত্র নদ (প্রধান জলপ্রবাহ)</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-700">
                <span className="w-5 h-1 bg-[#5bc0de] rounded-full inline-block"></span>
                <span>ধরলা, তিস্তা ও দুধকুমার নদী</span>
              </div>
            </div>

            {/* SVG Vector Map Canvas */}
            <div
              className="w-full max-w-[540px] aspect-[800/950] transition-transform duration-500 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg
                viewBox="0 0 800 950"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Gradient for each upazila */}
                  {UPAZILA_GEO_PATHS.map((geo) => {
                    const isSelected = selectedUpazilaId === geo.id;
                    const isHovered = hoveredUpazilaId === geo.id;
                    return (
                      <linearGradient key={`grad-${geo.id}`} id={`grad-${geo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isSelected ? '#22c55e' : isHovered ? '#bbf7d0' : geo.color} />
                        <stop offset="100%" stopColor={isSelected ? '#14532d' : isHovered ? '#4ade80' : '#c8dcd0'} />
                      </linearGradient>
                    );
                  })}

                  {/* Glow filter for selected upazila */}
                  <filter id="selected-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feFlood floodColor="#22c55e" floodOpacity="0.35" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Subtle river glow */}
                  <filter id="river-glow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Subtle shadow for polygons */}
                  <filter id="poly-shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
                  </filter>
                </defs>

                {/* Soft background */}
                <rect x="0" y="0" width="800" height="950" fill="#f0ece5" rx="8" />

                {/* Major Rivers — drawn behind polygons with glow */}
                {RIVER_PATHS.map((river, idx) => (
                  <g key={`river-${idx}`}>
                    {/* River shadow/glow layer */}
                    <path
                      d={river.svgPath}
                      fill="none"
                      stroke={idx === 0 ? '#93c5fd' : '#a5f3fc'}
                      strokeWidth={river.strokeWidth + 6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-25 pointer-events-none"
                    />
                    {/* Main river */}
                    <path
                      d={river.svgPath}
                      fill="none"
                      stroke={idx === 0 ? '#3b82f6' : '#22d3ee'}
                      strokeWidth={river.strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-55 pointer-events-none"
                      filter="url(#river-glow)"
                    />
                  </g>
                ))}

                {/* Upazila Geographic Polygons */}
                {UPAZILA_GEO_PATHS.map((geo) => {
                  const isSelected = selectedUpazilaId === geo.id;
                  const isHovered = hoveredUpazilaId === geo.id;

                  return (
                    <g key={geo.id} className="cursor-pointer">
                      {/* Selected outer glow ring */}
                      {isSelected && (
                        <path
                          d={geo.svgPath}
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth={5}
                          strokeLinejoin="round"
                          className="opacity-40"
                          filter="url(#selected-glow)"
                        />
                      )}

                      {/* Main polygon with gradient fill */}
                      <path
                        d={geo.svgPath}
                        fill={`url(#grad-${geo.id})`}
                        stroke={isSelected ? '#15803d' : isHovered ? '#22c55e' : '#9cb8a6'}
                        strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                        filter={isSelected ? undefined : 'url(#poly-shadow)'}
                        onClick={() => setSelectedUpazilaId(geo.id)}
                        onMouseEnter={() => setHoveredUpazilaId(geo.id)}
                        onMouseLeave={() => setHoveredUpazilaId(null)}
                      />

                      {/* Upazila Name Labels */}
                      <text
                        x={geo.centerSvg[0]}
                        y={geo.centerSvg[1]}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none select-none"
                        style={{
                          fontSize: isSelected ? '15px' : '12px',
                          fontWeight: isSelected ? 700 : 600,
                          fill: isSelected ? '#ffffff' : isHovered ? '#14532d' : '#374151',
                          textShadow: isSelected
                            ? '0 1px 4px rgba(0,0,0,0.5)'
                            : '0 1px 3px rgba(255,255,255,0.9)',
                          transition: 'all 0.3s ease',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {geo.nameBn}
                      </text>
                    </g>
                  );
                })}

                {/* Layer Interactive Pins with pulse animation */}
                {markers.map((marker) => {
                  const isCurUpazila = marker.upazilaId === selectedUpazilaId;
                  return (
                    <g
                      key={marker.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedUpazilaId(marker.upazilaId)}
                    >
                      {/* Animated pulse ring for active markers */}
                      {isCurUpazila && (
                        <circle
                          cx={marker.x}
                          cy={marker.y}
                          r="12"
                          fill="none"
                          stroke={marker.color}
                          strokeWidth="1.5"
                          opacity="0.5"
                        >
                          <animate attributeName="r" from="9" to="20" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Outer ring */}
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r={isCurUpazila ? 10 : 8}
                        fill={marker.color}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-200"
                        style={{ filter: `drop-shadow(0 1px 3px ${marker.color}66)` }}
                      />

                      {/* Inner white dot */}
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r={isCurUpazila ? 3.5 : 2.5}
                        fill="#ffffff"
                        className="pointer-events-none opacity-80"
                      />

                      <title>{`${marker.title} (${marker.category})`}</title>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Upazila Detail & Context Panel (Col 5/12) */}
          <div className="lg:col-span-5 p-5 bg-white flex flex-col justify-between overflow-y-auto max-h-[640px]">
            <div>
              {/* Selected Upazila Header */}
              <div className="border-b border-slate-200 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    নির্বাচিত উপজেলা
                  </span>
                  <Link
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedUpazila.mapCoords.lat},${selectedUpazila.mapCoords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline font-medium"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>গুগল ম্যাপে দিকনির্দেশ</span>
                  </Link>
                </div>

                <h3 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight mt-2 flex items-baseline gap-2">
                  <span>{selectedUpazila.nameBn}</span>
                  <span className="text-sm font-normal text-slate-400 font-sans">({selectedUpazila.nameEn})</span>
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedUpazila.overviewBn}
                </p>
              </div>

              {/* Key Administrative Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">আয়তন</span>
                  <span className="text-xs font-bold text-slate-800">{selectedUpazila.areaKm2} কিমি²</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">জনসংখ্যা</span>
                  <span className="text-xs font-bold text-slate-800">{selectedUpazila.population.toLocaleString('bn-BD')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">ইউনিয়ন</span>
                  <span className="text-xs font-bold text-slate-800">{selectedUpazila.unionsCount}টি</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">স্বাক্ষরতার হার</span>
                  <span className="text-xs font-bold text-emerald-700">{selectedUpazila.keyStats.literacyRate}</span>
                </div>
              </div>

              {/* Unions Badges */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  ইউনিয়নসমূহ ({selectedUpazila.unions.length}টি):
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedUpazila.unions.map((union, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 shadow-2xs"
                    >
                      {union}
                    </span>
                  ))}
                </div>
              </div>

              {/* Local Highlights Accordion / Tabs */}
              <div className="space-y-3">
                {/* Related Heritage */}
                {relatedHeritage.length > 0 && (
                  <div className="border border-amber-200 bg-amber-50/40 rounded p-3">
                    <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5 mb-1.5">
                      <Landmark className="w-3.5 h-3.5 text-amber-700" />
                      <span>দর্শনীয় ও ঐতিহাসিক স্থান:</span>
                    </span>
                    {relatedHeritage.map((h) => (
                      <div key={h.id} className="text-xs text-gray-800">
                        <Link href={`/heritage/${h.slug}`} className="font-medium hover:text-amber-800 hover:underline">
                          • {h.nameBn}
                        </Link>
                        <p className="text-[11px] text-gray-600 pl-3 line-clamp-1">{h.culturalSignificanceBn}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Related Healthcare */}
                {relatedHospitals.length > 0 && (
                  <div className="border border-red-200 bg-red-50/30 rounded p-3">
                    <span className="text-xs font-semibold text-red-900 flex items-center gap-1.5 mb-1">
                      <Hospital className="w-3.5 h-3.5 text-red-600" />
                      <span>জরুরি চিকিৎসাকেন্দ্র:</span>
                    </span>
                    <div className="text-xs space-y-1">
                      <div className="font-medium text-gray-900">• {relatedHospitals[0].nameBn}</div>
                      <div className="text-[11px] text-gray-600 flex items-center justify-between">
                        <span>হটলাইন: {relatedHospitals[0].phone}</span>
                        <a
                          href={`tel:${relatedHospitals[0].phone}`}
                          className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] hover:bg-red-700"
                        >
                          কল করুন
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Police */}
                {relatedPolice.length > 0 && (
                  <div className="border border-blue-200 bg-blue-50/30 rounded p-3 text-xs">
                    <span className="font-semibold text-blue-900 flex items-center gap-1.5 mb-1">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>থানা ও ওসি যোগাযোগ:</span>
                    </span>
                    <div className="flex items-center justify-between text-gray-800">
                      <span>• {relatedPolice[0].officeNameBn} ({relatedPolice[0].phone})</span>
                      <a
                        href={`tel:${relatedPolice[0].phone}`}
                        className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] hover:bg-blue-700"
                      >
                        কল দিন
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA to Full Upazila Profile */}
            <div className="mt-5 pt-3 border-t border-[#e7e3db]">
              <Link
                href={`/upazila/${selectedUpazila.slug}`}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs"
              >
                <span>{selectedUpazila.nameBn} উপজেলার পূর্ণাঙ্গ প্রোফাইল ও ডিরেক্টরি দেখুন</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Alternative List View */
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UPAZILAS.map((upazila) => (
              <div
                key={upazila.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:bg-white hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-base text-slate-900">
                      {upazila.nameBn}
                    </span>
                    <span className="text-xs text-slate-400 font-sans">{upazila.nameEn}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {upazila.overviewBn}
                  </p>
                  <div className="space-y-1 text-xs text-slate-500 border-t border-slate-200/80 pt-2">
                    <p>• সদর দপ্তর: <span className="text-slate-800 font-medium">{upazila.headquarters}</span></p>
                    <p>• জনসংখ্যা: <span className="text-slate-800 font-medium">{upazila.population.toLocaleString('bn-BD')}</span></p>
                    <p>• ইউনিয়ন সংখ্যা: <span className="text-slate-800 font-medium">{upazila.unionsCount}টি</span></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedUpazilaId(upazila.id);
                      setViewMode('map');
                    }}
                    className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>মানচিত্রে দেখুন</span>
                  </button>

                  <Link
                    href={`/upazila/${upazila.slug}`}
                    className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-2xs"
                  >
                    সম্পূর্ণ বিবরণ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
