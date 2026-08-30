import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import CartEvent from '../models/CartEvent.js';
import { calculateCartTotals } from './cartCalculationService.js';

export const cartService = {
  /**
   * Helper to log lightweight CartEvent for future AI Growth analytics
   */
  async logCartEvent(userId, cartId, productId, eventType, quantity = 1, metadata = {}) {
    try {
      await CartEvent.create({
        user: userId,
        cart: cartId,
        product: productId,
        eventType,
        quantity,
        metadata
      });
    } catch (err) {
      console.warn('[CartEvent Warning] Failed to log cart event:', err.message);
    }
  },

  /**
   * Get user's cart populated with current product data
   */
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        currency: 'INR'
      });
    }

    // Filter out inactive or deleted products
    cart.items = cart.items.filter((item) => item.product && item.product.active);

    // Recalculate totals dynamically
    const totals = calculateCartTotals(cart.items);
    cart.subtotal = totals.subtotal;
    cart.discount = totals.discount;
    cart.tax = totals.tax;
    cart.shipping = totals.shipping;
    cart.total = totals.total;

    await cart.save();

    return cart;
  },

  /**
   * Add product to cart with strict stock & price validation
   */
  async addItem(userId, productId, quantity = 1) {
    const addQty = Math.max(1, parseInt(quantity, 10) || 1);

    const product = await Product.findById(productId);
    if (!product || !product.active) {
      throw new Error('Product is unavailable or does not exist');
    }

    if (product.stock <= 0) {
      throw new Error('Product is out of stock');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
      await this.logCartEvent(userId, cart._id, productId, 'CART_CREATED');
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    let newQty = addQty;
    if (existingIndex > -1) {
      newQty = cart.items[existingIndex].quantity + addQty;
    }

    if (newQty > product.stock) {
      throw new Error(`Only ${product.stock} units of ${product.name} are available in stock`);
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].priceAtAddition = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: addQty,
        priceAtAddition: product.price
      });
    }

    await cart.save();

    // Log Cart Event
    await this.logCartEvent(userId, cart._id, productId, 'ITEM_ADDED', addQty, {
      price: product.price
    });

    return await this.getCart(userId);
  },

  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(userId, productId, quantity) {
    const targetQty = parseInt(quantity, 10);
    if (isNaN(targetQty)) {
      throw new Error('Invalid quantity provided');
    }

    if (targetQty <= 0) {
      return await this.removeItem(userId, productId);
    }

    const product = await Product.findById(productId);
    if (!product || !product.active) {
      throw new Error('Product unavailable');
    }

    if (targetQty > product.stock) {
      throw new Error(`Only ${product.stock} units available in stock`);
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex === -1) {
      throw new Error('Product not found in cart');
    }

    cart.items[existingIndex].quantity = targetQty;
    cart.items[existingIndex].priceAtAddition = product.price;
    await cart.save();

    // Log Cart Event
    await this.logCartEvent(userId, cart._id, productId, 'QUANTITY_UPDATED', targetQty);

    return await this.getCart(userId);
  },

  /**
   * Remove item from cart
   */
  async removeItem(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString()
      );
      await cart.save();

      await this.logCartEvent(userId, cart._id, productId, 'ITEM_REMOVED');
    }

    return await this.getCart(userId);
  },

  /**
   * Clear all items from cart
   */
  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      cart.discount = 0;
      cart.tax = 0;
      cart.shipping = 0;
      cart.total = 0;
      await cart.save();

      await this.logCartEvent(userId, cart._id, null, 'CART_CLEARED');
    }

    return await this.getCart(userId);
  },

  /**
   * Validate cart items, pricing, and stock availability before checkout
   */
  async validateCart(userId) {
    const cart = await this.getCart(userId);
    const warnings = [];
    let isValid = true;

    for (const item of cart.items) {
      const p = item.product;
      if (!p || !p.active) {
        warnings.push(`Product '${p?.name || 'Unknown'}' is no longer available.`);
        isValid = false;
      } else if (item.quantity > p.stock) {
        warnings.push(
          `Requested quantity (${item.quantity}) for '${p.name}' exceeds stock (${p.stock}).`
        );
        isValid = false;
      }
    }

    return {
      isValid,
      warnings,
      cart
    };
  },

  /**
   * Record checkout started event
   */
  async recordCheckoutStarted(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      await this.logCartEvent(userId, cart._id, null, 'CHECKOUT_STARTED', 0, {
        total: cart.total
      });
    }
  }
};

export default cartService;
