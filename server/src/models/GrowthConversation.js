import mongoose from 'mongoose';

const growthConversationSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'New Growth Strategy Session'
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const GrowthConversation = mongoose.model('GrowthConversation', growthConversationSchema);
export default GrowthConversation;
