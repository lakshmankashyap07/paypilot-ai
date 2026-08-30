import mongoose from 'mongoose';

const paymentEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    eventType: {
      type: String,
      required: true,
      index: true
    },
    processed: {
      type: Boolean,
      default: false
    },
    processedAt: {
      type: Date,
      default: null
    },
    payloadHash: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const PaymentEvent = mongoose.model('PaymentEvent', paymentEventSchema);
export default PaymentEvent;
