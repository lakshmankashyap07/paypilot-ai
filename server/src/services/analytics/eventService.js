import AnalyticsEvent from '../../models/AnalyticsEvent.js';

export const eventService = {
  /**
   * Track structured commerce analytics event with idempotency check
   */
  async trackEvent({
    eventType,
    user = null,
    merchant = null,
    product = null,
    order = null,
    payment = null,
    sessionId = null,
    conversationId = null,
    source = 'WEB',
    metadata = {}
  }) {
    try {
      const generatedId = `evt_${eventType}_${user || 'anon'}_${order || product || Date.now()}_${Math.floor(Math.random() * 10000)}`;

      // Deduplication check for specific idempotency keys
      if (metadata.idempotencyKey) {
        const existing = await AnalyticsEvent.findOne({ eventId: metadata.idempotencyKey });
        if (existing) return existing;
      }

      const event = await AnalyticsEvent.create({
        eventId: metadata.idempotencyKey || generatedId,
        eventType,
        user,
        merchant,
        product,
        order,
        payment,
        sessionId,
        conversationId,
        source: source || (conversationId ? 'AI_AGENT' : 'WEB'),
        metadata
      });

      return event;
    } catch (err) {
      console.warn('Analytics event tracking notice:', err.message);
      return null;
    }
  }
};

export default eventService;
