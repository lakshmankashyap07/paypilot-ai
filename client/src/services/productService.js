import api from './api';

export const productService = {
  /**
   * Fetch paginated & filtered products list
   */
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response;
  },

  /**
   * Fetch product details by ID or Slug
   */
  async getProduct(idOrSlug) {
    const response = await api.get(`/products/${idOrSlug}`);
    return response;
  },

  /**
   * Fetch product details by Slug
   */
  async getProductBySlug(slug) {
    const response = await api.get(`/products/slug/${slug}`);
    return response;
  },

  /**
   * Fetch featured products list
   */
  async getFeaturedProducts(limit = 8) {
    const response = await api.get('/products/featured', { params: { limit } });
    return response;
  },

  /**
   * Fetch categories list
   */
  async getCategories() {
    const response = await api.get('/products/categories');
    return response;
  },

  /**
   * Fetch distinct active brands list
   */
  async getBrands() {
    const response = await api.get('/products/brands');
    return response;
  }
};

export default productService;
