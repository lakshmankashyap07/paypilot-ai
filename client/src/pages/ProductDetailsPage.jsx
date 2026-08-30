import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { ProductDetailsSkeleton } from '../components/Skeletons';
import { ProductCard } from '../components/ProductCard';
import { ReviewForm } from '../components/ReviewForm';
import { WishlistButton } from '../components/WishlistButton';
import { getImageUrl } from '../utils/imageUtils';
import {
  Star,
  ShoppingBag,
  Zap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Edit,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  Tag
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, relatedProducts, isLoading, isError, errorMessage } = useProduct(id);
  const { reviews, addReview, editReview, removeReview } = useReviews(product?._id);
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          {errorMessage || 'The product you are looking for does not exist or has been removed.'}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-xl text-sm"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const {
    _id,
    name,
    brand,
    category,
    price,
    originalPrice,
    discount,
    rating = 0,
    reviewCount = 0,
    stock = 0,
    description,
    specifications = {},
    images = [],
    thumbnail,
    imageUrl,
    image
  } = product;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(originalPrice)
    : null;

  const rawPrimaryImage = thumbnail || (images && images[0]) || imageUrl || image;
  const rawImageList = (images && images.length > 0) ? images : (rawPrimaryImage ? [rawPrimaryImage] : []);
  const allImages = rawImageList.map((img) => getImageUrl(img));
  const currentImage = imageError || allImages.length === 0 ? getImageUrl(rawPrimaryImage) : (allImages[selectedImageIndex] || getImageUrl(rawPrimaryImage));

  const inStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleAddToCart = async () => {
    if (!inStock || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      await addToCart(_id, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!inStock) return;
    const success = await addToCart(_id, quantity);
    if (success) {
      navigate('/cart');
    }
  };

  const userReview = isAuthenticated
    ? reviews.find((r) => r.user?._id === user?.id || r.user?._id === user?._id)
    : null;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating] += 1;
    }
  });

  const handleReviewSubmit = async (reviewData) => {
    if (userReview) {
      await editReview(userReview._id, reviewData);
    } else {
      await addReview(reviewData);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await removeReview(reviewId);
      showToast('Review deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <Link to="/" className="hover:text-[#2874F0]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/shop" className="hover:text-[#2874F0]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to={`/shop?category=${encodeURIComponent(category)}`} className="hover:text-[#2874F0]">
          {category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold truncate max-w-[200px]">{name}</span>
      </nav>

      {/* 2. Main Product Details Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Gallery */}
        <div className="space-y-4 sticky top-24">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 aspect-[4/3] overflow-hidden flex items-center justify-center relative">
            <img
              src={currentImage}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-extrabold bg-[#388E3C] text-white rounded shadow-sm">
                {discount}% OFF
              </span>
            )}
            <div className="absolute top-3 right-3 z-10">
              <WishlistButton productId={_id} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-gray-600 hover:text-rose-500" iconSize="w-5 h-5" />
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setImageError(false);
                  }}
                  className={`w-16 h-16 rounded-lg bg-gray-50 border p-1 overflow-hidden transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#2874F0] ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-gray-300 opacity-70'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Information */}
        <div className="space-y-5 text-xs text-[#212121]">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Brand: {brand || 'PayPilot'}
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded border ${
                  inStock
                    ? isLowStock
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {inStock ? (
                  isLowStock ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Only {stock} left!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      In Stock
                    </>
                  )
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Out of Stock
                  </>
                )}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">{name}</h1>

            {/* Rating badge */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#388E3C] text-white font-bold text-xs">
                <span>{rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {reviewCount} Ratings & Reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">{formattedPrice}</span>
              {formattedOriginalPrice && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  {formattedOriginalPrice}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-[#008C45]">
                  {discount}% off
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 font-medium">Inclusive of all taxes. Free Delivery available.</p>
          </div>

          {/* Bank Offers List */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h4 className="font-bold text-gray-800 text-xs flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#2874F0]" />
              <span>Available Offers & Promotions</span>
            </h4>
            <ul className="space-y-1 text-[11px] text-gray-600">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-[#008C45]">Bank Offer:</span> 5% Unlimited Cashback on PayPilot Credit Card.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-[#008C45]">Special Price:</span> Get extra ₹2,000 off on exchange offer.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-[#008C45]">Razorpay Sandbox:</span> 100% Verified Instant Test Mode Payments.
              </li>
            </ul>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            {inStock && (
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-1 text-gray-700 hover:text-black disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-gray-900 text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="p-1 text-gray-700 hover:text-black disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-[#2874F0] font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 border border-blue-200 transition-all disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAddingToCart ? 'Adding...' : 'ADD TO CART'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="py-3 px-4 bg-[#FF9F00] hover:bg-amber-600 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40"
              >
                <Zap className="w-4 h-4" />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>

          {/* Delivery & Warranty Info */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-[11px] text-gray-600 text-center">
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#2874F0]" />
              <span className="font-semibold">Free Delivery</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#2874F0]" />
              <span className="font-semibold">7 Days Replacement</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#008C45]" />
              <span className="font-semibold">Brand Warranty</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-3 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Description</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Specifications */}
          {specifications && Object.keys(specifications).length > 0 && (
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Specifications</h3>
              <div className="rounded-xl border border-gray-200 overflow-hidden text-xs">
                {Object.entries(specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`flex justify-between p-2.5 ${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <span className="font-bold text-gray-500">{key}</span>
                    <span className="font-medium text-gray-800 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Similar Products</h2>
            <Link to={`/shop?category=${encodeURIComponent(category)}`} className="text-xs font-bold text-[#2874F0] hover:underline">
              View All in {category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Customer Reviews Section */}
      <div id="reviews-section" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#2874F0]" />
              Ratings & Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-gray-500">Verified purchaser feedback</p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2 bg-[#2874F0] text-white font-bold rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{userReview ? 'Edit Review' : 'Rate Product'}</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-gray-100 text-[#2874F0] font-bold rounded-lg text-xs hover:bg-gray-200"
            >
              Sign in to review
            </Link>
          )}
        </div>

        {/* Rating Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div className="text-center space-y-1">
            <div className="text-4xl font-black text-gray-900">{rating.toFixed(1)} ★</div>
            <div className="text-xs text-gray-500">{reviewCount} total customer ratings</div>
          </div>

          <div className="md:col-span-2 space-y-1.5 text-xs">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = ratingCounts[starNum] || 0;
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={starNum} className="flex items-center gap-2">
                  <span className="w-10 text-gray-600 font-bold flex items-center gap-1">
                    {starNum} ★
                  </span>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#388E3C] rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right text-gray-500">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-xs border border-gray-200 rounded-xl">
              No customer reviews yet. Be the first to rate this product!
            </div>
          ) : (
            reviews.map((rev) => {
              const isOwnReview = user && (rev.user?._id === user?.id || rev.user?._id === user?._id);
              return (
                <div
                  key={rev._id}
                  className={`p-4 rounded-xl border space-y-2 text-xs ${
                    isOwnReview ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50/50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-[#388E3C] text-white font-bold text-[10px] rounded">
                        {rev.rating} ★
                      </span>
                      <span className="font-bold text-gray-900">{rev.title}</span>
                    </div>
                    {(isOwnReview || user?.role === 'ADMIN') && (
                      <button
                        onClick={() => handleReviewDelete(rev._id)}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{rev.comment}</p>
                  <div className="text-[10px] text-gray-400 font-medium">
                    By {rev.user?.name || 'Customer'} on {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {reviewModalOpen && (
        <ReviewForm
          existingReview={userReview}
          onSubmit={handleReviewSubmit}
          onClose={() => setReviewModalOpen(false)}
        />
      )}

    </div>
  );
};

export default ProductDetailsPage;
