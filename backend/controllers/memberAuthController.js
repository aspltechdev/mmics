/**
 * =========================================================
 * MEMBER AUTH CONTROLLER
 * =========================================================
 *
 * Covers the "Member Portal" section of the proposal:
 *
 *   Member Login
 *     - secure login credentials
 *     - member authentication
 *     - access to personal dashboard
 *
 *   Member Dashboard
 *     - personal profile details
 *     - membership information
 *     - account details
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';
import { MEMBER_ACCOUNT_TYPE } from '../middleware/memberAuth.js';

/**
 * Fields safe to return to the member themselves.
 * `password` is never included.
 */
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

const signMemberToken = (member) =>
  jwt.sign(
    {
      id: member.id,
      email: member.email,
      accountType: MEMBER_ACCOUNT_TYPE,
      role: 'MEMBER',
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

/* =========================================================
   POST /api/member/auth/login
   ========================================================= */

export const memberLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const member = await prisma.member.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    // Same generic message whether the email is unknown or
    // the password is wrong, so the endpoint cannot be used
    // to enumerate which emails are registered.
    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isValidPassword = await bcrypt.compare(password, member.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!member.isActive) {
      return res.status(403).json({
        success: false,
        message:
          'Your membership account has not been activated yet. Please contact the office.',
      });
    }

    // Fire-and-forget: the login response should not wait on
    // this write.
    prisma.member
      .update({
        where: { id: member.id },
        data: { lastLoginAt: new Date() },
      })
      .catch((error) => console.error('lastLoginAt update failed:', error.message));

    const { password: _password, ...safeMember } = member;

    res.json({
      success: true,
      data: {
        token: signMemberToken(member),
        user: {
          ...safeMember,
          role: 'MEMBER',
          accountType: MEMBER_ACCOUNT_TYPE,
        },
      },
    });
  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    });
  }
};

/* =========================================================
   GET /api/member/auth/me
   ========================================================= */

export const getMemberProfile = async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: req.member.id },
      select: MEMBER_PUBLIC_FIELDS,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.json({
      success: true,
      data: { ...member, role: 'MEMBER', accountType: MEMBER_ACCOUNT_TYPE },
    });
  } catch (error) {
    console.error('Get member profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while loading your profile',
    });
  }
};

/* =========================================================
   GET /api/member/auth/dashboard
   =========================================================
   Everything the member dashboard needs in one round trip.
   ========================================================= */

export const getMemberDashboard = async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: req.member.id },
      select: MEMBER_PUBLIC_FIELDS,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    // Organisation-level context shown on the member's
    // dashboard. Counts only, so this stays cheap.
    const [settings, productCount, categoryCount] = await Promise.all([
      prisma.siteSettings.findFirst({
        select: {
          companyName: true,
          tagline: true,
          email: true,
          phone: true,
          address: true,
        },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
    ]);

    res.json({
      success: true,
      data: {
        profile: {
          name: member.name,
          email: member.email,
          phone: member.phone,
          address: member.address,
          profileImage: member.profileImage,
        },
        membership: {
          membershipNumber: member.membershipNumber,
          membershipType: member.membershipType,
          joinedAt: member.joinedAt,
          status: member.isActive ? 'Active' : 'Inactive',
        },
        account: {
          isActive: member.isActive,
          lastLoginAt: member.lastLoginAt,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        },
        organisation: {
          companyName: settings?.companyName || 'MMMICS Limited',
          tagline: settings?.tagline || null,
          email: settings?.email || null,
          phone: settings?.phone || null,
          address: settings?.address || null,
          activeProducts: productCount,
          activeCategories: categoryCount,
        },
      },
    });
  } catch (error) {
    console.error('Get member dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while loading your dashboard',
    });
  }
};

/* =========================================================
   PUT /api/member/auth/profile
   =========================================================
   A member may edit their own contact details and photo.
   Membership number, status and email are deliberately not
   editable here: those are administered by the office.
   ========================================================= */

export const updateMemberProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const current = await prisma.member.findUnique({
      where: { id: req.member.id },
      select: { profileImagePublicId: true },
    });

    let imageData = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'members');

      imageData = {
        profileImage: result.url,
        profileImagePublicId: result.publicId,
      };

      if (current?.profileImagePublicId) {
        await deleteFromCloudinary(current.profileImagePublicId);
      }
    }

    const updated = await prisma.member.update({
      where: { id: req.member.id },
      data: {
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(phone !== undefined ? { phone: phone ? String(phone).trim() : null } : {}),
        ...(address !== undefined
          ? { address: address ? String(address).trim() : null }
          : {}),
        ...imageData,
      },
      select: MEMBER_PUBLIC_FIELDS,
    });

    res.json({
      success: true,
      data: { ...updated, role: 'MEMBER', accountType: MEMBER_ACCOUNT_TYPE },
    });
  } catch (error) {
    console.error('Update member profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating your profile',
    });
  }
};

/* =========================================================
   POST /api/member/auth/change-password
   ========================================================= */

export const changeMemberPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    const member = await prisma.member.findUnique({
      where: { id: req.member.id },
    });

    const isValidPassword = await bcrypt.compare(currentPassword, member.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    await prisma.member.update({
      where: { id: member.id },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change member password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while changing your password',
    });
  }
};

export { MEMBER_PUBLIC_FIELDS };
