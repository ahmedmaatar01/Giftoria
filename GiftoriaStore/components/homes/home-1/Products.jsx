"use client";
import { useContextElement } from "@/context/Context";
import React, { useState, useEffect } from "react";
import { ProductCard } from "../../shopCards/ProductCard";

export default function Products() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { apiProducts, loading: apiLoading } = useContextElement();
  const [allproducts, setAllproducts] = useState([]);

  // Only use API products, no fallback to static
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      setAllproducts([...apiProducts.slice(0, 8)]); // Show first 8 API products only
    }
  }, [apiProducts]);

  const handleLoad = () => {
    if (apiProducts && apiProducts.length > allproducts.length) {
      setLoading(true);

      setTimeout(() => {
        const currentLength = allproducts.length;
        const nextProducts = apiProducts.slice(currentLength, currentLength + 12);
        setAllproducts((pre) => [...pre, ...nextProducts]);
        setLoading(false);
        setLoaded(currentLength + nextProducts.length >= apiProducts.length);
      }, 1000);
    }
  };

  return (
    <section className="flat-spacing-5 pt_0 flat-seller">
      <div className="container">
        <div className="flat-title">
          <span className="title wow fadeInUp" data-wow-delay="0s">
            <span className="banner-title-montserrat">Best Seller</span>
          </span>
          <p className="sub-title wow fadeInUp" data-wow-delay="0s">
            Shop the Latest Styles: Stay ahead of the curve with our newest
            arrivals
          </p>
        </div>
        {/* Show loading indicator when fetching API products */}
        {apiLoading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
            <p className="mt-2">Loading products from server...</p>
          </div>
        )}
        
        {/* Show message when no API products available */}
        {!apiLoading && (!apiProducts || apiProducts.length === 0) && (
          <div className="text-center py-5">
            <div className="alert alert-info">
              <h5>No Products Available</h5>
              <p>Please make sure your backend API is running at <code>http://localhost:8000/api</code></p>
              <p>Or add some products through your admin dashboard.</p>
            </div>
          </div>
        )}
        
        {/* Show products grid only when we have API products */}
        {allproducts.length > 0 && (
          <div
            className="grid-layout wow fadeInUp"
            data-wow-delay="0s"
            data-grid="grid-4"
          >
            {allproducts.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
        )}
        
        {/* Load more button - only show if there are more API products to load */}
        {allproducts.length > 0 && !loaded && apiProducts && allproducts.length < apiProducts.length && (
          <div className="tf-pagination-wrap view-more-button text-center">
            <button
              className={`tf-btn-loading tf-loading-default style-2 btn-loadmore ${
                loading ? "loading" : ""
              } `}
              onClick={() => handleLoad()}
            >
              <span className="text">Load more</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
