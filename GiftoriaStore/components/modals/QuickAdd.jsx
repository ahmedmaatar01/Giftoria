"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Quantity from "../shopDetails/Quantity";
import { useContextElement } from "@/context/Context";

import { allProducts } from "@/data/products";
export default function QuickAdd() {
  const {
    quickAddItem,
    addProductToCart,
    isAddedToCartProducts,
    apiProducts,
  } = useContextElement();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // State for custom field values
  const [customFieldValues, setCustomFieldValues] = useState({});
  
  useEffect(() => {
    // Use only API products
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      const filtered = apiProducts.filter((el) => el.id == quickAddItem);
      if (filtered && filtered.length > 0) {
        setItem(filtered[0]);
        
        // Initialize custom field values
        const initial = {};
        if (filtered[0].custom_fields && filtered[0].custom_fields.length > 0) {
          filtered[0].custom_fields.forEach(field => {
            const val = filtered[0].customValues && filtered[0].customValues.length > 0
              ? filtered[0].customValues.find(v => v.custom_field_id === field.id)?.value || ''
              : '';
            initial[field.id] = val;
          });
        }
        setCustomFieldValues(initial);
      }
    }
  }, [quickAddItem, apiProducts]);

  // Handler for custom field input changes
  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // Helper function to get product image
  const getProductImage = () => {
    if (!item) return "/images/no-image.png";
    
    if (item.images && item.images.length > 0) {
      const featuredImage = item.images.find(img => img.is_featured);
      return featuredImage ? 
        `http://localhost:8000${featuredImage.image_path}` : 
        `http://localhost:8000${item.images[0].image_path}`;
    }
    if (item.featured_image) {
      return `http://localhost:8000${item.featured_image}`;
    }
    // Fallback to static imgSrc if exists
    return item.imgSrc || "/images/no-image.png";
  };

  // Get product name
  const getProductName = () => {
    if (!item) return "Product";
    return item.name || item.title || "Product";
  };

  return (
    <div className="modal fade modalDemo" id="quick_add">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            {item ? (
            <>
            <div className="tf-product-info-item">
              <div className="image">
                <Image
                  alt="image"
                  style={{ objectFit: "contain" }}
                  src={getProductImage()}
                  width={720}
                  height={1005}
                />
              </div>
              <div className="content">
                <Link href={`/product-detail/${item.id}`}>{getProductName()}</Link>
                <div className="tf-product-info-price">
                  <div className="price">${parseFloat(item.price || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
            {/* Render custom fields as input fields if present */}
            {item.custom_fields && item.custom_fields.length > 0 && (
              <div className="tf-product-custom-fields mb_15">
                {item.custom_fields.map((field) => {
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
                  className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                  onClick={() => {
                    addProductToCart(item.id, quantity ? quantity : 1, customFieldValues);
                  }}
                >
                  <span>
                    {isAddedToCartProducts(item.id)
                      ? "Already Added - "
                      : "Add to cart - "}
                  </span>
                  <span className="tf-qty-price">${(parseFloat(item.price || 0)* quantity).toFixed(2)} </span>
                </a>
                <div className="tf-product-btn-wishlist btn-icon-action">
                  <i className="icon-heart" />
                  <i className="icon-delete" />
                </div>
                {/* Compare feature removed */}
 
              </form>
            </div>
            </>
            ) : (
              <div className="text-center p-4">
                <p>Product not found in API data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
