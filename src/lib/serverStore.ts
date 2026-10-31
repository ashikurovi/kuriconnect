import { db } from './db';
import { BloodDonor, BloodRequest, CommunityReport, LostNotice, ScamAlert, AuthUser } from '@/types';
import { UPAZILAS } from '@/data/kurigramData';

export interface StoredUser extends AuthUser {
  password: string;
}

let schemaMigrationPromise: Promise<void> | null = null;
async function ensureUserIdColumns() {
  if (!schemaMigrationPromise) {
    schemaMigrationPromise = (async () => {
      try {
        await db.query(`ALTER TABLE blood_requests ADD COLUMN IF NOT EXISTS user_id TEXT;`);
      } catch {}
      try {
        await db.query(`ALTER TABLE lost_notices ADD COLUMN IF NOT EXISTS user_id TEXT;`);
      } catch {}
      try {
        await db.query(`ALTER TABLE community_reports ADD COLUMN IF NOT EXISTS user_id TEXT;`);
      } catch {}
      try {
        await db.query(`ALTER TABLE scam_alerts ADD COLUMN IF NOT EXISTS user_id TEXT;`);
      } catch {}
    })();
  }
  return schemaMigrationPromise;
}

export class DatabaseStore {
  // In-memory persistent users for both admin & regular citizens
  private users: StoredUser[] = [
    {
      id: 'usr-admin-1',
      name: 'প্রধান প্রশাসক (Admin)',
      email: 'admin@kuriconnect.org',
      phone: '01700000000',
      nid: '19851234567890123',
      password: 'admin123',
      role: 'admin',
      createdAt: '2026-01-01'
    },
    {
      id: 'usr-citizen-1',
      name: 'কুড়িগ্রাম সাধারণ নাগরিক (User)',
      email: 'user@kuriconnect.org',
      phone: '01711111111',
      nid: '19951234567890123',
      password: 'user123',
      role: 'user',
      createdAt: '2026-01-01'
    }
  ];

  // ===================== AUTH & USER MANAGEMENT =====================
  async authenticate(identifier: string, password: string): Promise<AuthUser | null> {
    const clean = identifier.trim().toLowerCase();
    const user = this.users.find(
      (u) =>
        (u.phone === clean || (u.email && u.email.toLowerCase() === clean) || (u.nid && u.nid === clean)) &&
        u.password === password
    );
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async registerUser(data: {
    name: string;
    phone: string;
    nid: string;
    email?: string;
    password: string;
    role?: 'admin' | 'user';
    jela?: string;
    upazila?: string;
    union?: string;
    gram?: string;
  }): Promise<{ user?: AuthUser; error?: string }> {
    const phone = data.phone.trim();
    const nid = data.nid.trim();
    const email = data.email?.trim().toLowerCase();

    const existing = this.users.find(
      (u) =>
        u.phone === phone ||
        (u.nid && u.nid === nid) ||
        (email && u.email && u.email.toLowerCase() === email)
    );
    if (existing) {
      if (existing.nid === nid) {
        return { error: 'এই জাতীয় পরিচয়পত্র (NID) নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে।' };
      }
      return { error: 'এই মোবাইল নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে।' };
    }

    const newUser: StoredUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      phone,
      nid,
      email: email || undefined,
      password: data.password,
      role: data.role === 'admin' ? 'admin' : 'user',
      jela: data.jela?.trim() || 'কুড়িগ্রাম',
      upazila: data.upazila?.trim() || undefined,
      union: data.union?.trim() || undefined,
      gram: data.gram?.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    this.users.unshift(newUser);

    const { password: _, ...safeUser } = newUser;
    return { user: safeUser };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async updateUserProfile(userId: string, data: {
    name?: string;
    phone?: string;
    email?: string;
    nid?: string;
    jela?: string;
    upazila?: string;
    union?: string;
    gram?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ user?: AuthUser; error?: string }> {
    const userIndex = this.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { error: 'ব্যবহারকারী পাওয়া যায়নি।' };
    }

    const targetUser = this.users[userIndex];

    // If changing password, verify current password
    if (data.newPassword) {
      if (!data.currentPassword) {
        return { error: 'পাসওয়ার্ড পরিবর্তনের জন্য বর্তমান পাসওয়ার্ড লিখতে হবে।' };
      }
      if (targetUser.password !== data.currentPassword) {
        return { error: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' };
      }
      if (data.newPassword.length < 4) {
        return { error: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' };
      }
      targetUser.password = data.newPassword;
    }

    // Check duplicate phone on other users
    if (data.phone && data.phone.trim() !== targetUser.phone) {
      const exists = this.users.find((u) => u.id !== userId && u.phone === data.phone?.trim());
      if (exists) return { error: 'এই মোবাইল নম্বরটি অন্য একটি অ্যাকাউন্টে ব্যবহৃত হয়েছে।' };
      targetUser.phone = data.phone.trim();
    }

    // Check duplicate email on other users
    if (data.email && data.email.trim().toLowerCase() !== (targetUser.email || '')) {
      const cleanEmail = data.email.trim().toLowerCase();
      const exists = this.users.find((u) => u.id !== userId && u.email?.toLowerCase() === cleanEmail);
      if (exists) return { error: 'এই ইমেইলটি অন্য একটি অ্যাকাউন্টে ব্যবহৃত হয়েছে।' };
      targetUser.email = cleanEmail;
    }

    // Check duplicate nid on other users
    if (data.nid && data.nid.trim() !== (targetUser.nid || '')) {
      const cleanNid = data.nid.trim().replace(/[\s-]/g, '');
      if (cleanNid.length < 10) {
        return { error: 'সঠিক জাতীয় পরিচয়পত্র (NID) নম্বর প্রদান করুন (কমপক্ষে ১০ ডিজিট)।' };
      }
      const exists = this.users.find((u) => u.id !== userId && u.nid === cleanNid);
      if (exists) return { error: 'এই জাতীয় পরিচয়পত্র নম্বরটি অন্য একটি অ্যাকাউন্টে ব্যবহৃত হয়েছে।' };
      targetUser.nid = cleanNid;
    }

    if (data.name && data.name.trim()) {
      targetUser.name = data.name.trim();
    }
    if (data.jela !== undefined) {
      targetUser.jela = data.jela.trim() || undefined;
    }
    if (data.upazila !== undefined) {
      targetUser.upazila = data.upazila.trim() || undefined;
    }
    if (data.union !== undefined) {
      targetUser.union = data.union.trim() || undefined;
    }
    if (data.gram !== undefined) {
      targetUser.gram = data.gram.trim() || undefined;
    }

    const { password: _, ...safeUser } = targetUser;
    return { user: safeUser };
  }

  async getAllUsers(): Promise<AuthUser[]> {
    return this.users.map(({ password: _, ...safeUser }) => safeUser);
  }
  // ===================== BLOOD DONORS =====================
  async getBloodDonors(params?: {
    bloodGroup?: string;
    upazilaId?: string;
    search?: string;
    limit?: number;
    approvedOnly?: boolean;
  }) {
    try {
      let query = `SELECT * FROM blood_donors WHERE 1=1`;
      const values: any[] = [];
      let idx = 1;

      // Filter by approval: by default, landing & public pages only see approved donors
      if (params?.approvedOnly) {
        query += ` AND is_approved = true`;
      }
      if (params?.bloodGroup && params.bloodGroup !== 'all') {
        query += ` AND blood_group = $${idx++}`;
        values.push(params.bloodGroup);
      }
      if (params?.upazilaId && params.upazilaId !== 'all') {
        query += ` AND upazila_id = $${idx++}`;
        values.push(params.upazilaId);
      }
      if (params?.search) {
        query += ` AND (LOWER(donor_name_bn) LIKE $${idx} OR LOWER(area_bn) LIKE $${idx})`;
        values.push(`%${params.search.toLowerCase()}%`);
        idx++;
      }
      query += ` ORDER BY created_at DESC`;
      if (params?.limit) {
        query += ` LIMIT $${idx++}`;
        values.push(params.limit);
      }

      const rows = await db.query<any>(query, values);
      return rows.map((r) => ({
        id: r.id,
        donorNameBn: r.donor_name_bn,
        donorNameEn: r.donor_name_en,
        bloodGroup: r.blood_group,
        upazilaId: r.upazila_id,
        upazilaNameBn: r.upazila_name_bn,
        unionNameBn: r.union_name_bn,
        areaBn: r.area_bn,
        phone: r.phone,
        contactNumberMasked: r.contact_number_masked,
        directContactAvailable: r.direct_contact_available,
        lastDonationDate: r.last_donation_date,
        availabilityStatus: r.availability_status || 'available',
        isVerified: r.is_verified,
        isApproved: r.is_approved ?? false,
        verifiedDate: r.verified_date,
        registeredSince: r.registered_since,
        totalDonationsCount: r.total_donations_count,
        emergencyAvailable: r.emergency_available,
        notes: r.notes
      })) as BloodDonor[];
    } catch (err) {
      console.error('DatabaseStore.getBloodDonors error:', err);
      return [];
    }
  }

  async addBloodDonor(data: Partial<BloodDonor> & { donorNameBn: string; bloodGroup: BloodDonor['bloodGroup']; phone?: string }) {
    const upazila = UPAZILAS.find((u) => u.id === data.upazilaId);
    const rawPhone = data.phone || '০১৭১১-০০০৪৫৬';
    const masked = rawPhone.length > 5
      ? `${rawPhone.slice(0, 5)}-***${rawPhone.slice(-3)}`
      : '০১৭১১-***৪৫৬';
    const id = `donor-${Date.now()}`;
    const upazilaId = (data.upazilaId as any) || 'kurigram-sadar';
    const upazilaNameBn = upazila ? upazila.nameBn : 'কুড়িগ্রাম সদর';

    // Requires admin approval (is_approved = false by default)
    await db.query(
      `INSERT INTO blood_donors (
        id, donor_name_bn, donor_name_en, blood_group, upazila_id, upazila_name_bn, union_name_bn,
        area_bn, phone, contact_number_masked, direct_contact_available, availability_status, last_donation_date,
        is_verified, is_approved, verified_date, registered_since, total_donations_count, emergency_available, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
      [
        id,
        data.donorNameBn,
        data.donorNameEn || '',
        data.bloodGroup,
        upazilaId,
        upazilaNameBn,
        data.unionNameBn || '',
        data.areaBn || 'সদর',
        rawPhone,
        masked,
        true,
        data.availabilityStatus || 'available',
        data.lastDonationDate || null,
        true,
        false, // Pending approval
        'অপেক্ষমাণ (অনুমোদন প্রয়োজন)',
        new Date().toISOString().split('T')[0],
        data.totalDonationsCount || 1,
        data.emergencyAvailable ?? true,
        data.notes || ''
      ]
    );

    return {
      id,
      donorNameBn: data.donorNameBn,
      donorNameEn: data.donorNameEn || '',
      bloodGroup: data.bloodGroup,
      upazilaId,
      upazilaNameBn,
      unionNameBn: data.unionNameBn || '',
      areaBn: data.areaBn || 'সদর',
      phone: rawPhone,
      contactNumberMasked: masked,
      directContactAvailable: true,
      lastDonationDate: data.lastDonationDate,
      availabilityStatus: data.availabilityStatus || 'available',
      isVerified: true,
      isApproved: false,
      verifiedDate: 'অপেক্ষমাণ (অনুমোদন প্রয়োজন)',
      registeredSince: new Date().toISOString().split('T')[0],
      totalDonationsCount: data.totalDonationsCount || 1,
      emergencyAvailable: data.emergencyAvailable ?? true,
      notes: data.notes || ''
    } as BloodDonor;
  }

  async updateBloodDonor(id: string, updates: Partial<BloodDonor>) {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (updates.isApproved !== undefined) {
        setClauses.push(`is_approved = $${idx++}`);
        values.push(updates.isApproved);
        if (updates.isApproved) {
          setClauses.push(`verified_date = $${idx++}`);
          values.push('অনুমোদিত');
        }
      }
      if (updates.availabilityStatus !== undefined) {
        setClauses.push(`availability_status = $${idx++}`);
        values.push(updates.availabilityStatus);
      }
      if (updates.lastDonationDate !== undefined) {
        setClauses.push(`last_donation_date = $${idx++}`);
        values.push(updates.lastDonationDate || null);
      }
      if (updates.totalDonationsCount !== undefined) {
        setClauses.push(`total_donations_count = $${idx++}`);
        values.push(Number(updates.totalDonationsCount) || 1);
      }
      if (updates.emergencyAvailable !== undefined) {
        setClauses.push(`emergency_available = $${idx++}`);
        values.push(updates.emergencyAvailable);
      }
      if (updates.areaBn !== undefined) {
        setClauses.push(`area_bn = $${idx++}`);
        values.push(updates.areaBn);
      }
      if (updates.unionNameBn !== undefined) {
        setClauses.push(`union_name_bn = $${idx++}`);
        values.push(updates.unionNameBn);
      }
      if (updates.notes !== undefined) {
        setClauses.push(`notes = $${idx++}`);
        values.push(updates.notes);
      }

      if (setClauses.length > 0) {
        values.push(id);
        await db.query(`UPDATE blood_donors SET ${setClauses.join(', ')} WHERE id = $${idx}`, values);
      }

      const rows = await db.query<any>(`SELECT * FROM blood_donors WHERE id = $1`, [id]);
      if (!rows || rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        donorNameBn: r.donor_name_bn,
        donorNameEn: r.donor_name_en,
        bloodGroup: r.blood_group,
        upazilaId: r.upazila_id,
        upazilaNameBn: r.upazila_name_bn,
        unionNameBn: r.union_name_bn,
        areaBn: r.area_bn,
        phone: r.phone,
        contactNumberMasked: r.contact_number_masked,
        directContactAvailable: r.direct_contact_available,
        lastDonationDate: r.last_donation_date,
        availabilityStatus: r.availability_status || 'available',
        isVerified: r.is_verified,
        isApproved: r.is_approved ?? false,
        verifiedDate: r.verified_date,
        registeredSince: r.registered_since,
        totalDonationsCount: r.total_donations_count,
        emergencyAvailable: r.emergency_available,
        notes: r.notes
      } as BloodDonor;
    } catch (err) {
      console.error('updateBloodDonor error:', err);
      return null;
    }
  }

  async getDonorByPhone(phone: string, userId?: string): Promise<BloodDonor | null> {
    if (!phone && !userId) return null;

    // Convert Bengali numerals to English and extract digits
    const bnToEnMap: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    const enToBnMap: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };

    const cleanInput = (phone || '').replace(/[০-৯]/g, (d) => bnToEnMap[d] || d);
    const digitsOnly = cleanInput.replace(/\D/g, '');
    const last10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
    const last8 = digitsOnly.length >= 8 ? digitsOnly.slice(-8) : digitsOnly;
    const bnLast10 = last10.replace(/[0-9]/g, (d) => enToBnMap[d] || d);
    const bnLast8 = last8.replace(/[0-9]/g, (d) => enToBnMap[d] || d);

    try {
      // 1. Direct SQL check with patterns
      const searchTerms: string[] = [];
      if (last10) searchTerms.push(`%${last10}%`);
      if (bnLast10 && bnLast10 !== last10) searchTerms.push(`%${bnLast10}%`);
      if (last8 && last8 !== last10) searchTerms.push(`%${last8}%`);
      if (bnLast8 && bnLast8 !== bnLast10) searchTerms.push(`%${bnLast8}%`);

      if (searchTerms.length > 0) {
        const placeholders = searchTerms.map((_, i) => `phone LIKE $${i + 1}`).join(' OR ');
        const rows = await db.query<any>(
          `SELECT * FROM blood_donors WHERE ${placeholders} LIMIT 1`,
          searchTerms
        );

        if (rows && rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            donorNameBn: r.donor_name_bn,
            donorNameEn: r.donor_name_en,
            bloodGroup: r.blood_group,
            upazilaId: r.upazila_id,
            upazilaNameBn: r.upazila_name_bn,
            unionNameBn: r.union_name_bn,
            areaBn: r.area_bn,
            phone: r.phone,
            contactNumberMasked: r.contact_number_masked,
            directContactAvailable: r.direct_contact_available,
            lastDonationDate: r.last_donation_date,
            availabilityStatus: r.availability_status || 'available',
            isVerified: r.is_verified,
            isApproved: r.is_approved ?? false,
            verifiedDate: r.verified_date,
            registeredSince: r.registered_since,
            totalDonationsCount: r.total_donations_count,
            emergencyAvailable: r.emergency_available,
            notes: r.notes
          } as BloodDonor;
        }
      }

      // 2. Fallback: inspect rows in JavaScript for maximum normalization tolerance
      const allDonors = await db.query<any>(`SELECT * FROM blood_donors LIMIT 300`);
      if (allDonors && allDonors.length > 0) {
        const matched = allDonors.find((r: any) => {
          if (!r.phone) return false;
          const rowEnDigits = r.phone.replace(/[০-৯]/g, (d: string) => bnToEnMap[d] || d).replace(/\D/g, '');
          if (last10 && rowEnDigits.includes(last10)) return true;
          if (last8 && rowEnDigits.includes(last8)) return true;
          return false;
        });

        if (matched) {
          const r = matched;
          return {
            id: r.id,
            donorNameBn: r.donor_name_bn,
            donorNameEn: r.donor_name_en,
            bloodGroup: r.blood_group,
            upazilaId: r.upazila_id,
            upazilaNameBn: r.upazila_name_bn,
            unionNameBn: r.union_name_bn,
            areaBn: r.area_bn,
            phone: r.phone,
            contactNumberMasked: r.contact_number_masked,
            directContactAvailable: r.direct_contact_available,
            lastDonationDate: r.last_donation_date,
            availabilityStatus: r.availability_status || 'available',
            isVerified: r.is_verified,
            isApproved: r.is_approved ?? false,
            verifiedDate: r.verified_date,
            registeredSince: r.registered_since,
            totalDonationsCount: r.total_donations_count,
            emergencyAvailable: r.emergency_available,
            notes: r.notes
          } as BloodDonor;
        }
      }

      return null;
    } catch (err) {
      console.error('DatabaseStore.getDonorByPhone error:', err);
      return null;
    }
  }

  async deleteBloodDonor(id: string) {
    try {
      await db.query(`DELETE FROM blood_donors WHERE id = $1`, [id]);
      return true;
    } catch {
      return false;
    }
  }

  // ===================== BLOOD REQUESTS (জরুরি রক্তের আবেদন) =====================
  async getBloodRequests(params?: { status?: string; upazilaId?: string; bloodGroup?: string; userId?: string; limit?: number }) {
    await ensureUserIdColumns();
    try {
      let query = `SELECT * FROM blood_requests WHERE 1=1`;
      const values: any[] = [];
      let idx = 1;

      if (params?.status && params.status !== 'all') {
        query += ` AND status = $${idx++}`;
        values.push(params.status);
      }
      if (params?.upazilaId && params.upazilaId !== 'all') {
        query += ` AND upazila_id = $${idx++}`;
        values.push(params.upazilaId);
      }
      if (params?.bloodGroup && params.bloodGroup !== 'all') {
        query += ` AND blood_group = $${idx++}`;
        values.push(params.bloodGroup);
      }
      if (params?.userId && params.userId !== 'all') {
        query += ` AND user_id = $${idx++}`;
        values.push(params.userId);
      }
      query += ` ORDER BY created_at DESC`;
      if (params?.limit) {
        query += ` LIMIT $${idx++}`;
        values.push(params.limit);
      }

      const rows = await db.query<any>(query, values);
      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        patientNameBn: r.patient_name_bn,
        bloodGroup: r.blood_group,
        bagsNeeded: r.bags_needed,
        hospitalNameBn: r.hospital_name_bn,
        problemDescription: r.problem_description,
        upazilaId: r.upazila_id,
        upazilaNameBn: r.upazila_name_bn,
        contactNumber: r.contact_number,
        urgencyDate: r.urgency_date,
        status: r.status,
        createdAt: r.created_at
      })) as BloodRequest[];
    } catch (err: any) {
      if (err?.code === '42703' || String(err?.message || '').includes('user_id')) {
        try {
          await db.query(`ALTER TABLE blood_requests ADD COLUMN IF NOT EXISTS user_id TEXT;`);
        } catch {}
        if (params?.userId) return [];
      }
      console.error('DatabaseStore.getBloodRequests error:', err);
      return [];
    }
  }

  async addBloodRequest(data: {
    userId?: string;
    patientNameBn: string;
    bloodGroup: BloodRequest['bloodGroup'];
    bagsNeeded: number;
    hospitalNameBn: string;
    problemDescription: string;
    upazilaId?: string;
    contactNumber: string;
    urgencyDate?: string;
  }) {
    const upazila = UPAZILAS.find((u) => u.id === data.upazilaId);
    const id = `req-${Date.now()}`;
    const upazilaId = (data.upazilaId as any) || 'kurigram-sadar';
    const upazilaNameBn = upazila ? upazila.nameBn : 'কুড়িগ্রাম সদর';

    try {
      await db.query(
        `INSERT INTO blood_requests (
          id, patient_name_bn, blood_group, bags_needed, hospital_name_bn, problem_description,
          upazila_id, upazila_name_bn, contact_number, urgency_date, status, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          id,
          data.patientNameBn,
          data.bloodGroup,
          data.bagsNeeded || 1,
          data.hospitalNameBn,
          data.problemDescription,
          upazilaId,
          upazilaNameBn,
          data.contactNumber,
          data.urgencyDate || 'আজকের মধ্যে',
          'approved', // Auto-approved: emergency blood requests are instantly published
          data.userId || null
        ]
      );
    } catch {
      await db.query(
        `INSERT INTO blood_requests (
          id, patient_name_bn, blood_group, bags_needed, hospital_name_bn, problem_description,
          upazila_id, upazila_name_bn, contact_number, urgency_date, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          id,
          data.patientNameBn,
          data.bloodGroup,
          data.bagsNeeded || 1,
          data.hospitalNameBn,
          data.problemDescription,
          upazilaId,
          upazilaNameBn,
          data.contactNumber,
          data.urgencyDate || 'আজকের মধ্যে',
          'approved'
        ]
      );
    }

    return {
      id,
      userId: data.userId,
      patientNameBn: data.patientNameBn,
      bloodGroup: data.bloodGroup,
      bagsNeeded: data.bagsNeeded || 1,
      hospitalNameBn: data.hospitalNameBn,
      problemDescription: data.problemDescription,
      upazilaId,
      upazilaNameBn,
      contactNumber: data.contactNumber,
      urgencyDate: data.urgencyDate || 'আজকের মধ্যে',
      status: 'approved'
    } as BloodRequest;
  }

  async updateBloodRequest(id: string, updates: Partial<BloodRequest>) {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (updates.status !== undefined) {
        setClauses.push(`status = $${idx++}`);
        values.push(updates.status);
      }

      if (setClauses.length > 0) {
        values.push(id);
        await db.query(`UPDATE blood_requests SET ${setClauses.join(', ')} WHERE id = $${idx}`, values);
      }

      const rows = await db.query<any>(`SELECT * FROM blood_requests WHERE id = $1`, [id]);
      return rows[0] || null;
    } catch {
      return null;
    }
  }

  async deleteBloodRequest(id: string) {
    try {
      await db.query(`DELETE FROM blood_requests WHERE id = $1`, [id]);
      return true;
    } catch {
      return false;
    }
  }

  // ===================== COMMUNITY REPORTS =====================
  async getReports(params?: { status?: string; upazilaId?: string; category?: string; userId?: string; search?: string; limit?: number }) {
    await ensureUserIdColumns();
    try {
      let query = `SELECT * FROM community_reports WHERE 1=1`;
      const values: any[] = [];
      let idx = 1;

      if (params?.status && params.status !== 'all') {
        query += ` AND status = $${idx++}`;
        values.push(params.status);
      }
      if (params?.upazilaId && params.upazilaId !== 'all') {
        query += ` AND upazila_id = $${idx++}`;
        values.push(params.upazilaId);
      }
      if (params?.category && params.category !== 'all') {
        query += ` AND category = $${idx++}`;
        values.push(params.category);
      }
      if (params?.userId && params.userId !== 'all') {
        query += ` AND user_id = $${idx++}`;
        values.push(params.userId);
      }
      if (params?.search) {
        query += ` AND (LOWER(title_bn) LIKE $${idx} OR LOWER(location_details_bn) LIKE $${idx})`;
        values.push(`%${params.search.toLowerCase()}%`);
        idx++;
      }
      query += ` ORDER BY created_at DESC`;
      if (params?.limit) {
        query += ` LIMIT $${idx++}`;
        values.push(params.limit);
      }

      const rows = await db.query<any>(query, values);
      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        trackingCode: r.tracking_code,
        titleBn: r.title_bn,
        descriptionBn: r.description_bn,
        category: r.category,
        categoryLabelBn: r.category_label_bn || 'নাগরিক সেবা ও জনসমস্যা',
        upazilaId: r.upazila_id,
        upazilaNameBn: r.upazila_name_bn,
        locationDetailsBn: r.location_details_bn,
        status: r.status,
        priority: r.priority,
        submittedAt: r.submitted_at || 'আজ',
        updatedAt: r.updated_at || 'আজ',
        reporterNameMasked: r.reporter_name_masked,
        reporterPhoneMasked: r.reporter_phone_masked,
        upvotesCount: r.upvotes_count || 1,
        images: r.images || []
      })) as CommunityReport[];
    } catch (err: any) {
      if (err?.code === '42703' || String(err?.message || '').includes('user_id')) {
        try {
          await db.query(`ALTER TABLE community_reports ADD COLUMN IF NOT EXISTS user_id TEXT;`);
        } catch {}
        if (params?.userId) return [];
      }
      console.error('DatabaseStore.getReports error:', err);
      return [];
    }
  }

  async addReport(data: {
    userId?: string;
    titleBn: string;
    descriptionBn: string;
    locationDetailsBn: string;
    category?: CommunityReport['category'];
    upazilaId?: string;
    reporterName?: string;
    reporterPhone?: string;
    priority?: CommunityReport['priority'];
    images?: string[];
  }) {
    const upazila = UPAZILAS.find((u) => u.id === data.upazilaId);
    const trackingCode = `KC-${Date.now().toString().slice(-6)}`;
    const id = `rep-${Date.now()}`;
    const upazilaId = (data.upazilaId as any) || 'kurigram-sadar';
    const upazilaNameBn = upazila ? upazila.nameBn : 'কুড়িগ্রাম সদর';
    const reporterNameMasked = data.reporterName ? `${data.reporterName.charAt(0)}... (নাগরিক)` : 'নাম প্রকাশে অনিচ্ছুক';
    const reporterPhoneMasked = data.reporterPhone ? `${data.reporterPhone.slice(0, 5)}-***` : undefined;
    const images = Array.isArray(data.images) ? data.images : [];

    try {
      await db.query(
        `INSERT INTO community_reports (
          id, tracking_code, title_bn, description_bn, category, category_label_bn,
          upazila_id, upazila_name_bn, location_details_bn, status, priority,
          submitted_at, updated_at, reporter_name_masked, reporter_phone_masked, upvotes_count, images, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          id,
          trackingCode,
          data.titleBn,
          data.descriptionBn,
          data.category || 'damaged-road',
          'নাগরিক সেবা ও জনসমস্যা',
          upazilaId,
          upazilaNameBn,
          data.locationDetailsBn,
          'submitted',
          data.priority || 'medium',
          'আজ',
          'আজ',
          reporterNameMasked,
          reporterPhoneMasked || null,
          1,
          images,
          data.userId || null
        ]
      );
    } catch {
      await db.query(
        `INSERT INTO community_reports (
          id, tracking_code, title_bn, description_bn, category, category_label_bn,
          upazila_id, upazila_name_bn, location_details_bn, status, priority,
          submitted_at, updated_at, reporter_name_masked, reporter_phone_masked, upvotes_count, images
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          id,
          trackingCode,
          data.titleBn,
          data.descriptionBn,
          data.category || 'damaged-road',
          'নাগরিক সেবা ও জনসমস্যা',
          upazilaId,
          upazilaNameBn,
          data.locationDetailsBn,
          'submitted',
          data.priority || 'medium',
          'আজ',
          'আজ',
          reporterNameMasked,
          reporterPhoneMasked || null,
          1,
          images
        ]
      );
    }

    return {
      id,
      userId: data.userId,
      trackingCode,
      titleBn: data.titleBn,
      descriptionBn: data.descriptionBn,
      category: data.category || 'damaged-road',
      categoryLabelBn: 'নাগরিক সেবা ও জনসমস্যা',
      upazilaId,
      upazilaNameBn,
      locationDetailsBn: data.locationDetailsBn,
      status: 'submitted',
      priority: data.priority || 'medium',
      submittedAt: 'আজ',
      updatedAt: 'আজ',
      reporterNameMasked,
      reporterPhoneMasked,
      upvotesCount: 1,
      images
    } as CommunityReport;
  }

  async updateReport(id: string, updates: Partial<CommunityReport>) {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (updates.status !== undefined) {
        setClauses.push(`status = $${idx++}`);
        values.push(updates.status);
      }
      if (updates.priority !== undefined) {
        setClauses.push(`priority = $${idx++}`);
        values.push(updates.priority);
      }
      if (updates.titleBn !== undefined) {
        setClauses.push(`title_bn = $${idx++}`);
        values.push(updates.titleBn);
      }
      if (updates.descriptionBn !== undefined) {
        setClauses.push(`description_bn = $${idx++}`);
        values.push(updates.descriptionBn);
      }
      if (updates.locationDetailsBn !== undefined) {
        setClauses.push(`location_details_bn = $${idx++}`);
        values.push(updates.locationDetailsBn);
      }

      setClauses.push(`updated_at = $${idx++}`);
      values.push('আজ');

      if (setClauses.length > 0) {
        values.push(id);
        await db.query(`UPDATE community_reports SET ${setClauses.join(', ')} WHERE id = $${idx}`, values);
      }

      const rows = await db.query<any>(`SELECT * FROM community_reports WHERE id = $1`, [id]);
      return rows[0] || null;
    } catch {
      return null;
    }
  }

  async deleteReport(id: string) {
    try {
      await db.query(`DELETE FROM community_reports WHERE id = $1`, [id]);
      return true;
    } catch {
      return false;
    }
  }

  // ===================== LOST & FOUND =====================
  async getLostNotices(params?: { type?: string; status?: string; upazilaId?: string; category?: string; userId?: string; search?: string; limit?: number }) {
    await ensureUserIdColumns();
    try {
      let query = `SELECT * FROM lost_notices WHERE 1=1`;
      const values: any[] = [];
      let idx = 1;

      if (params?.type && params.type !== 'all') {
        query += ` AND type = $${idx++}`;
        values.push(params.type);
      }
      if (params?.status && params.status !== 'all') {
        query += ` AND status = $${idx++}`;
        values.push(params.status);
      }
      if (params?.upazilaId && params.upazilaId !== 'all') {
        query += ` AND upazila_id = $${idx++}`;
        values.push(params.upazilaId);
      }
      if (params?.category && params.category !== 'all') {
        query += ` AND category = $${idx++}`;
        values.push(params.category);
      }
      if (params?.userId && params.userId !== 'all') {
        query += ` AND user_id = $${idx++}`;
        values.push(params.userId);
      }
      if (params?.search) {
        query += ` AND (LOWER(title_bn) LIKE $${idx} OR LOWER(contact_name) LIKE $${idx})`;
        values.push(`%${params.search.toLowerCase()}%`);
        idx++;
      }
      query += ` ORDER BY created_at DESC`;
      if (params?.limit) {
        query += ` LIMIT $${idx++}`;
        values.push(params.limit);
      }

      const rows = await db.query<any>(query, values);
      const categoryLabelMap: Record<string, string> = {
        person: 'নিখোঁজ ব্যক্তি',
        document: 'আইডি কার্ড ও সনদ',
        vehicle: 'যানবাহন ও সাইকেল',
        valuable: 'মোবাইল ও মূল্যবান জিনিস',
        other: 'অন্যান্য'
      };

      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        trackingNumber: r.tracking_number,
        type: r.type,
        category: r.category,
        categoryLabelBn: (r.category_label_bn && r.category_label_bn !== 'হারানো ও প্রাপ্তি')
          ? r.category_label_bn
          : (categoryLabelMap[r.category] || 'অন্যান্য'),
        titleBn: r.title_bn,
        descriptionBn: r.description_bn,
        upazilaId: r.upazila_id,
        upazilaNameBn: r.upazila_name_bn,
        locationDetailsBn: r.location_details_bn,
        date: r.event_date || 'আজ',
        contactName: r.contact_name,
        contactPhone: r.contact_phone,
        gdNumber: r.gd_number,
        rewardBn: r.reward_bn,
        status: r.status,
        isVerified: r.is_verified
      })) as unknown as LostNotice[];
    } catch (err: any) {
      if (err?.code === '42703' || String(err?.message || '').includes('user_id')) {
        try {
          await db.query(`ALTER TABLE lost_notices ADD COLUMN IF NOT EXISTS user_id TEXT;`);
        } catch {}
        if (params?.userId) return [];
      }
      console.error('DatabaseStore.getLostNotices error:', err);
      return [];
    }
  }

  async addLostNotice(data: {
    userId?: string;
    type: 'lost' | 'found';
    category: LostNotice['category'];
    titleBn: string;
    descriptionBn?: string;
    upazilaId?: string;
    locationDetailsBn?: string;
    contactName: string;
    contactPhone: string;
    gdNumber?: string;
    rewardBn?: string;
  }) {
    const upazila = UPAZILAS.find((u) => u.id === data.upazilaId);
    const trackingNumber = `LF-${Date.now().toString().slice(-6)}`;
    const id = `lost-${Date.now()}`;
    const upazilaId = (data.upazilaId as any) || 'kurigram-sadar';
    const upazilaNameBn = upazila ? upazila.nameBn : 'কুড়িগ্রাম সদর';

    const categoryLabelMap: Record<string, string> = {
      person: 'নিখোঁজ ব্যক্তি',
      document: 'আইডি কার্ড ও সনদ',
      vehicle: 'যানবাহন ও সাইকেল',
      valuable: 'মোবাইল ও মূল্যবান জিনিস',
      other: 'অন্যান্য'
    };
    const categoryLabelBn = categoryLabelMap[data.category] || 'অন্যান্য';

    try {
      await db.query(
        `INSERT INTO lost_notices (
          id, tracking_number, type, category, category_label_bn, title_bn, description_bn,
          upazila_id, upazila_name_bn, location_details_bn, event_date, contact_name, contact_phone,
          gd_number, reward_bn, status, is_verified, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          id,
          trackingNumber,
          data.type,
          data.category,
          categoryLabelBn,
          data.titleBn,
          data.descriptionBn || '',
          upazilaId,
          upazilaNameBn,
          data.locationDetailsBn || '',
          'আজ',
          data.contactName,
          data.contactPhone,
          data.gdNumber || null,
          data.rewardBn || null,
          'active',
          true,
          data.userId || null
        ]
      );
    } catch {
      await db.query(
        `INSERT INTO lost_notices (
          id, tracking_number, type, category, category_label_bn, title_bn, description_bn,
          upazila_id, upazila_name_bn, location_details_bn, event_date, contact_name, contact_phone,
          gd_number, reward_bn, status, is_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          id,
          trackingNumber,
          data.type,
          data.category,
          categoryLabelBn,
          data.titleBn,
          data.descriptionBn || '',
          upazilaId,
          upazilaNameBn,
          data.locationDetailsBn || '',
          'আজ',
          data.contactName,
          data.contactPhone,
          data.gdNumber || null,
          data.rewardBn || null,
          'active',
          true
        ]
      );
    }

    return {
      id,
      userId: data.userId,
      trackingNumber,
      type: data.type,
      category: data.category,
      categoryLabelBn,
      titleBn: data.titleBn,
      descriptionBn: data.descriptionBn || '',
      upazilaId,
      upazilaNameBn,
      locationDetailsBn: data.locationDetailsBn || '',
      date: 'আজ',
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      gdNumber: data.gdNumber,
      rewardBn: data.rewardBn,
      status: 'active',
      isVerified: true
    } as unknown as LostNotice;
  }

  async updateLostNotice(id: string, updates: Partial<LostNotice>) {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (updates.status !== undefined) {
        setClauses.push(`status = $${idx++}`);
        values.push(updates.status);
      }
      if (updates.titleBn !== undefined) {
        setClauses.push(`title_bn = $${idx++}`);
        values.push(updates.titleBn);
      }
      if (updates.descriptionBn !== undefined) {
        setClauses.push(`description_bn = $${idx++}`);
        values.push(updates.descriptionBn);
      }

      if (setClauses.length > 0) {
        values.push(id);
        await db.query(`UPDATE lost_notices SET ${setClauses.join(', ')} WHERE id = $${idx}`, values);
      }

      const rows = await db.query<any>(`SELECT * FROM lost_notices WHERE id = $1`, [id]);
      return rows[0] || null;
    } catch {
      return null;
    }
  }

  async deleteLostNotice(id: string) {
    try {
      await db.query(`DELETE FROM lost_notices WHERE id = $1`, [id]);
      return true;
    } catch {
      return false;
    }
  }

  // ===================== SCAM ALERTS (প্রতারণা) =====================
  async getScamAlerts(params?: {
    severity?: string;
    category?: string;
    userId?: string;
    search?: string;
    limit?: number;
    approvedOnly?: boolean;
  }) {
    await ensureUserIdColumns();
    try {
      let query = `SELECT * FROM scam_alerts WHERE 1=1`;
      const values: any[] = [];
      let idx = 1;

      // Filter by approval: by default, landing & public pages only see approved alerts
      if (params?.approvedOnly) {
        query += ` AND is_approved = true`;
      }
      if (params?.severity && params.severity !== 'all') {
        query += ` AND severity = $${idx++}`;
        values.push(params.severity);
      }
      if (params?.category && params.category !== 'all') {
        query += ` AND scam_category = $${idx++}`;
        values.push(params.category);
      }
      if (params?.userId && params.userId !== 'all') {
        query += ` AND user_id = $${idx++}`;
        values.push(params.userId);
      }
      if (params?.search) {
        query += ` AND (LOWER(title_bn) LIKE $${idx} OR LOWER(summary_bn) LIKE $${idx})`;
        values.push(`%${params.search.toLowerCase()}%`);
        idx++;
      }
      query += ` ORDER BY created_at DESC`;
      if (params?.limit) {
        query += ` LIMIT $${idx++}`;
        values.push(params.limit);
      }

      const rows = await db.query<any>(query, values);
      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        titleBn: r.title_bn,
        summaryBn: r.summary_bn,
        detailsBn: r.details_bn,
        scamCategory: r.scam_category,
        scamCategoryLabelBn: r.scam_category_label_bn,
        targetType: r.target_type || 'individual',
        suspectName: r.suspect_name,
        suspectContact: r.suspect_contact,
        images: r.images || [],
        severity: r.severity,
        preventionTipsBn: r.prevention_tips_bn || [],
        verifiedBy: r.verified_by,
        publishedDate: r.published_date,
        isApproved: r.is_approved ?? false
      })) as ScamAlert[];
    } catch (err: any) {
      if (err?.code === '42703' || String(err?.message || '').includes('user_id')) {
        try {
          await db.query(`ALTER TABLE scam_alerts ADD COLUMN IF NOT EXISTS user_id TEXT;`);
        } catch {}
        if (params?.userId) return [];
      }
      console.error('DatabaseStore.getScamAlerts error:', err);
      return [];
    }
  }

  async addScamAlert(data: {
    userId?: string;
    titleBn: string;
    summaryBn: string;
    detailsBn?: string;
    scamCategory: string;
    scamCategoryLabelBn?: string;
    targetType?: 'individual' | 'company';
    suspectName?: string;
    suspectContact?: string;
    images?: string[];
    severity?: ScamAlert['severity'];
    preventionTipsBn?: string[];
    verifiedBy?: string;
    isApproved?: boolean;
  }) {
    const id = `scam-${Date.now()}`;
    const tips = data.preventionTipsBn && data.preventionTipsBn.length > 0 
      ? data.preventionTipsBn 
      : ['অপরিচিত ব্যক্তির কথায় টাকা লেনদেন করবেন না'];

    const isApproved = data.isApproved ?? false;
    const images = Array.isArray(data.images) ? data.images : [];

    try {
      await db.query(
        `INSERT INTO scam_alerts (
          id, title_bn, summary_bn, details_bn, scam_category, scam_category_label_bn,
          target_type, suspect_name, suspect_contact, images,
          severity, prevention_tips_bn, verified_by, published_date, is_approved, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          id,
          data.titleBn,
          data.summaryBn,
          data.detailsBn || data.summaryBn,
          data.scamCategory,
          data.scamCategoryLabelBn || 'প্রতারণা সতর্কতা',
          data.targetType || 'individual',
          data.suspectName || null,
          data.suspectContact || null,
          images,
          data.severity || 'high',
          tips,
          data.verifiedBy || 'কুড়িগ্রাম জেলা প্রশাসন ও সাইবার হেল্পডেস্ক',
          new Date().toISOString().split('T')[0],
          isApproved,
          data.userId || null
        ]
      );
    } catch {
      await db.query(
        `INSERT INTO scam_alerts (
          id, title_bn, summary_bn, details_bn, scam_category, scam_category_label_bn,
          target_type, suspect_name, suspect_contact, images,
          severity, prevention_tips_bn, verified_by, published_date, is_approved
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          id,
          data.titleBn,
          data.summaryBn,
          data.detailsBn || data.summaryBn,
          data.scamCategory,
          data.scamCategoryLabelBn || 'প্রতারণা সতর্কতা',
          data.targetType || 'individual',
          data.suspectName || null,
          data.suspectContact || null,
          images,
          data.severity || 'high',
          tips,
          data.verifiedBy || 'কুড়িগ্রাম জেলা প্রশাসন ও সাইবার হেল্পডেস্ক',
          new Date().toISOString().split('T')[0],
          isApproved
        ]
      );
    }

    return {
      id,
      userId: data.userId,
      titleBn: data.titleBn,
      summaryBn: data.summaryBn,
      detailsBn: data.detailsBn || data.summaryBn,
      scamCategory: data.scamCategory,
      scamCategoryLabelBn: data.scamCategoryLabelBn || 'প্রতারণা সতর্কতা',
      targetType: data.targetType || 'individual',
      suspectName: data.suspectName,
      suspectContact: data.suspectContact,
      images,
      severity: data.severity || 'high',
      preventionTipsBn: tips,
      verifiedBy: data.verifiedBy || 'কুড়িগ্রাম জেলা প্রশাসন ও সাইবার হেল্পডেস্ক',
      publishedDate: new Date().toISOString().split('T')[0],
      isApproved
    } as ScamAlert;
  }

  async updateScamAlert(id: string, updates: Partial<ScamAlert>) {
    try {
      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (updates.isApproved !== undefined) {
        setClauses.push(`is_approved = $${idx++}`);
        values.push(updates.isApproved);
      }
      if (updates.severity !== undefined) {
        setClauses.push(`severity = $${idx++}`);
        values.push(updates.severity);
      }

      if (setClauses.length > 0) {
        values.push(id);
        await db.query(`UPDATE scam_alerts SET ${setClauses.join(', ')} WHERE id = $${idx}`, values);
      }

      const rows = await db.query<any>(`SELECT * FROM scam_alerts WHERE id = $1`, [id]);
      return rows[0] || null;
    } catch {
      return null;
    }
  }

  async deleteScamAlert(id: string) {
    try {
      await db.query(`DELETE FROM scam_alerts WHERE id = $1`, [id]);
      return true;
    } catch {
      return false;
    }
  }
}

export const serverStore = new DatabaseStore();
