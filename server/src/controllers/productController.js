import productService from '../services/productService.js';

/**
 * Get Paginated, Filtered, and Searched Products
 * GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Featured Products
 * GET /api/products/featured
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const products = await productService.getFeaturedProducts(limit);
    res.status(200).json({
      success: true,
      message: 'Featured products fetched successfully',
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Categories List
 * GET /api/products/categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Brands List
 * GET /api/products/brands
 */
export const getBrands = async (req, res, next) => {
  try {
    const brands = await productService.getBrands();
    res.status(200).json({
      success: true,
      message: 'Brands fetched successfully',
      data: { brands }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Product by Slug
 * GET /api/products/slug/:slug
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductByIdOrSlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with slug '${slug}' not found`
      });
    }

    const relatedProducts = await productService.getRelatedProducts(
      product._id,
      product.category,
      product.brand,
      4
    );

    // Track product view (non-blocking)
    productService.recordProductView(
      product._id,
      req.user?._id || null,
      req.headers['x-session-id'] || ''
    );

    res.status(200).json({
      success: true,
      message: 'Product details fetched successfully',
      data: { product, relatedProducts }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Product Details by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByIdOrSlug(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await productService.getRelatedProducts(
      product._id,
      product.category,
      product.brand,
      4
    );

    // Track product view (non-blocking)
    productService.recordProductView(
      product._id,
      req.user?._id || null,
      req.headers['x-session-id'] || ''
    );

    res.status(200).json({
      success: true,
      message: 'Product details fetched successfully',
      data: { product, relatedProducts }
    });
  } catch (error) {
    next(error);
  }
};
