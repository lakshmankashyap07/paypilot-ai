import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import productService from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCardSkeleton } from '../components/Skeletons';
import { EmptyState } from '../components/EmptyState';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State derived from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Available brands list
  const [brandsList, setBrandsList] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize internal React state whenever URL searchParams change
  // (Handles CategoryNav clicks, browser Back/Forward, direct URL links, and refreshes)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setRating(searchParams.get('rating') || '');
    setInStock(searchParams.get('inStock') === 'true');
    setFeatured(searchParams.get('featured') === 'true');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page'), 10) || 1);
  }, [searchParams]);

  // Load distinct brands list
  useEffect(() => {
    productService
      .getBrands()
      .then((res) => {
        if (res && res.success && res.data?.brands) {
          setBrandsList(res.data.brands);
        }
      })
      .catch((err) => console.warn('Failed to load brands:', err.message));
  }, []);

  // Fetch product list using custom hook with active filters
  const { products, pagination, isLoading, isError, errorMessage } = useProducts({
    search: search ? search.trim() : undefined,
    category: category && category.toLowerCase() !== 'all' ? category.trim() : undefined,
    brand: brand && brand.toLowerCase() !== 'all' ? brand.trim() : undefined,
    minPrice: minPrice !== '' && Number.isFinite(Number(minPrice)) ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== '' && Number.isFinite(Number(maxPrice)) ? Number(maxPrice) : undefined,
    rating: rating !== '' && Number.isFinite(Number(rating)) ? Number(rating) : undefined,
    inStock,
    featured,
    sort,
    page,
    limit: 12
  });

  // Helper to update specific search parameter in URL without breaking other parameters
  const updateUrlParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === false ||
      (typeof value === 'string' && value.toLowerCase() === 'all')
    ) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
    if (key !== 'page') {
      nextParams.delete('page');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleFilterChange = (key, value) => {
    if (key === 'brand') updateUrlParam('brand', value);
    if (key === 'minPrice') updateUrlParam('minPrice', value);
    if (key === 'maxPrice') updateUrlParam('maxPrice', value);
    if (key === 'rating') updateUrlParam('rating', value);
    if (key === 'inStock') updateUrlParam('inStock', value);
    if (key === 'featured') updateUrlParam('featured', value);
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const isCategoryFilterActive = Boolean(
    category && category.trim() !== '' && category.toLowerCase() !== 'all'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Catalog Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {isCategoryFilterActive ? `${category} Products` : 'Marketplace Catalog'}
          </h1>
          <p className="text-xs text-gray-500">Shop verified products with Flipkart-inspired pricing & ratings</p>
        </div>

        {search && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2874F0] border border-blue-200 rounded-lg text-xs font-bold">
            <span>Search: "{search}"</span>
            <button onClick={() => updateUrlParam('search', '')} className="hover:text-rose-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog Section (Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            brands={brandsList}
            selectedBrand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedRating={rating}
            inStock={inStock}
            featured={featured}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar (Mobile Filter Toggle, Product Count, Sort Dropdown) */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#2874F0]" />
                <span>Filters</span>
              </button>

              <span className="text-xs font-semibold text-gray-700">
                Showing <strong className="text-gray-900 font-extrabold">{pagination.total}</strong> products
                {isCategoryFilterActive && (
                  <span>
                    {' '}
                    in <strong className="text-[#2874F0] font-extrabold">{category}</strong>
                  </span>
                )}
              </span>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 hidden sm:inline uppercase tracking-wider">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => updateUrlParam('sort', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2874F0]"
              >
                <option value="newest">Relevance / Newest</option>
                <option value="price_asc">Price — Low to High</option>
                <option value="price_desc">Price — High to Low</option>
                <option value="rating">Rating — High to Low</option>
                <option value="popular">Popularity</option>
                <option value="discount">Discount Percentage</option>
              </select>
            </div>
          </div>

          {/* Product Grid / Skeleton / Error / Empty State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              title="Unable to load products"
              message={errorMessage || 'An error occurred while fetching products. Please try resetting your filters.'}
              buttonText="Reset Search & Filters"
              onReset={handleResetFilters}
            />
          ) : products.length === 0 ? (
            <EmptyState
              title={isCategoryFilterActive ? 'No products found in this category.' : 'Showing 0 Products'}
              message={
                isCategoryFilterActive
                  ? `We couldn't find any products matching "${category}". Try exploring all products or clearing active filters.`
                  : 'No items match your active search terms or filter constraints.'
              }
              buttonText={isCategoryFilterActive ? 'View All Products' : 'Reset Search & Filters'}
              onReset={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !isError && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => updateUrlParam('page', Math.max(1, page - 1))}
                className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pNum = index + 1;
                  const isCurrent = pNum === page;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateUrlParam('page', pNum)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-[#2874F0] text-white shadow-sm'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => updateUrlParam('page', Math.min(pagination.totalPages, page + 1))}
                className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto border-l border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-base">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <FilterSidebar
              brands={brandsList}
              selectedBrand={brand}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedRating={rating}
              inStock={inStock}
              featured={featured}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
