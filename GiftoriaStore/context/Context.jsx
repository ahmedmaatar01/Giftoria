"use client";
// import { allProducts } from "@/data/products";
import { fetchProducts, products1 } from "@/data/products";
import { apiCall, API_CONFIG } from "@/utils/api";
import { openCartModal } from "@/utlis/openCartModal";
// import { openCart } from "@/utlis/toggleCart";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([1, 2, 3]);
  const [compareItem, setCompareItem] = useState([1, 2, 3]);
  // Initialize quickViewItem to undefined to avoid property errors
  const [quickViewItem, setQuickViewItem] = useState(undefined);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [apiProducts, setApiProducts] = useState([]); // Changed to empty array
  const [allProducts, setAllProducts] = useState([]); // allProducts always mirrors apiProducts
  // --- AUTH STATE ---
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // --- AUTH LOGIC ---
  // Load token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      if (savedToken && savedUser) {
        setAuthToken(savedToken);
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
    }
  }, []);

  // Check session on mount (validate token if exists)
  useEffect(() => {
    const checkSession = async () => {
      if (!authToken) return;
      
      setAuthLoading(true);
      setAuthError(null);
      try {
        const res = await apiCall('/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const userData = res.user || res;
        setUser(userData);
        // Update localStorage with fresh user data
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } catch (err) {
        console.log('[Auth] Session invalid, clearing auth state');
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setAuthLoading(false);
      }
    };
    checkSession();
  }, [authToken]);

  // Login
  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiCall('/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const userData = res.user || res;
      const token = res.token || res.access_token;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      setUser(userData);
      setAuthToken(token);
      
      // Save to localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      setUser(null);
      setAuthToken(null);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Register
  const register = async (first_name, last_name, email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiCall('/user/register', {
        method: 'POST',
        body: JSON.stringify({ first_name, last_name, email, password }),
      });
      const userData = res.user || res;
      const token = res.token || res.access_token;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      setUser(userData);
      setAuthToken(token);
      
      // Save to localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      setUser(null);
      setAuthToken(null);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authToken) {
        await apiCall('/user/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
      }
      
      // Clear state and localStorage
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      return { success: true };
    } catch (err) {
      setAuthError(err.message || 'Logout failed');
      // Clear anyway even if API call fails
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);

  // Load products from API
  useEffect(() => {
    const loadApiProducts = async () => {
      try {
        setLoading(true);
        console.log('[Context] Fetching products from API...');
        const products = await fetchProducts();
        console.log('[Context] API products loaded:', Array.isArray(products) ? products.length : products);
        setApiProducts(products);
      } catch (error) {
        console.error('[Context] Error loading API products:', error);
        setApiProducts(products1); // Fallback to static
      } finally {
        setLoading(false);
        console.log('[Context] Loading state set to false');
      }
    };

    loadApiProducts();
  }, []);
  
  // Keep allProducts always in sync with apiProducts and set quickViewItem
  useEffect(() => {
    console.log('[Context] Sync allProducts with apiProducts. Count:', Array.isArray(apiProducts) ? apiProducts.length : 0);
    setAllProducts(apiProducts);
    if (apiProducts && apiProducts.length > 0) {
      console.log('[Context] quickViewItem set to first API product id:', apiProducts[0]?.id);
      setQuickViewItem(apiProducts[0]);
    } else {
      console.log('[Context] quickViewItem cleared (no API products)');
      setQuickViewItem(undefined);
    }
  }, [apiProducts]);

  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  // Accept customFieldValues in addProductToCart
  const addProductToCart = (id, qty, customFieldValues = {}) => {
    console.log('[Context] addProductToCart called:', { id, qty, customFieldValues });
    // Use apiProducts instead of allProducts
      const allAvailableProducts = allProducts; // Use allProducts (which mirrors apiProducts)
    console.log('[Context] allAvailableProducts count:', Array.isArray(allAvailableProducts) ? allAvailableProducts.length : 0);
    const existing = cartProducts.find((elm) => elm.id == id);
    if (!existing) {
      const base = allAvailableProducts.find((elm) => elm.id == id);
      if (!base) {
        console.warn('[Context] Base product not found for id:', id);
        return; // safety guard
      }
      const item = {
        ...base,
        quantity: qty ? qty : 1,
        customFieldValues: { ...customFieldValues }, // Store custom fields in cart item
      };
      console.log('[Context] Adding new cart item:', { id: item.id, quantity: item.quantity, customFieldValues: item.customFieldValues });
      setCartProducts((pre) => [...pre, item]);
      openCartModal();
      return;
    }

    // If already in cart, update its custom fields and quantity
    const items = [...cartProducts];
    const idx = items.indexOf(existing);
    const updated = {
      ...existing,
      customFieldValues: { ...customFieldValues },
      quantity: (existing.quantity || 1) + (qty ? qty : 1),
    };
    items[idx] = updated;
    console.log('[Context] Updating existing cart item:', { id: updated.id, quantity: updated.quantity, customFieldValues: updated.customFieldValues });
    setCartProducts(items);
    openCartModal();
  };
  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const updateQuantity = (id, qty) => {
    if (isAddedToCartProducts(id)) {
      let item = cartProducts.filter((elm) => elm.id == id)[0];
      let items = [...cartProducts];
      const itemIndex = items.indexOf(item);

      item.quantity = qty / 1;
      items[itemIndex] = item;
      setCartProducts(items);

      openCartModal();
    } else {
      addProductToCart(id, qty);
    }
  };
  const addToWishlist = (id) => {
    if (!wishList.includes(id)) {
      setWishList((pre) => [...pre, id]);
    } else {
      setWishList((pre) => [...pre].filter((elm) => elm != id));
    }
  };
  const removeFromWishlist = (id) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  const removeFromCompareItem = (id) => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const isAddedtoWishlist = (id) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  const isAddedtoCompareItem = (id) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
  apiProducts, // Add API products to context
  loading, // Add loading state
  // --- AUTH ---
  user,
  setUser,
  authLoading,
  authError,
  login,
  register,
  logout,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
