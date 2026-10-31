import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/);
const dbUrl = match ? match[1] : null;

if (!dbUrl) {
  console.error('No DATABASE_URL found!');
  process.exit(1);
}

const sql = neon(dbUrl);

async function seedData() {
  console.log('Seeding initial data into Neon database...');

  try {
    // 1. Seed Blood Donors if empty
    const donors = await sql`SELECT COUNT(*) FROM blood_donors`;
    if (parseInt(donors[0].count) === 0) {
      console.log('Seeding blood donors...');
      await sql`
        INSERT INTO blood_donors (id, donor_name_bn, donor_name_en, blood_group, upazila_id, upazila_name_bn, area_bn, phone, contact_number_masked, availability_status, is_verified, verified_date, total_donations_count, emergency_available)
        VALUES 
        ('donor-1', 'মোঃ রফিকুল ইসলাম', 'Md. Rafiqul Islam', 'A+', 'kurigram-sadar', 'কুড়িগ্রাম সদর', 'কলেজ মোড়', '০১৭১১-২০০০২২', '০১৭১১-***০২২', 'available', true, 'আজ (অনুমোদিত)', 4, true),
        ('donor-2', 'তানভীর আহমেদ', 'Tanvir Ahmed', 'O+', 'ulipur', 'উলিপুর', 'বাজার চত্বর', '০১৭২২-৪৫৬৭৮৯', '০১৭২২-***৭৮৯', 'available', true, 'আজ (অনুমোদিত)', 6, true),
        ('donor-3', 'শাহিনা আক্তার', 'Shahina Akter', 'B+', 'nageshwari', 'নাগেশ্বরী', 'উপজেলা রোড', '০১৮১১-১২৩৪৫৬', '০১৮১১-***৪৫৬', 'available', true, 'গতকাল', 2, true),
        ('donor-4', 'আরিফুল হক', 'Ariful Haque', 'AB+', 'chilmari', 'চিলমারী', 'বন্দর এলাকা', '০১৯১১-৯৮৭৬৫৪', '০১৯১১-***৬৫৪', 'available', true, '৩ দিন আগে', 8, true);
      `;
    }

    // 2. Seed Community Reports if empty
    const reports = await sql`SELECT COUNT(*) FROM community_reports`;
    if (parseInt(reports[0].count) === 0) {
      console.log('Seeding community reports...');
      await sql`
        INSERT INTO community_reports (id, tracking_code, title_bn, description_bn, category, category_label_bn, upazila_id, upazila_name_bn, location_details_bn, status, priority, submitted_at, reporter_name_masked, reporter_phone_masked, upvotes_count)
        VALUES
        ('rep-1', 'KC-482019', 'ধরলা বাঁধ সংলগ্ন ভাঙন রোধে অবিলম্বে জিওব্যাগ ডাম্পিং প্রয়োজন', 'গত সপ্তাহের প্রবল স্রোতে ধরলা নদীর বাঁধের প্রায় ১০০ মিটার এলাকা মারাত্মকভাবে ক্ষতিগ্রস্ত হয়েছে। যেকোনো সময় মূল সড়ক নদীগর্ভে চলে যেতে পারে।', 'embankment-erosion', 'নদীভাঙন ও বাঁধ সংস্কার', 'kurigram-sadar', 'কুড়িগ্রাম সদর', 'পাঁচগাছী ইউনিয়ন, নদীর ডান তীর বাঁধ', 'submitted', 'critical', 'আজ', 'রাশেদুল... (নাগরিক)', '০১৭১১-***', 24),
        ('rep-2', 'KC-482020', 'চিলমারী বন্দর সংযোগ সড়কে তীব্র যানজট ও খানাখন্দ', 'বন্দর রোডে বৃষ্টির পানি জমে দীর্ঘদিনের ভাঙা গর্তগুলো এখন পুকুরে পরিণত হয়েছে। ভারী পণ্যবাহী ট্রাক প্রায়ই আটকে যাচ্ছে।', 'damaged-road', 'রাস্তাঘাট ও যোগাযোগ', 'chilmari', 'চিলমারী', 'চিলমারী নদীবন্দর সংলগ্ন প্রধান সড়ক', 'in_progress', 'high', 'গতকাল', 'জাহিদুল... (নাগরিক)', '০১৭২০-***', 18);
      `;
    }

    // 3. Seed Scam Alerts if empty
    const scams = await sql`SELECT COUNT(*) FROM scam_alerts`;
    if (parseInt(scams[0].count) === 0) {
      console.log('Seeding scam alerts...');
      await sql`
        INSERT INTO scam_alerts (id, title_bn, summary_bn, details_bn, scam_category, scam_category_label_bn, severity, prevention_tips_bn, verified_by, published_date)
        VALUES
        ('scam-1', 'উপজেলা প্রকল্প সহায়তা বা অনুদান পাইয়ে দেওয়ার ভুয়া ফোন কল সতর্কতা', 'কুড়িগ্রামের বিভিন্ন ইউনিয়নে সরকারি সহায়তা পাইয়ে দেওয়ার নামে বিকাশ ও নগদে অগ্রিম ফি চাওয়া হচ্ছে।', 'প্রতারক চক্র বিভিন্ন নম্বর থেকে ফোন দিয়ে নিজেদের উপজেলা নির্বাহী কর্মকর্তা (ইউএনও) বা জেলা সমাজসেবা কর্মকর্তা পরিচয় দিয়ে বিভিন্ন ভাতার কথা বলে টাকা দাবি করছে।', 'fake-govt-grant', 'সরকারি ভাতা ও প্রকল্প প্রতারণা', 'critical', ARRAY['সরকারি কোনো কর্মকর্তা কখনো ভাতার জন্য অগ্রিম টাকা চান না', 'অপরিচিত নম্বরে কোনো ওটিপি বা পিন নম্বর শেয়ার করবেন না', 'সন্দেহ হলে সরাসরি উপজেলা নির্বাহী কর্মকর্তার কার্যালয়ে যোগাযোগ করুন'], 'কুড়িগ্রাম জেলা প্রশাসন ও সাইবার হেল্পডেস্ক', '২০২৬-০৩-২০'),
        ('scam-2', 'চাকরি পাইয়ে দেওয়ার নামে সোনাহাট স্থলবন্দর ভুয়া নিয়োগ বিজ্ঞপ্তি', 'সোনাহাট স্থলবন্দরে ট্রাফিক সুপারভাইজার পদে লোক নিয়োগের ভুয়া সার্কুলার সামাজিক যোগাযোগমাধ্যমে ছড়ানো হচ্ছে।', 'একটি চক্র ভুয়া প্যাড তৈরি করে ফেসবুক ও হোয়াটসঅ্যাপে নিয়োগ বিজ্ঞপ্তি প্রকাশ করে সাধারণ তরুণদের কাছ থেকে ব্যাংক বা মোবাইল ব্যাংকিংয়ের মাধ্যমে টাকা আদায় করছে।', 'job-fraud', 'ভুয়া নিয়োগ প্রতারণা', 'high', ARRAY['অফিসিয়াল ওয়েবসাইট ব্যতীত সামাজিক মাধ্যমের ভুয়া বিজ্ঞপ্তিতে বিশ্বাস করবেন না', 'সরকারি স্থলবন্দর কর্তৃপক্ষ কখনো নগদ টাকায় চাকরি দেয় না', 'প্রতারিত হলে দ্রুত নিকটস্থ থানায় জিডি করুন'], 'ভূরুঙ্গামারী থানা ও সাইবার সিকিউরিটি সেল', '২০২৬-০৩-১৫');
      `;
    }

    // 4. Seed Lost Notices if empty
    const notices = await sql`SELECT COUNT(*) FROM lost_notices`;
    if (parseInt(notices[0].count) === 0) {
      console.log('Seeding lost notices...');
      await sql`
        INSERT INTO lost_notices (id, tracking_number, type, category, category_label_bn, title_bn, description_bn, upazila_id, upazila_name_bn, location_details_bn, event_date, contact_name, contact_phone, gd_number, reward_bn, status, is_verified)
        VALUES
        ('lost-1', 'LF-102931', 'lost', 'documents', 'জরুরি দলিলপত্র', 'কুড়িগ্রাম জজ কোর্ট চত্বরে জাতীয় পরিচয়পত্র ও জমির খতিয়ান ফাইল হারিয়েছে', 'একটি কালো ব্যাগে মূল এনআইডি, জমির পর্চা এবং প্রয়োজনীয় দলিল ছিল।', 'kurigram-sadar', 'কুড়িগ্রাম সদর', 'জজ কোর্ট মোড় থেকে পুরাতন পোস্ট অফিস রোড', 'আজ সকাল ১১টা', 'মোস্তাফিজুর রহমান', '০১৭১১-৮৮৯৯০০', 'জিডি নং- ৮৪২/২০২৬ (সদর থানা)', 'উপযুক্ত পুরষ্কার প্রদান করা হবে', 'active', true),
        ('lost-2', 'LF-102932', 'found', 'wallet', 'মানিব্যাগ প্রাপ্তি', 'উলিপুর বাজারে একটি বাদামি রঙের চামড়ার মানিব্যাগ পাওয়া গেছে', 'মানিব্যাগে কিছু টাকা ও একটি স্টুডেন্ট আইডি কার্ড রয়েছে। উপযুক্ত প্রমাণ দিয়ে যোগাযোগ করুন।', 'ulipur', 'উলিপুর', 'উলিপুর বাজার চত্বর, আল-আমিন মসজিদের সামনে', 'গতকাল বিকাল ৫টা', 'মোঃ কামরুল হাসান', '০১৭৩০-১১২২৩৩', NULL, NULL, 'active', true);
      `;
    }

    console.log('✅ Database seeded successfully with initial data!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  }
}

seedData();

