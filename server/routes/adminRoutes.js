import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getGifts,
  getGiftDetails,
  toggleGiftStatus,
  deleteGift,
  getPayments
} from '../controllers/adminController.js';
import { getAnalyticsSummary } from '../controllers/analyticsController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Admin Auth
router.post('/auth/login', adminLogin);

// Protected Admin Endpoints
router.get('/dashboard', authenticateAdmin, getDashboardStats);
router.get('/gifts', authenticateAdmin, getGifts);
router.get('/gifts/:id', authenticateAdmin, getGiftDetails);
router.patch('/gifts/:id/status', authenticateAdmin, toggleGiftStatus);
router.delete('/gifts/:id', authenticateAdmin, deleteGift);
router.get('/payments', authenticateAdmin, getPayments);
router.get('/analytics', authenticateAdmin, getAnalyticsSummary);

export default router;
