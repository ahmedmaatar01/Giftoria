"use client";
import React, { useState } from "react";

import Image from "next/image";
import {
  paymentImages,
} from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import Quantity from "./Quantity";

import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import { useContextElement } from "@/context/Context";
import { openCartModal } from "@/utlis/openCartModal";

export default function DetailsOuterZoom({ product }) {

  const [quantity, setQuantity] = useState(1);

  // State for custom field values
  const [customFieldValues, setCustomFieldValues] = useState(() => {
    const initial = {};
    if (product.custom_fields && product.custom_fields.length > 0) {
      product.custom_fields.forEach(field => {
        // Try to get value from product.customValues if present
        const val = product.customValues && product.customValues.length > 0
          ? product.customValues.find(v => v.custom_field_id === field.id)?.value || ''
          : '';
        initial[field.id] = val;
      });
    }
    return initial;
  });

  // Add missing handler for custom field input changes
  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // Helper function to get main product image
  const getMainImage = () => {
    if (product.images && product.images.length > 0) {
      const featuredImage = product.images.find(img => img.is_featured);
      return featuredImage ? 
        `http://localhost:8000${featuredImage.image_path}` : 
        `http://localhost:8000${product.images[0].image_path}`;
    }
    return product.featured_image ? 
      `http://localhost:8000${product.featured_image}` : 
      "/images/no-image.png";
  };

console.log("Product in DetailsOuterZoom:", product);
  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
  } = useContextElement();
  return (
    <section
      className="flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div
        className="tf-main-product section-image-zoom"
        style={{ maxWidth: "100vw", overflow: "clip" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="thumbs-slider">
                  <Slider1ZoomOuter
                    firstImage={getMainImage()}
                    productImages={product.images || []}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-title">
                    <h5 className="bell-t-medium" style={{  textTransform: "uppercase" }}>
                      {product.name ? product.name : "Product Name"}
                    </h5>
                  </div>
      
                  <div className="tf-product-info-badges">
                    <div className="badges">Best seller</div>
                    <div className="product-status-content">
                      <i className="icon-lightning" />
                      <p className="fw-6">
                        Selling fast! {product.stock} items in stock.
                      </p>
                    </div>
                  </div>
                  <div className="tf-product-info-price">
                    <div className="price-on-sale">
                      ${parseFloat(product.price).toFixed(2)}
                    </div>

  

                  
                  </div>
                 
                  <div className="tf-product-info-countdown">
                    <div className="countdown-wrap">
                      <div className="countdown-title">
                        <i className="icon-time tf-ani-tada" />
                        <p className="fw-6">
                          Estimated delivery time: {product.lead_time ? `${product.lead_time} hours` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
               {/* Render custom fields as input fields if present */}
                  {product.custom_fields && product.custom_fields.length > 0 && (
                    <div className="tf-product-custom-fields mb-3">
                      {product.custom_fields.map((field) => {
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
                              style={{ paddingTop:"0.75rem",paddingBottom:"0.75rem"}}
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
                            <label className="fw-6 mb-1" htmlFor={`custom-field-${field.id}`}>{field.name}{field.is_required ? ' *' : ''}:</label>
                            {inputEl}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity setQuantity={setQuantity} />
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="">
                      <a
                        onClick={() => {
                          openCartModal();
                          addProductToCart(product.id, quantity ? quantity : 1, customFieldValues);
                        }}
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                      >
                        <span>
                          {isAddedToCartProducts(product.id)
                            ? "Already Added"
                            : "Add to cart"}{" "}
                          -{" "}
                        </span>
                        <span className="tf-qty-price">
                          ${(parseFloat(product.price) * quantity).toFixed(2)}
                        </span>
                      </a>
                      <a
                        onClick={() => addToWishlist(product.id)}
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                      >
                        <span
                          className={`icon icon-heart ${
                            isAddedtoWishlist(product.id) ? "added" : ""
                          }`}
                        />
                        <span className="tooltip">
                          {" "}
                          {isAddedtoWishlist(product.id)
                            ? "Already Wishlisted"
                            : "Add to Wishlist"}
                        </span>
                        <span className="icon icon-delete" />
                      </a>
                      {/* Compare feature removed */}
                      {/* <div className="w-100">
                        <a href="#" className="btns-full">
                          Buy with
                          <Image
                            alt="image"
                            src="/images/payments/paypal.png"
                            width={64}
                            height={18}
                          />
                        </a>
                        <a href="#" className="payment-more-option">
                          More payment options
                        </a>
                      </div> */}
                    </form>
                  </div>
        
                  <div className="tf-product-info-delivery-return">
                    <div className="row">
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery">
                          <div className="icon">
                            <i className="icon-delivery-time" />
                          </div>
                          <p>
                            Estimate delivery times:
                            <span className="fw-7">12-26 days</span>
                            (International),
                            <span className="fw-7">2-6 days</span> (Quatar).
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery mb-0">
                          <div className="icon">
                            <i className="icon-return-order" />
                          </div>
                          <p>
                            Return within <span className="fw-7">30 days</span>{" "}
                            of purchase. Duties &amp; taxes are non-refundable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-trust-seal">
                    <div className="tf-product-trust-mess">
                      <i className="icon-safe" />
                      <p className="fw-6">
                        Guarantee Safe Checkout
                      </p>
                    </div>
                    <div className="tf-payment">
                        <Image
                          key={'index'}
                          alt={"payment"}
                          src={"https://i0.wp.com/wpecomus.com/fashion/wp-content/uploads/sites/2/2024/07/payments.png"}
                          width={"250"}
                          height={"50"}
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <StickyItem />
    </section>
  );
}
