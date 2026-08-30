import Conversation from '../../models/Conversation.js';
import Product from '../../models/Product.js';

export const contextService = {
  /**
   * Get Active Shopping Context & Candidate Products
   */
  async getShoppingContext(conversationId) {
    if (!conversationId) return null;

    const conversation = await Conversation.findById(conversationId)
      .populate('shoppingState.candidateProducts')
      .populate('shoppingState.selectedProduct')
      .lean();

    if (!conversation) return null;

    return {
      shoppingState: conversation.shoppingState || {},
      candidateProducts: conversation.shoppingState?.candidateProducts || [],
      selectedProduct: conversation.shoppingState?.selectedProduct || null
    };
  },

  /**
   * Update Conversation Shopping State (Active Filters, Candidate Products)
   */
  async updateShoppingState(conversationId, updates = {}) {
    if (!conversationId) return null;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return null;

    if (!conversation.shoppingState) {
      conversation.shoppingState = {};
    }

    const { category, subcategory, brand, minPrice, maxPrice, minRating, candidateProductIds, selectedProductId, intent } = updates;

    if (intent) conversation.shoppingState.intent = intent;
    if (category !== undefined) conversation.shoppingState.category = category;
    if (subcategory !== undefined) conversation.shoppingState.subcategory = subcategory;
    if (brand !== undefined) conversation.shoppingState.brand = brand;
    if (minPrice !== undefined) conversation.shoppingState.minPrice = minPrice;
    if (maxPrice !== undefined) conversation.shoppingState.maxPrice = maxPrice;
    if (minRating !== undefined) conversation.shoppingState.minRating = minRating;

    if (Array.isArray(candidateProductIds) && candidateProductIds.length > 0) {
      conversation.shoppingState.candidateProducts = candidateProductIds;
    }

    if (selectedProductId) {
      conversation.shoppingState.selectedProduct = selectedProductId;
    }

    await conversation.save();
    return conversation.shoppingState;
  },

  /**
   * Resolve Natural-Language Product References ("the first one", "cheaper one", "that product")
   */
  async resolveProductReference(conversationId, referenceText) {
    const context = await this.getShoppingContext(conversationId);
    const candidates = context?.candidateProducts || [];

    if (candidates.length === 0) return null;

    const text = referenceText.toLowerCase().trim();

    // 1. Ordinal References ("first one", "second", "3rd product")
    if (text.includes('first') || text.includes('1st') || text.includes('number 1') || text.includes('one')) {
      return candidates[0] || null;
    }

    if (text.includes('second') || text.includes('2nd') || text.includes('number 2') || text.includes('two')) {
      return candidates[1] || candidates[0] || null;
    }

    if (text.includes('third') || text.includes('3rd') || text.includes('number 3') || text.includes('three')) {
      return candidates[2] || candidates[0] || null;
    }

    // 2. Comparative References ("cheaper one", "cheapest")
    if (text.includes('cheap') || text.includes('lower price') || text.includes('less expensive')) {
      const sorted = [...candidates].sort((a, b) => a.price - b.price);
      return sorted[0] || candidates[0];
    }

    // 3. Quality/Rating References ("better rated", "best rated", "highest rating")
    if (text.includes('better') || text.includes('rating') || text.includes('best')) {
      const sorted = [...candidates].sort((a, b) => b.rating - a.rating);
      return sorted[0] || candidates[0];
    }

    // 4. Selected/Previous Product ("that product", "selected product", "it")
    if (context.selectedProduct) {
      return context.selectedProduct;
    }

    // Default fallback to first candidate
    return candidates[0] || null;
  }
};

export default contextService;
