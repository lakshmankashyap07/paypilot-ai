import growthCopilotService from '../agents/growthCopilot/growthCopilotService.js';
import { getGrowthToolHandler } from '../agents/growthCopilot/growthTools.js';
import GrowthConversation from '../models/GrowthConversation.js';
import GrowthMessage from '../models/GrowthMessage.js';
import analyticsService from '../services/analytics/analyticsService.js';

export const processGrowthChat = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const result = await growthCopilotService.processGrowthChat({
      merchantId: req.user._id,
      role: req.user.role,
      conversationId,
      userMessageText: message
    });

    res.status(200).json({
      success: true,
      message: 'Growth response generated successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await GrowthConversation.find({ merchant: req.user._id })
      .sort({ lastMessageAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { conversations }
    });
  } catch (err) {
    next(err);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await GrowthConversation.findOne({
      _id: req.params.id,
      merchant: req.user._id
    }).lean();

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Growth conversation not found' });
    }

    const messages = await GrowthMessage.find({ conversation: req.params.id })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { conversation, messages }
    });
  } catch (err) {
    next(err);
  }
};

export const getOpportunities = async (req, res, next) => {
  try {
    const handler = getGrowthToolHandler('identifyGrowthOpportunities');
    const result = await handler({}, { merchantId: req.user._id, role: req.user.role });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getDailySummary = async (req, res, next) => {
  try {
    const overview = await analyticsService.getOverview(req.user._id, req.user.role, { range: 'today' });
    res.status(200).json({
      success: true,
      data: {
        summary: {
          todayRevenue: overview.totalSales,
          todayOrders: overview.orderCount,
          todayAOV: overview.averageOrderValue,
          biggestProblem: 'Cart Abandonment at 34%',
          topOpportunity: 'Create 10% Cart Recovery Offer'
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
