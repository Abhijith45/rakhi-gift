import express from 'express';
import { trackEvent, getAnalyticsSummary } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/event', trackEvent);
router.get('/summary', getAnalyticsSummary);

export default router;
