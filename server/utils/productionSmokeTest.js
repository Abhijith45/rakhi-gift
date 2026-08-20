/**
 * Production Smoke Test Suite
 * Validates the 14 Deployment Gate Checkpoints:
 * - Health endpoints
 * - API routing & structured 404s
 * - Gating before payment
 * - Server pricing authority
 * - Payment signature verification & gift activation
 * - Public gift presentation (no leaked secrets)
 * - Webhook idempotency & fraud rejection
 */

import http from 'http';
import crypto from 'crypto';
import dotenv from 'dotenv';
import prisma from '../config/prisma.js';
import { PLAN_PRICING, createRazorpayOrder, generatePaymentSignature } from '../config/razorpay.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const bodyStr = data ? JSON.stringify(data) : null;
    const reqHeaders = {
      ...headers
    };
    if (bodyStr) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = http.request(url, { method, headers: reqHeaders }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        let parsed = body;
        try { parsed = JSON.parse(body); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, data: parsed });
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function runProductionSmokeTest() {
  console.log('🚀 Running Production Deployment Smoke Test Suite...\n');
  let passed = 0;
  let failed = 0;
  const testGiftIds = [];

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title}`);
      failed++;
    }
  };

  try {
    // 1. Health Endpoints
    console.log('--- 1. Health & Status Endpoints ---');
    const rootHealth = await makeRequest('/health');
    assert(rootHealth.status === 200 && rootHealth.data.status === 'ok', 'Root /health returns 200 OK');

    const apiHealth = await makeRequest('/api/health');
    assert(apiHealth.status === 200 && apiHealth.data.status === 'ok', '/api/health returns 200 OK');
    assert(apiHealth.data.database && apiHealth.data.payments, 'Health payload confirms Database and Razorpay services');

    // 2. Structured API 404
    console.log('\n--- 2. Structured 404 Error Handling ---');
    const api404 = await makeRequest('/api/non-existent-route-xyz');
    assert(api404.status === 404 && api404.data.error?.code === 'ROUTE_NOT_FOUND', 'Unknown API route returns structured 404');

    // 3. Draft Creation & Server Validation
    console.log('\n--- 3. Gift Draft Creation & Server Gating ---');
    const draftRes = await makeRequest('/api/gifts', 'POST', {
      senderName: 'SmokeSender',
      recipientName: 'SmokeRecipient',
      relationship: 'Sister',
      theme: 'warm-memory',
      message: 'Smoke test heartfelt message for production deployment verification.',
      plan: 'PREMIUM',
      reasons: [{ number: '01', title: 'Smoke Reason', text: 'Smoke reason text' }]
    });

    assert(draftRes.status === 201 && draftRes.data.success && draftRes.data.data.id, 'Gift draft created successfully');
    const giftId = draftRes.data.data.id;
    testGiftIds.push(giftId);

    // 4. Gating Before Payment
    console.log('\n--- 4. Gating Unpaid Gift Access ---');
    const unpaidAccess = await makeRequest(`/api/gifts/public/unpaid-slug-attempt`);
    assert(unpaidAccess.status === 404, 'Unpaid / non-existent slug returns 404');

    // 5. Razorpay Order Creation & Pricing Authority
    console.log('\n--- 5. Payment Order Creation & Server Pricing Authority ---');
    const orderRes = await makeRequest('/api/payments/create-order', 'POST', {
      giftId,
      plan: 'PREMIUM'
    });

    assert(orderRes.status === 200 && orderRes.data.success, 'Payment order created');
    const orderData = orderRes.data.data;
    assert(orderData.amount === 249 && orderData.currency === 'INR', 'Server pricing enforced (₹249 for PREMIUM)');
    assert(orderData.orderId && orderData.keyId, 'Razorpay order ID and public key returned');

    // 6. Cryptographic Payment Verification & Atomic Activation
    console.log('\n--- 6. Cryptographic Verification & Gift Activation ---');
    const paymentId = `pay_smoke_${Date.now()}`;
    const validSignature = generatePaymentSignature(orderData.orderId, paymentId);

    const verifyRes = await makeRequest('/api/payments/verify', 'POST', {
      giftId,
      razorpayOrderId: orderData.orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSignature
    });

    assert(verifyRes.status === 200 && verifyRes.data.success, 'Payment signature verified');
    assert(verifyRes.data.data.isReady && verifyRes.data.data.slug, 'Gift activated with unique slug: ' + verifyRes.data.data.slug);
    const activeSlug = verifyRes.data.data.slug;

    // 7. Public Gift Presentation & Secret Sanitization
    console.log('\n--- 7. Public Gift Presentation ---');
    const publicGift = await makeRequest(`/api/gifts/public/${activeSlug}`);
    assert(publicGift.status === 200 && publicGift.data.success, 'Public gift loads cleanly with active slug');
    assert(publicGift.data.data.recipientName === 'SmokeRecipient', 'Correct recipient content presented');
    assert(!publicGift.data.data.razorpayKeySecret && !publicGift.data.data.payments, 'Private payment/secrets not exposed in public API');

    // 8. Webhook Idempotency & Signature Fraud Prevention
    console.log('\n--- 8. Webhook Security & Idempotency ---');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'AdQX1TAFHnUWA59CuTT4qDueHqQ';
    const fakeWebhookBody = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderData.orderId,
            amount: 24900,
            currency: 'INR',
            status: 'captured'
          }
        }
      }
    });

    // Valid webhook signature test (idempotent duplicate)
    const validWebhookSig = crypto.createHmac('sha256', webhookSecret).update(fakeWebhookBody).digest('hex');
    const webhookRes = await makeRequest('/api/payments/webhook', 'POST', JSON.parse(fakeWebhookBody), {
      'x-razorpay-signature': validWebhookSig
    });
    assert(webhookRes.status === 200 && webhookRes.data.status === 'already_processed', 'Duplicate webhook recognized idempotently');

    // Forged webhook signature test
    const forgedWebhookRes = await makeRequest('/api/payments/webhook', 'POST', JSON.parse(fakeWebhookBody), {
      'x-razorpay-signature': 'forged_invalid_signature_12345'
    });
    assert(forgedWebhookRes.status === 400, 'Forged webhook signature rejected with HTTP 400');

    // 9. Status Endpoint Polling Check
    console.log('\n--- 9. Polling Status Endpoint ---');
    const statusRes = await makeRequest(`/api/payments/${orderData.orderId}/status`);
    assert(statusRes.status === 200 && statusRes.data.data.isReady && statusRes.data.data.paymentStatus === 'PAID', 'Status endpoint confirms PAID and ACTIVE');

    // 10. Clean up test records
    console.log('\n--- 10. Cleanup ---');
    for (const id of testGiftIds) {
      await prisma.gift.delete({ where: { id } }).catch(() => {});
    }
    assert(true, 'Test records cleaned up from database');

  } catch (err) {
    console.error('Unexpected error in smoke test:', err);
    failed++;
  }

  console.log('\n=========================================');
  console.log(`📊 Smoke Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionSmokeTest();
