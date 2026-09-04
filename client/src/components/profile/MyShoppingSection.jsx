import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, ShoppingBag, RotateCcw, Eye, ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { useCart } from '../../hooks/useCart';

export const MyShoppingSection = ({ orders = [], wishlistCount = 0, cartCount = 0 }) => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = React.useState({});

  // Extract previously purchased products from orders
  const previousProducts = React.useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const prod = item.product;
        if (prod && prod._id && !map.has(prod._id)) {
          map.set(prod._id, {
            ...prod,
            price: item.price || prod.price,
            orderDate: order.createdAt
          });
        }
      });
    });
    return Array.from(map.values()).slice(0, 4);
  }, [orders]);

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
    setAddedItems((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">My Shopping Hub</h2>
          <p className="text-xs text-gray-500">Orders, wishlist, and quick re-ordering</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-black bg-blue-50 text-[#2874F0] border border-blue-100 rounded-full">
          SHOPPING INTELLIGENCE
        </span>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        {/* My Orders Tile */}
        <Link
          to="/orders"
          className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 hover:border-blue-300 hover:shadow-xs transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-blue-700">
            <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-sm">My Orders</div>
            <div className="text-[11px] text-gray-500 font-medium">{orders.length} total orders</div>
          </div>
        </Link>

        {/* Wishlist Tile */}
        <Link
          to="/wishlist"
          className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 hover:border-rose-300 hover:shadow-xs transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-rose-700">
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-sm">Wishlist</div>
            <div className="text-[11px] text-gray-500 font-medium">{wishlistCount} saved items</div>
          </div>
        </Link>

        {/* Cart Tile */}
        <Link
          to="/cart"
          className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:border-emerald-300 hover:shadow-xs transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-sm">Shopping Cart</div>
            <div className="text-[11px] text-gray-500 font-medium">{cartCount} items in cart</div>
          </div>
        </Link>

        {/* AI Preferences Tile */}
        <Link
          to="/profile/preferences"
          className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 hover:border-purple-300 hover:shadow-xs transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-purple-700">
            <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-sm">AI Preferences</div>
            <div className="text-[11px] text-gray-500 font-medium">Personalized feed</div>
          </div>
        </Link>

      </div>

      {/* Buy Again Section */}
      {previousProducts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#2874F0]" />
              <span>Buy Again — Quick Reorder</span>
            </div>
            <Link to="/orders" className="text-[11px] font-bold text-[#2874F0] hover:underline">
              View All Past Orders →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {previousProducts.map((prod) => (
              <div key={prod._id} className="p-3 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2 flex flex-col justify-between hover:bg-white hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(prod.thumbnail || prod.images?.[0] || prod.imageUrl)}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-200 p-1 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <Link to={`/product/${prod.slug || prod._id}`} className="font-bold text-xs text-gray-900 line-clamp-1 hover:text-[#2874F0]">
                      {prod.name}
                    </Link>
                    <div className="text-[11px] font-black text-gray-900">
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(prod._id)}
                  className={`w-full py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    addedItems[prod._id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#2874F0] hover:bg-blue-700 text-white shadow-2xs'
                  }`}
                >
                  {addedItems[prod._id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Reorder Item</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default MyShoppingSection;
