import aiShoppingIntelligenceService from '../services/ai/aiShoppingIntelligenceService.js';

/**
 * POST /api/ai-intelligence/natural-search
 */
export const handleNaturalSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const result = await aiShoppingIntelligenceService.parseNaturalSearchQuery(query);
    return res.status(200).json({
      success: true,
      message: 'Natural language search query parsed successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process natural search'
    });
  }
};

/**
 * POST /api/ai-intelligence/compare
 */
export const handleCompareProducts = async (req, res) => {
  try {
    const { productIds, userCriteria } = req.body;
    const result = await aiShoppingIntelligenceService.compareProducts(productIds, userCriteria);
    return res.status(200).json({
      success: true,
      message: 'Product comparison generated successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to compare products'
    });
  }
};

/**
 * POST /api/ai-intelligence/budget-guard
 */
export const handleBudgetGuard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userBudget } = req.body;
    const result = await aiShoppingIntelligenceService.analyzeCartBudget(userId, userBudget);
    return res.status(200).json({
      success: true,
      message: 'Cart budget analyzed successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to analyze cart budget'
    });
  }
};

/**
 * GET /api/ai-intelligence/bundles/:productId
 */
export const handleSmartBundles = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userBudget } = req.query;
    const result = await aiShoppingIntelligenceService.getSmartBundles(productId, userBudget);
    return res.status(200).json({
      success: true,
      message: 'Smart bundle recommendations retrieved',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch smart bundles'
    });
  }
};

/**
 * GET /api/ai-intelligence/price-intelligence/:productId
 */
export const handlePriceIntelligence = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await aiShoppingIntelligenceService.getPriceIntelligence(productId);
    return res.status(200).json({
      success: true,
      message: 'Price intelligence data retrieved',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch price intelligence'
    });
  }
};

/**
 * GET /api/ai-intelligence/smart-wishlist
 */
export const handleSmartWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await aiShoppingIntelligenceService.getSmartWishlist(userId);
    return res.status(200).json({
      success: true,
      message: 'Smart wishlist tracking retrieved',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch smart wishlist'
    });
  }
};

/**
 * GET /api/ai-intelligence/for-you
 */
export const handlePersonalizedFeed = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    const result = await aiShoppingIntelligenceService.getPersonalizedFeed(userId, limit);
    return res.status(200).json({
      success: true,
      message: 'Personalized "For You" feed retrieved',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch personalized feed'
    });
  }
};

/**
 * POST /api/ai-intelligence/checkout-summary
 */
export const handleCheckoutAssistant = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userBudget } = req.body;
    const result = await aiShoppingIntelligenceService.getCheckoutAssistantSummary(userId, userBudget);
    return res.status(200).json({
      success: true,
      message: 'AI Checkout assistant summary generated',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to generate checkout summary'
    });
  }
};
