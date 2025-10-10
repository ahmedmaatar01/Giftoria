// API utility functions for GiftoriaStore

// Base API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Generic API call function with error handling
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Specific API functions
export const productsAPI = {
  // Get all products
  getAll: () => apiCall('/products'),
  
  // Get product by ID
  getById: (id) => apiCall(`/products/${id}`),
  
  // Get products by category
  getByCategory: (categoryId) => apiCall(`/products?category_id=${categoryId}`),
  
  // Search products
  search: (query) => apiCall(`/products?search=${encodeURIComponent(query)}`),
};

export const categoriesAPI = {
  // Get all categories
  getAll: () => apiCall('/categories'),
  
  // Get category by ID
  getById: (id) => apiCall(`/categories/${id}`),
};

// Product mapping utility
export const mapBackendProduct = (backendProduct) => {
  const featuredImage = backendProduct.images?.find(img => img.is_featured);
  const otherImages = backendProduct.images?.filter(img => !img.is_featured) || [];
  
  return {
    id: backendProduct.id,
    imgSrc: featuredImage 
      ? `${API_CONFIG.BASE_URL.replace('/api', '')}${featuredImage.image_path}` 
      : "/images/products/placeholder.jpg",
    imgHoverSrc: otherImages.length > 0 
      ? `${API_CONFIG.BASE_URL.replace('/api', '')}${otherImages[0].image_path}` 
      : "/images/products/placeholder.jpg",
    title: backendProduct.name,
    price: parseFloat(backendProduct.price),
    originalPrice: backendProduct.original_price ? parseFloat(backendProduct.original_price) : null,
    colors: backendProduct.images?.map((img, index) => ({
      name: `Color ${index + 1}`,
      colorClass: `bg_color-${index + 1}`,
      imgSrc: `${API_CONFIG.BASE_URL.replace('/api', '')}${img.image_path}`,
    })) || [],
    sizes: ["S", "M", "L", "XL"], // Default sizes - you can add this to your backend model
    filterCategories: backendProduct.category ? [backendProduct.category.name] : [],
    brand: "Giftoria", // Default brand - you can add this to your backend model
    isAvailable: backendProduct.stock > 0,
    stock: backendProduct.stock,
    description: backendProduct.description,
    category: backendProduct.category?.name || "Uncategorized",
    categoryId: backendProduct.category?.id,
    images: backendProduct.images?.map(img => ({
      ...img,
      fullPath: `${API_CONFIG.BASE_URL.replace('/api', '')}${img.image_path}`
    })) || [],
    // Additional fields for e-commerce
    discount: backendProduct.discount_percentage || 0,
    isOnSale: backendProduct.is_on_sale || false,
    isFeatured: backendProduct.is_featured || false,
    rating: backendProduct.rating || 4.5, // Default rating
    reviewCount: backendProduct.review_count || 0,
    createdAt: backendProduct.created_at,
    updatedAt: backendProduct.updated_at,
  };
};

export default {
  apiCall,
  productsAPI,
  categoriesAPI,
  mapBackendProduct,
  API_CONFIG,
};