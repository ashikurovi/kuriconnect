import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export interface ContributionSummary {
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
    blood: number; // 20 pts per item
    scam: number; // 25 pts per item
    report: number; // 15 pts per item
    lost: number; // 10 pts per item
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'ইউজার আইডি প্রদান করুন' },
        { status: 400 }
      );
    }

    // Parallel fetch for the user
    const [bloodRequests, scamAlerts, reports, lostNotices] = await Promise.all([
      serverStore.getBloodRequests({ userId }),
      serverStore.getScamAlerts({ userId, approvedOnly: false }),
      serverStore.getReports({ userId }),
      serverStore.getLostNotices({ userId })
    ]);

    // Point calculations
    const bloodPoints = bloodRequests.length * 20;
    const scamPoints = scamAlerts.length * 25;
    const reportPoints = reports.length * 15;
    const lostPoints = lostNotices.length * 10;
    const totalPoints = bloodPoints + scamPoints + reportPoints + lostPoints;

    // Gamified citizen level
    let tier = '১ম স্তর';
    let badgeName = 'সচেতন নাগরিক';
    let nextTierTarget = 30;
    let progressPercent = Math.min(100, Math.round((totalPoints / 30) * 100));
    let color = 'emerald';

    if (totalPoints >= 150) {
      tier = '৪র্থ স্তর';
      badgeName = 'কুড়িগ্রামের রত্ন (Star Citizen)';
      nextTierTarget = 200;
      progressPercent = 100;
      color = 'amber';
    } else if (totalPoints >= 80) {
      tier = '৩য় স্তর';
      badgeName = 'সমাজসেবী নাগরিক';
      nextTierTarget = 150;
      progressPercent = Math.min(100, Math.round(((totalPoints - 80) / (150 - 80)) * 100));
      color = 'indigo';
    } else if (totalPoints >= 30) {
      tier = '২য় স্তর';
      badgeName = 'সক্রিয় নাগরিক';
      nextTierTarget = 80;
      progressPercent = Math.min(100, Math.round(((totalPoints - 30) / (80 - 30)) * 100));
      color = 'teal';
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalPoints,
        level: {
          tier,
          badgeName,
          nextTierTarget,
          progressPercent,
          color
        },
        counts: {
          bloodRequests: bloodRequests.length,
          scamAlerts: scamAlerts.length,
          reports: reports.length,
          lostNotices: lostNotices.length,
          total: bloodRequests.length + scamAlerts.length + reports.length + lostNotices.length
        },
        pointsBreakdown: {
          blood: bloodPoints,
          scam: scamPoints,
          report: reportPoints,
          lost: lostPoints
        }
      },
      data: {
        bloodRequests,
        scamAlerts,
        reports,
        lostNotices
      }
    });
  } catch (err: any) {
    console.error('Error fetching user contributions:', err);
    return NextResponse.json(
      { success: false, message: 'তথ্য লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}
