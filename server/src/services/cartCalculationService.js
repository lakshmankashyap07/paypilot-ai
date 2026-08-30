/**
 * Centralized Cart Monetary Calculation Engine
 * 
 * Never trust monetary values sent from the frontend.
 * Computes subtotal, discount, tax, shipping, and total strictly from database product data.
 */
export const calculateCartTotals = (items = []) => {
  let subtotal = 0;
  let totalDiscount = 0;

  for (const item of items) {
    const product = item.product;
    const qty = Math.max(1, item.quantity || 1);

    // Use current database product price if available, fallback to priceAtAddition
    const currentPrice = product && product.price !== undefined ? product.price : item.priceAtAddition;
    const originalPrice = product && product.originalPrice ? product.originalPrice : currentPrice;

    subtotal += currentPrice * qty;

    if (originalPrice > currentPrice) {
      totalDiscount += (originalPrice - currentPrice) * qty;
    }
  }

  // Demo Pricing Rules:
  // Tax: 18% GST on net subtotal
  const taxRate = 0.18;
  const tax = Math.round(subtotal * taxRate);

  // Shipping: ₹99 flat rate; FREE for subtotals >= ₹2000
  const freeShippingThreshold = 2000;
  const shipping = items.length === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : 99;

  // Final Total
  const total = Math.max(0, subtotal + tax + shipping);

  return {
    subtotal: Math.round(subtotal),
    discount: Math.round(totalDiscount),
    tax: Math.round(tax),
    shipping: Math.round(shipping),
    total: Math.round(total),
    currency: 'INR'
  };
};

export default calculateCartTotals;
