import UserPreference from '../../models/UserPreference.js';
import Product from '../../models/Product.js';
import ProductView from '../../models/ProductView.js';

export const preferenceService = {
  /**
   * Get User Shopping Preferences
   */
  async getUserPreferences(userId) {
    if (!userId) return null;

    let pref = await UserPreference.findOne({ user: userId }).lean();
    if (!pref) {
      pref = {
        preferredCategories: [],
        preferredBrands: [],
        recentlyViewedProducts: [],
        recentlyPurchasedProducts: []
      };
    }
    return pref;
  },

  /**
   * Record Product Interest / View Activity
   */
  async recordProductInterest(userId, productId) {
    if (!userId || !productId) return;

    try {
      const product = await Product.findById(productId).select('category brand').lean();
      if (!product) return;

      let pref = await UserPreference.findOne({ user: userId });
      if (!pref) {
        pref = new UserPreference({ user: userId });
      }

      pref.preferredCategories = pref.preferredCategories || [];
      pref.preferredBrands = pref.preferredBrands || [];
      pref.viewedProducts = pref.viewedProducts || [];

      // Update category preference count
      const catIdx = pref.preferredCategories.findIndex((c) => c.category === product.category);
      if (catIdx > -1) {
        pref.preferredCategories[catIdx].score = (pref.preferredCategories[catIdx].score || 1) + 1;
      } else {
        pref.preferredCategories.push({ category: product.category, score: 1 });
      }

      // Update brand preference count
      if (product.brand) {
        const brandIdx = pref.preferredBrands.findIndex((b) => b.brand === product.brand);
        if (brandIdx > -1) {
          pref.preferredBrands[brandIdx].score = (pref.preferredBrands[brandIdx].score || 1) + 1;
        } else {
          pref.preferredBrands.push({ brand: product.brand, score: 1 });
        }
      }

      // Update viewed products (max 10)
      const existingViewed = pref.viewedProducts || [];
      pref.viewedProducts = [
        { product: productId, viewedAt: new Date() },
        ...existingViewed.filter((v) => v.product?.toString() !== productId.toString())
      ].slice(0, 10);

      await pref.save();

      // Log to ProductView model as well
      await ProductView.create({ user: userId, product: productId });
    } catch (e) {
      console.warn('Failed to record product interest:', e.message);
    }
  },

  /**
   * Record Purchase Interest
   */
  async recordPurchaseInterest(userId, productId) {
    if (!userId || !productId) return;

    try {
      let pref = await UserPreference.findOne({ user: userId });
      if (!pref) {
        pref = new UserPreference({ user: userId });
      }

      pref.viewedProducts = pref.viewedProducts || [];

      pref.viewedProducts = [
        { product: productId, viewedAt: new Date() },
        ...pref.viewedProducts.filter((v) => v.product?.toString() !== productId.toString())
      ].slice(0, 10);

      await pref.save();
    } catch (e) {
      console.warn('Failed to record purchase interest:', e.message);
    }
  },

  /**
   * Get Personalized Recommended Products for Home Page & Chat
   */
  async getPersonalizedProducts(userId, limit = 6) {
    if (!userId) {
      return await Product.find({ active: true }).sort({ rating: -1 }).limit(limit).lean();
    }

    const pref = await this.getUserPreferences(userId);
    const topCategories = (pref.preferredCategories || [])
      .sort((a, b) => (b.score || 1) - (a.score || 1))
      .map((c) => c.category);

    const query = { active: true };
    if (topCategories.length > 0) {
      query.category = { $in: topCategories };
    }

    let products = await Product.find(query).sort({ rating: -1 }).limit(limit).lean();

    if (products.length < limit) {
      const additional = await Product.find({ active: true, _id: { $nin: products.map((p) => p._id) } })
        .sort({ rating: -1 })
        .limit(limit - products.length)
        .lean();
      products = [...products, ...additional];
    }

    return products;
  },

  /**
   * Reset / Clear User Preferences
   */
  async clearUserPreferences(userId) {
    if (!userId) return;
    await UserPreference.deleteMany({ user: userId });
  }
};

export default preferenceService;
