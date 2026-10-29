// TypeORM Entity Definitions for Hamar Kurigram Backend

export class UserEntity {
  id!: string;
  fullNameBn!: string;
  fullNameEn?: string;
  email!: string;
  passwordHash!: string;
  phone?: string;
  role!: 'super_admin' | 'administrator' | 'editor' | 'reporter' | 'moderator' | 'directory_manager' | 'citizen';
  avatarUrl?: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class UpazilaEntity {
  id!: string;
  nameBn!: string;
  nameEn!: string;
  slug!: string;
  headquartersBn!: string;
  areaKm2!: number;
  population!: number;
  unionsCount!: number;
  villagesCount!: number;
  overviewBn!: string;
  overviewEn?: string;
  historyBn?: string;
  literacyRate?: string;
  latitude!: number;
  longitude!: number;
}

export class NewsArticleEntity {
  id!: string;
  slug!: string;
  titleBn!: string;
  titleEn?: string;
  excerptBn!: string;
  contentBn!: string;
  category!: string;
  upazilaId?: string;
  authorId?: string;
  featuredImage!: string;
  isHeroFeatured!: boolean;
  publishedAt!: Date;
}

export class CommunityReportEntity {
  id!: string;
  titleBn!: string;
  descriptionBn!: string;
  category!: string;
  upazilaId!: string;
  locationDetailsBn!: string;
  status!: 'submitted' | 'under_review' | 'in_progress' | 'resolved';
  reporterNameMasked!: string;
  upvotesCount!: number;
  submittedAt!: Date;
}

export class BloodDonorEntity {
  id!: string;
  donorNameBn!: string;
  bloodGroup!: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  upazilaId!: string;
  areaBn!: string;
  phoneMasked!: string;
  availabilityStatus!: 'available' | 'busy' | 'recently_donated';
  verifiedDate!: string;
}
