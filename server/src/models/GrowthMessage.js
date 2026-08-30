import mongoose from 'mongoose';

const growthMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GrowthConversation',
      required: true,
      index: true
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ['MERCHANT', 'COPILOT', 'TOOL'],
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    toolCalls: {
      type: Array,
      default: []
    },
    toolResults: {
      type: Array,
      default: []
    },
    agentActivity: {
      type: Array,
      default: []
    },
    evidenceCards: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

const GrowthMessage = mongoose.model('GrowthMessage', growthMessageSchema);
export default GrowthMessage;
