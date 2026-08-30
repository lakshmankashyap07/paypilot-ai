import api from './api';

export const paymentService = {
  /**
   * Create Razorpay Payment Order for internal orderId
   */
  async createPaymentOrder(orderId) {
    const response = await api.post('/payments/create-order', { orderId });
    return response;
  },

  /**
   * Verify Razorpay Payment Signature
   */
  async verifyPayment(razorpayPayload) {
    const response = await api.post('/payments/verify', razorpayPayload);
    return response;
  },

  /**
   * Mark Payment as Failed
   */
  async markPaymentFailed(paymentId, failureReason = '') {
    const response = await api.post(`/payments/${paymentId}/failed`, { failureReason });
    return response;
  },

  /**
   * Get Customer Payment History
   */
  async getPayments() {
    const response = await api.get('/payments');
    return response;
  },

  /**
   * Get Single Payment Details
   */
  async getPayment(paymentId) {
    const response = await api.get(`/payments/${paymentId}`);
    return response;
  },

  /**
   * Retry Payment for Failed Order
   */
  async retryPayment(paymentId) {
    const response = await api.post(`/payments/${paymentId}/retry`);
    return response;
  }
};

export default paymentService;
