import prisma from '../config/prisma.js';
import { signToken, comparePassword } from '../utils/jwt.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rakhigift.me';

/**
 * Admin Login Authentication
 */
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' }
      });
    }

    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid admin credentials.' }
      });
    }

    const isMatch = comparePassword(password, process.env.ADMIN_PASSWORD_HASH);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid admin credentials.' }
      });
    }

    const token = signToken({ email: ADMIN_EMAIL, role: 'admin' });

    return res.json({
      success: true,
      data: {
        token,
        email: ADMIN_EMAIL,
        expiresIn: '7d'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Login failed.' }
    });
  }
}

/**
 * Aggregates Dashboard KPIs and Recent Orders
 */
export async function getDashboardStats(req, res) {
  try {
    const gifts = await prisma.gift.findMany({
      orderBy: { createdAt: 'desc' },
      include: { payments: true }
    });

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const totalGifts = gifts.length;
    const activeGifts = gifts.filter((g) => g.status === 'ACTIVE' || g.status === 'PAID').length;
    const draftGifts = gifts.filter((g) => g.status === 'DRAFT').length;

    const paidPayments = payments.filter((p) => p.status === 'PAID');
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalViews = gifts.reduce((sum, g) => sum + (g.viewCount || 0), 0);

    return res.json({
      success: true,
      data: {
        totalGifts,
        activeGifts,
        draftGifts,
        totalPaidOrders: paidPayments.length,
        totalRevenue,
        totalViews,
        recentGifts: gifts.slice(0, 8),
        recentPayments: payments.slice(0, 8)
      }
    });
  } catch (err) {
    console.error('Error fetching admin dashboard stats:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to load dashboard metrics.' }
    });
  }
}

/**
 * Returns all gifts for Admin table
 */
export async function getGifts(req, res) {
  try {
    const gifts = await prisma.gift.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        photos: true,
        payments: true
      }
    });

    return res.json({
      success: true,
      data: gifts
    });
  } catch (err) {
    console.error('Error fetching gifts:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch gifts list.' }
    });
  }
}

/**
 * Returns full gift inspection details
 */
export async function getGiftDetails(req, res) {
  try {
    const { id } = req.params;
    const gift = await prisma.gift.findUnique({
      where: { id },
      include: {
        photos: true,
        reasons: true,
        memories: true,
        payments: true
      }
    });

    if (!gift) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gift not found.' }
      });
    }

    return res.json({
      success: true,
      data: gift
    });
  } catch (err) {
    console.error('Error fetching gift details:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch gift details.' }
    });
  }
}

/**
 * Toggles Gift Status (Active / Disabled)
 */
export async function toggleGiftStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.gift.update({
      where: { id },
      data: { status }
    });

    return res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error('Error updating gift status:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update gift status.' }
    });
  }
}

/**
 * Deletes a Gift and all its relations
 */
export async function deleteGift(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.gift.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gift not found.' }
      });
    }

    await prisma.gift.delete({ where: { id } });

    return res.json({
      success: true,
      data: { deletedId: id }
    });
  } catch (err) {
    console.error('Error deleting gift:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete gift.' }
    });
  }
}

/**
 * Returns all payments for Admin audit table
 */
export async function getPayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: payments
    });
  } catch (err) {
    console.error('Error fetching payments:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch payments list.' }
    });
  }
}
