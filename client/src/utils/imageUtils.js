const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80';

/**
 * Get normalized, accessible product image URL
 * @param {string} url - Image path or URL
 * @param {string} fallback - Optional custom fallback URL
 * @returns {string} Fully qualified or relative image URL
 */
export const getImageUrl = (url, fallback = DEFAULT_FALLBACK_IMAGE) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const cleanUrl = url.trim();

  // Full URLs or Base64 Data URLs
  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('data:')
  ) {
    return cleanUrl;
  }

  // Uploaded backend files
  if (cleanUrl.startsWith('/uploads/')) {
    const backendOrigin = 'http://localhost:5000';
    return `${backendOrigin}${cleanUrl}`;
  }

  if (cleanUrl.startsWith('/')) {
    return cleanUrl;
  }

  return `http://localhost:5000/${cleanUrl}`;
};

export default getImageUrl;
