"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { tfLoopItems } from "@/data/products";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";
export default function SearchModal() {
  const { apiProducts } = useContextElement();
  const { t, i18n } = useTranslation();
  // Helper to get 3 random products
  function getRandomProducts(arr, n) {
    if (!arr || arr.length === 0) return [];
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false);

  // Filter products from API
  const filteredProducts = useMemo(() => {
    if (search.length < 2) return [];
    const s = search.toLowerCase();
    return apiProducts.filter(
      (p) =>
        (p.title || p.name || "").toLowerCase().includes(s) ||
        (p.arabic_name || p.name_ar || "").toLowerCase().includes(s)
    );
  }, [search, apiProducts]);

  const showResults = search.length >= 2 && filteredProducts.length > 0;
  const showNoResults = search.length >= 2 && filteredProducts.length === 0;
  const inspirationProducts = getRandomProducts(apiProducts, 3);

  return (
    <div className="offcanvas offcanvas-end canvas-search" id="canvasSearch">
      <div className="canvas-wrapper">
        <header className="tf-search-head">
          <div className="title fw-5">
            {t("search_title")}
            <div className="close">
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="offcanvas"
                aria-label={t("close")}
              />
            </div>
          </div>
          <div className="tf-search-sticky">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="tf-mini-search-frm"
            >
              <fieldset className="text">
                <input
                  type="text"
                  placeholder={t("header.search")}
                  className=""
                  name="text"
                  tabIndex={0}
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setTouched(true);
                  }}
                  aria-required="true"
                  required
                />
              </fieldset>
              <button className="" type="submit">
                <i className="icon-search" />
              </button>
            </form>
          </div>
        </header>
        <div className="canvas-body p-0">
          <div className="tf-search-content">
            <div className="tf-cart-hide-has-results">
              {/* Show results if found */}
              {showResults && (
                <div className="tf-col-content search-results-section">
                  <div className="tf-search-content-title fw-5">
                    {t("shop.products_found")}
                  </div>
                  <div className="tf-search-hidden-inner">
                    {filteredProducts.map((product, index) => (
                      <div className="tf-loop-item" key={index}>
                        <div className="image">
                          <Link href={`/product-detail/${product.id}`}>
                            <Image
                              alt={product.imgAlt || product.title || product.name}
                              src={product.imgSrc || product.image || "/images/no-image.png"}
                              width={product.imgWidth || 300}
                              height={product.imgHeight || 400}
                            />
                          </Link>
                        </div>
                        <div className="content">
                          <Link href={`/product-detail/${product.id}`}>
                            {i18n.language === "ar" ? (product.arabic_name || product.name_ar || product.title || product.name) : (product.title || product.name)}
                          </Link>
                          <div className="tf-product-info-price">
                            {product.isOnSale ? (
                              <>
                                <div className="compare-at-price arabic_div">
                                  ${product.compareAtPrice?.toFixed(2) || product.originalPrice?.toFixed(2) || ""}
                                </div>
                                <div className="price-on-sale arabic_div fw-6">
                                  ${product.salePrice?.toFixed(2) || product.price?.toFixed(2) || ""}
                                </div>
                              </>
                            ) : (
                              <div className="price fw-6 arabic_div">
                                ${product.price?.toFixed(2) || ""}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Show no results message and inspiration if no products found */}
              {showNoResults && (
                <div className="tf-col-content no-results-section">
                  <div className="tf-search-content-title fw-5">
                    {t("shop.no_products_title")}
                  </div>
                  {/* Inspiration section below */}
                  <div className="tf-col-content inspiration-section">
                    <div className="tf-search-content-title fw-5">
                      {t("search_inspiration")}
                    </div>
                    <div className="tf-search-hidden-inner">
                      {inspirationProducts.map((product, index) => (
                        <div className="tf-loop-item" key={index}>
                          <div className="image">
                            <Link href={`/product-detail/${product.id}`}>
                              <Image
                                alt={product.imgAlt || product.title || product.name}
                                src={product.imgSrc || product.image || "/images/no-image.png"}
                                width={product.imgWidth || 300}
                                height={product.imgHeight || 400}
                              />
                            </Link>
                          </div>
                          <div className="content">
                            <Link href={`/product-detail/${product.id}`}>
                              {i18n.language === "ar" ? (product.arabic_name || product.name_ar || product.title || product.name) : (product.title || product.name)}
                            </Link>
                            <div className="tf-product-info-price">
                              {product.isOnSale ? (
                                <>
                                  <div className="compare-at-price">
                                    ${product.compareAtPrice?.toFixed(2) || product.originalPrice?.toFixed(2) || ""}
                                  </div>
                                  <div className="price-on-sale fw-6">
                                    ${product.salePrice?.toFixed(2) || product.price?.toFixed(2) || ""}
                                  </div>
                                </>
                              ) : (
                                <div className="price arabic_div fw-6">
                                  ${product.price?.toFixed(2) || ""}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Show inspiration section if no search or less than 2 chars */}
              {(!showResults && !showNoResults) && (
                <div className="tf-col-content inspiration-section">
                  <div className="tf-search-content-title fw-5">
                    {t("search_inspiration")}
                  </div>
                  <div className="tf-search-hidden-inner">
                    {inspirationProducts.map((product, index) => (
                      <div className="tf-loop-item" key={index}>
                        <div className="image">
                          <Link href={`/product-detail/${product.id}`}>
                            <Image
                              alt={product.imgAlt || product.title || product.name}
                              src={product.imgSrc || product.image || "/images/no-image.png"}
                              width={product.imgWidth || 300}
                              height={product.imgHeight || 400}
                            />
                          </Link>
                        </div>
                        <div className="content">
                          <Link href={`/product-detail/${product.id}`}>
                            {i18n.language === "ar" ? (product.arabic_name || product.name_ar || product.title || product.name) : (product.title || product.name)}
                          </Link>
                          <div className="tf-product-info-price">
                            {product.isOnSale ? (
                              <>
                                <div className="compare-at-price">
                                  ${product.compareAtPrice?.toFixed(2) || product.originalPrice?.toFixed(2) || ""}
                                </div>
                                <div className="price-on-sale fw-6">
                                  ${product.salePrice?.toFixed(2) || product.price?.toFixed(2) || ""}
                                </div>
                              </>
                            ) : (
                              <div className="price fw-6 arabic_div">
                                ${product.price?.toFixed(2) || ""}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
