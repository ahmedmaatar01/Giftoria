"use client";
// import { allProducts } from "@/data/products";
import { fetchProducts, products1 } from "@/data/products";
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
  const [loading, setLoading] = useState(false);

  // Load products from API
  useEffect(() => {
    const loadApiProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        setApiProducts(products);
      } catch (error) {
        console.error('Error loading API products:', error);
        setApiProducts(products1); // Fallback to static
      } finally {
        setLoading(false);
      }
    };

    loadApiProducts();
  }, []);
  
  // Keep allProducts always in sync with apiProducts and set quickViewItem
  useEffect(() => {
    setAllProducts(apiProducts);
    if (apiProducts && apiProducts.length > 0) {
      setQuickViewItem(apiProducts[0]);
    } else {
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
    // Use apiProducts instead of allProducts
      const allAvailableProducts = allProducts; // Use allProducts (which mirrors apiProducts)
    const existing = cartProducts.find((elm) => elm.id == id);
    if (!existing) {
      const base = allAvailableProducts.find((elm) => elm.id == id);
      if (!base) return; // safety guard
      const item = {
        ...base,
        quantity: qty ? qty : 1,
        customFieldValues: { ...customFieldValues }, // Store custom fields in cart item
      };
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
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
