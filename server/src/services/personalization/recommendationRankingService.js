export const recommendationRankingService = {
  /**
   * Transparent Scoring Matrix for Products
   */
  rankProducts(products, interestVector) {
    if (!interestVector.personalizationEnabled) {
      return products.map((p) => ({
        ...p,
        score: p.rating * 10,
        explanation: 'Popular catalog item based on overall rating'
      })).sort((a, b) => b.score - a.score);
    }

    return products.map((p) => {
      let score = 0;
      const reasons = [];

      // Category Match (+30)
      if (interestVector.preferredCategories?.includes(p.category)) {
        score += 30;
        reasons.push(`Matches your interest in ${p.category}`);
      }

      // Brand Fit (+20)
      if (interestVector.preferredBrands?.includes(p.brand)) {
        score += 20;
        reasons.push(`From your preferred brand ${p.brand}`);
      }

      // Wishlist Relevance (+25)
      if (interestVector.wishlistProductIds?.includes(p._id?.toString())) {
        score += 25;
        reasons.push('In your wishlist');
      }

      // Rating Score (+15)
      if (p.rating >= 4.5) {
        score += 15;
        reasons.push(`Highly rated at ${p.rating}★`);
      } else if (p.rating >= 4.0) {
        score += 10;
      }

      // In Stock Availability (+10)
      if (p.stock > 0) {
        score += 10;
        reasons.push('In stock and ready to ship');
      }

      return {
        ...p,
        score,
        explanation: reasons.length > 0 ? reasons.join(' • ') : 'Recommended product based on store popularity'
      };
    }).sort((a, b) => b.score - a.score);
  }
};

export default recommendationRankingService;
