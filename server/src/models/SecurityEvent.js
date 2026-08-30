import mongoose from 'mongoose';

const securityEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        'LOGIN_FAILURE',
        'UNAUTHORIZED_ACCESS',
        'INVALID_TOKEN',
        'RATE_LIMIT_TRIGGERED',
        'PAYMENT_VERIFICATION_FAILURE',
        'WEBHOOK_VERIFICATION_FAILURE',
        'AI_TOOL_AUTHORIZATION_FAILURE'
      ],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    role: {
      type: String,
      default: 'ANONYMOUS'
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    path: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

securityEventSchema.index({ createdAt: -1, eventType: 1 });

const SecurityEvent = mongoose.model('SecurityEvent', securityEventSchema);
export default SecurityEvent;
