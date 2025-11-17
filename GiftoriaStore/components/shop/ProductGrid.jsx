"use client";
import React, { useState, useEffect } from "react";
import { ProductCard } from "../shopCards/ProductCard";
import Productcard23 from "../shopCards/Productcard23";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";

export default function ProductGrid({
  gridItems = 4,
  allproducts,
}) {
  const { t } = useTranslation();
  const { apiProducts, loading: apiLoading } = useContextElement();
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    // Prefer explicitly provided products from props; fall back to context apiProducts
    const source = typeof allproducts !== 'undefined' ? allproducts : apiProducts;
    const count = Array.isArray(source) ? source.length : 0;
    console.log('[ProductGrid] Source chosen:', typeof allproducts !== 'undefined' ? 'props.allproducts' : 'context.apiProducts', 'count:', count);
    if (Array.isArray(source) && source.length > 0) {
      setDisplayProducts(source);
    } else {
      setDisplayProducts([]);
    }
  }, [allproducts, apiProducts]);

  if (apiLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('shop.loading_products')}</span>
        </div>
        <p className="mt-2">{t('shop.loading_from_server')}</p>
      </div>
    );
  }

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning">
          <h5>{t('shop.no_products_title')}</h5>
          <p>{t('shop.no_products_message')}</p>
        </div>
      </div>
    );
  }

  return (
    console.log('[ProductGrid] Rendering products count:', displayProducts?.length, 'gridItems:', gridItems),
    <>
      {/* Product count sentence removed to avoid duplicate display; now only shown in sidebar */}
      {gridItems == 1 ? (
        <div className="grid-layout" data-grid="grid-list">
          {/* card product 1 */}
          {displayProducts.map((elm, i) => (
            <Productcard23 product={elm} key={i} />
          ))}
          {/* card product 2 */}
        </div>
      ) : (
        <div
          className="grid-layout wrapper-shop"
          data-grid={`grid-${gridItems}`}
        >
          {/* card product 1 */}
          {displayProducts.map((elm, i) => (
            
            <ProductCard product={elm} key={i} />
          ))}
        </div>
      )}
    </>
  );
}
