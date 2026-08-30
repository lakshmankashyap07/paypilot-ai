import Razorpay from 'razorpay';

class RazorpayService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_paypilot_key_id';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_paypilot_key_secret';
    this.client = null;

    if (this.keyId && this.keySecret) {
      try {
        this.client = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret
        });
      } catch (err) {
        console.warn('Failed to initialize Razorpay SDK client:', err.message);
      }
    }
  }

  isConfigured() {
    return Boolean(this.keyId && this.keySecret);
  }

  getKeyId() {
    return this.keyId;
  }

  /**
   * Create Razorpay Order
   * Amount MUST be in smallest currency unit (e.g. Paise for INR: 100 paise = ₹1)
   */
  async createRazorpayOrder({ amountInPaise, currency = 'INR', receipt, notes = {} }) {
    if (this.client) {
      try {
        const options = {
          amount: amountInPaise,
          currency,
          receipt: receipt || `receipt_${Date.now()}`,
          notes
        };

        const razorpayOrder = await this.client.orders.create(options);
        return razorpayOrder;
      } catch (error) {
        console.warn('Razorpay SDK Order Creation notice (falling back to Sandbox Demo mode):', error.message || error.description);
      }
    }

    // Sandbox / Test Mode Fallback Order Generation for local development
    const mockRazorpayOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    return {
      id: mockRazorpayOrderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes,
      created_at: Math.floor(Date.now() / 1000),
      isMock: true
    };
  }

  /**
   * Fetch Razorpay Payment details by paymentId
   */
  async fetchPayment(razorpayPaymentId) {
    if (!this.client) return null;
    try {
      return await this.client.payments.fetch(razorpayPaymentId);
    } catch (err) {
      console.warn('Razorpay fetch payment error:', err.message);
      return null;
    }
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService;
