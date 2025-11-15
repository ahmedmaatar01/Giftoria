"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DetailsOuterZoom from "./DetailsOuterZoom";
import ProductDetailLoading from "./ProductDetailLoading";
  import { API_BASE_URL_WITH_API } from '../../utils/config';

export default function ProductDetailClient({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL_WITH_API}/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);
    
  if (loading) {
    return <ProductDetailLoading />;
  }

  if (error || !product) {
    return (
      <section className="flat-spacing-4 pt_0">
        <div className="container">
          <div className="text-center py-5">
            <h2>Product Not Found</h2>
            <p>{error || 'The product you\'re looking for doesn\'t exist.'}</p>
            <a href="/" className="tf-btn btn-fill">Go Home</a>
          </div>
        </div>
      </section>
    );
  }

  return <DetailsOuterZoom product={product} />;
}