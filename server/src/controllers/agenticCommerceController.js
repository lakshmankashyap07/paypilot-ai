import agenticCommerceService from '../services/ai/agenticCommerceService.js';

/**
 * POST /api/agentic/deal-optimizer
 */
export const handleDealOptimizer = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await agenticCommerceService.optimizeCartDeals(userId);
    return res.status(200).json({
      success: true,
      message: 'Cart deals optimized',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to optimize cart deals'
    });
  }
};

/**
 * POST /api/agentic/post-purchase
 */
export const handlePostPurchaseQuery = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, query } = req.body;
    const result = await agenticCommerceService.handlePostPurchaseQuery(userId, orderId, query);
    return res.status(200).json({
      success: true,
      message: 'Post-purchase order query processed',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process post-purchase query'
    });
  }
};

/**
 * POST /api/agentic/return-request
 */
export const handleReturnRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, productId, issueCategory, reasonDetails } = req.body;
    const result = await agenticCommerceService.processReturnRequest(userId, {
      orderId,
      productId,
      issueCategory,
      reasonDetails
    });
    return res.status(200).json({
      success: true,
      message: 'Return request processed',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process return request'
    });
  }
};

/**
 * GET /api/agentic/merchant/copilot
 */
export const handleMerchantCopilot = async (req, res) => {
  try {
    const merchantId = req.user._id;
    const result = await agenticCommerceService.getMerchantCopilotInsights(merchantId);
    return res.status(200).json({
      success: true,
      message: 'Merchant copilot insights retrieved',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch merchant copilot insights'
    });
  }
};

/**
 * POST /api/agentic/merchant/copilot-qa
 */
export const handleMerchantCopilotQA = async (req, res) => {
  try {
    const merchantId = req.user._id;
    const { question } = req.body;
    const answer = await agenticCommerceService.handleMerchantCopilotQA(merchantId, question);
    return res.status(200).json({
      success: true,
      message: 'Merchant copilot Q&A processed',
      data: { answer }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to answer merchant copilot question'
    });
  }
};

/**
 * POST /api/agentic/merchant/generate-listing
 */
export const handleGenerateListingAI = async (req, res) => {
  try {
    const { name, brand, category, subcategory, specifications } = req.body;
    const result = await agenticCommerceService.generateProductListingAI({
      name,
      brand,
      category,
      subcategory,
      specifications
    });
    return res.status(200).json({
      success: true,
      message: 'AI Product listing generated successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to generate product listing'
    });
  }
};

/**
 * GET /api/agentic/order-risk/:orderId
 */
export const handleOrderRisk = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await agenticCommerceService.evaluateOrderRisk(orderId);
    return res.status(200).json({
      success: true,
      message: 'Order risk evaluation completed',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to evaluate order risk'
    });
  }
};

/**
 * DELETE /api/agentic/shopping-memory
 */
export const handleResetShoppingMemory = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await agenticCommerceService.resetUserShoppingMemory(userId);
    return res.status(200).json({
      success: true,
      message: 'Shopping memory reset',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to reset shopping memory'
    });
  }
};

/**
 * POST /api/agentic/budget-guard
 */
export const handleBudgetGuard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userBudget } = req.body;
    const result = await agenticCommerceService.analyzeCartBudgetAndOptimization(userId, userBudget);
    return res.status(200).json({
      success: true,
      message: 'Cart budget & deal optimization analysis complete',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to analyze cart budget'
    });
  }
};
