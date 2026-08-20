import prisma from '../config/prisma.js';
import { generateGiftSlug } from '../utils/slugGenerator.js';
import { calculateDeterministicLayout, calculateThreadConnections } from '../utils/deterministicLayout.js';
import { uploadImageBuffer } from '../config/cloudinary.js';

const MAX_IMAGES_PER_GIFT = 8;
const MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024; // 6 MB

/**
 * Creates a new Gift Draft
 */
export async function createDraft(req, res) {
  try {
    const {
      senderName,
      recipientName,
      relationship = 'Brother',
      senderNickname,
      recipientNickname,
      theme = 'warm-memory',
      message = '',
      plan = 'PREMIUM',
      reasons = [],
      surprise = {}
    } = req.body;

    if (!senderName || !recipientName) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Sender and Recipient names are required.'
        }
      });
    }

    const gift = await prisma.gift.create({
      data: {
        slug: null, // Public slug is created only after verified payment
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        relationship,
        senderNickname: senderNickname?.trim() || null,
        recipientNickname: recipientNickname?.trim() || null,
        theme,
        message: message.trim(),
        plan: plan.toUpperCase(),
        status: 'DRAFT',
        surpriseBadge: surprise.badge || 'A Little Surprise For You',
        surpriseTitle: surprise.title || 'One Last Promise...',
        surpriseMessage: surprise.message || '',
        surpriseVoucher: surprise.voucher || '',
        surpriseNote: surprise.note || '',
        reasons: {
          create: reasons.map((r, idx) => ({
            number: r.number || `0${idx + 1}`,
            title: r.title || `Special Reason ${idx + 1}`,
            text: r.text || '',
            displayOrder: idx
          }))
        }
      },
      include: {
        photos: true,
        reasons: true
      }
    });

    return res.status(201).json({
      success: true,
      data: gift
    });
  } catch (err) {
    console.error('Error creating gift draft:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create gift draft.'
      }
    });
  }
}

/**
 * Updates an existing Gift Draft
 */
export async function updateGift(req, res) {
  try {
    const { id } = req.params;
    const {
      senderName,
      recipientName,
      relationship,
      senderNickname,
      recipientNickname,
      theme,
      message,
      plan,
      reasons,
      surprise
    } = req.body;

    const existing = await prisma.gift.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gift not found.' }
      });
    }

    // Update reasons if provided
    if (Array.isArray(reasons)) {
      await prisma.giftReason.deleteMany({ where: { giftId: id } });
      await prisma.giftReason.createMany({
        data: reasons.map((r, idx) => ({
          giftId: id,
          number: r.number || `0${idx + 1}`,
          title: r.title || `Reason ${idx + 1}`,
          text: r.text || '',
          displayOrder: idx
        }))
      });
    }

    const updated = await prisma.gift.update({
      where: { id },
      data: {
        ...(senderName && { senderName: senderName.trim() }),
        ...(recipientName && { recipientName: recipientName.trim() }),
        ...(relationship && { relationship }),
        ...(senderNickname !== undefined && { senderNickname }),
        ...(recipientNickname !== undefined && { recipientNickname }),
        ...(theme && { theme }),
        ...(message !== undefined && { message }),
        ...(plan && { plan: plan.toUpperCase() }),
        ...(surprise?.badge && { surpriseBadge: surprise.badge }),
        ...(surprise?.title && { surpriseTitle: surprise.title }),
        ...(surprise?.message !== undefined && { surpriseMessage: surprise.message }),
        ...(surprise?.voucher !== undefined && { surpriseVoucher: surprise.voucher }),
        ...(surprise?.note !== undefined && { surpriseNote: surprise.note })
      },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        reasons: { orderBy: { displayOrder: 'asc' } }
      }
    });

    return res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error('Error updating gift:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update gift.' }
    });
  }
}

/**
 * Uploads photos to a Gift with strict 8-photo and 6MB limits
 */
export async function uploadPhotos(req, res) {
  try {
    const { id } = req.params;
    const { photos = [], caption, date } = req.body;

    const gift = await prisma.gift.findUnique({
      where: { id },
      include: { photos: true }
    });

    if (!gift) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gift not found.' }
      });
    }

    // Enforce maximum 8 images per gift constraint
    const currentCount = gift.photos.length;
    if (currentCount + photos.length > MAX_IMAGES_PER_GIFT) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'IMAGE_LIMIT_EXCEEDED',
          message: `You can add up to ${MAX_IMAGES_PER_GIFT} memories.`
        }
      });
    }

    const uploadedPhotos = [];

    // Process photo items (base64 data URLs or URLs)
    for (let i = 0; i < photos.length; i++) {
      const item = photos[i];
      let buffer;
      let originalname = item.name || `memory-${Date.now()}-${i}.jpg`;

      if (item.data && typeof item.data === 'string' && item.data.includes('base64,')) {
        const base64Data = item.data.split('base64,')[1];
        buffer = Buffer.from(base64Data, 'base64');
      } else if (item.data && Buffer.isBuffer(item.data)) {
        buffer = item.data;
      } else {
        // Direct URL or placeholder
        const photoRecord = await prisma.giftPhoto.create({
          data: {
            giftId: id,
            url: item.url || item.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            thumbnailUrl: item.thumbnailUrl || item.url || item.imageUrl,
            caption: item.caption || caption || null,
            frameVariant: item.frameVariant || (item.caption || caption ? 'caption' : 'classic'),
            date: item.date || date || 'Raksha Bandhan',
            displayOrder: currentCount + i,
            aspectRatio: 1.333
          }
        });
        uploadedPhotos.push(photoRecord);
        continue;
      }

      // Enforce 6MB file size validation
      if (buffer.length > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'This photo is larger than 6 MB. Please choose a smaller image.'
          }
        });
      }

      const uploadResult = await uploadImageBuffer(buffer, originalname);

      const photoRecord = await prisma.giftPhoto.create({
        data: {
          giftId: id,
          url: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          cloudinaryPublicId: uploadResult.publicId,
          caption: item.caption || caption || null,
          frameVariant: item.frameVariant || (item.caption || caption ? 'caption' : 'classic'),
          date: item.date || date || 'Raksha Bandhan',
          displayOrder: currentCount + i,
          aspectRatio: 1.333
        }
      });

      uploadedPhotos.push(photoRecord);
    }

    return res.status(201).json({
      success: true,
      data: uploadedPhotos
    });
  } catch (err) {
    console.error('Error uploading photos:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_ERROR', message: 'Failed to upload photo assets.' }
    });
  }
}

/**
 * Updates a specific photo (caption, date, frameVariant)
 */
export async function updatePhoto(req, res) {
  try {
    const { id, photoId } = req.params;
    const { caption, date, frameVariant } = req.body;

    const photo = await prisma.giftPhoto.findFirst({
      where: { id: photoId, giftId: id }
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Photo not found.' }
      });
    }

    const updated = await prisma.giftPhoto.update({
      where: { id: photoId },
      data: {
        ...(caption !== undefined && { caption }),
        ...(date !== undefined && { date }),
        ...(frameVariant && { frameVariant })
      }
    });

    return res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error('Error updating photo:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update photo.' }
    });
  }
}

/**
 * Reorders photos for a Gift
 */
export async function reorderPhotos(req, res) {
  try {
    const { id } = req.params;
    const { photoIds = [] } = req.body;

    for (let i = 0; i < photoIds.length; i++) {
      await prisma.giftPhoto.update({
        where: { id: photoIds[i] },
        data: { displayOrder: i }
      });
    }

    const photos = await prisma.giftPhoto.findMany({
      where: { giftId: id },
      orderBy: { displayOrder: 'asc' }
    });

    return res.json({
      success: true,
      data: photos
    });
  } catch (err) {
    console.error('Error reordering photos:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to reorder photos.' }
    });
  }
}

/**
 * Deletes a Photo from a Gift
 */
export async function deletePhoto(req, res) {
  try {
    const { id, photoId } = req.params;

    const photo = await prisma.giftPhoto.findFirst({
      where: { id: photoId, giftId: id }
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Photo not found.' }
      });
    }

    await prisma.giftPhoto.delete({ where: { id: photoId } });

    return res.json({
      success: true,
      data: { deletedId: photoId }
    });
  } catch (err) {
    console.error('Error deleting photo:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to remove photo.' }
    });
  }
}

/**
 * Gets Gift Draft Details (for Creator Preview)
 */
export async function getDraft(req, res) {
  try {
    const { id } = req.params;

    const gift = await prisma.gift.findUnique({
      where: { id },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        reasons: { orderBy: { displayOrder: 'asc' } },
        memories: { orderBy: { displayOrder: 'asc' } },
        payments: true
      }
    });

    if (!gift) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Gift not found.' }
      });
    }

    // Compute deterministic 3D positions
    const formattedPhotos = calculateDeterministicLayout(gift.photos, gift.slug || gift.id);
    const threadConnections = calculateThreadConnections(formattedPhotos);

    return res.json({
      success: true,
      data: {
        ...gift,
        photos: formattedPhotos,
        threadConnections
      }
    });
  } catch (err) {
    console.error('Error fetching draft:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch gift draft.' }
    });
  }
}

/**
 * Gets Public Gift Record (for Recipient Page)
 */
export async function getPublicGift(req, res) {
  try {
    const { slug } = req.params;

    const gift = await prisma.gift.findUnique({
      where: { slug },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        reasons: { orderBy: { displayOrder: 'asc' } },
        memories: { orderBy: { displayOrder: 'asc' } }
      }
    });

    if (!gift) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GIFT_NOT_FOUND',
          message: 'This Rakhi gift link does not exist or has expired.'
        }
      });
    }

    if (gift.status !== 'ACTIVE' && gift.status !== 'PAID') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'GIFT_INACTIVE',
          message: 'This Rakhi gift is still in draft or awaiting activation.'
        }
      });
    }

    // Increment anonymous view counter
    await prisma.gift.update({
      where: { id: gift.id },
      data: { viewCount: { increment: 1 } }
    });

    // Compute deterministic 3D positions
    const formattedPhotos = calculateDeterministicLayout(gift.photos, gift.slug);
    const threadConnections = calculateThreadConnections(formattedPhotos);

    // Return sanitized public presentation data
    return res.json({
      success: true,
      data: {
        id: gift.id,
        slug: gift.slug,
        senderName: gift.senderName,
        recipientName: gift.recipientName,
        relationship: gift.relationship,
        senderNickname: gift.senderNickname,
        recipientNickname: gift.recipientNickname,
        theme: gift.theme,
        message: {
          salutation: `Dearest ${gift.recipientNickname || gift.recipientName},`,
          body: gift.message,
          signoff: `With all my love,`,
          sender: gift.senderNickname || gift.senderName
        },
        reasons: gift.reasons.map((r, idx) => ({
          id: r.id,
          number: r.number || `0${idx + 1}`,
          title: r.title,
          text: r.text
        })),
        surprise: {
          badge: gift.surpriseBadge || 'A Little Surprise For You',
          title: gift.surpriseTitle || 'One Last Promise...',
          message: gift.surpriseMessage || '',
          giftVoucher: gift.surpriseVoucher || '',
          giftNote: gift.surpriseNote || ''
        },
        photos: formattedPhotos,
        threadConnections,
        publishedAt: gift.publishedAt
      }
    });
  } catch (err) {
    console.error('Error fetching public gift:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to load public gift.' }
    });
  }
}
