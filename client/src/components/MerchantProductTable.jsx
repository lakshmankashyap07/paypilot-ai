import React, { useState } from 'react';
import { InventoryStatusBadge } from './InventoryStatusBadge';
import { Edit2, Eye, Search, Plus, Trash2, Power, Package, CheckCircle2, AlertTriangle, XCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

export const MerchantProductTable = ({
  products = [],
  isLoading = false,
  onAddClick,
  onEditClick,
  onUpdateStock,
  onToggleStatus,
  onDeleteClick
}) => {
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockVal, setStockVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');

  const handleStockSave = (productId) => {
    if (onUpdateStock && stockVal !== '') {
      onUpdateStock(productId, stockVal);
    }
    setEditingStockId(null);
  };

  // Real KPI summary counts
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active !== false).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' || p.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && p.active !== false) ||
      (statusFilter === 'INACTIVE' && p.active === false);

    const matchesStock =
      stockFilter === 'ALL' ||
      (stockFilter === 'IN_STOCK' && p.stock > 0) ||
      (stockFilter === 'OUT_OF_STOCK' && p.stock === 0) ||
      (stockFilter === 'LOW_STOCK' && p.stock > 0 && p.stock <= 5);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  const categoriesList = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* 1. TOP SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Products</span>
            <Package className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalProducts}</div>
          <div className="text-[11px] text-gray-500 font-medium">Catalog items</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Active Listings</span>
            <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{activeProducts}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Live on marketplace</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Out of Stock</span>
            <XCircle className="w-4 h-4 text-[#D32F2F]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{outOfStockProducts}</div>
          <div className="text-[11px] text-[#D32F2F] font-medium">Requires replenishment</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{lowStockProducts}</div>
          <div className="text-[11px] text-amber-700 font-medium">5 or fewer items remaining</div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search products by name, SKU, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
          >
            <option value="ALL">All Stock</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

        </div>
      </div>

      {/* 3. PRODUCT TABLE / EMPTY STATE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          
          /* EMPTY STATE CARD */
          <div className="py-12 px-6 text-center space-y-4 max-w-sm mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874F0] border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
              <Package className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-gray-900">No products found</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {products.length === 0
                  ? 'Add your first product to start selling on PayPilot.'
                  : 'No products matched your search or filters.'}
              </p>
            </div>

            {products.length === 0 && (
              <button
                onClick={onAddClick}
                className="px-5 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-gray-700">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock Status</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const isEditingStock = editingStockId === p._id;

                  return (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      {/* Product Cell */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(p.thumbnail || p.images?.[0] || p.imageUrl || p.image)}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-200 p-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900 max-w-[200px] truncate">{p.name}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase">{p.brand || 'PayPilot'}</div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-3.5 font-mono font-semibold text-gray-600 text-[11px]">
                        {p.sku}
                      </td>

                      {/* Category */}
                      <td className="p-3.5 text-gray-800 font-medium">
                        {p.category}
                      </td>

                      {/* Price & Discount */}
                      <td className="p-3.5">
                        <div className="font-black text-gray-900">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        {p.originalPrice > p.price && (
                          <div className="text-[10px] text-gray-400 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                        {p.discount > 0 && (
                          <div className="text-[10px] text-[#00875A] font-bold">
                            {p.discount}% OFF
                          </div>
                        )}
                      </td>

                      {/* Stock Status with Inline Edit */}
                      <td className="p-3.5">
                        {isEditingStock ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={stockVal}
                              onChange={(e) => setStockVal(e.target.value)}
                              className="w-16 bg-white border border-[#2874F0] rounded px-2 py-1 text-xs text-gray-900 font-bold"
                            />
                            <button
                              onClick={() => handleStockSave(p._id)}
                              className="px-2 py-1 bg-[#2874F0] text-white font-bold rounded text-[10px]"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingStockId(p._id);
                              setStockVal(p.stock);
                            }}
                            className="cursor-pointer inline-block"
                            title="Click to update stock"
                          >
                            <InventoryStatusBadge stock={p.stock} />
                          </div>
                        )}
                      </td>

                      {/* Active Status Badge */}
                      <td className="p-3.5">
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(p._id, !p.active)}
                          className={`px-2.5 py-1 rounded text-[10px] font-black border transition-all cursor-pointer ${
                            p.active !== false
                              ? 'bg-emerald-50 text-[#00875A] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-[#D32F2F] border-rose-200 hover:bg-rose-100'
                          }`}
                          title={p.active !== false ? 'Click to deactivate' : 'Click to activate'}
                        >
                          {p.active !== false ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/product/${p.slug || p._id}`}
                            className="p-1.5 text-gray-500 hover:text-[#2874F0] rounded-lg transition-colors"
                            title="View Public Listing"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => onEditClick && onEditClick(p)}
                            className="p-1.5 text-gray-500 hover:text-[#2874F0] rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteClick && onDeleteClick(p._id)}
                            className="p-1.5 text-gray-500 hover:text-[#D32F2F] rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info bar */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px] flex justify-between items-center font-medium">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>PayPilot Merchant Catalog</span>
        </div>
      </div>

    </div>
  );
};

export default MerchantProductTable;
