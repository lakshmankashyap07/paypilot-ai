import mongoose from 'mongoose';

const growthActionLogSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GrowthConversation'
    },
    action: {
      type: String,
      enum: ['CAMPAIGN_DRAFT_CREATED', 'CAMPAIGN_ACTIVATED', 'CAMPAIGN_PAUSED', 'CAMPAIGN_DELETED'],
      required: true
    },
    target: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'SUCCESS'
    },
    confirmedByMerchant: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const GrowthActionLog = mongoose.model('GrowthActionLog', growthActionLogSchema);
export default GrowthActionLog;
