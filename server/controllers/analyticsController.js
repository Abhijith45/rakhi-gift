import prisma from '../config/prisma.js';

/**
 * Tracks an anonymous user analytics / funnel event
 */
export async function trackEvent(req, res) {
  try {
    const { event, giftId, sessionId, device, referrer } = req.body;

    if (!event) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Event name is required.' }
      });
    }

    const recorded = await prisma.analyticsEvent.create({
      data: {
        event,
        giftId: giftId || null,
        sessionId: sessionId || null,
        device: device || 'desktop',
        referrer: referrer || null
      }
    });

    return res.status(201).json({
      success: true,
      data: { id: recorded.id, event: recorded.event }
    });
  } catch (err) {
    console.error('Analytics tracking error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'TRACKING_FAILED', message: 'Failed to record analytics event.' }
    });
  }
}

/**
 * Summarizes funnel counts and key conversion metrics
 */
export async function getAnalyticsSummary(req, res) {
  try {
    const events = await prisma.analyticsEvent.findMany();

    const counts = {
      landing_view: 0,
      create_started: 0,
      preview_viewed: 0,
      payment_started: 0,
      payment_success: 0,
      payment_failed: 0,
      gift_created: 0,
      gift_viewed: 0,
      surprise_revealed: 0,
      share_clicked: 0,
      whatsapp_share_clicked: 0,
      qr_generated: 0
    };

    events.forEach((e) => {
      if (counts[e.event] !== undefined) {
        counts[e.event]++;
      }
    });

    // Calculate funnel conversions
    const conversionRate = counts.landing_view > 0
      ? Number(((counts.payment_success / counts.landing_view) * 100).toFixed(1))
      : 0;

    return res.json({
      success: true,
      data: {
        counts,
        totalEvents: events.length,
        conversionRate,
        recentEvents: events.slice(-20).reverse()
      }
    });
  } catch (err) {
    console.error('Error fetching analytics summary:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to aggregate analytics.' }
    });
  }
}
