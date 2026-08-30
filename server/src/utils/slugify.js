import Product from '../models/Product.js';

export function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateUniqueSlug(name, productId = null) {
  let baseSlug = slugify(name);
  if (!baseSlug) {
    baseSlug = `product-${Date.now()}`;
  }

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: uniqueSlug };
    if (productId) {
      query._id = { $ne: productId };
    }

    const existing = await Product.findOne(query).select('_id').lean();
    if (!existing) {
      break;
    }

    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export default { slugify, generateUniqueSlug };
