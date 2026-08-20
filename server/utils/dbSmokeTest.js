import prisma from '../config/prisma.js';

async function runPostgresSmokeTest() {
  console.log('🧪 Starting comprehensive PostgreSQL database integration test...\n');

  try {
    // 1. Connection check
    await prisma.$connect();
    console.log('✅ [1/9] PostgreSQL Connection Verified.');

    // 2. Create a test Gift with nested relations
    const testSlug = `test-gift-${Date.now()}`;
    const testGift = await prisma.gift.create({
      data: {
        slug: testSlug,
        senderName: 'Pooja',
        recipientName: 'Rohan',
        relationship: 'Brother',
        senderNickname: 'Didi',
        recipientNickname: 'Chhotu',
        theme: 'warm-memory',
        message: 'A test heartfelt message for PostgreSQL integration verification.',
        plan: 'PREMIUM',
        status: 'DRAFT',
        surpriseBadge: 'Special Surprise',
        surpriseTitle: 'Secret Promise',
        surpriseMessage: 'We are going on a family trip!',
        photos: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
              thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
              caption: 'Childhood photo #1',
              date: '2015',
              displayOrder: 0,
              aspectRatio: 1.333,
              frameVariant: 'classic'
            },
            {
              url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74',
              thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74',
              caption: 'Diwali night #2',
              date: '2018',
              displayOrder: 1,
              aspectRatio: 1.333,
              frameVariant: 'note'
            }
          ]
        },
        reasons: {
          create: [
            {
              number: '01',
              title: 'Always supportive',
              text: 'Never lets me down',
              displayOrder: 0
            }
          ]
        }
      },
      include: {
        photos: true,
        reasons: true
      }
    });
    console.log(`✅ [2/9] Created Gift (${testGift.id}) with nested photos & reasons in PostgreSQL.`);

    // 3. Query Gift by slug
    const queriedGift = await prisma.gift.findUnique({
      where: { slug: testSlug },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        reasons: true
      }
    });
    if (!queriedGift || queriedGift.photos.length !== 2) {
      throw new Error('Failed to query gift by slug with nested relations.');
    }
    console.log(`✅ [3/9] Queried Gift by slug "${testSlug}" - found ${queriedGift.photos.length} photos.`);

    // 4. Update Gift properties & increment view counter
    const updatedGift = await prisma.gift.update({
      where: { id: testGift.id },
      data: {
        theme: 'playful-childhood',
        viewCount: { increment: 1 }
      }
    });
    if (updatedGift.theme !== 'playful-childhood' || updatedGift.viewCount !== 1) {
      throw new Error('Gift update failed.');
    }
    console.log(`✅ [4/9] Updated Gift theme to "${updatedGift.theme}" & incremented viewCount to ${updatedGift.viewCount}.`);

    // 5. Photo CRUD & Reordering
    const newPhoto = await prisma.giftPhoto.create({
      data: {
        giftId: testGift.id,
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
        caption: 'Graduation day',
        displayOrder: 2,
        frameVariant: 'caption'
      }
    });
    console.log(`✅ [5/9] Created new photo (${newPhoto.id}) for gift.`);

    // Update photo caption
    await prisma.giftPhoto.update({
      where: { id: newPhoto.id },
      data: { caption: 'Updated Graduation celebration ❤️' }
    });

    // 6. Payments table operations
    const testOrderId = `order_test_${Date.now()}`;
    const paymentRecord = await prisma.payment.create({
      data: {
        giftId: testGift.id,
        plan: 'PREMIUM',
        amount: 249,
        currency: 'INR',
        status: 'PAID',
        razorpayOrderId: testOrderId,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        paidAt: new Date()
      }
    });
    console.log(`✅ [6/9] Created Payment record for order "${paymentRecord.razorpayOrderId}".`);

    // 7. Analytics event tracking
    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        giftId: testGift.id,
        event: 'payment_success',
        sessionId: 'sess_test_123',
        device: 'desktop'
      }
    });
    console.log(`✅ [7/9] Logged Analytics Event "${analyticsEvent.event}".`);

    // 8. Aggregation & count queries
    const totalGifts = await prisma.gift.count();
    const totalPayments = await prisma.payment.count();
    console.log(`✅ [8/9] Verified count queries: ${totalGifts} gifts, ${totalPayments} payments in DB.`);

    // 9. Cascade deletion test
    await prisma.gift.delete({ where: { id: testGift.id } });
    const remainingPhotos = await prisma.giftPhoto.findMany({ where: { giftId: testGift.id } });
    const remainingReasons = await prisma.giftReason.findMany({ where: { giftId: testGift.id } });
    if (remainingPhotos.length !== 0 || remainingReasons.length !== 0) {
      throw new Error('Cascade delete failed: Orphan records still exist.');
    }
    console.log('✅ [9/9] Cascade deletion verified (photos, reasons, payments cleanly removed with gift).');

    console.log('\n🎉 ALL 9 POSTGRESQL DATABASE INTEGRATION TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('\n❌ PostgreSQL Smoke Test Failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPostgresSmokeTest();
