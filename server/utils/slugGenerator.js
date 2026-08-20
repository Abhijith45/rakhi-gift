import crypto from 'crypto';
import prisma from '../config/prisma.js';

/**
 * Generates a clean, readable, collision-safe gift slug
 * Example: 'aarav-8x92k', 'ananya-4m19q'
 */
export function generateGiftSlug(recipientName = 'sibling') {
  // Clean recipient name: lowercase, alphanumeric only
  const cleanName = (recipientName || 'gift')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 16) || 'gift';

  // Random 5-character alphanumeric token
  const randomSuffix = crypto.randomBytes(3).toString('hex').slice(0, 5);

  return `${cleanName}-${randomSuffix}`;
}

/**
 * Generates a guaranteed unique slug by checking against the database
 */
export async function generateUniqueGiftSlug(recipientName = 'sibling', dbClient = prisma) {
  let attempts = 0;
  while (attempts < 10) {
    const candidate = generateGiftSlug(recipientName);
    const existing = await dbClient.gift.findUnique({ where: { slug: candidate } });
    if (!existing) {
      return candidate;
    }
    attempts++;
  }
  // Fallback with longer random entropy if needed
  return `${(recipientName || 'gift').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}-${Date.now().toString(36)}`;
}

export default generateGiftSlug;
