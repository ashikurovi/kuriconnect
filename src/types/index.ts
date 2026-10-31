export type UpazilaId =
  | 'kurigram-sadar'
  | 'ulipur'
  | 'nageshwari'
  | 'bhurungamari'
  | 'phulbari'
  | 'rajarhat'
  | 'chilmari'
  | 'raumari'
  | 'char-rajibpur';

export interface Upazila {
  id: UpazilaId;
  nameEn: string;
  nameBn: string;
  slug: string;
  headquarters: string;
  areaKm2: number;
  population: number;
  unionsCount: number;
  villagesCount: number;
  unions: string[];
  rivers: string[];
  overviewBn: string;
  overviewEn: string;
  historyBn: string;
  mapCoords: { lat: number; lng: number };
  featuredImage: string;
  keyStats: {
    literacyRate: string;
    collegesCount: number;
    highSchoolsCount: number;
    healthCentersCount: number;
  };
}

export interface NewsArticle {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  contentBn: string;
  category: 'district' | 'upazila' | 'river-erosion' | 'agriculture' | 'education' | 'health' | 'heritage' | 'crime';
  upazilaId?: UpazilaId;
  upazilaNameBn?: string;
  author: {
    nameBn: string;
    roleBn: string;
    avatar?: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  featuredImage: string;
  isHeroFeatured?: boolean;
  isTrending?: boolean;
  source: string;
  tags: string[];
}

export interface HeritageSite {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  category: 'historical-monument' | 'mosque-temple' | 'river-port' | 'natural-beauty' | 'archaeological';
  categoryLabelBn: string;
  historyBn: string;
  culturalSignificanceBn: string;
  visitingGuidanceBn: string;
  transportInfoBn: string;
  addressBn: string;
  mapCoords: { lat: number; lng: number };
  mainImage: string;
  galleryImages: string[];
  verifiedDate: string;
  officialSource: string;
}

export interface HealthcareFacility {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'govt-hospital' | 'upazila-health-complex' | 'private-clinic' | 'diagnostic-center' | 'ambulance';
  categoryLabelBn: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  addressBn: string;
  phone: string;
  emergencyPhone?: string;
  availableServices: string[];
  bedCount?: number;
  is24x7: boolean;
  verifiedDate: string;
  officialSource: string;
  mapCoords?: { lat: number; lng: number };
}

export interface BloodDonor {
  id: string;
  donorNameBn: string;
  donorNameEn?: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  unionNameBn?: string;
  areaBn: string;
  phone?: string;
  contactNumberMasked: string; // Privacy protected
  altPhone?: string;
  directContactAvailable: boolean;
  lastDonationDate?: string;
  totalDonationsCount?: number;
  availabilityStatus: 'available' | 'busy' | 'recently_donated';
  isVerified?: boolean;
  isApproved?: boolean;
  verifiedDate: string;
  verifiedBy?: string;
  emergencyAvailable?: boolean;
  registeredSince: string;
  notes?: string;
}

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  nid?: string;
  jela?: string;
  upazila?: string;
  union?: string;
  gram?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface BloodRequest {
  id: string;
  userId?: string;
  patientNameBn: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  bagsNeeded: number;
  hospitalNameBn: string;
  problemDescription: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  contactNumber: string;
  urgencyDate?: string;
  status: 'pending' | 'approved' | 'managed' | 'cancelled';
  createdAt?: string;
}

export interface PoliceContact {
  id: string;
  officeNameBn: string;
  officeNameEn: string;
  designationBn: string;
  officerNameBn?: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  category: 'thana' | 'oc' | 'uno' | 'fire-service' | 'river-police' | 'emergency-control';
  phone: string;
  altPhone?: string;
  addressBn: string;
  verifiedDate: string;
  officialSource: string;
}

export interface CommunityReport {
  id: string;
  userId?: string;
  trackingCode?: string;
  titleBn: string;
  descriptionBn: string;
  category: 'damaged-road' | 'river-erosion' | 'flood-embankment' | 'waterlogging' | 'school-hazard' | 'public-service' | 'corruption' | 'other';
  categoryLabelBn: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  unionNameBn?: string;
  locationDetailsBn: string;
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  updatedAt: string;
  reporterNameMasked: string;
  reporterPhoneMasked?: string;
  upvotesCount: number;
  resolutionNotesBn?: string;
  departmentAssigned?: string;
  assignedOfficer?: string;
  images: string[];
}

export interface ScamAlert {
  id: string;
  userId?: string;
  titleBn: string;
  summaryBn: string;
  detailsBn: string;
  scamCategory: 'fake-jobs' | 'microcredit-fraud' | 'land-char-compensation' | 'online-shopping' | 'lottery-sms' | 'visa-fraud' | 'impersonation' | 'other';
  scamCategoryLabelBn: string;
  targetType?: 'individual' | 'company'; // ব্যক্তি নাকি কোম্পানি / প্রতিষ্ঠান
  suspectName?: string; // ব্যক্তি বা প্রতিষ্ঠানের নাম
  suspectContact?: string; // ফোন নম্বর / ফেসবুক পেজ বা লিংক
  images?: string[]; // প্রমাণস্বরূপ ছবি বা স্ক্রিনশট
  severity: 'low' | 'medium' | 'high' | 'critical';
  targetedAreaUpazila?: string;
  reportedIncidentsCount?: number;
  preventionTipsBn: string[];
  verifiedBy: string;
  publishedDate: string;
  isApproved?: boolean;
  status?: 'active' | 'contained' | 'archived';
}

export interface DirectoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'college' | 'school' | 'madrasa' | 'govt-office' | 'market' | 'ghat';
  categoryLabelBn: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  addressBn: string;
  phone?: string;
  establishedYear?: number;
  verifiedDate: string;
}

export type LostNoticeCategory = 'person' | 'document' | 'vehicle' | 'valuable' | 'other';

export const LOST_NOTICE_CATEGORIES: { id: LostNoticeCategory; labelBn: string }[] = [
  { id: 'person', labelBn: 'নিখোঁজ ব্যক্তি' },
  { id: 'document', labelBn: 'আইডি কার্ড ও সনদ' },
  { id: 'vehicle', labelBn: 'যানবাহন ও সাইকেল' },
  { id: 'valuable', labelBn: 'মোবাইল ও মূল্যবান জিনিস' },
  { id: 'other', labelBn: 'অন্যান্য' },
];

export const LOST_NOTICE_CATEGORY_LABELS: Record<string, string> = {
  all: 'সকল ক্যাটাগরি',
  person: 'নিখোঁজ ব্যক্তি',
  document: 'আইডি কার্ড ও সনদ',
  vehicle: 'যানবাহন ও সাইকেল',
  valuable: 'মোবাইল ও মূল্যবান জিনিস',
  other: 'অন্যান্য'
};

export interface LostNotice {
  id: string;
  userId?: string;
  trackingNumber?: string;
  type: 'lost' | 'found'; // হারানো বা কুড়িয়ে পাওয়া
  category: LostNoticeCategory;
  categoryLabelBn: string;
  titleBn: string;
  descriptionBn: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  locationDetailsBn: string;
  date: string;
  time?: string;
  gdNumber?: string;
  gdPoliceStation?: string;
  contactName: string;
  contactPhone: string;
  altContactPhone?: string;
  rewardBn?: string;
  status: 'active' | 'resolved' | 'expired';
  verifiedByAdmin?: boolean;
  images?: string[];
}
