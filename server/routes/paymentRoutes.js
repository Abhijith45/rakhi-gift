import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  webhookHandler,
  getPaymentStatus,
  razorpayCallback
} from '../controllers/paymentController.js';

const router = express.Router();

// Order creation & Checkout verification
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

// Razorpay redirect callback (when user is redirected back from Razorpay checkout)
router.get('/callback', razorpayCallback);

// Authoritative Webhook endpoint
router.post('/webhook', webhookHandler);

// Safe status polling endpoint - must be AFTER /callback to avoid conflict
router.get('/:orderId/status', getPaymentStatus);

export default router;
