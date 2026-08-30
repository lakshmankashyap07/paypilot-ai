export const PAYMENT_STATUSES = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const paymentStateService = {
  /**
   * Validate if Payment status transition is allowed
   */
  isValidPaymentTransition(currentStatus, targetStatus) {
    if (currentStatus === targetStatus) return true; // Idempotent

    const allowedTransitions = {
      CREATED: ['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED'],
      PENDING: ['AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED'],
      AUTHORIZED: ['CAPTURED', 'FAILED', 'REFUNDED'],
      CAPTURED: ['REFUNDED'],
      FAILED: ['PENDING', 'CREATED'], // Payment Retry allows transition back to attempt
      CANCELLED: [],
      REFUNDED: []
    };

    const validNext = allowedTransitions[currentStatus] || [];
    return validNext.includes(targetStatus);
  },

  /**
   * Map Payment Status change to appropriate Order Status update
   */
  mapPaymentToOrderStatus(paymentStatus) {
    switch (paymentStatus) {
      case 'CAPTURED':
        return ORDER_STATUSES.CONFIRMED;
      case 'CANCELLED':
        return ORDER_STATUSES.CANCELLED;
      default:
        return null; // Leave order status unchanged
    }
  }
};

export default paymentStateService;
