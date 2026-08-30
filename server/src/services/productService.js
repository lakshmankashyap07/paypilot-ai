import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ProductView from '../models/ProductView.js';

export const productService = {
  /**
   * Multi-faceted query engine for product list with bulletproof query construction
   */
  async getProducts(queryParams = {}) {
    const {
      search,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      minRating,
      featured,
      inStock,
      sort,
      page = 1,
      limit = 12
    } = queryParams;

    const query = { active: true };

    // 1. Search Query (matching name, brand, category, subcategory, description, and tags)
    if (search && typeof search === 'string' && search.trim() !== '') {
      const cleanSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(cleanSearch, 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    // 2. Category & Subcategory Filter
    if (
      category &&
      typeof category === 'string' &&
      category.trim() !== '' &&
      category.trim().toLowerCase() !== 'all'
    ) {
      const cleanCat = category.trim();
      let catRegexStr = cleanCat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const catLower = cleanCat.toLowerCase();
      if (catLower === 'mobiles' || catLower === 'mobile' || catLower === 'smartphones' || catLower === 'smartphone') {
        catRegexStr = '(Smartphones|Mobiles|Mobile|Smartphone)';
      } else if (catLower === 'appliances' || catLower === 'appliance') {
        catRegexStr = '(Electronics|Home|Appliances|Appliance)';
      } else if (catLower === 'laptops' || catLower === 'laptop') {
        catRegexStr = '(Laptops|Laptop|Electronics)';
      } else if (catLower === 'headphones' || catLower === 'headphone') {
        catRegexStr = '(Headphones|Headphone|Electronics)';
      } else if (catLower === 'shoes' || catLower === 'shoe' || catLower === 'footwear') {
        catRegexStr = '(Shoes|Shoe|Fashion)';
      }

      query.category = new RegExp(`^${catRegexStr}$`, 'i');
    }

    if (
      subcategory &&
      typeof subcategory === 'string' &&
      subcategory.trim() !== '' &&
      subcategory.trim().toLowerCase() !== 'all'
    ) {
      const cleanSub = subcategory.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.subcategory = new RegExp(cleanSub, 'i');
    }

    // 3. Brand Filter (supports single string, comma-separated string, or array)
    if (brand) {
      let brandList = [];
      if (Array.isArray(brand)) {
        brandList = brand
          .map((b) => String(b).trim())
          .filter((b) => b !== '' && b.toLowerCase() !== 'all');
      } else if (typeof brand === 'string' && brand.trim() !== '') {
        brandList = brand
          .split(',')
          .map((b) => b.trim())
          .filter((b) => b !== '' && b.toLowerCase() !== 'all');
      }

      if (brandList.length === 1) {
        const cleanBrand = brandList[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.brand = new RegExp(`^${cleanBrand}$`, 'i');
      } else if (brandList.length > 1) {
        query.brand = {
          $in: brandList.map((b) => new RegExp(`^${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'))
        };
      }
    }

    // 4. Price Filter (Strict Numeric Validation & Safe Query Construction)
    let parsedMin = undefined;
    let parsedMax = undefined;

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      if (typeof minPrice === 'number' && Number.isFinite(minPrice)) {
        parsedMin = minPrice;
      } else if (typeof minPrice === 'string' && minPrice.trim() !== '') {
        const num = Number(minPrice.trim());
        if (Number.isFinite(num)) parsedMin = num;
      }
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      if (typeof maxPrice === 'number' && Number.isFinite(maxPrice)) {
        parsedMax = maxPrice;
      } else if (typeof maxPrice === 'string' && maxPrice.trim() !== '') {
        const num = Number(maxPrice.trim());
        if (Number.isFinite(num)) parsedMax = num;
      }
    }

    // Swap if min > max to handle invalid ranges smoothly
    if (parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax) {
      const temp = parsedMin;
      parsedMin = parsedMax;
      parsedMax = temp;
    }

    const priceCondition = {};
    if (parsedMin !== undefined && parsedMin >= 0) {
      priceCondition.$gte = parsedMin;
    }
    if (parsedMax !== undefined && parsedMax >= 0) {
      priceCondition.$lte = parsedMax;
    }

    // Only set query.price if at least one valid numeric condition exists
    if (Object.keys(priceCondition).length > 0) {
      query.price = priceCondition;
    }

    // 5. Rating Filter (Strict Numeric Validation)
    const ratingVal = rating !== undefined ? rating : minRating;
    if (ratingVal !== undefined && ratingVal !== null && ratingVal !== '') {
      const parsedRating = Number(ratingVal);
      if (Number.isFinite(parsedRating) && parsedRating > 0) {
        query.rating = { $gte: parsedRating };
      }
    }

    // 6. In Stock Filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // 7. Featured Filter
    if (featured === 'true' || featured === true) {
      query.featured = true;
    }

    // 8. Sorting Engine
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, reviewCount: -1 };
    } else if (sort === 'popular') {
      sortOptions = { reviewCount: -1, rating: -1 };
    } else if (sort === 'discount') {
      sortOptions = { discount: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    // 9. Pagination Engine
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    };
  },

  /**
   * Get single product by ID or Slug
   */
  async getProductByIdOrSlug(identifier) {
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).lean();
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier.toLowerCase() }).lean();
    }

    return product;
  },

  /**
   * Get top featured products
   */
  async getFeaturedProducts(limit = 8) {
    return await Product.find({ featured: true, active: true })
      .sort({ rating: -1 })
      .limit(limit)
      .lean();
  },

  /**
   * Get related products by category or brand
   */
  async getRelatedProducts(productId, category, brand, limit = 4) {
    return await Product.find({
      _id: { $ne: productId },
      active: true,
      $or: [{ category }, { brand }]
    })
      .sort({ rating: -1 })
      .limit(limit)
      .lean();
  },

  /**
   * Get list of categories
   */
  async getCategories() {
    return await Category.find({ active: true }).sort({ name: 1 }).lean();
  },

  /**
   * Get list of distinct active brands
   */
  async getBrands() {
    const brands = await Product.distinct('brand', { active: true });
    return brands.sort();
  },

  /**
   * Record lightweight product view event
   */
  async recordProductView(productId, userId = null, sessionId = '') {
    try {
      await ProductView.create({
        product: productId,
        user: userId,
        sessionId
      });
    } catch (err) {
      console.warn('[ProductView Warning] Failed to log product view:', err.message);
    }
  }
};

export default productService;
