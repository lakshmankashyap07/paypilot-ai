import UserPreference from '../../models/UserPreference.js';
import Wishlist from '../../models/Wishlist.js';
import Cart from '../../models/Cart.js';
import Order from '../../models/Order.js';

export const userInterestService = {
  /**
   * Aggregate Interest Vector for User
   */
  async getUserInterestVector(userId) {
    const prefs = await UserPreference.findOne({ user: userId }).lean();
    if (prefs && prefs.personalizationEnabled === false) {
      return { personalizationEnabled: false, preferredCategories: [], preferredBrands: [], viewedProductIds: [] };
    }

    const wishlist = await Wishlist.findOne({ user: userId }).lean();
    const cart = await Cart.findOne({ user: userId }).lean();
    const orders = await Order.find({ user: userId, paymentStatus: 'CAPTURED' }).lean();

    const wishlistProductIds = wishlist?.products?.map((p) => p.product?.toString()) || [];
    const cartProductIds = cart?.items?.map((i) => i.product?.toString()) || [];
    const purchasedProductIds = [];
    orders.forEach((o) => {
      o.items?.forEach((i) => purchasedProductIds.push(i.product?.toString()));
    });

    const viewedProductIds = prefs?.viewedProducts?.map((v) => v.product?.toString()) || [];

    const categories = prefs?.preferredCategories?.map((c) => c.category) || [];
    const brands = prefs?.preferredBrands?.map((b) => b.brand) || [];

    return {
      personalizationEnabled: true,
      preferredCategories: categories,
      preferredBrands: brands,
      viewedProductIds,
      wishlistProductIds,
      cartProductIds,
      purchasedProductIds
    };
  }
};

export default userInterestService;
