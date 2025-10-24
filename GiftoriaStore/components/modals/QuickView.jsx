"use client";
import { useContextElement } from "@/context/Context";

import Image from "next/image";
import Link from "next/link";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Quantity from "../shopDetails/Quantity";
import React, { useEffect, useState } from "react";

export default function QuickView() {
  const {
    quickViewItem,
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
  } = useContextElement();
  const qv = quickViewItem;
  const qvId = qv?.id;
  // Prefer name, then title, fallback to "Product"
  const qvTitle = qv?.name || qv?.title || "Product";
  // Normalize price to number if possible
  const qvPrice = (() => {
    const n = parseFloat(qv?.price);
    return isNaN(n) ? null : n;
  })();

  // Robust image resolver (same as Productcard23)
  const resolveImageUrl = (p) => {
    if (!p) return "/images/no-image.png";
    if (typeof p !== 'string') return "/images/no-image.png";
    if (p.startsWith('http')) return p;
    if (p.startsWith('/')) return `http://localhost:8000${p}`;
    return `http://localhost:8000/storage/${p}`;
  };
  const getPrimaryImage = (prod) => {
    const featured = prod?.images?.find((img) => img.is_featured);
    if (featured?.image_path) return resolveImageUrl(featured.image_path);
    if (Array.isArray(prod?.images) && prod.images.length > 0) {
      return resolveImageUrl(prod.images[0].image_path);
    }
    if (prod?.featured_image) return resolveImageUrl(prod.featured_image);
    return prod?.imgSrc || "/images/no-image.png";
  };
  const getHoverImage = (prod) => {
    if (Array.isArray(prod?.images) && prod.images.length > 1) {
      return resolveImageUrl(prod.images[1].image_path);
    }
    if (prod?.imgHoverSrc) return prod.imgHoverSrc;
    return getPrimaryImage(prod);
  };
  // Custom field values state
  const [customFieldValues, setCustomFieldValues] = useState({});
  // Quantity state
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    // Initialize custom field values
    if (qv && qv.custom_fields && qv.custom_fields.length > 0) {
      const initial = {};
      qv.custom_fields.forEach(field => {
        const val = qv.customValues && qv.customValues.length > 0
          ? qv.customValues.find(v => v.custom_field_id === field.id)?.value || ''
          : '';
        initial[field.id] = val;
      });
      setCustomFieldValues(initial);
    }
  }, [qv]);

  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <div className="modal fade modalDemo" id="quick_view">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            <div className="tf-product-media-wrap">
              {qv && (
                <Swiper
                  dir="ltr"
                  modules={[Navigation]}
                  navigation={{
                    prevEl: ".snbqvp",
                    nextEl: ".snbqvn",
                  }}
                  className="swiper tf-single-slide"
                >
                  {[getPrimaryImage(qv), getHoverImage(qv)].map((img, index) => (
                    <SwiperSlide className="swiper-slide" key={index}>
                      <div className="item">
                        <Image
                          alt={qvTitle}
                          src={img}
                          width={720}
                          height={1045}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                  <div className="swiper-button-next button-style-arrow single-slide-prev snbqvp" />
                  <div className="swiper-button-prev button-style-arrow single-slide-next snbqvn" />
                </Swiper>
              )}
            </div>
            <div className="tf-product-info-wrap position-relative">
              <div className="tf-product-info-list">
                <div className="tf-product-info-title">
                  <h5>
                    <Link
                      className="link"
                      href={qvId ? `/product-detail/${qvId}` : "#"}
                    >
                      {qvTitle}
                    </Link>
                  </h5>
                </div>
                <div className="tf-product-info-price">
                  <div className="price">
                    {qvPrice !== null ? `$${(qvPrice * quantity).toFixed(2)}` : "—"}
                  </div>
                </div>
                <div className="tf-product-description">
                  <p>{(() => {
                    // Helper to strip HTML tags
                    const stripHtml = (html) => {
                      if (!html) return '';
                      return html.replace(/<[^>]+>/g, ' ');
                    };
                    // Helper to limit to 20 words
                    const limitWords = (text, maxWords = 20) => {
                      const words = text.split(/\s+/).filter(Boolean);
                      if (words.length <= maxWords) return words.join(' ');
                      return words.slice(0, maxWords).join(' ') + '...';
                    };
                    const desc = qv?.description ? stripHtml(qv.description) : '';
                    return desc ? limitWords(desc, 20) : 'No description available.';
                  })()}</p>
                </div>
                {/* Render custom fields as input fields if present */}
                {qv?.custom_fields && qv.custom_fields.length > 0 && (
                  <div className="tf-product-custom-fields mb_15">
                    {qv.custom_fields.map((field) => {
                      const value = customFieldValues[field.id] || '';
                      let inputEl = null;
                      if (field.type === 'select') {
                        let opts = [];
                        try {
                          opts = JSON.parse(field.options);
                        } catch { opts = []; }
                        inputEl = (
                          <select
                            id={`custom-field-${field.id}`}
                            name={`custom-field-${field.id}`}
                            className="form-control"
                            value={value}
                            style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
                            onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                            required={field.is_required}
                          >
                            <option value="">Select {field.name}</option>
                            {opts.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        );
                      } else if (field.type === 'text') {
                        inputEl = (
                          <input
                            id={`custom-field-${field.id}`}
                            name={`custom-field-${field.id}`}
                            type="text"
                            className="form-control"
                            value={value}
                            onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                            required={field.is_required}
                          />
                        );
                      } else {
                        inputEl = (
                          <input
                            id={`custom-field-${field.id}`}
                            name={`custom-field-${field.id}`}
                            type="text"
                            className="form-control"
                            value={value}
                            onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                            required={field.is_required}
                          />
                        );
                      }
                      return (
                        <div key={field.id} className="mb-2">
                          <label className="fw-6 mb-1" htmlFor={`custom-field-${field.id}`}>
                            {field.name}{field.is_required ? ' *' : ''}:
                          </label>
                          {inputEl}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="tf-product-info-quantity mb_15">
                  <div className="quantity-title fw-6">Quantity</div>
                  <Quantity setQuantity={setQuantity} />
                </div>
                <div className="tf-product-info-buy-button">
                  <form onSubmit={(e) => e.preventDefault()} className="">
                    <a
                      href="#"
                      className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                      aria-disabled={!qvId}
                      onClick={() => {
                        if (qvId) {
                          addProductToCart(qvId, quantity ? quantity : 1, customFieldValues);
                        }
                      }}
                    >
                      <span>
                        {qvId && isAddedToCartProducts(qvId)
                          ? "Already Added - "
                          : "Add to cart - "}
                      </span>
                      <span className="tf-qty-price">
                        {qvPrice !== null ? `$${(qvPrice * quantity).toFixed(2)}` : ""}
                      </span>
                    </a>
                    <a
                      onClick={() => qvId && addToWishlist(qvId)}
                      className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                    >
                      <span
                        className={`icon icon-heart ${
                          qvId && isAddedtoWishlist(qvId) ? "added" : ""
                        }`}
                      />
                      <span className="tooltip">
                        {qvId && isAddedtoWishlist(qvId)
                          ? "Already Wishlisted"
                          : "Add to Wishlist"}
                      </span>
                      <span className="icon icon-delete" />
                    </a>
                    {/* Compare and payment options removed as requested */}
                  </form>
                </div>
                <div>
                  <Link
                    href={qvId ? `/product-detail/${qvId}` : "#"}
                    aria-disabled={!qvId}
                    className="tf-btn fw-6 btn-line"
                  >
                    View full details
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
