"use client";
import { products1 } from "@/data/products";
import { useContextElement } from "@/context/Context";
import React, { useState, useEffect } from "react";
import { ProductCard } from "../../shopCards/ProductCard";

export default function Products() {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { apiProducts, loading: apiLoading } = useContextElement();
  const [allproducts, setAllproducts] = useState([]);

  // Initialize products when API products are loaded
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      setAllproducts([...apiProducts.slice(0, 8)]); // Show first 8 API products
    } else {
      setAllproducts([...products1.slice(0, 8)]); // Fallback to static
    }
  }, [apiProducts]);

  const handleLoad = () => {
    setLoading(true);

    setTimeout(() => {
      const productsToAdd = apiProducts.length > 0 ? apiProducts : products1;
      setAllproducts((pre) => [...pre, ...productsToAdd.slice(8, 20)]); // Load next 12 products
      setLoading(false);
      setLoaded(true);
    }, 1000);
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
        {apiLoading && allproducts.length === 0 && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
            <p className="mt-2">Loading products from server...</p>
          </div>
        )}
        <div
          className="grid-layout wow fadeInUp"
          data-wow-delay="0s"
          data-grid="grid-4"
        >
          {allproducts.map((product, i) => (
            <ProductCard product={product} key={i} />
          ))}
        </div>
        {!loaded && (
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
