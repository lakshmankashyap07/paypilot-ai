import mongoose from 'mongoose';

const aiRequestLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    role: {
      type: String,
      default: 'CUSTOMER'
    },
    provider: {
      type: String,
      default: 'Google Gemini'
    },
    model: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    requestTimestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    responseTimeMs: {
      type: Number,
      default: 0
    },
    toolCount: {
      type: Number,
      default: 0
    },
    success: {
      type: Boolean,
      default: true,
      index: true
    },
    errorType: {
      type: String,
      default: null
    },
    inputTokens: {
      type: Number,
      default: 0
    },
    outputTokens: {
      type: Number,
      default: 0
    },
    estimatedCost: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

aiRequestLogSchema.index({ createdAt: -1, success: 1 });

const AIRequestLog = mongoose.model('AIRequestLog', aiRequestLogSchema);
export default AIRequestLog;
