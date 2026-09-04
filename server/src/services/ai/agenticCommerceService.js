import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import Cart from '../../models/Cart.js';
import User from '../../models/User.js';
import preferenceService from '../recommendation/preferenceService.js';

export const agenticCommerceService = {
  /**
   * 1. AI Deal Optimizer
   */
  async optimizeCartDeals(userId) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        cartTotal: 0,
        bestOffer: null,
        discountAmount: 0,
        finalTotal: 0,
        rationale: 'Cart is empty. No deals applicable.'
      };
    }

    const cartTotal = cart.total || 0;

    // Available system deals / coupons
    const systemOffers = [
      {
        code: 'PAYPILOT10',
        title: '10% Instant Marketplace Offer',
        type: 'PERCENTAGE',
        value: 10,
        minOrder: 1000,
        maxDiscount: 2000,
        rationale: 'Applied 10% instant discount for order exceeding ₹1,000 threshold.'
      },
      {
        code: 'WELCOME500',
        title: 'Flat ₹500 First Order Offer',
        type: 'FLAT',
        value: 500,
        minOrder: 2000,
        maxDiscount: 500,
        rationale: 'Applied Flat ₹500 instant welcome savings on order over ₹2,000.'
      },
      {
        code: 'FESTIVE15',
        title: '15% Mega Shopping Offer',
        type: 'PERCENTAGE',
        value: 15,
        minOrder: 5000,
        maxDiscount: 3500,
        rationale: 'Applied 15% promotional discount on order exceeding ₹5,000 threshold.'
      }
    ];

    // Find best offer yielding maximum savings
    let maxSavings = 0;
    let selectedOffer = null;

    for (const offer of systemOffers) {
      if (cartTotal >= offer.minOrder) {
        let savings = 0;
        if (offer.type === 'PERCENTAGE') {
          savings = Math.min(offer.maxDiscount, Math.round((cartTotal * offer.value) / 100));
        } else {
          savings = Math.min(offer.maxDiscount, offer.value);
        }

        if (savings > maxSavings) {
          maxSavings = savings;
          selectedOffer = offer;
        }
      }
    }

    const finalTotal = Math.max(0, cartTotal - maxSavings);

    return {
      cartTotal,
      bestOffer: selectedOffer ? { code: selectedOffer.code, title: selectedOffer.title } : null,
      discountAmount: maxSavings,
      finalTotal,
      rationale: selectedOffer
        ? selectedOffer.rationale
        : 'Add items above ₹1,000 to unlock instant marketplace coupons.'
    };
  },

  /**
   * 2. Post-Purchase AI Order Assistant
   */
  async handlePostPurchaseQuery(userId, orderId = null, queryText = '') {
    const textLower = queryText.toLowerCase().trim();

    // Query live Order from database
    let order;
    if (orderId) {
      order = await Order.findOne({ _id: orderId, user: userId }).lean();
    } else {
      order = await Order.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
    }

    if (!order) {
      return {
        hasOrder: false,
        answerText: 'I could not find any active orders in your account history. Feel free to browse our shop!'
      };
    }

    const orderNum = order.orderNumber;
    const orderStatus = order.orderStatus || 'PROCESSING';
    const payStatus = order.paymentStatus || 'PENDING';
    const totalAmount = order.total || 0;
    const itemCount = order.items?.length || 0;
    const createdDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Estimate delivery date (3 business days from order creation)
    const deliveryEta = new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    let answerText = '';

    if (textLower.includes('where') || textLower.includes('track') || textLower.includes('status')) {
      answerText = `Order **#${orderNum}** is currently **${orderStatus}** (Payment: ${payStatus}). It was placed on ${createdDate} and is estimated to arrive by **${deliveryEta}**.`;
    } else if (textLower.includes('cancel')) {
      if (['PENDING', 'PROCESSING'].includes(orderStatus)) {
        answerText = `Order **#${orderNum}** is currently in **${orderStatus}** state and can be cancelled. You can click 'Request Order Cancellation' on your Order Details page.`;
      } else {
        answerText = `Order **#${orderNum}** has reached **${orderStatus}** status and can no longer be directly cancelled. You can initiate a return once delivered!`;
      }
    } else if (textLower.includes('spent') || textLower.includes('cost') || textLower.includes('how much')) {
      answerText = `You spent a total of **₹${totalAmount.toLocaleString('en-IN')}** on Order **#${orderNum}** (${itemCount} items).`;
    } else if (textLower.includes('bought') || textLower.includes('what did i buy')) {
      const itemList = order.items?.map((i) => `• ${i.productName} (x${i.quantity}) - ₹${i.subtotal?.toLocaleString('en-IN')}`).join('\n');
      answerText = `In Order **#${orderNum}**, you purchased:\n${itemList || 'Items list available in order details.'}`;
    } else {
      answerText = `Order **#${orderNum}** (Total: ₹${totalAmount.toLocaleString('en-IN')}) is **${orderStatus}**. Expected delivery: **${deliveryEta}**.`;
    }

    return {
      hasOrder: true,
      orderNumber: orderNum,
      orderStatus,
      paymentStatus: payStatus,
      deliveryEta,
      answerText
    };
  },

  /**
   * 3. AI Return & Replacement Assistant
   */
  async processReturnRequest(userId, { orderId, productId, issueCategory, reasonDetails }) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error('Order not found.');

    const targetItem = order.items?.find(
      (i) => (i.product?._id || i.product || '').toString() === productId || i.productName === productId
    ) || order.items?.[0];
    if (!targetItem) throw new Error('Item not found in specified order.');

    const normStatus = (order.orderStatus || '').toUpperCase();

    // 1. Must be DELIVERED
    if (normStatus !== 'DELIVERED') {
      throw new Error('Return / Replacement is only available after order delivery.');
    }

    // 2. Check if already returned/replaced/requested
    if (normStatus === 'RETURNED' || normStatus === 'REPLACED' || normStatus === 'RETURN_REQUESTED') {
      throw new Error('A return or replacement request has already been processed for this order.');
    }

    // 3. Check 7-day return window from delivery/update date
    const deliveryRefDate = order.deliveredAt || order.updatedAt || order.createdAt;
    const orderDays = (Date.now() - new Date(deliveryRefDate).getTime()) / (1000 * 60 * 60 * 24);
    if (orderDays > 7) {
      throw new Error('Return window expired. Returns must be requested within 7 days of delivery.');
    }

    // Update order status in DB
    order.orderStatus = 'RETURN_REQUESTED';
    await order.save();

    return {
      success: true,
      orderNumber: order.orderNumber,
      productName: targetItem.productName,
      issueCategory,
      isEligible: true,
      resolution: 'RETURN_APPROVED',
      message: 'Your return request has been authorized under the 7-day PayPilot buyer policy.',
      ticketId: `RET-${Date.now().toString().slice(-6)}`
    };
  },

  /**
   * 4. Merchant AI Copilot & Sales Insights
   */
  async getMerchantCopilotInsights(merchantId) {
    const products = await Product.find({ merchant: merchantId }).lean();
    const productIds = products.map((p) => p._id);

    const orders = await Order.find({
      $or: [
        { 'items.merchant': merchantId },
        { 'items.product': { $in: productIds } },
        { merchant: merchantId }
      ]
    }).lean();

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.active !== false).length;
    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    // Calculate revenue, units sold, and best sellers
    let totalRevenue = 0;
    let unitsSold = 0;
    const productSalesMap = {};
    const categorySalesMap = {};

    orders.forEach((ord) => {
      const isPaid = ord.paymentStatus === 'CAPTURED' || ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'PROCESSING';
      if (isPaid) {
        totalRevenue += ord.total || 0;
        (ord.items || []).forEach((item) => {
          const qty = item.quantity || 1;
          unitsSold += qty;
          const pId = (item.product?._id || item.product || '').toString();
          if (pId) {
            productSalesMap[pId] = (productSalesMap[pId] || 0) + qty;
          }
          const cat = item.product?.category || 'General';
          categorySalesMap[cat] = (categorySalesMap[cat] || 0) + ((item.price || 0) * qty);
        });
      }
    });

    const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    // Determine top selling product
    let topProdId = null;
    let maxQty = 0;
    for (const [pId, qty] of Object.entries(productSalesMap)) {
      if (qty > maxQty) {
        maxQty = qty;
        topProdId = pId;
      }
    }
    const topSellingProduct = products.find((p) => p._id.toString() === topProdId);

    // Sales explanation
    let salesExplanation = 'Revenue calculation is based on live captured orders.';
    if (orders.length > 0) {
      if (topSellingProduct) {
        salesExplanation = `"${topSellingProduct.name}" is your strongest performing item, accounting for ${maxQty} unit sales.`;
      } else {
        salesExplanation = `Your store generated ₹${totalRevenue.toLocaleString('en-IN')} across ${orders.length} total customer orders.`;
      }
    } else {
      salesExplanation = 'Revenue generated, but there is not enough historical order data for deep trend analysis.';
    }

    // Inventory Intelligence
    const fastMoving = products.filter((p) => (productSalesMap[p._id.toString()] || 0) >= 3);
    const slowMoving = products.filter((p) => p.stock > 10 && (productSalesMap[p._id.toString()] || 0) === 0);

    // AI Listing Quality Checks (0-100)
    const listingCheck = products.map((p) => {
      let score = 100;
      const issues = [];
      if (!p.name || p.name.length < 10) { score -= 15; issues.push('Title is too short'); }
      if (!p.description || p.description.length < 30) { score -= 20; issues.push('Description needs more detail'); }
      if (!p.images || p.images.length === 0) { score -= 25; issues.push('Missing product image'); }
      if (!p.specifications || Object.keys(p.specifications).length === 0) { score -= 15; issues.push('Missing technical specifications'); }
      return { productId: p._id, name: p.name, score: Math.max(20, score), issues };
    });

    const avgListingScore = listingCheck.length > 0
      ? Math.round(listingCheck.reduce((acc, curr) => acc + curr.score, 0) / listingCheck.length)
      : 85;

    // AI Recommended Actions
    const priorityActions = [];
    if (outOfStockProducts.length > 0) {
      priorityActions.push({
        id: 'action_out_stock',
        type: 'restock',
        title: `🚨 Restock ${outOfStockProducts.length} Out-of-Stock Products`,
        description: `"${outOfStockProducts[0].name}" has 0 inventory. Restock now to prevent lost revenue.`,
        actionText: 'Restock Product'
      });
    }

    if (lowStockProducts.length > 0) {
      priorityActions.push({
        id: 'action_low_stock',
        type: 'restock',
        title: `⚠️ Restock ${lowStockProducts.length} Low-Stock Products`,
        description: `"${lowStockProducts[0].name}" has ${lowStockProducts[0].stock} items remaining.`,
        actionText: 'Restock Inventory'
      });
    }

    const lowQualityListing = listingCheck.find((l) => l.score < 70);
    if (lowQualityListing) {
      priorityActions.push({
        id: 'action_listing',
        type: 'listing',
        title: `📝 Improve Listing Quality for "${lowQualityListing.name}"`,
        description: lowQualityListing.issues.join(', ') || 'Add descriptions and high quality images.',
        actionText: 'Edit Listing'
      });
    }

    if (priorityActions.length === 0) {
      priorityActions.push({
        id: 'action_promote',
        type: 'promote',
        title: '📦 Promote Featured Listings',
        description: 'Store operations are healthy! Create a promotional offer to drive higher volume.',
        actionText: 'Create Campaign'
      });
    }

    const insights = [];
    if (lowStockProducts.length > 0) {
      insights.push({
        type: 'inventory_risk',
        severity: 'HIGH',
        title: `Low Stock Alert (${lowStockProducts.length} items)`,
        description: `Products like "${lowStockProducts[0].name}" have 5 or fewer items left in stock.`
      });
    }

    return {
      merchantId,
      totalProducts,
      activeProducts,
      totalOrders: orders.length,
      totalRevenue,
      unitsSold,
      averageOrderValue,
      topSellingProduct: topSellingProduct ? { name: topSellingProduct.name, price: topSellingProduct.price, unitsSold: maxQty } : null,
      salesExplanation,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      fastMovingCount: fastMoving.length,
      slowMovingCount: slowMoving.length,
      listingQualityScore: avgListingScore,
      demandSignal: orders.length >= 3 ? 'Sales velocity appears healthy based on recent customer orders.' : 'Not enough historical order data for a reliable demand signal.',
      priorityActions,
      insights
    };
  },

  /**
   * 4b. Merchant Copilot Natural Language Q&A Handler
   */
  async handleMerchantCopilotQA(merchantId, questionText = '') {
    const textLower = questionText.toLowerCase().trim();
    const insights = await this.getMerchantCopilotInsights(merchantId);

    if (textLower.includes('sold the most') || textLower.includes('best selling') || textLower.includes('top product')) {
      if (insights.topSellingProduct) {
        return `Your best-selling product is **"${insights.topSellingProduct.name}"** with ${insights.topSellingProduct.unitsSold} units sold at ₹${insights.topSellingProduct.price?.toLocaleString('en-IN')}.`;
      }
      return 'You currently do not have enough captured order data to determine a single top-selling product.';
    }

    if (textLower.includes('restock') || textLower.includes('low stock') || textLower.includes('inventory')) {
      if (insights.lowStockCount > 0 || insights.outOfStockCount > 0) {
        return `You have **${insights.outOfStockCount} out-of-stock** and **${insights.lowStockCount} low-stock** items that require inventory restocking.`;
      }
      return 'All your active product inventory levels are currently in optimal state (no low-stock alerts).';
    }

    if (textLower.includes('revenue') || textLower.includes('sales') || textLower.includes('earnings') || textLower.includes('generate')) {
      return `Your store has generated **₹${insights.totalRevenue.toLocaleString('en-IN')}** across **${insights.totalOrders} total customer orders** (Average Order Value: ₹${insights.averageOrderValue.toLocaleString('en-IN')}).`;
    }

    if (textLower.includes('listing') || textLower.includes('quality') || textLower.includes('improve')) {
      return `Your overall store Listing Quality Score is **${insights.listingQualityScore}/100**. Ensure all listings contain long descriptions, clear images, and complete technical specifications.`;
    }

    return `PayPilot Merchant Copilot Summary: Your store has ${insights.totalProducts} total listings, ₹${insights.totalRevenue.toLocaleString('en-IN')} total revenue, and ${insights.totalOrders} total orders. Ask me about top products, inventory restocking, or revenue breakdowns!`;
  },

  /**
   * 5. AI Product Listing Generator
   */
  async generateProductListingAI({ name, brand, category, subcategory = '', specifications = {} }) {
    if (!name || !brand || !category) {
      throw new Error('Name, brand, and category are required to generate product listing.');
    }

    const cleanName = name.trim();
    const cleanBrand = brand.trim();
    const cleanCat = category.trim();

    const seoTitle = `${cleanBrand} ${cleanName} | Premium ${cleanCat}`;
    const shortDescription = `Experience unmatched performance with the all-new ${cleanBrand} ${cleanName}. Designed for high reliability, durability, and top-tier user satisfaction in ${cleanCat}.`;

    const description = `The ${cleanBrand} ${cleanName} delivers modern design, robust functionality, and exceptional build quality. Specially engineered for ${cleanCat.toLowerCase()} enthusiasts, this product combines cutting-edge specifications with seamless daily usability.\n\nWhether you need reliable performance or premium aesthetic appeal, the ${cleanName} is your ideal companion. Backed by full brand warranty and verified seller quality assurance on PayPilot AI.`;

    const keyFeatures = [
      `Genuine ${cleanBrand} engineering & build quality`,
      `Optimized for peak efficiency in ${cleanCat}`,
      `Comes with full brand warranty & 7-day buyer return guarantee`,
      `Includes essential accessories and standard package contents`
    ];

    const tags = [cleanBrand.toLowerCase(), cleanCat.toLowerCase(), 'paypilot-verified', 'best-seller'];
    if (subcategory) tags.push(subcategory.toLowerCase());

    return {
      seoTitle,
      shortDescription,
      description,
      keyFeatures,
      tags
    };
  },

  /**
   * 6. AI Fraud & Risk Signals
   */
  async evaluateOrderRisk(orderId) {
    const order = await Order.findById(orderId).populate('user').lean();
    if (!order) throw new Error('Order not found.');

    let riskScore = 0; // 0 to 100 scale
    const riskFactors = [];

    // Signal 1: High order total (> ₹50,000)
    if (order.total > 50000) {
      riskScore += 30;
      riskFactors.push('High value transaction exceeding ₹50,000 threshold');
    } else if (order.total > 20000) {
      riskScore += 15;
      riskFactors.push('Moderate transaction value above ₹20,000');
    }

    // Signal 2: Rapid user order frequency (> 3 orders in 24 hours)
    if (order.user) {
      const recentCount = await Order.countDocuments({
        user: order.user._id,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      if (recentCount > 3) {
        riskScore += 25;
        riskFactors.push(`High order frequency (${recentCount} orders in 24h)`);
      }
    }

    // Signal 3: Unverified shipping address completeness
    if (!order.shippingAddress?.phone || order.shippingAddress?.phone.length < 10) {
      riskScore += 20;
      riskFactors.push('Incomplete contact phone digits in shipping profile');
    }

    let riskLevel = 'Low Risk';
    let riskColor = 'emerald';
    if (riskScore >= 50) {
      riskLevel = 'High Risk';
      riskColor = 'rose';
    } else if (riskScore >= 25) {
      riskLevel = 'Medium Risk';
      riskColor = 'amber';
    }

    return {
      orderId,
      orderNumber: order.orderNumber,
      riskScore,
      riskLevel,
      riskColor,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['Standard customer transaction pattern confirmed']
    };
  },

  /**
   * 7. AI Shopping Memory Controls
   */
  async resetUserShoppingMemory(userId) {
    await preferenceService.clearUserPreferences(userId);
    return {
      userId,
      preferencesCleared: true,
      clearedAt: new Date()
    };
  },

  /**
   * 8. AI Budget Guard + Smart Cart Optimizer Analysis
   */
  async analyzeCartBudgetAndOptimization(userId, userBudget = 30000) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        cartTotal: 0,
        userBudget: Number(userBudget) || 0,
        isOverBudget: false,
        difference: 0,
        budgetStatusMessage: 'Your cart is currently empty.',
        insights: [],
        cheaperAlternatives: [],
        bestDeal: null,
        potentialSavings: 0,
        optimizedTotal: 0,
        optimizationSummary: ['Cart is empty.']
      };
    }

    const cartTotal = cart.total || 0;
    const targetBudget = Number(userBudget) || 30000;
    const isOverBudget = cartTotal > targetBudget;
    const difference = Math.abs(cartTotal - targetBudget);

    // 1. Insights (Highest cost item & category overlap)
    const insights = [];
    const sortedItems = [...cart.items].sort((a, b) => (b.product?.price || 0) - (a.product?.price || 0));
    const highestCostItem = sortedItems[0]?.product;

    if (highestCostItem) {
      insights.push(`Your "${highestCostItem.name}" is the highest-cost item in this cart (₹${highestCostItem.price?.toLocaleString('en-IN')}).`);
    }

    // Category count map
    const catCounts = {};
    for (const item of cart.items) {
      if (item.product?.category) {
        catCounts[item.product.category] = (catCounts[item.product.category] || 0) + item.quantity;
      }
    }
    for (const [cat, count] of Object.entries(catCounts)) {
      if (count >= 2) {
        insights.push(`Your cart contains ${count} items in the "${cat}" category.`);
      }
    }

    // 2. Real Cheaper Alternatives from MongoDB
    const cheaperAlternatives = [];
    if (highestCostItem && highestCostItem.category) {
      const altProducts = await Product.find({
        category: highestCostItem.category,
        price: { $lt: highestCostItem.price },
        _id: { $ne: highestCostItem._id },
        active: true
      })
        .sort({ rating: -1, price: 1 })
        .limit(2)
        .lean();

      for (const alt of altProducts) {
        const savings = (highestCostItem.price - alt.price) * (sortedItems[0].quantity || 1);
        cheaperAlternatives.push({
          currentProduct: highestCostItem,
          replacementProduct: alt,
          savings,
          rationale: `Replace "${highestCostItem.name}" (₹${highestCostItem.price?.toLocaleString('en-IN')}) with "${alt.name}" (₹${alt.price?.toLocaleString('en-IN')}) to save ₹${savings.toLocaleString('en-IN')}.`
        });
      }
    }

    // 3. Applicable System Coupons / Deals
    const systemOffers = [
      { code: 'PAYPILOT10', title: '10% Instant Marketplace Offer', value: 10, type: 'PERCENTAGE', minOrder: 1000, maxDiscount: 2000 },
      { code: 'WELCOME500', title: 'Flat ₹500 First Order Offer', value: 500, type: 'FLAT', minOrder: 2000, maxDiscount: 500 },
      { code: 'FESTIVE15', title: '15% Mega Shopping Offer', value: 15, type: 'PERCENTAGE', minOrder: 5000, maxDiscount: 3500 }
    ];

    let maxDealSavings = 0;
    let selectedOffer = null;

    for (const offer of systemOffers) {
      if (cartTotal >= offer.minOrder) {
        let savings = offer.type === 'PERCENTAGE'
          ? Math.min(offer.maxDiscount, Math.round((cartTotal * offer.value) / 100))
          : Math.min(offer.maxDiscount, offer.value);

        if (savings > maxDealSavings) {
          maxDealSavings = savings;
          selectedOffer = offer;
        }
      }
    }

    // 4. Calculate Optimization Summary
    const potentialAltSavings = cheaperAlternatives.length > 0 ? cheaperAlternatives[0].savings : 0;
    const totalPotentialSavings = maxDealSavings + potentialAltSavings;
    const optimizedTotal = Math.max(0, cartTotal - totalPotentialSavings);

    const optimizationSummary = [];
    if (selectedOffer) {
      optimizationSummary.push(`✓ Applied promotional offer "${selectedOffer.code}" (-₹${maxDealSavings.toLocaleString('en-IN')})`);
    } else {
      optimizationSummary.push(`No additional offers are currently available.`);
    }

    if (cheaperAlternatives.length > 0) {
      optimizationSummary.push(`✓ Suggested replacement: "${cheaperAlternatives[0].replacementProduct.name}" (Save ₹${potentialAltSavings.toLocaleString('en-IN')})`);
    }

    if (totalPotentialSavings > 0) {
      optimizationSummary.push(`Total potential savings: ₹${totalPotentialSavings.toLocaleString('en-IN')}`);
    }

    return {
      cartTotal,
      userBudget: targetBudget,
      isOverBudget,
      difference,
      budgetStatusMessage: isOverBudget
        ? `⚠️ You are ₹${difference.toLocaleString('en-IN')} over your budget of ₹${targetBudget.toLocaleString('en-IN')}.`
        : `✓ You're within your ₹${targetBudget.toLocaleString('en-IN')} budget (Remaining: ₹${difference.toLocaleString('en-IN')}).`,
      insights,
      cheaperAlternatives,
      bestDeal: selectedOffer ? { code: selectedOffer.code, title: selectedOffer.title, discount: maxDealSavings } : null,
      potentialSavings: totalPotentialSavings,
      optimizedTotal,
      optimizationSummary
    };
  }
};

export default agenticCommerceService;
