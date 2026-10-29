-- =========================================================================
-- Hamar Kurigram (হামার কুড়িগ্রাম) — Normalized PostgreSQL Relational Schema
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Roles & Users (RBAC)
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'administrator',
  'editor',
  'reporter',
  'moderator',
  'directory_manager',
  'citizen'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name_bn VARCHAR(255) NOT NULL,
  full_name_en VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role_enum NOT NULL DEFAULT 'citizen',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Upazilas & Administrative Unions
CREATE TABLE upazilas (
  id VARCHAR(50) PRIMARY KEY, -- e.g. 'kurigram-sadar'
  name_bn VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  headquarters_bn VARCHAR(150) NOT NULL,
  area_km2 DECIMAL(8, 2) NOT NULL,
  population INT NOT NULL,
  unions_count INT NOT NULL DEFAULT 0,
  villages_count INT NOT NULL DEFAULT 0,
  overview_bn TEXT NOT NULL,
  overview_en TEXT,
  history_bn TEXT,
  literacy_rate VARCHAR(20),
  colleges_count INT DEFAULT 0,
  high_schools_count INT DEFAULT 0,
  health_centers_count INT DEFAULT 0,
  featured_image TEXT,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  boundary_geom GEOMETRY(Polygon, 4326),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE unions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upazila_id VARCHAR(50) REFERENCES upazilas(id) ON DELETE CASCADE,
  name_bn VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  ward_count INT DEFAULT 9,
  chairman_name_bn VARCHAR(150),
  parishad_phone VARCHAR(50),
  parishad_address_bn TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. News Articles & Categories
CREATE TYPE news_category_enum AS ENUM (
  'district',
  'upazila',
  'river-erosion',
  'agriculture',
  'education',
  'health',
  'heritage',
  'crime'
);

CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_bn VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  excerpt_bn TEXT NOT NULL,
  content_bn TEXT NOT NULL,
  category news_category_enum NOT NULL,
  upazila_id VARCHAR(50) REFERENCES upazilas(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name_bn VARCHAR(255) NOT NULL,
  author_role_bn VARCHAR(150),
  featured_image TEXT NOT NULL,
  is_hero_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  read_time_minutes INT DEFAULT 3,
  source VARCHAR(255) NOT NULL,
  tags TEXT[], -- array of tags
  published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Heritage Sites & Tourism
CREATE TYPE heritage_category_enum AS ENUM (
  'historical-monument',
  'mosque-temple',
  'river-port',
  'natural-beauty',
  'archaeological'
);

CREATE TABLE heritage_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name_bn VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  upazila_id VARCHAR(50) REFERENCES upazilas(id) ON DELETE RESTRICT,
  category heritage_category_enum NOT NULL,
  category_label_bn VARCHAR(100) NOT NULL,
  history_bn TEXT NOT NULL,
  cultural_significance_bn TEXT,
  visiting_guidance_bn TEXT,
  transport_info_bn TEXT,
  address_bn TEXT NOT NULL,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  main_image TEXT NOT NULL,
  gallery_images TEXT[],
  official_source VARCHAR(255),
  verified_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Healthcare Facilities & Ambulances
CREATE TYPE healthcare_category_enum AS ENUM (
  'govt-hospital',
  'upazila-health-complex',
  'private-clinic',
  'diagnostic-center',
  'ambulance'
);

CREATE TABLE healthcare_facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_bn VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  category healthcare_category_enum NOT NULL,
  category_label_bn VARCHAR(100) NOT NULL,
  upazila_id VARCHAR(50) REFERENCES upazilas(id) ON DELETE RESTRICT,
  address_bn TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  emergency_phone VARCHAR(50),
  available_services TEXT[],
  bed_count INT,
  is_24x7 BOOLEAN DEFAULT TRUE,
  official_source VARCHAR(255),
  verified_date DATE NOT NULL,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Blood Donors & Consent Controls (Privacy Safeguarded)
CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE donor_status_enum AS ENUM ('available', 'busy', 'recently_donated', 'deactivated');

CREATE TABLE blood_donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name_bn VARCHAR(255) NOT NULL,
  blood_group blood_group_enum NOT NULL,
  upazila_id VARCHAR(50) REFERENCES upazilas(id) ON DELETE RESTRICT,
  area_bn VARCHAR(255) NOT NULL,
  phone_encrypted VARCHAR(500) NOT NULL, -- Encrypted at rest
  phone_masked VARCHAR(50) NOT NULL,    -- Displayed publicly: 01711-***890
  consent_given BOOLEAN DEFAULT TRUE,
  last_donation_date DATE,
  availability_status donor_status_enum DEFAULT 'available',
  verified_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Police & Administrative Contacts
CREATE TYPE police_category_enum AS ENUM (
  'thana',
  'oc',
  'uno',
  'fire-service',
  'river-police',
  'emergency-control'
);

CREATE TABLE police_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  office_name_bn VARCHAR(255) NOT NULL,
  office_name_en VARCHAR(255) NOT NULL,
  designation_bn VARCHAR(150) NOT NULL,
  officer_name_bn VARCHAR(255),
  upazila_id VARCHAR(50) REFERENCES upazilas(id) ON DELETE RESTRICT,
  category police_category_enum NOT NULL,
  phone VARCHAR(50) NOT NULL,
  alt_phone VARCHAR(50),
  address_bn TEXT NOT NULL,
  official_source VARCHAR(255) NOT NULL,
  verified_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Community Reports & Citizen Problem Tracking
CREATE TYPE report_status_enum AS ENUM (
  'submitted',
  'under_review',
  'in_progress',
  'resolved',
  'rejected'
);

CREATE TABLE community_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_bn VARCHAR(500) NOT NULL,
  description_bn TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  category_label_bn VARCHAR(150) NOT NULL,
  upazila_id VARCHAR(50) REFERENCES upazilas(id) ON DELETE RESTRICT,
  location_details_bn TEXT NOT NULL,
  status report_status_enum DEFAULT 'submitted',
  reporter_name_masked VARCHAR(255) DEFAULT 'নাগরিক',
  reporter_phone_encrypted VARCHAR(500),
  upvotes_count INT DEFAULT 1,
  resolution_notes_bn TEXT,
  resolved_at TIMESTAMPTZ,
  images TEXT[],
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Scam Alerts & Fraud Prevention
CREATE TYPE scam_severity_enum AS ENUM ('critical', 'high', 'medium', 'low');

CREATE TABLE scam_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_bn VARCHAR(500) NOT NULL,
  summary_bn TEXT NOT NULL,
  details_bn TEXT NOT NULL,
  scam_category VARCHAR(100) NOT NULL,
  scam_category_label_bn VARCHAR(150) NOT NULL,
  severity scam_severity_enum NOT NULL DEFAULT 'high',
  prevention_tips_bn TEXT[] NOT NULL,
  verified_by VARCHAR(255) NOT NULL,
  published_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_name VARCHAR(255) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_news_upazila ON news_articles(upazila_id);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);
CREATE INDEX idx_blood_group ON blood_donors(blood_group);
CREATE INDEX idx_blood_upazila ON blood_donors(upazila_id);
CREATE INDEX idx_reports_status ON community_reports(status);
CREATE INDEX idx_reports_upazila ON community_reports(upazila_id);
