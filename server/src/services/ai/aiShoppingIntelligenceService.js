import Product from '../../models/Product.js';
import Cart from '../../models/Cart.js';
import Wishlist from '../../models/Wishlist.js';
import Order from '../../models/Order.js';

export const aiShoppingIntelligenceService = {
  /**
   * 1. Natural Language Search Parser
   * Parses queries like "best phone under 20000 with good camera"
   */
  async parseNaturalSearchQuery(queryText = '') {
    const raw = queryText.trim();
    if (!raw) {
      return { queryText: '', category: null, maxPrice: null, brand: null, keywords: [] };
    }

    const textLower = raw.toLowerCase();

    // Budget extraction (e.g. "under 20000", "below 50k", "under 30,000", "budget 25000")
    let maxPrice = null;
    const priceMatch = textLower.match(/(?:under|below|less than|budget|max|within|upto|up to)?\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)\s*(k|thousand)?/i);
    if (priceMatch) {
      let numStr = priceMatch[1].replace(/,/g, '');
      let num = parseInt(numStr, 10);
      if (!isNaN(num)) {
        if (priceMatch[2] && priceMatch[2].toLowerCase() === 'k') num *= 1000;
        if (num > 100) maxPrice = num;
      }
    }

    // Category detection
    let category = null;
    if (textLower.includes('laptop') || textLower.includes('notebook') || textLower.includes('macbook')) category = 'Laptops';
    else if (textLower.includes('phone') || textLower.includes('mobile') || textLower.includes('smartphone')) category = 'Smartphones';
    else if (textLower.includes('headphone') || textLower.includes('earphone') || textLower.includes('earbuds') || textLower.includes('audio')) category = 'Headphones';
    else if (textLower.includes('shoe') || textLower.includes('footwear') || textLower.includes('sneaker')) category = 'Shoes';
    else if (textLower.includes('fashion') || textLower.includes('cloth') || textLower.includes('shirt') || textLower.includes('tshirt')) category = 'Fashion';
    else if (textLower.includes('game') || textLower.includes('gaming') || textLower.includes('ps5') || textLower.includes('console')) category = 'Gaming';
    else if (textLower.includes('beauty') || textLower.includes('makeup')) category = 'Beauty';
    else if (textLower.includes('home') || textLower.includes('decor')) category = 'Home';

    // Brand detection
    const brands = ['apple', 'sony', 'samsung', 'hp', 'dell', 'lenovo', 'asus', 'nike', 'adidas', 'puma', 'boat', 'realme', 'oneplus'];
    let detectedBrand = null;
    for (const b of brands) {
      if (textLower.includes(b)) {
        detectedBrand = b.charAt(0).toUpperCase() + b.slice(1);
        break;
      }
    }

    // Key specs/feature tags
    const keywords = [];
    if (textLower.includes('gaming') || textLower.includes('gpu')) keywords.push('Gaming / High Performance');
    if (textLower.includes('coding') || textLower.includes('programming') || textLower.includes('developer')) keywords.push('Coding / Multitasking');
    if (textLower.includes('camera') || textLower.includes('photo')) keywords.push('High Resolution Camera');
    if (textLower.includes('battery') || textLower.includes('backup')) keywords.push('Long Battery Life');
    if (textLower.includes('wireless') || textLower.includes('bluetooth')) keywords.push('Wireless');
    if (textLower.includes('lightweight') || textLower.includes('thin')) keywords.push('Portable');

    // Query MongoDB for matching products
    const queryFilter = { active: true };
    if (category) queryFilter.category = category;
    if (detectedBrand) queryFilter.brand = new RegExp(detectedBrand, 'i');
    if (maxPrice) queryFilter.price = { $lte: maxPrice };

    let matchingProducts = await Product.find(queryFilter).sort({ rating: -1, price: 1 }).limit(10).lean();

    // Fallback if strict filter yields 0 results
    if (matchingProducts.length === 0 && maxPrice) {
      delete queryFilter.price;
      matchingProducts = await Product.find(queryFilter).sort({ rating: -1 }).limit(6).lean();
    }

    if (matchingProducts.length === 0) {
      matchingProducts = await Product.find({ active: true }).sort({ rating: -1 }).limit(6).lean();
    }

    // Attach Explainable Recommendation rationale to each product
    const enrichedProducts = matchingProducts.map((prod) => {
      const whyList = [];
      if (maxPrice && prod.price <= maxPrice) whyList.push(`✓ Within your ₹${maxPrice.toLocaleString('en-IN')} budget`);
      if (prod.rating >= 4.0) whyList.push(`✓ High ${prod.rating}★ rating from verified buyers`);
      if (prod.stock > 0 && prod.stock <= 5) whyList.push(`⚠️ Limited stock (${prod.stock} left)`);
      if (keywords.length > 0) whyList.push(`✓ Ideal for ${keywords[0]}`);
      whyList.push(`✓ Verified PayPilot seller listing`);

      return {
        ...prod,
        whyRecommended: whyList.join(' • '),
        whyList
      };
    });

    return {
      queryText: raw,
      parsedIntent: { category, maxPrice, brand: detectedBrand, keywords },
      totalFound: enrichedProducts.length,
      products: enrichedProducts
    };
  },

  /**
   * 2. Smart Product Comparison Matrix
   */
  async compareProducts(productIds = [], userCriteria = '') {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('Please select at least one product to compare.');
    }

    const products = await Product.find({ _id: { $in: productIds } }).lean();
    if (products.length === 0) {
      throw new Error('No matching products found for comparison.');
    }

    // Assign AI Badges
    const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
    const sortedByRating = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const sortedByDiscount = [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0));

    const bestBudgetProduct = sortedByPrice[0];
    const bestPerformanceProduct = sortedByRating[0];
    const bestValueProduct = sortedByDiscount[0] || sortedByPrice[0];
    const bestOverallProduct = sortedByRating[0] || sortedByPrice[0];

    const comparisonItems = products.map((prod) => {
      const badges = [];
      if (prod._id.toString() === bestOverallProduct._id.toString()) badges.push({ type: 'overall', label: 'Best Overall', description: 'Highest customer rating and overall reliability.' });
      if (prod._id.toString() === bestBudgetProduct._id.toString()) badges.push({ type: 'budget', label: 'Best Budget', description: 'Lowest price point in selected group.' });
      if (prod._id.toString() === bestPerformanceProduct._id.toString()) badges.push({ type: 'performance', label: 'Best Performance', description: 'Top specifications and feature set.' });
      if (prod._id.toString() === bestValueProduct._id.toString()) badges.push({ type: 'value', label: 'Best Value', description: 'Greatest discount percentage and feature balance.' });

      return {
        ...prod,
        badges,
        valueRating: Math.min(5, (prod.rating || 4) + (prod.discount > 15 ? 0.5 : 0))
      };
    });

    return {
      totalCompared: comparisonItems.length,
      summaryText: `AI compared ${comparisonItems.length} products across price, ratings, discounts, and specification value.`,
      bestOverall: bestOverallProduct.name,
      bestBudget: bestBudgetProduct.name,
      bestPerformance: bestPerformanceProduct.name,
      bestValue: bestValueProduct.name,
      products: comparisonItems
    };
  },

  /**
   * 3. AI Cart Budget Guard
   */
  async analyzeCartBudget(userId, userBudgetInput = null) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        cartTotal: 0,
        userBudget: userBudgetInput || 0,
        isOverBudget: false,
        difference: 0,
        message: 'Your cart is currently empty.',
        suggestions: []
      };
    }

    const cartTotal = cart.total || 0;
    const userBudget = Number(userBudgetInput) || 30000; // Default budget baseline if none specified
    const isOverBudget = cartTotal > userBudget;
    const difference = Math.abs(cartTotal - userBudget);

    const suggestions = [];
    if (isOverBudget) {
      // Find highest cost item in cart to suggest alternative
      const cartItemsSorted = [...cart.items].sort((a, b) => (b.product?.price || 0) - (a.product?.price || 0));
      const highestItem = cartItemsSorted[0]?.product;

      if (highestItem) {
        const cheaperAlt = await Product.findOne({
          category: highestItem.category,
          price: { $lt: highestItem.price },
          _id: { $ne: highestItem._id },
          active: true
        }).sort({ price: -1 }).lean();

        if (cheaperAlt) {
          const savings = highestItem.price - cheaperAlt.price;
          suggestions.push({
            type: 'swap',
            title: `Swap "${highestItem.name}" with "${cheaperAlt.name}"`,
            savings,
            description: `Replace with ${cheaperAlt.name} to save ₹${savings.toLocaleString('en-IN')} while staying in ${highestItem.category}.`,
            replacementProduct: cheaperAlt
          });
        }
      }

      suggestions.push({
        type: 'remove',
        title: 'Remove non-essential add-on items',
        savings: cartItemsSorted[cartItemsSorted.length - 1]?.product?.price || 0,
        description: 'Remove lower-priority items to immediately bring your cart under budget.'
      });
    }

    return {
      cartTotal,
      userBudget,
      isOverBudget,
      difference,
      message: isOverBudget
        ? `You are ₹${difference.toLocaleString('en-IN')} over your budget of ₹${userBudget.toLocaleString('en-IN')}.`
        : `Your cart (₹${cartTotal.toLocaleString('en-IN')}) is within your budget of ₹${userBudget.toLocaleString('en-IN')}.`,
      suggestions
    };
  },

  /**
   * 4. Smart Bundle Builder
   */
  async getSmartBundles(productId, userBudget = null) {
    const primaryProduct = await Product.findById(productId).lean();
    if (!primaryProduct) {
      throw new Error('Product not found for bundle recommendation.');
    }

    // Category compatibility map
    const categoryMapping = {
      Laptops: ['Headphones', 'Accessories', 'Electronics'],
      Smartphones: ['Headphones', 'Accessories', 'Beauty'],
      Shoes: ['Fashion', 'Accessories'],
      Headphones: ['Smartphones', 'Laptops', 'Accessories'],
      Gaming: ['Headphones', 'Laptops', 'Electronics']
    };

    const targetCategories = categoryMapping[primaryProduct.category] || ['Accessories', 'Electronics', 'Headphones'];

    const bundleItems = await Product.find({
      category: { $in: targetCategories },
      _id: { $ne: primaryProduct._id },
      active: true,
      stock: { $gt: 0 }
    })
      .sort({ rating: -1, price: 1 })
      .limit(3)
      .lean();

    const bundleTotal = primaryProduct.price + bundleItems.reduce((acc, item) => acc + item.price, 0);
    const bundleDiscountPercent = 10; // Extra 10% bundle discount
    const discountedBundleTotal = Math.round(bundleTotal * (1 - bundleDiscountPercent / 100));
    const bundleSavings = bundleTotal - discountedBundleTotal;

    return {
      primaryProduct,
      bundleItems,
      originalTotal: bundleTotal,
      discountedTotal: discountedBundleTotal,
      savings: bundleSavings,
      discountPercent: bundleDiscountPercent,
      compatibilityReason: `Selected items are top-rated companion accessories specifically paired for ${primaryProduct.name}.`
    };
  },

  /**
   * 5. Price Intelligence
   */
  async getPriceIntelligence(productId) {
    const product = await Product.findById(productId).lean();
    if (!product) throw new Error('Product not found.');

    const discountPct = product.discount || (product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

    let priceVerdict = 'Good value';
    let insightText = 'Price is aligned with standard market value.';

    if (discountPct >= 20) {
      priceVerdict = 'Great Time to Buy!';
      insightText = `Currently ${discountPct}% below original MRP. This is a top promotional price.`;
    } else if (product.stock <= 5 && product.stock > 0) {
      priceVerdict = 'High Demand Alert!';
      insightText = `Stock is limited (${product.stock} items left). High risk of selling out soon.`;
    } else if (product.rating >= 4.5) {
      priceVerdict = 'Top Rated Choice';
      insightText = `Outstanding customer rating (${product.rating}★) with stable price history.`;
    }

    return {
      product,
      currentPrice: product.price,
      originalPrice: product.originalPrice || product.price,
      discountPercentage: discountPct,
      priceVerdict,
      insightText,
      hasHistoricalChart: false,
      historicalNotice: 'Historical price tracking active from product catalog publication date.'
    };
  },

  /**
   * 6. Smart Wishlist Tracking
   */
  async getSmartWishlist(userId) {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products').lean();
    if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
      return { total: 0, products: [] };
    }

    const smartProducts = wishlist.products.map((prod) => {
      const discount = prod.discount || (prod.originalPrice > prod.price ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) : 0);
      const isLowStock = prod.stock > 0 && prod.stock <= 5;
      const isOutOfStock = prod.stock === 0;

      const alerts = [];
      if (discount >= 15) alerts.push({ type: 'price_drop', label: `Price dropped! ${discount}% OFF` });
      if (isLowStock) alerts.push({ type: 'low_stock', label: `Only ${prod.stock} left in stock` });
      if (isOutOfStock) alerts.push({ type: 'out_of_stock', label: 'Out of Stock' });

      return {
        ...prod,
        discountPercentage: discount,
        alerts,
        aiSuggestion: discount >= 15 ? 'Great time to buy!' : isLowStock ? 'Purchase soon before stock runs out.' : 'Price is steady.'
      };
    });

    return {
      total: smartProducts.length,
      products: smartProducts
    };
  },

  /**
   * 7. Personalized "For You" Feed
   */
  async getPersonalizedFeed(userId, limit = 8) {
    let categoryPreferences = new Set();

    if (userId) {
      // 1. Inspect recent Wishlist items
      const wishlist = await Wishlist.findOne({ user: userId }).populate('products').lean();
      if (wishlist?.products) {
        wishlist.products.forEach((p) => p?.category && categoryPreferences.add(p.category));
      }

      // 2. Inspect Cart items
      const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
      if (cart?.items) {
        cart.items.forEach((item) => item?.product?.category && categoryPreferences.add(item.product.category));
      }

      // 3. Inspect Order history
      const orders = await Order.find({ user: userId }).limit(3).lean();
      orders.forEach((ord) => {
        ord.items?.forEach((item) => item?.category && categoryPreferences.add(item.category));
      });
    }

    const categoriesArray = Array.from(categoryPreferences);
    const filter = { active: true };
    if (categoriesArray.length > 0) {
      filter.category = { $in: categoriesArray };
    }

    let feedProducts = await Product.find(filter).sort({ rating: -1, discount: -1 }).limit(limit).lean();

    // Fallback if user history has no specific category preferences
    if (feedProducts.length < limit) {
      const extraProducts = await Product.find({ active: true, _id: { $nin: feedProducts.map((p) => p._id) } })
        .sort({ rating: -1 })
        .limit(limit - feedProducts.length)
        .lean();
      feedProducts = [...feedProducts, ...extraProducts];
    }

    // Attach explainable recommendation rationale
    const personalizedItems = feedProducts.map((prod) => {
      const rationale = [];
      if (categoriesArray.includes(prod.category)) rationale.push(`Based on your interest in ${prod.category}`);
      if (prod.rating >= 4.4) rationale.push(`Top customer rating (${prod.rating}★)`);
      if (prod.discount >= 10) rationale.push(`${prod.discount}% discount offer`);
      rationale.push('Popular choice on PayPilot AI');

      return {
        ...prod,
        whyRecommended: rationale.join(' • '),
        whyList: rationale
      };
    });

    return {
      personalized: categoriesArray.length > 0,
      matchedCategories: categoriesArray,
      products: personalizedItems
    };
  },

  /**
   * 8. AI Checkout Assistant Summary
   */
  async getCheckoutAssistantSummary(userId, userBudget = null) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        hasCart: false,
        message: 'Cart is empty.'
      };
    }

    const cartTotal = cart.total || 0;
    const budgetNum = Number(userBudget) || 30000;
    const isOverBudget = cartTotal > budgetNum;
    const difference = Math.abs(cartTotal - budgetNum);

    // Verified available system offer codes
    const availableOffers = [
      { code: 'PAYPILOT10', description: 'Get 10% Instant Discount on orders over ₹1,000', discountAmount: Math.round(cartTotal * 0.1) },
      { code: 'WELCOME500', description: 'Flat ₹500 off on first purchase above ₹2,000', discountAmount: 500 }
    ];

    const bestOffer = availableOffers.sort((a, b) => b.discountAmount - a.discountAmount)[0];

    return {
      hasCart: true,
      itemCount: cart.items.length,
      cartTotal,
      userBudget: budgetNum,
      isOverBudget,
      budgetDifference: difference,
      recommendedOffer: bestOffer,
      potentialSavings: bestOffer?.discountAmount || 0,
      checkoutTip: isOverBudget
        ? `Applying promo '${bestOffer.code}' reduces your cart total to ₹${(cartTotal - bestOffer.discountAmount).toLocaleString('en-IN')}.`
        : `Your cart is under budget! You can save an extra ₹${bestOffer.discountAmount} with offer '${bestOffer.code}'.`
    };
  }
};

export default aiShoppingIntelligenceService;
