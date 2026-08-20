import crypto from 'crypto';
import prisma from '../config/prisma.js';
import {
  createPaymentOrder,
  verifyPayment,
  webhookHandler,
  getPaymentStatus
} from '../controllers/paymentController.js';
import { generateUniqueGiftSlug } from './slugGenerator.js';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_mock_secret_2026';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '7VfGb0n1yUbiUcKULVvK7yuJ';

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

function generateHmacSignature(payload, secret) {
  const buf = Buffer.isBuffer(payload) ? payload : Buffer.from(typeof payload === 'string' ? payload : JSON.stringify(payload));
  return crypto.createHmac('sha256', secret).update(buf).digest('hex');
}

async function runPaymentTests() {
  console.log('💳 Starting Comprehensive Razorpay Payment & Webhook Integration Test Suite...\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Normal Successful Payment & Verification Flow
    // ----------------------------------------------------
    console.log('--- Test 1: Normal Successful Payment Flow ---');
    const gift1 = await prisma.gift.create({
      data: {
        senderName: 'Ananya',
        recipientName: 'Aarav',
        relationship: 'Brother',
        theme: 'warm-memory',
        message: 'Happy Raksha Bandhan!',
        plan: 'PREMIUM',
        status: 'DRAFT'
      }
    });
    console.log(`✓ Gift draft created (${gift1.id}) with status: ${gift1.status}, slug: ${gift1.slug}`);

    // Create Payment Order
    const reqOrder = { body: { giftId: gift1.id, plan: 'PREMIUM' } };
    const resOrder = mockRes();
    await createPaymentOrder(reqOrder, resOrder);
    if (!resOrder.body?.success) throw new Error('Failed to create payment order');
    const orderData = resOrder.body.data;
    console.log(`✓ Payment order created: ${orderData.orderId} (Amount: ₹${orderData.amount})`);

    // Verify Gift status is PAYMENT_PENDING
    const updatedGift1 = await prisma.gift.findUnique({ where: { id: gift1.id } });
    if (updatedGift1.status !== 'PAYMENT_PENDING') throw new Error('Gift should be PAYMENT_PENDING');

    // Simulate Client Checkout Success & Verify Signature
    const paymentId1 = `pay_test_${Date.now()}`;
    const validSignature1 = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(`${orderData.orderId}|${paymentId1}`)
      .digest('hex');

    const reqVerify = {
      body: {
        giftId: gift1.id,
        razorpayOrderId: orderData.orderId,
        razorpayPaymentId: paymentId1,
        razorpaySignature: validSignature1
      }
    };
    const resVerify = mockRes();
    await verifyPayment(reqVerify, resVerify);
    if (!resVerify.body?.success || !resVerify.body?.data?.isReady) throw new Error('Payment verification failed');
    const finalSlug1 = resVerify.body.data.slug;
    console.log(`✓ Server payment signature verified! Gift ACTIVE with permanent slug: ${finalSlug1}`);

    // ----------------------------------------------------
    // TEST 2: Before Payment Gating (Unpublished Draft Check)
    // ----------------------------------------------------
    console.log('\n--- Test 2: Gating Before Payment ---');
    const unpaidGift = await prisma.gift.create({
      data: {
        senderName: 'Riya',
        recipientName: 'Karan',
        status: 'DRAFT',
        message: 'Unpaid gift draft'
      }
    });
    if (unpaidGift.slug !== null) throw new Error('Unpaid draft must not have an active slug before payment');
    console.log('✓ Verified unpaid draft has slug = null and cannot be accessed publicly.');

    // ----------------------------------------------------
    // TEST 3: Payment Failure Handling
    // ----------------------------------------------------
    console.log('\n--- Test 3: Payment Failure Handling ---');
    const reqFailOrder = { body: { giftId: unpaidGift.id, plan: 'BASIC' } };
    const resFailOrder = mockRes();
    await createPaymentOrder(reqFailOrder, resFailOrder);
    const failOrderId = resFailOrder.body.data.orderId;

    // Simulate Webhook payment.failed
    const failWebhookPayload = JSON.stringify({
      event: 'payment.failed',
      payload: {
        payment: {
          entity: {
            order_id: failOrderId
          }
        }
      }
    });
    const failSig = generateHmacSignature(failWebhookPayload, WEBHOOK_SECRET);
    const reqFailWebhook = {
      headers: { 'x-razorpay-signature': failSig },
      rawBody: Buffer.from(failWebhookPayload)
    };
    const resFailWebhook = mockRes();
    await webhookHandler(reqFailWebhook, resFailWebhook);

    const failedPayment = await prisma.payment.findUnique({ where: { razorpayOrderId: failOrderId } });
    if (failedPayment.status !== 'FAILED') throw new Error('Payment status should be FAILED');
    console.log(`✓ Webhook correctly marked failed payment as FAILED (${failedPayment.razorpayOrderId}).`);

    // ----------------------------------------------------
    // TEST 4: Webhook Idempotency (Duplicate Events)
    // ----------------------------------------------------
    console.log('\n--- Test 4: Webhook Idempotency ---');
    const gift4 = await prisma.gift.create({
      data: {
        senderName: 'Priya',
        recipientName: 'Kabir',
        status: 'DRAFT',
        message: 'Idempotency test'
      }
    });
    const resOrder4 = mockRes();
    await createPaymentOrder({ body: { giftId: gift4.id, plan: 'DELUXE' } }, resOrder4);
    const orderId4 = resOrder4.body.data.orderId;
    const paymentId4 = `pay_deluxe_${Date.now()}`;

    const webhookPayload4 = JSON.stringify({
      event: 'payment.captured',
      id: `evt_${Date.now()}`,
      payload: {
        payment: {
          entity: {
            id: paymentId4,
            order_id: orderId4,
            amount: 44900, // ₹449 in paise
            currency: 'INR',
            status: 'captured'
          }
        }
      }
    });
    const sig4 = generateHmacSignature(webhookPayload4, WEBHOOK_SECRET);

    // Send Webhook 1st time
    const resWebhook4a = mockRes();
    await webhookHandler({ headers: { 'x-razorpay-signature': sig4 }, rawBody: Buffer.from(webhookPayload4) }, resWebhook4a);
    if (resWebhook4a.statusCode !== 200) throw new Error('Webhook 1st run failed');

    const paymentAfter1 = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId4 }, include: { gift: true } });
    const slugAfter1 = paymentAfter1.gift.slug;

    // Send Webhook 2nd time (Duplicate Replay)
    const resWebhook4b = mockRes();
    await webhookHandler({ headers: { 'x-razorpay-signature': sig4 }, rawBody: Buffer.from(webhookPayload4) }, resWebhook4b);
    if (resWebhook4b.statusCode !== 200) throw new Error('Webhook duplicate replay failed');

    const paymentAfter2 = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId4 }, include: { gift: true } });
    if (paymentAfter2.gift.slug !== slugAfter1) throw new Error('Slug changed on duplicate webhook! Idempotency broken.');
    console.log(`✓ Webhook idempotency confirmed: Slug preserved as "${slugAfter1}" without duplicate side effects.`);

    // ----------------------------------------------------
    // TEST 5: Invalid Webhook Signature Rejection
    // ----------------------------------------------------
    console.log('\n--- Test 5: Invalid Webhook Signature Rejection ---');
    const forgedWebhookPayload = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { order_id: 'fake_order_123', amount: 100 } } }
    });
    const forgedSig = 'invalid_forged_signature_hex';
    const resForged = mockRes();
    await webhookHandler({ headers: { 'x-razorpay-signature': forgedSig }, rawBody: Buffer.from(forgedWebhookPayload) }, resForged);
    if (resForged.statusCode !== 400) throw new Error('Forged webhook signature was not rejected!');
    console.log('✓ Invalid webhook signature correctly rejected with HTTP 400.');

    // ----------------------------------------------------
    // TEST 6: Amount Mismatch Fraud Prevention
    // ----------------------------------------------------
    console.log('\n--- Test 6: Amount Mismatch Fraud Prevention ---');
    const gift6 = await prisma.gift.create({
      data: { senderName: 'Meera', recipientName: 'Varun', status: 'DRAFT', message: 'Fraud check' }
    });
    const resOrder6 = mockRes();
    await createPaymentOrder({ body: { giftId: gift6.id, plan: 'PREMIUM' } }, resOrder6);
    const orderId6 = resOrder6.body.data.orderId;

    // Webhook claims only ₹29 (2900 paise) instead of ₹249 (24900 paise)
    const fraudPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_fraud_${Date.now()}`,
            order_id: orderId6,
            amount: 2900, // ₹29 (Tampered!)
            currency: 'INR'
          }
        }
      }
    });
    const fraudSig = generateHmacSignature(fraudPayload, WEBHOOK_SECRET);
    const resFraud = mockRes();
    await webhookHandler({ headers: { 'x-razorpay-signature': fraudSig }, rawBody: Buffer.from(fraudPayload) }, resFraud);
    if (resFraud.statusCode !== 400) throw new Error('Amount mismatch should be rejected!');

    const fraudPayment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId6 }, include: { gift: true } });
    if (fraudPayment.status !== 'FAILED' || fraudPayment.gift.status === 'ACTIVE') {
      throw new Error('Fraudulent gift was activated!');
    }
    console.log('✓ Underpaid transaction correctly flagged, rejected, and marked FAILED.');

    // ----------------------------------------------------
    // TEST 7: Order Mismatch Handling
    // ----------------------------------------------------
    console.log('\n--- Test 7: Order Mismatch Handling ---');
    const unknownPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_unrelated_999',
            order_id: 'order_non_existent_in_db',
            amount: 24900,
            currency: 'INR'
          }
        }
      }
    });
    const unknownSig = generateHmacSignature(unknownPayload, WEBHOOK_SECRET);
    const resUnknown = mockRes();
    await webhookHandler({ headers: { 'x-razorpay-signature': unknownSig }, rawBody: Buffer.from(unknownPayload) }, resUnknown);
    if (resUnknown.statusCode !== 200 || resUnknown.body?.reason !== 'order_not_found') {
      throw new Error('Unrelated order webhook not handled cleanly.');
    }
    console.log('✓ Unrelated Razorpay order handled safely with zero side effects.');

    // ----------------------------------------------------
    // TEST 8: Browser Interruption / Webhook-Only Activation
    // ----------------------------------------------------
    console.log('\n--- Test 8: Browser Callback Interrupted (Webhook Authoritative) ---');
    const gift8 = await prisma.gift.create({
      data: { senderName: 'Divya', recipientName: 'Arjun', status: 'DRAFT', message: 'Interrupted test' }
    });
    const resOrder8 = mockRes();
    await createPaymentOrder({ body: { giftId: gift8.id, plan: 'PREMIUM' } }, resOrder8);
    const orderId8 = resOrder8.body.data.orderId;

    // Simulate browser crashed/closed immediately after payment without calling /verify
    // Razorpay webhook arrives asynchronously:
    const webhookPayload8 = JSON.stringify({
      event: 'payment.captured',
      id: `evt_async_${Date.now()}`,
      payload: {
        payment: {
          entity: {
            id: `pay_async_${Date.now()}`,
            order_id: orderId8,
            amount: 24900,
            currency: 'INR'
          }
        }
      }
    });
    const sig8 = generateHmacSignature(webhookPayload8, WEBHOOK_SECRET);
    await webhookHandler({ headers: { 'x-razorpay-signature': sig8 }, rawBody: Buffer.from(webhookPayload8) }, mockRes());

    // When customer returns and checks status:
    const resStatus8 = mockRes();
    await getPaymentStatus({ params: { orderId: orderId8 } }, resStatus8);
    if (!resStatus8.body?.data?.isReady || !resStatus8.body?.data?.slug) {
      throw new Error('Async webhook recovery failed.');
    }
    console.log(`✓ Webhook-only flow successfully activated gift with slug "${resStatus8.body.data.slug}".`);

    // ----------------------------------------------------
    // TEST 9: Status Endpoint After Payment
    // ----------------------------------------------------
    console.log('\n--- Test 9: Status Endpoint Verification ---');
    const resStatusCheck = mockRes();
    await getPaymentStatus({ params: { orderId: orderId8 } }, resStatusCheck);
    if (resStatusCheck.body?.data?.paymentStatus !== 'PAID' || resStatusCheck.body?.data?.giftStatus !== 'ACTIVE') {
      throw new Error('Status endpoint should return PAID and ACTIVE');
    }
    console.log('✓ Status endpoint returns safe response with isReady = true, paymentStatus = PAID.');

    // ----------------------------------------------------
    // TEST 10: Clean Up Test Records
    // ----------------------------------------------------
    console.log('\n--- Test 10: Cascade Cleanup of Test Gifts ---');
    await prisma.gift.deleteMany({
      where: {
        id: { in: [gift1.id, unpaidGift.id, gift4.id, gift6.id, gift8.id] }
      }
    });
    console.log('✓ Cleaned up test gift records.');

    console.log('\n🎉 ALL 10 RAZORPAY PAYMENT & WEBHOOK INTEGRATION TESTS PASSED PERFECTLY!\n');
  } catch (err) {
    console.error('\n❌ Payment Integration Test Failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPaymentTests();
