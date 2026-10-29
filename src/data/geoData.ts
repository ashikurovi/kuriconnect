import { UpazilaId } from '@/types';

export interface UpazilaGeoPath {
  id: UpazilaId;
  nameBn: string;
  nameEn: string;
  svgPath: string;
  centerSvg: [number, number]; // [x, y] for label/pin placement
  color: string;
  hoverColor: string;
}

export interface RiverPath {
  nameBn: string;
  nameEn: string;
  svgPath: string;
  strokeWidth: number;
}

// Geographically refined SVG vector map of Kurigram District (Viewbox: 0 0 800 950)
// Shapes use more control points for organic, realistic boundaries
export const UPAZILA_GEO_PATHS: UpazilaGeoPath[] = [
  {
    id: 'bhurungamari',
    nameBn: 'ভুরুঙ্গামারী',
    nameEn: 'Bhurungamari',
    // Northernmost border upazila — smoother organic contour
    svgPath: 'M 355,38 C 370,35 410,30 445,38 L 472,48 C 490,56 510,72 528,92 L 535,105 C 538,120 532,148 524,168 L 518,178 C 500,198 470,210 445,215 L 430,216 C 405,212 380,200 365,185 L 348,168 C 335,148 328,128 332,108 L 338,80 C 342,60 348,46 355,38 Z',
    centerSvg: [430, 128],
    color: '#e8f0ea',
    hoverColor: '#166534'
  },
  {
    id: 'phulbari',
    nameBn: 'ফুলবাড়ী',
    nameEn: 'Phulbari',
    // Northwest border upazila — smoother contour
    svgPath: 'M 188,178 C 210,170 250,162 282,165 L 300,170 C 318,180 332,198 342,218 L 345,228 C 342,258 332,280 322,298 L 315,308 C 295,318 260,316 235,312 L 218,308 C 198,295 182,272 176,252 L 174,235 C 176,210 182,192 188,178 Z',
    centerSvg: [258, 242],
    color: '#f0f5f1',
    hoverColor: '#166534'
  },
  {
    id: 'nageshwari',
    nameBn: 'নাগেশ্বরী',
    nameEn: 'Nageshwari',
    // North-central — large, detailed contour
    svgPath: 'M 342,218 C 365,210 405,208 440,212 L 460,215 C 490,210 510,195 530,178 L 548,185 C 568,200 578,220 582,240 L 588,268 C 590,292 588,310 584,325 L 578,342 C 558,358 530,368 500,372 L 482,368 C 450,362 418,350 395,342 L 378,335 C 348,318 328,302 322,285 L 318,268 C 322,248 332,232 342,218 Z',
    centerSvg: [458, 278],
    color: '#e2ecE5',
    hoverColor: '#166534'
  },
  {
    id: 'rajarhat',
    nameBn: 'রাজারহাট',
    nameEn: 'Rajarhat',
    // Western central upazila
    svgPath: 'M 138,332 C 160,322 195,312 228,312 L 248,315 C 272,325 288,340 298,355 L 302,368 C 298,398 290,428 278,452 L 268,462 C 245,475 215,478 188,475 L 172,470 C 150,455 135,432 130,412 L 128,395 C 130,365 134,348 138,332 Z',
    centerSvg: [210, 398],
    color: '#eaf2ec',
    hoverColor: '#166534'
  },
  {
    id: 'kurigram-sadar',
    nameBn: 'কুড়িগ্রাম সদর',
    nameEn: 'Kurigram Sadar',
    // Central administrative hub on the Dharla
    svgPath: 'M 298,355 C 325,342 358,338 388,340 L 420,345 C 452,352 472,362 485,372 L 492,385 C 490,415 482,445 476,468 L 470,480 C 448,495 418,502 392,500 L 370,498 C 335,490 305,475 285,460 L 278,448 C 280,415 288,382 298,355 Z',
    centerSvg: [382, 418],
    color: '#d5e6da',
    hoverColor: '#166534'
  },
  {
    id: 'ulipur',
    nameBn: 'উলিপুর',
    nameEn: 'Ulipur',
    // Largest south-central upazila
    svgPath: 'M 178,475 C 210,462 248,455 278,452 L 320,458 C 365,468 405,482 440,490 L 472,480 C 488,490 498,520 496,548 L 492,575 C 478,615 452,648 428,672 L 410,680 C 370,685 320,678 278,665 L 255,658 C 218,638 192,608 180,575 L 175,555 C 174,520 176,498 178,475 Z',
    centerSvg: [340, 565],
    color: '#dde9e0',
    hoverColor: '#166534'
  },
  {
    id: 'chilmari',
    nameBn: 'চিলমারী',
    nameEn: 'Chilmari',
    // River port upazila on western bank of Brahmaputra
    svgPath: 'M 255,658 C 290,648 340,652 385,660 L 415,670 C 435,682 445,710 442,740 L 440,758 C 432,782 412,800 390,810 L 365,818 C 332,820 298,808 272,790 L 252,772 C 242,748 248,718 252,695 L 255,658 Z',
    centerSvg: [345, 735],
    color: '#d0e1d5',
    hoverColor: '#166534'
  },
  {
    id: 'raumari',
    nameBn: 'রৌমারী',
    nameEn: 'Raumari',
    // East of Brahmaputra River
    svgPath: 'M 548,528 C 580,522 625,530 658,545 L 675,558 C 690,580 695,620 692,655 L 690,680 C 682,708 660,728 638,740 L 612,748 C 578,748 548,735 532,718 L 525,700 C 528,658 532,618 535,590 L 538,565 C 540,548 544,535 548,528 Z',
    centerSvg: [612, 635],
    color: '#e0ebe3',
    hoverColor: '#166534'
  },
  {
    id: 'char-rajibpur',
    nameBn: 'চর রাজীবপুর',
    nameEn: 'Char Rajibpur',
    // Southeastern trans-Brahmaputra char upazila
    svgPath: 'M 612,748 C 638,738 670,728 692,718 L 708,725 C 718,745 720,782 715,815 L 710,838 C 698,860 672,878 645,885 L 618,888 C 585,882 558,862 545,838 L 540,818 C 542,788 550,765 560,750 L 575,742 C 590,740 600,742 612,748 Z',
    centerSvg: [632, 800],
    color: '#d5e4da',
    hoverColor: '#166534'
  }
];

// Major Rivers Flowing Through Kurigram — smoother cubic Bézier curves
export const RIVER_PATHS: RiverPath[] = [
  {
    nameBn: 'ব্রহ্মপুত্র নদ (Brahmaputra River)',
    nameEn: 'Brahmaputra River',
    // Flowing north to south dividing Chilmari/Ulipur from Raumari/Rajibpur
    svgPath: 'M 578,308 C 560,370 535,430 515,490 C 505,530 498,568 494,610 C 490,650 488,690 490,730 C 492,770 498,820 510,870 C 515,890 518,900 520,910',
    strokeWidth: 18
  },
  {
    nameBn: 'ধরলা নদী (Dharla River)',
    nameEn: 'Dharla River',
    // Flowing from Phulbari through Kurigram Sadar to join Brahmaputra
    svgPath: 'M 195,188 C 220,220 250,255 290,310 C 320,345 360,380 400,405 C 430,420 465,440 510,478',
    strokeWidth: 9
  },
  {
    nameBn: 'দুধকুমার নদী (Dudhkumar River)',
    nameEn: 'Dudhkumar River',
    // Flowing through Bhurungamari & Nageshwari to Brahmaputra
    svgPath: 'M 438,48 C 430,95 425,140 435,185 C 445,220 458,260 480,305 C 500,340 530,360 565,375',
    strokeWidth: 8
  },
  {
    nameBn: 'তিস্তা নদী (Teesta River)',
    nameEn: 'Teesta River',
    // Flowing into Ulipur/Rajarhat
    svgPath: 'M 122,428 C 148,465 178,500 215,540 C 248,572 280,600 320,638 C 355,665 400,680 445,685',
    strokeWidth: 10
  }
];
