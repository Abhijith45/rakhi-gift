import { PrismaClient } from '@prisma/client';

/**
 * Production-grade PostgreSQL database client configuration via Prisma ORM.
 * Configured with logging, connection lifecycle management, and auto-seeding.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Validates connection to PostgreSQL on startup and seeds initial demonstration gift if needed
 */
export async function initDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database successfully.');

    // Ensure all required columns and tables exist (Self-healing schema migration)
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE "GiftMemory" ADD COLUMN IF NOT EXISTS "photoId" TEXT');
      await prisma.$executeRawUnsafe('ALTER TABLE "GiftMemory" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT');
      await prisma.$executeRawUnsafe('ALTER TABLE "GiftMemory" ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT');
      await prisma.$executeRawUnsafe('ALTER TABLE "GiftMemory" ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" TEXT');

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "GiftFunItem" (
            "id" TEXT NOT NULL,
            "giftId" TEXT NOT NULL,
            "question" TEXT NOT NULL,
            "answer" TEXT NOT NULL,
            "displayOrder" INTEGER NOT NULL DEFAULT 0,
            CONSTRAINT "GiftFunItem_pkey" PRIMARY KEY ("id")
        )
      `);

      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "GiftMemory_photoId_idx" ON "GiftMemory"("photoId")');
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "GiftFunItem_giftId_idx" ON "GiftFunItem"("giftId")');
      await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "GiftFunItem_displayOrder_idx" ON "GiftFunItem"("displayOrder")');
      console.log('✅ Schema self-healing verified (GiftMemory columns & GiftFunItem table).');
    } catch (migErr) {
      console.warn('⚠️ Non-critical schema self-healing warning:', migErr.message);
    }

    // Seed default demo gift if table is empty
    const count = await prisma.gift.count();
    if (count === 0) {
      console.log('🌱 Seeding initial demo gift into PostgreSQL...');
      const seedGift = await prisma.gift.create({
        data: {
          slug: 'aarav-8x92k',
          senderName: 'Ananya',
          recipientName: 'Aarav',
          relationship: 'Brother',
          theme: 'warm-memory',
          message:
            'No matter how many miles separate us or how busy life gets, you will always be the first person I turn to when I need a laugh, an honest opinion, or someone to split the last slice of pizza. Thank you for always protecting me, cheering for my craziest dreams, and never letting me forget where we came from. Happy Raksha Bandhan! ❤️',
          plan: 'PREMIUM',
          status: 'ACTIVE',
          surpriseBadge: 'A Little Surprise For You',
          surpriseTitle: 'One Last Promise...',
          surpriseMessage:
            "I booked our tickets for that concert we've been wanting to attend since 2019! Check your email this weekend. Here's to making 100 more memories together.",
          surpriseVoucher: 'FLIGHT & CONCERT PASS — NOVEMBER 2026',
          surpriseNote: 'Claimable anytime. Non-negotiable sibling date!',
          viewCount: 20,
          publishedAt: new Date(),
          photos: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
                caption: 'When we thought mud puddles were swimming pools.',
                date: 'Summer 2014',
                displayOrder: 0,
                aspectRatio: 1.333,
                frameVariant: 'note'
              },
              {
                url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
                caption: 'Burnt maggi, smoked kitchen, but we laughed for hours.',
                date: 'Diwali 2017',
                displayOrder: 1,
                aspectRatio: 1.333,
                frameVariant: 'classic'
              },
              {
                url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
                caption: 'You yelled louder than anyone else in the auditorium.',
                date: 'Spring 2021',
                displayOrder: 2,
                aspectRatio: 1.333,
                frameVariant: 'classic'
              },
              {
                url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
                caption: "Solving all the world's problems over chai.",
                date: 'Monsoon 2022',
                displayOrder: 3,
                aspectRatio: 1.333,
                frameVariant: 'note'
              },
              {
                url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
                caption: 'Flat tire, zero network, but the best playlist.',
                date: 'Winter 2023',
                displayOrder: 4,
                aspectRatio: 1.333,
                frameVariant: 'caption'
              },
              {
                url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                caption: 'Always looking out for each other.',
                date: 'Summer 2024',
                displayOrder: 5,
                aspectRatio: 1.333,
                frameVariant: 'classic'
              }
            ]
          },
          reasons: {
            create: [
              {
                number: '01',
                title: 'Always Having My Back',
                text: 'Even when I make the worst mistakes, you never judge — you just help me fix them.',
                displayOrder: 0
              },
              {
                number: '02',
                title: 'Our Secret Eyebrow Talks',
                text: 'We can communicate an entire paragraph across a crowded family dinner with one look.',
                displayOrder: 1
              },
              {
                number: '03',
                title: 'Best Playlist Curator',
                text: 'Every great road trip memory we have is tied to the songs you queued up.',
                displayOrder: 2
              },
              {
                number: '04',
                title: 'Forever Loyalty',
                text: "You'll roast me for an hour straight, but defend me fiercely against the rest of the world.",
                displayOrder: 3
              }
            ]
          }
        }
      });
      console.log('✅ Demo gift seeded successfully into PostgreSQL:', seedGift.slug);
    }
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL database:', err.message);
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ PostgreSQL disconnected cleanly.');
  } catch (err) {
    console.error('Error disconnecting PostgreSQL:', err.message);
  }
}

export default prisma;
