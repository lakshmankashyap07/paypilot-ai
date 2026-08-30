import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      index: true
    },
    provider: {
      type: String,
      default: 'gemini'
    },
    model: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    toolCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'UNCONFIGURED'],
      default: 'SUCCESS'
    },
    responseTimeMs: {
      type: Number,
      default: 0
    },
    error: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const AILog = mongoose.model('AILog', aiLogSchema);
export default AILog;
