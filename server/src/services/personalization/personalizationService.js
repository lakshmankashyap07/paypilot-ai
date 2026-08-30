import userInterestService from './userInterestService.js';
import recommendationRankingService from './recommendationRankingService.js';
import Product from '../../models/Product.js';
import UserPreference from '../../models/UserPreference.js';

export const personalizationService = {
  /**
   * Get Personalized Home Page Feeds
   */
  async getPersonalizedHomePage(userId) {
    const interestVector = await userInterestService.getUserInterestVector(userId);
    const allProducts = await Product.find({ active: true }).lean();

    const rankedProducts = recommendationRankingService.rankProducts(allProducts, interestVector);

    // Recently Viewed
    let recentlyViewed = [];
    if (interestVector.viewedProductIds?.length > 0) {
      recentlyViewed = allProducts.filter((p) => interestVector.viewedProductIds.includes(p._id.toString())).slice(0, 4);
    }

    return {
      recommendedForYou: rankedProducts.slice(0, 6),
      recentlyViewed,
      basedOnInterests: rankedProducts.slice(6, 12),
      popularCategories: ['Laptops', 'Headphones', 'Footwear', 'Gaming'],
      personalizationEnabled: interestVector.personalizationEnabled
    };
  },

  /**
   * Smart Product Similarity & Alternatives (cheaper, better rated, premium, similar)
   */
  async findSimilarProducts(productId) {
    const targetProduct = await Product.findById(productId).lean();
    if (!targetProduct) throw new Error('Target product not found');

    const sameCategory = await Product.find({
      _id: { $ne: targetProduct._id },
      category: targetProduct.category,
      active: true
    }).lean();

    const cheaper = sameCategory.filter((p) => p.price < targetProduct.price).sort((a, b) => a.price - b.price)[0] || null;
    const betterRated = sameCategory.filter((p) => p.rating > targetProduct.rating).sort((a, b) => b.rating - a.rating)[0] || null;
    const premium = sameCategory.filter((p) => p.price > targetProduct.price).sort((a, b) => b.price - a.price)[0] || null;

    return {
      similar: sameCategory.slice(0, 4),
      alternatives: {
        cheaper,
        betterRated,
        premium
      }
    };
  },

  /**
   * Customer Preferences Management
   */
  async getUserPreferences(userId) {
    let prefs = await UserPreference.findOne({ user: userId });
    if (!prefs) {
      prefs = await UserPreference.create({ user: userId, personalizationEnabled: true });
    }
    return prefs;
  },

  async updateUserPreferences(userId, updateData) {
    const prefs = await UserPreference.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
    return prefs;
  },

  async resetUserPreferences(userId) {
    const prefs = await UserPreference.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          preferredCategories: [],
          preferredBrands: [],
          pricePreference: {},
          viewedProducts: []
        }
      },
      { new: true }
    );
    return prefs;
  },

  async togglePersonalization(userId, enabled) {
    const prefs = await UserPreference.findOneAndUpdate(
      { user: userId },
      { $set: { personalizationEnabled: Boolean(enabled) } },
      { new: true, upsert: true }
    );
    return prefs;
  }
};

export default personalizationService;
