import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Package, Search, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const AdminProductsPage = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getProducts({ search: searchTerm });
      if (res?.success && res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleToggleStatus = async (id, currentActive) => {
    try {
      await adminService.updateProductStatus(id, !currentActive);
      showToast(`Product status updated to ${!currentActive ? 'Active' : 'Inactive'}`, 'info');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to update product status', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    return categoryFilter === 'ALL' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  const categoriesList = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const totalCount = products.length;
  const activeCount = products.filter((p) => p.active !== false).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">Product Management</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Monitor marketplace product listings, catalog inventory, and content moderation controls.
          </p>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total Products</span>
            <Package className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">Marketplace catalog</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Active Listings</span>
            <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{activeCount}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Live in store</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Out of Stock</span>
            <XCircle className="w-4 h-4 text-[#D32F2F]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{outOfStockCount}</div>
          <div className="text-[11px] text-[#D32F2F] font-medium">0 inventory left</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Low Stock Risks</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{lowStockCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">5 or fewer items remaining</div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, SKU, brand..."
            className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
        >
          <option value="ALL">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No products found matching current search query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2.5">
                      <img
                        src={p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=100&q=80'}
                        alt={p.name}
                        className="w-9 h-9 rounded object-contain bg-white border border-gray-200 p-0.5 flex-shrink-0"
                      />
                      <div>
                        <div className="max-w-[220px] truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">SKU: {p.sku}</div>
                      </div>
                    </td>

                    <td className="p-3.5 font-medium text-gray-700">{p.category}</td>

                    <td className="p-3.5 font-black text-gray-900">₹{p.price?.toLocaleString('en-IN')}</td>

                    <td className="p-3.5 font-bold text-gray-800">{p.stock} units</td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded border ${
                        p.active !== false
                          ? 'bg-emerald-50 text-[#00875A] border-emerald-200'
                          : 'bg-rose-50 text-[#D32F2F] border-rose-200'
                      }`}>
                        {p.active !== false ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleStatus(p._id, p.active !== false)}
                        className={`px-3 py-1 font-bold rounded text-[11px] transition-all cursor-pointer ${
                          p.active !== false
                            ? 'bg-rose-50 text-[#D32F2F] hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-[#00875A] hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {p.active !== false ? 'Soft Delete' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px] flex justify-between items-center font-medium">
          <span>Showing {filteredProducts.length} products</span>
          <span>PayPilot Product Moderation</span>
        </div>
      </div>

    </div>
  );
};

export default AdminProductsPage;
