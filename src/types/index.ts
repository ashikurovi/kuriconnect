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
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  areaBn: string;
  contactNumberMasked: string; // Privacy protected
  directContactAvailable: boolean;
  lastDonationDate?: string;
  availabilityStatus: 'available' | 'busy' | 'recently_donated';
  verifiedDate: string;
  registeredSince: string;
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
  titleBn: string;
  descriptionBn: string;
  category: 'damaged-road' | 'river-erosion' | 'flood-embankment' | 'waterlogging' | 'school-hazard' | 'public-service';
  categoryLabelBn: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  locationDetailsBn: string;
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved';
  submittedAt: string;
  updatedAt: string;
  reporterNameMasked: string;
  upvotesCount: number;
  resolutionNotesBn?: string;
  images: string[];
}

export interface ScamAlert {
  id: string;
  titleBn: string;
  summaryBn: string;
  detailsBn: string;
  scamCategory: 'fake-jobs' | 'microcredit-fraud' | 'land-char-compensation' | 'online-shopping' | 'lottery-sms';
  scamCategoryLabelBn: string;
  severity: 'high' | 'medium' | 'critical';
  publishedDate: string;
  verifiedBy: string;
  preventionTipsBn: string[];
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

export interface LostNotice {
  id: string;
  type: 'lost' | 'found'; // হারানো বা কুড়িয়ে পাওয়া
  category: 'person' | 'document' | 'vehicle' | 'valuable' | 'other';
  categoryLabelBn: string;
  titleBn: string;
  descriptionBn: string;
  upazilaId: UpazilaId;
  upazilaNameBn: string;
  locationDetailsBn: string;
  date: string;
  gdNumber?: string;
  contactName: string;
  contactPhone: string;
  rewardBn?: string;
  status: 'active' | 'resolved';
}
