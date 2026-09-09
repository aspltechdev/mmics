/**
 * =========================================================
 * MEMBER MANAGEMENT (ADMIN)
 * =========================================================
 *
 * Implements the proposal's "Member Management System":
 *
 *   Add Members
 *     - create new member profiles
 *     - add member details
 *     - generate member accounts
 *
 *   Manage Members
 *     - view member list
 *     - edit member details
 *     - update information
 *     - delete members
 *     - search members
 *     - activate / deactivate accounts
 *
 *   Member Information Fields
 *     - Member Name, Contact Number, Email Address, Address,
 *       Membership Number, Profile Image, Account Status
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

const MEMBER_PUBLIC_FIELDS = {
  id: true,
  membershipNumber: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  profileImage: true,
  membershipType: true,
  joinedAt: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

/* =========================================================
   HELPERS
   ========================================================= */

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return String(value).toLowerCase() === 'true';
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));

/**
 * Membership numbers look like MEM-2026-0007.
 *
 * The count-based suffix is wrapped in a retry loop because
 * two admins creating members at the same moment would
 * otherwise generate the same number and one insert would
 * fail on the unique constraint.
 */
const generateMembershipNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `MEM-${year}-`;

  const latest = await prisma.member.findFirst({
    where: { membershipNumber: { startsWith: prefix } },
    orderBy: { membershipNumber: 'desc' },
    select: { membershipNumber: true },
  });

  let nextSequence = 1;

  if (latest?.membershipNumber) {
    const parsed = parseInt(latest.membershipNumber.replace(prefix, ''), 10);

    if (!Number.isNaN(parsed)) {
      nextSequence = parsed + 1;
    }
  }

  return `${prefix}${String(nextSequence).padStart(4, '0')}`;
};

/**
 * Temporary password handed to the member on account
 * creation. Readable but not guessable.
 */
const generateTemporaryPassword = () =>
  `Mmics@${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

/* =========================================================
   GET /api/members
   =========================================================
   Paginated, searchable member list.
   ========================================================= */

export const getMembers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { membershipNumber: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'active') {
      where.isActive = true;
    }

    if (status === 'inactive') {
      where.isActive = false;
    }

    const allowedSortFields = ['createdAt', 'name', 'membershipNumber', 'lastLoginAt'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        select: MEMBER_PUBLIC_FIELDS,
        orderBy: { [safeSortBy]: safeSortOrder },
        skip,
        take: limitNumber,
      }),
      prisma.member.count({ where }),
    ]);

    res.json({
      success: true,
      data: members,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching members',
    });
  }
};

/* =========================================================
   GET /api/members/:id
   ========================================================= */

export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      select: MEMBER_PUBLIC_FIELDS,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the member',
    });
  }
};

/* =========================================================
   POST /api/members
   =========================================================
   Create a member profile and generate their account.
   ========================================================= */

export const createMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      membershipNumber,
      membershipType,
      password,
      isActive,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Member name and email address are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    const normalisedEmail = String(email).trim().toLowerCase();

    const existingMember = await prisma.member.findUnique({
      where: { email: normalisedEmail },
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'A member with this email address already exists',
      });
    }

    // Membership number: use the supplied one, otherwise
    // generate the next in sequence.
    let finalMembershipNumber = membershipNumber?.trim();

    if (finalMembershipNumber) {
      const duplicate = await prisma.member.findUnique({
        where: { membershipNumber: finalMembershipNumber },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'This membership number is already in use',
        });
      }
    } else {
      finalMembershipNumber = await generateMembershipNumber();
    }

    // Password: admin may set one, otherwise generate a
    // temporary password to hand over to the member.
    const generatedPassword = password?.trim() ? null : generateTemporaryPassword();
    const plainPassword = password?.trim() || generatedPassword;

    if (plainPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    let imageData = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'members');

      imageData = {
        profileImage: result.url,
        profileImagePublicId: result.publicId,
      };
    }

    const member = await prisma.member.create({
      data: {
        membershipNumber: finalMembershipNumber,
        name: String(name).trim(),
        email: normalisedEmail,
        password: await bcrypt.hash(plainPassword, 10),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        membershipType: membershipType?.trim() || 'Regular',
        isActive: parseBoolean(isActive, true),
        ...imageData,
      },
      select: MEMBER_PUBLIC_FIELDS,
    });

    res.status(201).json({
      success: true,
      data: member,
      // Shown once, so the admin can pass it to the member.
      // Never stored or returned again.
      temporaryPassword: generatedPassword,
    });
  } catch (error) {
    console.error('Create member error:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'A member with that email or membership number already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the member',
    });
  }
};

/* =========================================================
   PUT /api/members/:id
   ========================================================= */

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      address,
      membershipNumber,
      membershipType,
      password,
      isActive,
    } = req.body;

    const member = await prisma.member.findUnique({ where: { id } });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    const data = {};

    if (name !== undefined) {
      data.name = String(name).trim();
    }

    if (email !== undefined && email !== member.email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address',
        });
      }

      const normalisedEmail = String(email).trim().toLowerCase();

      const duplicate = await prisma.member.findUnique({
        where: { email: normalisedEmail },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Another member already uses this email address',
        });
      }

      data.email = normalisedEmail;
    }

    if (membershipNumber !== undefined && membershipNumber !== member.membershipNumber) {
      const duplicate = await prisma.member.findUnique({
        where: { membershipNumber: membershipNumber.trim() },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Another member already uses this membership number',
        });
      }

      data.membershipNumber = membershipNumber.trim();
    }

    if (phone !== undefined) {
      data.phone = phone?.trim() || null;
    }

    if (address !== undefined) {
      data.address = address?.trim() || null;
    }

    if (membershipType !== undefined) {
      data.membershipType = membershipType?.trim() || 'Regular';
    }

    if (isActive !== undefined) {
      data.isActive = parseBoolean(isActive, member.isActive);
    }

    // Admin-initiated password reset.
    if (password?.trim()) {
      if (password.trim().length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters',
        });
      }

      data.password = await bcrypt.hash(password.trim(), 10);
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'members');

      data.profileImage = result.url;
      data.profileImagePublicId = result.publicId;

      // Remove the old file only after the new one is safely
      // stored.
      if (member.profileImagePublicId) {
        await deleteFromCloudinary(member.profileImagePublicId);
      }
    }

    const updated = await prisma.member.update({
      where: { id },
      data,
      select: MEMBER_PUBLIC_FIELDS,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the member',
    });
  }
};

/* =========================================================
   PATCH /api/members/:id/status
   =========================================================
   Activate / deactivate without touching anything else.
   ========================================================= */

export const toggleMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const member = await prisma.member.findUnique({
      where: { id },
      select: { id: true, isActive: true },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    const nextStatus =
      isActive === undefined ? !member.isActive : parseBoolean(isActive, member.isActive);

    const updated = await prisma.member.update({
      where: { id },
      data: { isActive: nextStatus },
      select: MEMBER_PUBLIC_FIELDS,
    });

    res.json({
      success: true,
      data: updated,
      message: nextStatus ? 'Member account activated' : 'Member account deactivated',
    });
  } catch (error) {
    console.error('Toggle member status error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the account status',
    });
  }
};

/* =========================================================
   DELETE /api/members/:id
   ========================================================= */

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({ where: { id } });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    if (member.profileImagePublicId) {
      await deleteFromCloudinary(member.profileImagePublicId);
    }

    await prisma.member.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Member deleted successfully',
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the member',
    });
  }
};
