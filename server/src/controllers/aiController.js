import commerceAgent from '../agents/commerceAgent.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * AI Chat Message Endpoint
 * POST /api/ai/chat
 */
export const postChatMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const result = await commerceAgent.processMessage({
      userId: req.user._id,
      conversationId,
      message: message.trim()
    });

    res.status(200).json({
      success: true,
      message: 'AI agent response generated',
      data: {
        conversationId: result.conversationId,
        message: result.message,
        products: result.products || [],
        agentActivity: result.agentActivity || [],
        agentState: 'completed'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'AI Agent processing error'
    });
  }
};

/**
 * Create Conversation Thread
 * POST /api/ai/conversations
 */
export const createConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      user: req.user._id,
      title: title || 'New Shopping Session'
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created',
      data: { conversation }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Conversations List
 * GET /api/ai/conversations
 */
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ lastMessageAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Conversations fetched successfully',
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Conversation Details with Message History
 * GET /api/ai/conversations/:id
 */
export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findOne({ _id: id, user: req.user._id }).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({ conversation: id })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Conversation details fetched',
      data: {
        conversation,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Conversation Thread
 * DELETE /api/ai/conversations/:id
 */
export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findOneAndDelete({ _id: id, user: req.user._id });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    await Message.deleteMany({ conversation: id });

    res.status(200).json({
      success: true,
      message: 'Conversation deleted',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
