import Razorpay from 'razorpay';
import crypto from 'crypto';

const sanitizeEnv = (val) => (val ? String(val).trim().replace(/^["']|["']$/g, '') : '');

const keyId = sanitizeEnv(process.env.RAZORPAY_KEY_ID);
const keySecret = sanitizeEnv(process.env.RAZORPAY_KEY_SECRET);
const webhookSecret = sanitizeEnv(process.env.RAZORPAY_WEBHOOK_SECRET);

if (!keyId || !keySecret) {
  console.warn('[Razorpay] WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured. Payment features will be unavailable.');
} else {
  console.log(`[Razorpay] Configured with Key ID: ${keyId.substring(0, 10)}... (mode: ${keyId.startsWith('rzp_live') ? 'LIVE' : 'TEST'})`);
}

if (!webhookSecret) {
  console.warn('[Razorpay] WARNING: RAZORPAY_WEBHOOK_SECRET is not configured. Webhook signature verification will fail.');
}

export const razorpayInstance = keyId && keySecret
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    })
  : null;

/**
 * Server-Side Plan Pricing Config (Single Source of Truth)
 * Amount is determined ONLY here — the client cannot override it.
 * Minimum Razorpay amount is ₹1 = 100 paise.
 */
export const PLAN_PRICING = {
  BASIC: {
    plan: 'BASIC',
    amount: 99,       // INR — 9900 paise (above 100 paise minimum)
    name: 'Basic Keepsake',
    description: 'A heartfelt digital card with sweet memories.',
    maxPhotos: 6
  },
  PREMIUM: {
    plan: 'PREMIUM',
    amount: 249,      // INR — 24900 paise
    name: 'Premium Memory Wall',
    description: 'Our most loved gift — a complete emotional digital keepsake.',
    maxPhotos: 8
  },
  DELUXE: {
    plan: 'DELUXE',
    amount: 449,      // INR — 44900 paise
    name: 'Deluxe Keepsake Hamper',
    description: 'The ultimate sibling tribute with extended timeline and audio.',
    maxPhotos: 8
  }
};

/**
 * Creates a Razorpay Standard Checkout order on the backend.
 * Amount is always resolved server-side from PLAN_PRICING — never from client input.
 * Reference: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
 */
export async function createRazorpayOrder({ plan = 'PREMIUM', receiptId, giftId }) {
  const planConfig = PLAN_PRICING[plan.toUpperCase()] || PLAN_PRICING.PREMIUM;
  const amountInPaise = planConfig.amount * 100; // Razorpay requires amount in paise

  // Validate minimum amount (Razorpay requires >= 100 paise = ₹1)
  if (amountInPaise < 100) {
    throw new Error(`Invalid plan amount: ${amountInPaise} paise is below the minimum 100 paise.`);
  }

  if (!razorpayInstance) {
    throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
  }

  try {
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,        // Server-locked amount — cannot be changed by client
      currency: 'INR',
      receipt: receiptId || `rcpt_${giftId?.substring(0, 8)}_${Date.now()}`,
      notes: {
        giftId: giftId || '',
        plan: planConfig.plan,
        planName: planConfig.name
      }
    });

    console.log(`[Razorpay] Order created: ${order.id} | Plan: ${planConfig.plan} | Amount: ₹${planConfig.amount} (${amountInPaise} paise)`);

    return {
      orderId: order.id,
      amount: planConfig.amount,  // In INR for display
      amountInPaise,              // In paise — exact value locked by server
      currency: 'INR',
      keyId: keyId,
      planName: planConfig.name,
      planDescription: planConfig.description
    };
  } catch (err) {
    console.error('[Razorpay] orders.create failed:', err.message || err);
    throw new Error(`Failed to create Razorpay order: ${err.error?.description || err.message || 'Unknown error'}`);
  }
}

/**
 * Verifies Razorpay payment signature (Standard Checkout callback).
 * Algorithm: HMAC-SHA256(orderId + "|" + paymentId, KEY_SECRET)
 * Reference: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/#verify-payment-signature
 */
export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  if (!keySecret) {
    console.error('[Razorpay] RAZORPAY_KEY_SECRET is not configured — cannot verify signature.');
    return false;
  }

  if (!orderId || !paymentId || !signature) {
    console.error('[Razorpay] Missing orderId, paymentId, or signature for verification.');
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = generatedSignature === signature;
  if (!isValid) {
    console.warn(`[Razorpay] Signature mismatch for order ${orderId}. Expected: ${generatedSignature.substring(0, 16)}...`);
  }

  return isValid;
}

/**
 * Verifies Razorpay Webhook signature against the raw request body bytes.
 * Uses RAZORPAY_WEBHOOK_SECRET (different from KEY_SECRET).
 * Reference: https://razorpay.com/docs/webhooks/validate-test/
 */
export function verifyWebhookSignature({ rawBody, signature }) {
  if (!webhookSecret) {
    console.error('[Razorpay] RAZORPAY_WEBHOOK_SECRET is not configured — cannot verify webhook.');
    return false;
  }

  if (!rawBody || !signature) {
    return false;
  }

  const bodyBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody);

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyBuffer)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Generates a valid HMAC-SHA256 payment signature (used in tests and smoke tests).
 * This is the same algorithm Razorpay uses on their side.
 */
export function generatePaymentSignature(orderId, paymentId) {
  if (!keySecret) {
    throw new Error('[Razorpay] RAZORPAY_KEY_SECRET is required to generate signature.');
  }
  return crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

export default {
  PLAN_PRICING,
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyWebhookSignature,
  generatePaymentSignature
};
