import productService from '../../services/productService.js';
import cartService from '../../services/cartService.js';
import addressService from '../../services/addressService.js';
import orderService from '../../services/orderService.js';
import preferenceService from '../../services/recommendation/preferenceService.js';
import contextService from '../../services/ai/contextService.js';
import checkoutSessionService from '../../services/checkout/checkoutSessionService.js';
import { calculateCartTotals } from '../../services/cartCalculationService.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

export const commerceToolsRegistry = [
  // 1. Search Products
  {
    name: 'searchProducts',
    description: 'Search the catalog for products matching text query, category, price range, brand, or minimum rating.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Keyword search term (e.g. running shoes, laptop, headphones)' },
        category: { type: 'STRING', description: 'Product category filter' },
        brand: { type: 'STRING', description: 'Brand filter' },
        minPrice: { type: 'NUMBER', description: 'Minimum price in INR' },
        maxPrice: { type: 'NUMBER', description: 'Maximum price in INR' },
        minRating: { type: 'NUMBER', description: 'Minimum rating (1 to 5)' },
        inStock: { type: 'BOOLEAN', description: 'Only show in-stock products' },
        limit: { type: 'NUMBER', description: 'Number of results to return (default 6)' }
      }
    },
    permission: 'READ',
    async execute(args, context) {
      const result = await productService.getProducts({
        search: args.query,
        category: args.category,
        brand: args.brand,
        minPrice: args.minPrice,
        maxPrice: args.maxPrice,
        minRating: args.minRating,
        inStock: args.inStock ? 'true' : undefined,
        limit: args.limit || 6
      });

      const mappedProducts = result.products.map((p) => ({
        id: p._id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        thumbnail: p.thumbnail || p.images?.[0] || ''
      }));

      if (context.conversationId && mappedProducts.length > 0) {
        await contextService.updateShoppingState(context.conversationId, {
          intent: 'product_search',
          category: args.category || '',
          brand: args.brand || '',
          maxPrice: args.maxPrice || null,
          minPrice: args.minPrice || null,
          candidateProductIds: mappedProducts.map((p) => p.id)
        });
      }

      if (context.userId && mappedProducts.length > 0) {
        await preferenceService.recordProductInterest(context.userId, mappedProducts[0].id);
      }

      return {
        products: mappedProducts,
        total: result.pagination.total,
        filtersApplied: args
      };
    }
  },

  // 2. Get Product Details
  {
    name: 'getProductDetails',
    description: 'Get comprehensive product details, specifications, reviews count, and stock. Supports product IDs, slugs, or references like "first one" or "cheaper one".',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: { type: 'STRING', description: 'Database ID, slug, or reference text (e.g. "first one", "cheaper one")' }
      },
      required: ['productId']
    },
    permission: 'READ',
    async execute(args, context) {
      let targetId = args.productId;

      if (context.conversationId && (!targetId || targetId.length < 10 || targetId.includes(' '))) {
        const resolved = await contextService.resolveProductReference(context.conversationId, targetId || 'first one');
        if (resolved) targetId = resolved._id ? resolved._id.toString() : resolved.id;
      }

      const product = await productService.getProductByIdOrSlug(targetId);
      if (!product) throw new Error(`Product '${targetId}' was not found`);

      if (context.userId) {
        await preferenceService.recordProductInterest(context.userId, product._id);
      }

      return { product };
    }
  },

  // 3. Compare Products
  {
    name: 'compareProducts',
    description: 'Compare 2 or 3 products side-by-side on price, rating, discount, brand, and specifications.',
    parameters: {
      type: 'OBJECT',
      properties: {
        productIds: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'List of product IDs or reference names to compare'
        }
      }
    },
    permission: 'READ',
    async execute(args, context) {
      let targetIds = args.productIds || [];

      if (targetIds.length === 0 && context.conversationId) {
        const ctx = await contextService.getShoppingContext(context.conversationId);
        if (ctx.candidateProducts && ctx.candidateProducts.length >= 2) {
          targetIds = ctx.candidateProducts.slice(0, 3).map((p) => p._id.toString());
        }
      }

      if (!Array.isArray(targetIds) || targetIds.length === 0) {
        throw new Error('Please provide product IDs to compare');
      }

      const products = await Product.find({ _id: { $in: targetIds } }).lean();
      const comparison = products.map((p) => ({
        id: p._id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        specifications: p.specifications || {}
      }));

      return { comparisonCount: comparison.length, products: comparison };
    }
  },

  // 4. Recommend Products
  {
    name: 'recommendProducts',
    description: 'Get personalized, ranked product recommendations with data-backed explanations based on budget, category, minimum rating, and user preferences.',
    parameters: {
      type: 'OBJECT',
      properties: {
        category: { type: 'STRING', description: 'Target category' },
        budget: { type: 'NUMBER', description: 'Maximum budget in INR' },
        minimumRating: { type: 'NUMBER', description: 'Minimum rating (default 4.0)' },
        useCase: { type: 'STRING', description: 'Intended use case (e.g. gaming, daily running, coding)' },
        limit: { type: 'NUMBER', description: 'Number of recommendations (default 4)' }
      }
    },
    permission: 'READ',
    async execute(args, context) {
      const userPrefs = context.userId ? await preferenceService.getUserPreferences(context.userId) : null;
      const result = await productService.getProducts({
        category: args.category,
        maxPrice: args.budget,
        minRating: args.minimumRating !== undefined ? args.minimumRating : 1.0,
        limit: args.limit || 4,
        sort: 'rating'
      });

      const recommendations = result.products.map((p) => {
        const isPrefCategory = userPrefs?.preferredCategories?.some((c) => c.category === p.category);
        const isPrefBrand = userPrefs?.preferredBrands?.some((b) => b.brand === p.brand);

        let why = `Fits your budget of ₹${p.price.toLocaleString('en-IN')}`;
        if (p.rating >= 4.5) why += `, highly rated at ${p.rating}★`;
        if (p.discount >= 20) why += `, with ${p.discount}% discount`;
        if (isPrefBrand) why += `, matches your brand preference for ${p.brand}`;

        return {
          id: p._id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          rating: p.rating,
          discount: p.discount,
          stock: p.stock,
          thumbnail: p.thumbnail || p.images?.[0] || '',
          whyRecommended: why
        };
      });

      if (context.conversationId && recommendations.length > 0) {
        await contextService.updateShoppingState(context.conversationId, {
          intent: 'recommendation',
          category: args.category || '',
          maxPrice: args.budget || null,
          candidateProductIds: recommendations.map((p) => p.id)
        });
      }

      return { recommendations };
    }
  },

  // 5. View Cart
  {
    name: 'viewCart',
    description: 'Get the active user shopping cart with products, quantities, prices, subtotal, tax, shipping, and total.',
    parameters: { type: 'OBJECT', properties: {} },
    permission: 'READ',
    async execute(args, context) {
      const cart = await cartService.getCart(context.userId);
      return { cart };
    }
  },

  // 6. Add To Cart
  {
    name: 'addToCart',
    description: 'Add a product to the user shopping cart. Supports product IDs or reference phrases like "the first one", "cheaper option", "that product".',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: { type: 'STRING', description: 'Database ObjectId or reference string (e.g. "first one", "cheaper option")' },
        quantity: { type: 'NUMBER', description: 'Quantity to add (default 1)' }
      }
    },
    permission: 'WRITE',
    async execute(args, context) {
      let targetId = args.productId;

      if (context.conversationId && (!targetId || targetId.length < 10 || targetId.includes(' '))) {
        const resolved = await contextService.resolveProductReference(context.conversationId, targetId || 'first one');
        if (resolved) targetId = resolved._id ? resolved._id.toString() : resolved.id;
      }

      if (!targetId) throw new Error('Could not identify product to add to cart');

      const qty = Math.max(1, parseInt(args.quantity, 10) || 1);
      const updatedCart = await cartService.addItem(context.userId, targetId, qty);

      if (context.userId) {
        await preferenceService.recordProductInterest(context.userId, targetId);
      }

      return {
        success: true,
        message: 'Product added to cart successfully',
        quantityAdded: qty,
        cartSummary: {
          itemCount: updatedCart.items.length,
          total: updatedCart.total
        }
      };
    }
  },

  // 7. Remove From Cart
  {
    name: 'removeFromCart',
    description: 'Remove a product from the shopping cart.',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: { type: 'STRING', description: 'Database ObjectId of product to remove' }
      },
      required: ['productId']
    },
    permission: 'WRITE',
    async execute(args, context) {
      const updatedCart = await cartService.removeItem(context.userId, args.productId);
      return { success: true, cart: updatedCart };
    }
  },

  // 8. Update Cart Quantity
  {
    name: 'updateCartQuantity',
    description: 'Update quantity of an existing cart item.',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: { type: 'STRING', description: 'Product ID' },
        quantity: { type: 'NUMBER', description: 'New quantity' }
      },
      required: ['productId', 'quantity']
    },
    permission: 'WRITE',
    async execute(args, context) {
      const updatedCart = await cartService.updateItemQuantity(context.userId, args.productId, args.quantity);
      return { success: true, cart: updatedCart };
    }
  },

  // 9. Calculate Cart Total
  {
    name: 'calculateCartTotal',
    description: 'Calculate server-side subtotal, discount, 18% GST tax, shipping, and total for active cart.',
    parameters: { type: 'OBJECT', properties: {} },
    permission: 'READ',
    async execute(args, context) {
      const cart = await cartService.getCart(context.userId);
      const totals = calculateCartTotals(cart.items);
      return { totals };
    }
  },

  // 10. Prepare Checkout (Agentic Checkout Phase 3)
  {
    name: 'prepareCheckout',
    description: 'Validate cart, verify stock, calculate server-grounded totals, and prepare checkout summary. Requires user confirmation before order creation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        addressId: { type: 'STRING', description: 'Optional shipping address ID' }
      }
    },
    permission: 'READ',
    async execute(args, context) {
      return await checkoutSessionService.prepareCheckout(context.userId, context.conversationId, args.addressId);
    }
  },

  // 11. Confirm Checkout (Agentic Checkout Phase 3)
  {
    name: 'confirmCheckout',
    description: 'Confirm checkout and create order after explicit user confirmation ("Yes", "Confirm", "Place order"). Payment status remains PENDING.',
    parameters: {
      type: 'OBJECT',
      properties: {
        checkoutSessionId: { type: 'STRING', description: 'Optional checkout session ID' }
      }
    },
    permission: 'WRITE',
    async execute(args, context) {
      return await checkoutSessionService.confirmCheckout(context.userId, args.checkoutSessionId);
    }
  },

  // 12. Create Payment Session (Razorpay Phase 3)
  {
    name: 'createPaymentSession',
    description: 'Create Razorpay payment order for created internal order, returning safe checkout payload with amount in paise.',
    parameters: {
      type: 'OBJECT',
      properties: {
        orderId: { type: 'STRING', description: 'Database ObjectId of order to pay' }
      },
      required: ['orderId']
    },
    permission: 'WRITE',
    async execute(args, context) {
      return await checkoutSessionService.createPaymentSession(context.userId, args.orderId);
    }
  },

  // 13. Get Payment Status (Phase 3)
  {
    name: 'getPaymentStatus',
    description: 'Query verified backend payment and order status (e.g. CAPTURED, PENDING, FAILED) for an order.',
    parameters: {
      type: 'OBJECT',
      properties: {
        orderId: { type: 'STRING', description: 'Database ObjectId of order' }
      },
      required: ['orderId']
    },
    permission: 'READ',
    async execute(args, context) {
      return await checkoutSessionService.getPaymentStatus(context.userId, args.orderId);
    }
  },

  // 14. Get User Profile
  {
    name: 'getUserProfile',
    description: 'Get safe user profile details (name, email, role). Secrets and passwords are never exposed.',
    parameters: { type: 'OBJECT', properties: {} },
    permission: 'READ',
    async execute(args, context) {
      const user = await User.findById(context.userId).select('name email phone role').lean();
      return { user };
    }
  },

  // 15. Get Saved Addresses
  {
    name: 'getSavedAddresses',
    description: 'Get saved delivery shipping addresses for the authenticated user.',
    parameters: { type: 'OBJECT', properties: {} },
    permission: 'READ',
    async execute(args, context) {
      const addresses = await addressService.getAddresses(context.userId);
      return { addresses };
    }
  },

  // 16. Validate Checkout
  {
    name: 'validateCheckout',
    description: 'Validate cart stock, prices, and address readiness for checkout without placing an order.',
    parameters: {
      type: 'OBJECT',
      properties: {
        addressId: { type: 'STRING', description: 'Selected delivery address ID' }
      }
    },
    permission: 'READ',
    async execute(args, context) {
      let addrId = args.addressId;
      if (!addrId) {
        const addresses = await addressService.getAddresses(context.userId);
        if (addresses.length > 0) addrId = addresses[0]._id.toString();
      }

      const result = await orderService.validateCheckout(context.userId, { shippingAddressId: addrId });
      return { validation: result };
    }
  },

  // 17. Create Order (Legacy direct order creation)
  {
    name: 'createOrder',
    description: 'Create an order and reduce inventory after explicit customer confirmation. Payment status is PENDING.',
    parameters: {
      type: 'OBJECT',
      properties: {
        addressId: { type: 'STRING', description: 'Shipping address ID for the order' },
        notes: { type: 'STRING', description: 'Optional order notes' }
      }
    },
    permission: 'WRITE',
    async execute(args, context) {
      let addrId = args.addressId;
      if (!addrId) {
        const addresses = await addressService.getAddresses(context.userId);
        if (addresses.length > 0) addrId = addresses[0]._id.toString();
      }

      const order = await orderService.createOrder(context.userId, {
        shippingAddressId: addrId,
        notes: args.notes || ''
      });

      if (context.userId && order.items?.length > 0) {
        for (const item of order.items) {
          await preferenceService.recordPurchaseInterest(context.userId, item.product);
        }
      }

      return {
        success: true,
        message: 'Order created successfully. You can now complete payment securely via Razorpay.',
        orderNumber: order.orderNumber,
        total: order.total,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      };
    }
  }
];

export const getToolDefinitions = () => {
  return commerceToolsRegistry.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters
  }));
};

export const getToolHandler = (name) => {
  const tool = commerceToolsRegistry.find((t) => t.name === name);
  return tool ? tool.execute : null;
};
