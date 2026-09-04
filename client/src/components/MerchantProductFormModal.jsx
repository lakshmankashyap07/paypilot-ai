import React, { useState, useRef } from 'react';
import { X, Save, Loader2, Package, Tag, DollarSign, Image as ImageIcon, FileText, Upload, RefreshCw, Trash2, Link as LinkIcon, Sparkles, Bot } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import uploadService from '../services/uploadService';
import agenticCommerceService from '../services/agenticCommerceService';

const CATEGORIES = [
  'Electronics',
  'Laptops',
  'Smartphones',
  'Headphones',
  'Fashion',
  'Shoes',
  'Accessories',
  'Home',
  'Beauty',
  'Gaming'
];

export const MerchantProductFormModal = ({ initialProduct = null, onSubmit, onClose }) => {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [category, setCategory] = useState(initialProduct?.category || 'Electronics');
  const [subcategory, setSubcategory] = useState(initialProduct?.subcategory || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [price, setPrice] = useState(initialProduct?.price !== undefined ? initialProduct.price : '');
  const [originalPrice, setOriginalPrice] = useState(initialProduct?.originalPrice || '');
  const [stock, setStock] = useState(initialProduct?.stock !== undefined ? initialProduct.stock : 10);
  const [sku, setSku] = useState(initialProduct?.sku || '');
  
  // Image states
  const [imageUrl, setImageUrl] = useState(initialProduct?.thumbnail || initialProduct?.images?.[0] || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialProduct?.thumbnail || initialProduct?.images?.[0] || '');
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [active, setActive] = useState(initialProduct?.active !== undefined ? initialProduct.active : true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async () => {
    if (!name.trim() || !brand.trim() || !category) {
      showToast('Please enter Product Name, Brand, and Category first', 'error');
      return;
    }

    try {
      setIsGeneratingAI(true);
      const res = await agenticCommerceService.generateProductListing({
        name: name.trim(),
        brand: brand.trim(),
        category,
        subcategory: subcategory.trim()
      });

      if (res && res.description) {
        setDescription(res.description);
        if (!name.includes('|') && res.seoTitle) setName(res.seoTitle);
        showToast('Generated professional product listing with AI!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'AI listing generation failed', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // File Picker Selection & Validation
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('Only PNG, JPG, JPEG, and WEBP image files are allowed', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate File Size (Maximum 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast(`Image file size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum limit of 5MB`, 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    showToast('Image selected from gallery', 'success');
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !category || !brand.trim() || price === '' || stock === '') {
      showToast('Please complete all required product fields', 'error');
      return;
    }

    if (!initialProduct && !sku.trim()) {
      showToast('SKU is required for new products', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      let finalThumbnailUrl = imageUrl.trim();

      // Upload file to server if selected from gallery
      if (selectedFile) {
        setIsUploading(true);
        try {
          const uploadRes = await uploadService.uploadImage(selectedFile);
          finalThumbnailUrl = uploadRes.url;
        } catch (uploadErr) {
          showToast(uploadErr.message || 'Image upload failed. Please try again.', 'error');
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        subcategory: subcategory.trim(),
        brand: brand.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Number(price),
        stock: Number(stock),
        sku: sku.trim().toUpperCase(),
        thumbnail: finalThumbnailUrl,
        images: finalThumbnailUrl ? [finalThumbnailUrl] : [],
        featured,
        active
      };

      const success = await onSubmit(payload);
      if (success && onClose) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const isFormInvalid = !name.trim() || !description.trim() || !category || !brand.trim() || price === '' || stock === '' || (!initialProduct && !sku.trim());

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E0E6ED] p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in relative max-h-[90vh] overflow-y-auto text-xs text-[#172337]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#172337]">
                {initialProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-[#5F6B76] mt-0.5">
                {initialProduct ? `Update product details (SKU: ${initialProduct.sku})` : 'Publish a new item to your store catalog'}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: PRODUCT INFORMATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#172337] uppercase tracking-wider pb-1 border-b border-gray-100">
              <Tag className="w-3.5 h-3.5 text-[#2874F0]" />
              <span>Product Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sony, Apple, Samsung"
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0] transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Audio, Wireless"
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(initialProduct)}
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. AUD-SONY-001"
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors disabled:opacity-50 uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PRICING & INVENTORY */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#172337] uppercase tracking-wider pb-1 border-b border-gray-100">
              <DollarSign className="w-3.5 h-3.5 text-[#00875A]" />
              <span>Pricing & Inventory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1999"
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Original MRP (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 2999"
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUCT IMAGE MEDIA WITH GALLERY UPLOADER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#172337] uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Product Image Media</span>
              </div>
              <button
                type="button"
                onClick={() => setShowUrlFallback(!showUrlFallback)}
                className="text-[11px] font-bold text-[#2874F0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showUrlFallback ? 'Use Gallery Upload' : 'Or Paste Image URL'}</span>
              </button>
            </div>

            {/* Hidden Native File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!showUrlFallback ? (
              /* GALLERY DROPZONE & PREVIEW */
              <div className="bg-gray-50 border-2 border-dashed border-[#E0E6ED] hover:border-[#2874F0] rounded-xl p-5 transition-colors text-center space-y-3">
                {previewUrl ? (
                  /* PREVIEW CARD */
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-lg border border-[#E0E6ED]">
                    <div className="flex items-center gap-3">
                      <img
                        src={previewUrl}
                        alt="Product preview"
                        className="w-16 h-16 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1 flex-shrink-0"
                      />
                      <div className="text-left space-y-0.5">
                        <div className="font-bold text-gray-900 text-xs truncate max-w-[220px]">
                          {selectedFile ? selectedFile.name : 'Current Product Image'}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium">
                          {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Loaded Image'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Change image</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#D32F2F] font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* UPLOAD PROMPT CARD */
                  <div className="space-y-3 py-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2874F0] border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-black text-gray-900 text-xs">Upload product image</div>
                      <div className="text-[11px] text-gray-500 font-medium">PNG, JPG, WEBP up to 5MB</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose from Gallery</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* URL FALLBACK INPUT */
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Image URL (Optional Fallback)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors"
                />
              </div>
            )}
          </div>

          {/* SECTION 4: DESCRIPTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#172337] uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Description & Specifications</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI}
                className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-lg text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer transition-all disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Detailed Product Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of features, specs, and package contents..."
                className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg p-3 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] transition-colors"
              />
            </div>
          </div>

          {/* SECTION 5: STORE OPTIONS / LISTING STATUS CHECKBOXES */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-[#E0E6ED] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-800 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#2874F0] focus:ring-0 cursor-pointer"
              />
              <span>Active Listing (visible in customer store)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-800 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#2874F0] focus:ring-0 cursor-pointer"
              />
              <span>Featured Product (showcase on landing page)</span>
            </label>
          </div>

          {/* SECTION 6: FORM ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-extrabold rounded-lg text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isUploading || isFormInvalid}
              className="px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isUploading ? 'Uploading Image...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initialProduct ? 'Update Product' : 'Save Product'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default MerchantProductFormModal;
