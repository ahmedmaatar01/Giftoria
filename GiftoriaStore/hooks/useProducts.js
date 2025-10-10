"use client";
import { useState, useEffect } from 'react';
import { fetchProducts, products1 } from '@/data/products';

export const useProducts = () => {
  const [products, setProducts] = useState(products1.slice(0, 8)); // Show first 8 static products initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const apiProducts = await fetchProducts();
        setProducts(apiProducts);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message);
        // Keep static products as fallback
        setProducts(products1);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};

export default useProducts;