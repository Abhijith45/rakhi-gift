import prisma from '../config/prisma.js';
import {
  PLAN_PRICING,
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyWebhookSignature
} from '../config/razorpay.js';
import { generateUniqueGiftSlug } from '../utils/slugGenerator.js';

/**
 * Creates a Razorpay payment order for a Gift Draft
 * Enforces server-side pricing lookup.
 */
export async function createPaymentOrder(req, res) {
  try {
    const { giftId, plan = 'PREMIUM' } = req.body;

    if (!giftId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'giftId is required.' }
      });
    }

    const gift = await prisma.gift.findUnique({ where: { id: giftId } });
    if (!gift) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gift not found.' }
      });
    }

    const selectedPlan = plan.toUpperCase();
    const planConfig = PLAN_PRICING[selectedPlan] || PLAN_PRICING.PREMIUM;

    const orderData = await createRazorpayOrder({
      plan: planConfig.plan,
      receiptId: `rcpt_${gift.id.slice(0, 8)}`,
      giftId: gift.id
    });

    // Create Payment record with PENDING status
    const paymentRecord = await prisma.payment.create({
      data: {
        giftId: gift.id,
        plan: planConfig.plan,
        amount: planConfig.amount,
        currency: 'INR',
        status: 'PENDING',
        razorpayOrderId: orderData.orderId
      }
    });

    // Update gift plan and status to PAYMENT_PENDING
    await prisma.gift.update({
      where: { id: gift.id },
      data: {
        plan: planConfig.plan,
        status: 'PAYMENT_PENDING'
      }
    });

    console.log(`[Payment] Order created: ${orderData.orderId} for Gift: ${gift.id} (${planConfig.plan} - ₹${planConfig.amount})`);

    return res.json({
      success: true,
      data: {
        orderId: orderData.orderId,
        amount: planConfig.amount,
        currency: 'INR',
        keyId: orderData.keyId,
        giftId: gift.id,
        recipientName: gift.recipientName,
        plan: planConfig.plan
      }
    });
  } catch (err) {
    console.error('Error creating payment order:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'PAYMENT_ORDER_FAILED', message: 'Could not create payment order.' }
    });
  }
}

/**
 * Server-side payment verification (for immediate checkout feedback)
 * Performs cryptographic signature verification & atomic database activation.
 */
export async function verifyPayment(req, res) {
  try {
    const { giftId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!giftId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All payment verification credentials (giftId, orderId, paymentId, signature) are required.'
        }
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId },
      include: { gift: true }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Payment record not found for this order.' }
      });
    }

    // Idempotent: If already marked PAID, return existing activated slug
    if (payment.status === 'PAID' && payment.gift.status === 'ACTIVE') {
      return res.json({
        success: true,
        data: {
          paymentStatus: 'PAID',
          giftStatus: 'ACTIVE',
          isReady: true,
          slug: payment.gift.slug,
          plan: payment.plan,
          amount: payment.amount
        }
      });
    }

    // Verify cryptographic HMAC-SHA256 signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isValid) {
      console.warn(`[Payment] Signature mismatch for order: ${razorpayOrderId}`);
      await prisma.payment.update({
        where: { razorpayOrderId },
        data: { status: 'FAILED' }
      });

      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SIGNATURE',
          message: 'Payment verification signature mismatch.'
        }
      });
    }

    const now = new Date();

    // Atomic Database Transaction: Mark Payment PAID + Activate Gift + Generate Unique Slug
    const [updatedPayment, activatedGift] = await prisma.$transaction(async (tx) => {
      // 1. Generate unique permanent slug if not yet created
      let finalSlug = payment.gift.slug;
      if (!finalSlug) {
        finalSlug = await generateUniqueGiftSlug(payment.gift.recipientName, tx);
      }

      // 2. Update Payment
      const p = await tx.payment.update({
        where: { razorpayOrderId },
        data: {
          status: 'PAID',
          razorpayPaymentId,
          razorpaySignature,
          paidAt: now
        }
      });

      // 3. Update Gift
      const g = await tx.gift.update({
        where: { id: payment.giftId },
        data: {
          status: 'ACTIVE',
          slug: finalSlug,
          publishedAt: now
        }
      });

      // 4. Log Analytics Event
      await tx.analyticsEvent.create({
        data: {
          giftId: payment.giftId,
          event: 'payment_success',
          device: 'web'
        }
      });

      return [p, g];
    });

    console.log(`[Payment] Verified & Activated Gift: ${activatedGift.slug} (${activatedGift.id})`);

    return res.json({
      success: true,
      data: {
        paymentStatus: 'PAID',
        giftStatus: 'ACTIVE',
        isReady: true,
        slug: activatedGift.slug,
        plan: updatedPayment.plan,
        amount: updatedPayment.amount,
        paidAt: updatedPayment.paidAt
      }
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'VERIFICATION_ERROR', message: 'Payment verification failed.' }
    });
  }
}

/**
 * Authoritative, Idempotent Razorpay Webhook Handler
 * Verifies raw body signature and handles captured payments safely.
 */
export async function webhookHandler(req, res) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || req.body;

    if (!signature) {
      console.warn('[Webhook] Missing X-Razorpay-Signature header.');
      return res.status(400).json({ success: false, message: 'Missing signature header' });
    }

    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      console.warn('[Webhook] Webhook signature verification failed.');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    // Parse event payload
    let eventPayload;
    try {
      eventPayload = typeof rawBody === 'string'
        ? JSON.parse(rawBody)
        : Buffer.isBuffer(rawBody)
        ? JSON.parse(rawBody.toString('utf-8'))
        : rawBody;
    } catch (e) {
      console.error('[Webhook] Failed to parse webhook JSON payload:', e);
      return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
    }

    const eventType = eventPayload?.event;
    const eventId = eventPayload?.event_id || eventPayload?.id || null;

    console.log(`[Webhook] Received Razorpay event: ${eventType} (ID: ${eventId || 'n/a'})`);

    // Handle payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = eventPayload?.payload?.payment?.entity;
      const orderEntity = eventPayload?.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const amountInPaise = paymentEntity?.amount || (orderEntity?.amount);
      const currency = paymentEntity?.currency || orderEntity?.currency || 'INR';

      if (!orderId) {
        console.warn('[Webhook] Missing order_id in webhook payload entity.');
        return res.status(200).json({ status: 'ignored', reason: 'missing_order_id' });
      }

      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
        include: { gift: true }
      });

      if (!payment) {
        console.warn(`[Webhook] No internal payment record found for order: ${orderId}`);
        return res.status(200).json({ status: 'ignored', reason: 'order_not_found' });
      }

      // Idempotency: If already marked PAID, return success without duplicate side effects
      if (payment.status === 'PAID') {
        console.log(`[Webhook] Order ${orderId} is already marked PAID. Idempotent skip.`);
        return res.status(200).json({ status: 'already_processed', slug: payment.gift.slug });
      }

      // Amount & Currency Validation (Fraud Prevention)
      const expectedAmountInPaise = payment.amount * 100;
      if (amountInPaise && amountInPaise !== expectedAmountInPaise) {
        console.error(`[Webhook] Fraud Alert: Amount mismatch for order ${orderId}. Expected ${expectedAmountInPaise}, received ${amountInPaise}`);
        await prisma.payment.update({
          where: { razorpayOrderId: orderId },
          data: { status: 'FAILED' }
        });
        return res.status(400).json({ status: 'failed', reason: 'amount_mismatch' });
      }

      const now = new Date();

      // Atomic Transaction
      await prisma.$transaction(async (tx) => {
        let finalSlug = payment.gift.slug;
        if (!finalSlug) {
          finalSlug = await generateUniqueGiftSlug(payment.gift.recipientName, tx);
        }

        await tx.payment.update({
          where: { razorpayOrderId: orderId },
          data: {
            status: 'PAID',
            razorpayPaymentId: paymentId || payment.razorpayPaymentId,
            paidAt: now,
            webhookEventId: eventId,
            webhookReceivedAt: now
          }
        });

        await tx.gift.update({
          where: { id: payment.giftId },
          data: {
            status: 'ACTIVE',
            slug: finalSlug,
            publishedAt: now
          }
        });

        await tx.analyticsEvent.create({
          data: {
            giftId: payment.giftId,
            event: 'payment_success',
            device: 'webhook'
          }
        });
      });

      console.log(`[Webhook] Successfully processed ${eventType} for order: ${orderId}`);
      return res.status(200).json({ status: 'success', message: 'Payment confirmed via webhook' });
    }

    // Handle payment.failed
    if (eventType === 'payment.failed') {
      const orderId = eventPayload?.payload?.payment?.entity?.order_id;
      if (orderId) {
        await prisma.payment.updateMany({
          where: { razorpayOrderId: orderId, status: { not: 'PAID' } },
          data: { status: 'FAILED' }
        });
        console.log(`[Webhook] Marked order ${orderId} as FAILED from webhook event.`);
      }
      return res.status(200).json({ status: 'failed_recorded' });
    }

    return res.status(200).json({ status: 'ignored', reason: 'unhandled_event_type' });
  } catch (err) {
    console.error('Fatal Webhook Error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal webhook error' });
  }
}

/**
 * Returns safe payment & gift status for creator UX polling / refresh
 */
export async function getPaymentStatus(req, res) {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'orderId is required.' }
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { gift: true }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Payment record not found.' }
      });
    }

    const isReady = payment.status === 'PAID' && payment.gift.status === 'ACTIVE';

    return res.json({
      success: true,
      data: {
        paymentStatus: payment.status,
        giftStatus: payment.gift.status,
        isReady,
        slug: isReady ? payment.gift.slug : null,
        plan: payment.plan,
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.paidAt,
        orderId: payment.razorpayOrderId
      }
    });
  } catch (err) {
    console.error('Error fetching payment status:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch payment status.' }
    });
  }
}

export default {
  createPaymentOrder,
  verifyPayment,
  webhookHandler,
  getPaymentStatus
};

/**
 * Handles Razorpay redirect after checkout (when customer is redirected back from Razorpay).
 * Razorpay sometimes redirects to callback_url instead of using the JS handler.
 * We redirect back to the frontend creator page so polling can pick up the result.
 */
export async function razorpayCallback(req, res) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.query;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // If we have a successful payment, try to activate and redirect to frontend
    if (razorpay_payment_id && razorpay_order_id) {
      try {
        const payment = await prisma.payment.findUnique({
          where: { razorpayOrderId: razorpay_order_id },
          include: { gift: true }
        });

        if (payment && payment.status !== 'PAID') {
          const { verifyRazorpaySignature } = await import('../config/razorpay.js');
          const isValid = verifyRazorpaySignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature || ''
          });

          if (isValid) {
            const now = new Date();
            const { generateUniqueGiftSlug } = await import('../utils/slugGenerator.js');
            await prisma.$transaction(async (tx) => {
              let finalSlug = payment.gift.slug;
              if (!finalSlug) {
                finalSlug = await generateUniqueGiftSlug(payment.gift.recipientName, tx);
              }
              await tx.payment.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: { status: 'PAID', razorpayPaymentId: razorpay_payment_id, paidAt: now }
              });
              await tx.gift.update({
                where: { id: payment.giftId },
                data: { status: 'ACTIVE', slug: finalSlug, publishedAt: now }
              });
            });
            console.log(`[Callback] Activated gift via redirect callback for order ${razorpay_order_id}`);
          }
        }
      } catch (activationErr) {
        // Non-fatal: webhook will catch this separately
        console.error('[Callback] Activation attempt error (webhook will recover):', activationErr.message);
      }

      // Redirect back to frontend creator page — it polls /status and unlocks step 8
      return res.redirect(
        `${frontendUrl}/create?order_id=${encodeURIComponent(razorpay_order_id)}&payment_id=${encodeURIComponent(razorpay_payment_id)}&status=processing`
      );
    }

    // No payment id = cancelled or failed
    return res.redirect(`${frontendUrl}/create?status=failed`);
  } catch (err) {
    console.error('[Callback] Unhandled error in Razorpay redirect callback:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/create?status=failed`);
  }
}

