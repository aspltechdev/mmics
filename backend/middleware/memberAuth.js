/**
 * =========================================================
 * MEMBER AUTHENTICATION
 * =========================================================
 *
 * Members live in their own table, so they need their own
 * guard. Admin tokens and member tokens are deliberately not
 * interchangeable: a token carries `accountType` and this
 * middleware refuses anything that is not "member".
 */

import jwt from 'jsonwebtoken';
import prisma from '../src/config/database.js';

export const MEMBER_ACCOUNT_TYPE = 'member';

export const authenticateMember = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.accountType !== MEMBER_ACCOUNT_TYPE) {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is for member accounts only',
      });
    }

    const member = await prisma.member.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        membershipNumber: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Member account not found',
      });
    }

    if (!member.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your membership account is not active. Please contact the office.',
      });
    }

    req.member = member;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export default authenticateMember;
