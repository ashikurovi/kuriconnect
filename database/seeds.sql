-- =========================================================================
-- Hamar Kurigram (হামার কুড়িগ্রাম) — Comprehensive Seed Data
-- =========================================================================

-- Insert 9 Upazilas
INSERT INTO upazilas (id, name_bn, name_en, slug, headquarters_bn, area_km2, population, unions_count, villages_count, overview_bn, literacy_rate, colleges_count, high_schools_count, health_centers_count, latitude, longitude)
VALUES
('kurigram-sadar', 'কুড়িগ্রাম সদর', 'Kurigram Sadar', 'kurigram-sadar', 'কুড়িগ্রাম শহর', 276.45, 312408, 8, 264, 'কুড়িগ্রাম সদর উপজেলা প্রশাসনিক ও বাণিজ্যিক কেন্দ্র। এটি ধরলা নদীর তীরে অবস্থিত।', '৬২.৪%', 14, 38, 12, 25.8103, 89.6500),
('ulipur', 'উলিপুর', 'Ulipur', 'ulipur', 'উলিপুর পৌরসভা', 458.48, 410890, 13, 418, 'উলিপুর আয়তন ও জনসংখ্যার দিক থেকে কুড়িগ্রামের বৃহত্তম উপজেলা। তিস্তা ও ব্রহ্মপুত্রের অববাহিকায় সমৃদ্ধ জনপদ।', '৫৮.৭%', 11, 46, 15, 25.6667, 89.6333),
('nageshwari', 'নাগেশ্বরী', 'Nageshwari', 'nageshwari', 'নাগেশ্বরী পৌরসভা', 415.80, 394255, 14, 367, 'নাগেশ্বরী উপজেলার ভেতর দিয়ে দুধকুমার ও গঙ্গাধর নদী প্রবাহিত। কৃষি ও ব্যবসা বাণিজ্যে অগ্রগণ্য।', '৫৭.২%', 9, 41, 14, 25.9667, 89.7000),
('bhurungamari', 'ভুরুঙ্গামারী', 'Bhurungamari', 'bhurungamari', 'ভুরুঙ্গামারী বাজার', 271.86, 231538, 10, 175, 'কুড়িগ্রামের সর্বউত্তরের সীমান্ত উপজেলা। সোনাহাট আন্তর্জাতিক স্থলবন্দর ও ঐতিহাসিক রেল সেতু অবস্থিত।', '৬৩.১%', 7, 30, 11, 26.1333, 89.7667),
('phulbari', 'ফুলবাড়ী', 'Phulbari', 'phulbari', 'ফুলবাড়ী বাজার', 163.63, 160250, 6, 164, 'ফুলবাড়ী উপজেলা নাওডাঙ্গা জমিদার বাড়ি ও ঐতিহাসিক দাসিয়ারছড়া ছিটমহল সমন্বয়ের জন্য পরিচিত।', '৬৪.৮%', 6, 26, 8, 25.9500, 89.5667),
('rajarhat', 'রাজারহাট', 'Rajarhat', 'rajarhat', 'রাজারহাট বাজার', 165.73, 182927, 7, 180, 'মুঘল আমলের ঐতিহ্যবাহী চান্দামারী মসজিদ ও সিন্দুরমতি দিঘির জন্য সুখ্যাত।', '৬৬.৫%', 8, 31, 9, 25.8000, 89.5500),
('chilmari', 'চিলমারী', 'Chilmari', 'chilmari', 'চিলমারী বন্দর', 224.97, 122841, 6, 133, 'ঐতিহাসিক ব্রহ্মপুত্র নদীবন্দর ও লোকসংগীতের ঐতিহ্যমণ্ডিত রমনা ফেরিঘাট।', '৫৫.৩%', 5, 22, 7, 25.5667, 89.6833),
('raumari', 'রৌমারী', 'Raumari', 'raumari', 'রৌমারী বাজার', 197.89, 198420, 6, 198, 'ব্রহ্মপুত্রের পূর্ব পাড়ে অবস্থিত রৌমারী মুক্তিযুদ্ধের সময় অবরুদ্ধমুক্ত স্বাধীন মুক্তাঞ্চল ছিল।', '৫৬.৪%', 6, 25, 8, 25.5500, 89.8500),
('char-rajibpur', 'চর রাজীবপুর', 'Char Rajibpur', 'char-rajibpur', 'রাজীবপুর বাজার', 111.03, 75230, 3, 99, 'ব্রহ্মপুত্রের চরাঞ্চলপ্রধান উপজেলা। চরের সংগ্রামশীল মানুষের জীবন ও কোদালকাটি রণক্ষেত্রের ইতিহাস।', '৫২.১%', 3, 16, 5, 25.4000, 89.8833)
ON CONFLICT (id) DO NOTHING;

-- Insert Healthcare Facilities
INSERT INTO healthcare_facilities (id, name_bn, name_en, category, category_label_bn, upazila_id, address_bn, phone, emergency_phone, available_services, bed_count, is_24x7, official_source, verified_date)
VALUES
(uuid_generate_v4(), 'কুড়িগ্রাম জেনারেল হাসপাতাল (২৫০ শয্যা)', 'Kurigram General Hospital (250 Bed)', 'govt-hospital', 'সরকারি জেলা সদর হাসপাতাল', 'kurigram-sadar', 'হাসপাতাল রোড, কুড়িগ্রাম শহর', '০২৫৮৯৯৬৫২১২', '০১৭৩০-৩২৪৫২১', ARRAY['জরুরি বিভাগ', 'আইসিইউ', 'ব্লাড ব্যাংক', 'ডায়ালিসিস'], 250, TRUE, 'সিভিল সার্জন কার্যালয়', '2026-10-28'),
(uuid_generate_v4(), 'উলিপুর উপজেলা স্বাস্থ্য কমপ্লেক্স', 'Ulipur Upazila Health Complex', 'upazila-health-complex', 'সরকারি উপজেলা স্বাস্থ্য কমপ্লেক্স', 'ulipur', 'হাসপাতাল মোড়, উলিপুর', '০২৫৮৯৯৬৬১২২', '০১৭৩০-৩২৪৫২৮', ARRAY['জরুরি সেবা', 'প্রসূতি কেয়ার', 'প্যাথলজি'], 50, TRUE, 'ইউএইচএফপিও উলিপুর', '2026-10-26')
ON CONFLICT DO NOTHING;

-- Insert Police Contacts
INSERT INTO police_contacts (id, office_name_bn, office_name_en, designation_bn, officer_name_bn, upazila_id, category, phone, alt_phone, address_bn, official_source, verified_date)
VALUES
(uuid_generate_v4(), 'কুড়িগ্রাম সদর থানা', 'Kurigram Sadar Police Station', 'অফিসার ইনচার্জ (ওসি)', 'মো: মাসুদ রানা', 'kurigram-sadar', 'oc', '০১৩২০-১৩৪২০০', '০২৫৮৯৯৬৫১১৩', 'থানা রোড, কুড়িগ্রাম', 'জেলা পুলিশ', '2026-10-25'),
(uuid_generate_v4(), 'কুড়িগ্রাম জেলা পুলিশ কন্ট্রোল রুম', 'Kurigram Police Control Room', 'ডিউটি অফিসার (২৪ ঘণ্টা)', NULL, 'kurigram-sadar', 'emergency-control', '০১৩২০-১৩৪০০০', '০২৫৮৯৯৬৫১১১', 'এসপি অফিস চত্বর', 'পুলিশ সুপার কার্যালয়', '2026-10-26')
ON CONFLICT DO NOTHING;
