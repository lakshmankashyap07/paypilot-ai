import mongoose from 'mongoose';

const toolCallSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    args: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const toolResultSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    result: { type: mongoose.Schema.Types.Mixed },
    success: { type: Boolean, default: true }
  },
  { _id: false }
);

const agentActivitySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['thinking', 'tool', 'result', 'error'], required: true },
    message: { type: String, required: true },
    tool: { type: String },
    status: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ['USER', 'ASSISTANT', 'TOOL'],
      required: true
    },
    content: {
      type: String,
      default: ''
    },
    toolCalls: [toolCallSchema],
    toolResults: [toolResultSchema],
    agentActivity: [agentActivitySchema],
    products: [{ type: mongoose.Schema.Types.Mixed }] // Structured products snapshot attached to assistant response
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
