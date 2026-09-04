/**
 * Helper to compute Return/Replacement eligibility for an order
 * @param {Object} order
 * @returns {Object} { isEligible: boolean, reason: string, daysRemaining: number, formattedDeliveryDate: string, statusMessage: string }
 */
export function getReturnEligibility(order) {
  if (!order) {
    return { isEligible: false, reason: 'INVALID_ORDER', statusMessage: 'Order unavailable' };
  }

  const rawStatus = (order.orderStatus || order.status || '').toUpperCase();

  // Statuses where return is impossible because it hasn't been delivered
  const nonDeliveredStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'IN_TRANSIT'];
  if (nonDeliveredStatuses.includes(rawStatus)) {
    return {
      isEligible: false,
      reason: 'NOT_DELIVERED',
      statusMessage: 'Return / Replacement available after delivery'
    };
  }

  if (rawStatus === 'CANCELLED') {
    return {
      isEligible: false,
      reason: 'CANCELLED',
      statusMessage: 'Order was cancelled'
    };
  }

  if (rawStatus === 'RETURN_REQUESTED' || rawStatus === 'RETURN_PENDING') {
    return {
      isEligible: false,
      reason: 'ALREADY_REQUESTED',
      statusMessage: 'Return Requested — In Review'
    };
  }

  if (rawStatus === 'REPLACEMENT_REQUESTED' || rawStatus === 'REPLACEMENT_PENDING') {
    return {
      isEligible: false,
      reason: 'ALREADY_REQUESTED',
      statusMessage: 'Replacement Requested — In Review'
    };
  }

  if (rawStatus === 'RETURN_APPROVED' || rawStatus === 'RETURN_PICKUP_SCHEDULED') {
    return {
      isEligible: false,
      reason: 'RETURN_APPROVED',
      statusMessage: 'Return Approved — Pickup Pending'
    };
  }

  if (rawStatus === 'REPLACEMENT_APPROVED') {
    return {
      isEligible: false,
      reason: 'REPLACEMENT_APPROVED',
      statusMessage: 'Replacement Approved — Processing'
    };
  }

  if (rawStatus === 'RETURNED') {
    return {
      isEligible: false,
      reason: 'RETURNED',
      statusMessage: 'Item Returned & Refunded'
    };
  }

  if (rawStatus === 'REPLACED') {
    return {
      isEligible: false,
      reason: 'REPLACED',
      statusMessage: 'Item Replaced'
    };
  }

  // Must be DELIVERED to proceed to 7-day return window check
  if (rawStatus !== 'DELIVERED') {
    return {
      isEligible: false,
      reason: 'NOT_DELIVERED',
      statusMessage: 'Return / Replacement available after delivery'
    };
  }

  // Check 7-Day Return Window
  const RETURN_WINDOW_DAYS = 7;
  const deliveryDateRef = order.deliveredAt || order.updatedAt || order.createdAt;
  const deliveryDate = new Date(deliveryDateRef);
  const now = new Date();

  const diffTime = now.getTime() - deliveryDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  const daysRemaining = Math.max(0, Math.ceil(RETURN_WINDOW_DAYS - diffDays));

  if (diffDays > RETURN_WINDOW_DAYS) {
    return {
      isEligible: false,
      reason: 'EXPIRED',
      daysRemaining: 0,
      statusMessage: 'Return window expired (7-day policy)'
    };
  }

  return {
    isEligible: true,
    reason: 'ELIGIBLE',
    daysRemaining,
    formattedDeliveryDate: deliveryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    statusMessage: `Eligible for return (${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining)`
  };
}

export default getReturnEligibility;
