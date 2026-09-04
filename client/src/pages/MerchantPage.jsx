import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import merchantService from '../services/merchantService';
import { useToast } from '../context/ToastContext';
import { DashboardStatCard } from '../components/DashboardStatCard';
import { MerchantProductTable } from '../components/MerchantProductTable';
import { MerchantOrderTable } from '../components/MerchantOrderTable';
import { MerchantProductFormModal } from '../components/MerchantProductFormModal';
import { MerchantAnalyticsTab } from '../components/MerchantAnalyticsTab';
import { MerchantCopilotWidget } from '../components/MerchantCopilotWidget';
import { InventoryStatusBadge } from '../components/InventoryStatusBadge';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Bot,
  Megaphone,
  X,
  Store,
  Plus
} from 'lucide-react';

export const MerchantPage = ({ defaultTab = 'dashboard' }) => {
  const location = useLocation();
  const { showToast } = useToast();

  // Derive active tab from URL path if available
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/products')) return 'products';
    if (path.includes('/orders')) return 'orders';
    return defaultTab;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, defaultTab]);

  // Dashboard Stats State
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Fetch Dashboard Analytics
  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const res = await merchantService.getDashboard();
      if (res && res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Failed to load merchant dashboard stats:', err.message);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Fetch Merchant Products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await merchantService.getProducts({ search: productSearch, limit: 20 });
      if (res && res.success && res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.warn('Failed to load merchant products:', err.message);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [productSearch]);

  // Fetch Merchant Orders
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await merchantService.getOrders({ status: orderStatusFilter, limit: 20 });
      if (res && res.success && res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.warn('Failed to load merchant orders:', err.message);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [orderStatusFilter]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, fetchProducts, fetchOrders]);

  // Product CRUD Handlers
  const handleCreateOrUpdateProduct = async (productData) => {
    try {
      if (editingProduct) {
        await merchantService.updateProduct(editingProduct._id, productData);
        showToast('Product updated successfully!', 'success');
      } else {
        await merchantService.createProduct(productData);
        showToast('Product created successfully!', 'success');
      }
      fetchProducts();
      fetchDashboard();
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
      return false;
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await merchantService.updateStock(productId, newStock);
      showToast('Stock updated successfully', 'success');
      fetchProducts();
      fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  const handleToggleStatus = async (productId, active) => {
    try {
      await merchantService.updateStatus(productId, active);
      showToast(active ? 'Product activated' : 'Product deactivated', 'info');
      fetchProducts();
      fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await merchantService.deleteProduct(productId);
      showToast('Product deleted', 'info');
      fetchProducts();
      fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await merchantService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchOrders();
      fetchDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#172337]">
            {activeTab === 'analytics' && 'Sales & Analytics'}
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'products' && 'Products & Catalog'}
            {activeTab === 'orders' && 'Customer Orders'}
          </h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            {activeTab === 'analytics' && 'Track your store revenue velocity, orders, and sales performance.'}
            {activeTab === 'dashboard' && 'Monitor your marketplace store performance at a glance.'}
            {activeTab === 'products' && 'Manage your marketplace product listings, pricing, and stock inventory.'}
            {activeTab === 'orders' && 'Manage and track customer order fulfillment.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'products' && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductFormOpen(true);
              }}
              className="px-4 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}

          <Link
            to="/merchant/ai"
            className="px-4 py-2 bg-[#172337] hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-[#FFCA28]" />
            <span>Launch AI Copilot</span>
          </Link>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'analytics' && <MerchantAnalyticsTab />}

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard
              title="Total Revenue"
              value={formatCurrency(stats?.orderValue?.grossOrderValue)}
              subtitle="Net captured revenue"
              icon={TrendingUp}
              color="blue"
            />

            <DashboardStatCard
              title="Total Orders"
              value={stats?.orders?.total || 0}
              subtitle={`Avg Value: ${formatCurrency(stats?.orderValue?.averageOrderValue)}`}
              icon={ShoppingBag}
              color="indigo"
            />

            <DashboardStatCard
              title="Total Products"
              value={stats?.products?.total || 0}
              subtitle={`${stats?.products?.active || 0} Active in Store`}
              icon={Package}
              color="emerald"
            />

            <DashboardStatCard
              title="Average Order Value"
              value={formatCurrency(stats?.orderValue?.averageOrderValue)}
              subtitle="Per completed order"
              icon={DollarSign}
              color="amber"
            />
          </div>

          {/* AI MERCHANT COPILOT WIDGET */}
          <MerchantCopilotWidget />

          {/* Low Stock Inventory Risk Alert */}
          {stats?.inventory?.lowStockProducts?.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#D32F2F] font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Low Inventory Alerts ({stats.inventory.lowStockProducts.length})</span>
                </div>
                <Link
                  to="/merchant/products"
                  className="text-xs text-[#2874F0] font-bold hover:underline"
                >
                  Manage Inventory →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.inventory.lowStockProducts.map((p) => (
                  <div
                    key={p._id}
                    className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-gray-900 text-xs truncate max-w-[160px]">{p.name}</div>
                      <div className="text-[10px] text-gray-500">SKU: {p.sku}</div>
                    </div>
                    <InventoryStatusBadge stock={p.stock} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs">
          <MerchantProductTable
            products={products}
            isLoading={isLoadingProducts}
            onAddClick={() => {
              setEditingProduct(null);
              setProductFormOpen(true);
            }}
            onEditClick={(prod) => {
              setEditingProduct(prod);
              setProductFormOpen(true);
            }}
            onUpdateStock={handleUpdateStock}
            onToggleStatus={handleToggleStatus}
            onDeleteClick={handleDeleteProduct}
          />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs">
          <MerchantOrderTable
            orders={orders}
            isLoading={isLoadingOrders}
            onUpdateStatus={handleUpdateOrderStatus}
            onViewDetails={(ord) => setSelectedOrderDetails(ord)}
          />
        </div>
      )}

      {/* Product Form Modal */}
      {productFormOpen && (
        <MerchantProductFormModal
          initialProduct={editingProduct}
          onSubmit={handleCreateOrUpdateProduct}
          onClose={() => setProductFormOpen(false)}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E0E6ED] p-6 space-y-4 shadow-xl relative max-h-[90vh] overflow-y-auto text-xs text-[#172337]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-black text-gray-900 text-base">
                  Order Details: #{selectedOrderDetails.orderNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">Items in Order</h4>
              {selectedOrderDetails.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                  <span className="font-bold text-gray-800">{item.productName} (x{item.quantity})</span>
                  <span className="font-extrabold text-gray-900">₹{item.subtotal}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">Shipping Address</h4>
                <p className="font-bold text-gray-900">{selectedOrderDetails.shippingAddress?.fullName}</p>
                <p className="text-gray-600">{selectedOrderDetails.shippingAddress?.addressLine1}, {selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state}</p>
                <p className="text-gray-500">Phone: {selectedOrderDetails.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-gray-100 text-gray-800 font-bold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MerchantPage;
