"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
export default function Productcard23({ product }) {
  // Helpers for description rendering
  const stripHtml = (html) => {
    if (!html) return "";
    return String(html).replace(/<[^>]+>/g, " ");
  };
  const limitWords = (text, maxWords = 20) => {
    const words = String(text).split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(" ");
    return words.slice(0, maxWords).join(" ") + "...";
  };

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

  const [currentImage, setCurrentImage] = useState(getPrimaryImage(product));
  const { setQuickViewItem } = useContextElement();
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();
  useEffect(() => {
    const primary = getPrimaryImage(product);
    setCurrentImage(primary);
    console.log('[Productcard23] Resolved images for product', product?.id, {
      primary,
      hover: getHoverImage(product),
    });
  }, [product]);

  return (
    <div className="card-product list-layout">
      <div className="card-product-wrapper">
        <a href="#" className="product-img">
          <Image
            className="lazyload img-product"
            alt="image-product"
            src={currentImage}
            width={720}
            height={1005}
          />
          <Image
            className="lazyload img-hover"
            alt="image-product"
            src={getHoverImage(product)}
            width={720}
            height={1005}
          />
        </a>
      </div>
      <div className="card-product-info">
        <a href="#" className="title link">
          {product?.title || product?.name || 'Product'}
        </a>
        {(() => {
          const n = parseFloat(product?.price ?? 0);
          if (isNaN(n)) {
            console.warn('[Productcard23] Non-numeric price for product id:', product?.id, 'value:', product?.price);
            return <span className="price">—</span>;
          }
          return <span className="price">${n.toFixed(2)}</span>;
        })()}
        <p className="description">
          {(() => {
            const clean = stripHtml(product?.description);
            return clean ? limitWords(clean, 20) : "";
          })()}
        </p>
        {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } `}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
                key={color.name}
              >
                <span className="tooltip">{color.name}</span>
                <span className={`swatch-value ${color.colorClass}`} />
                <Image
                  className="lazyload"
                  data-src={color.imgSrc}
                  src={color.imgSrc}
                  alt="image-product"
                  width={720}
                  height={1005}
                />
              </li>
            ))}
          </ul>
        )}
        {product.sizes && (
          <div className="size-list">
            {product.sizes.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )}
        <div className="list-product-btn">
          
          <a
            href="#quick_add"
            onClick={() => setQuickAddItem(product.id)}
            data-bs-toggle="modal"
            className="box-icon quick-add style-3 hover-tooltip"
          >
            <span className="icon icon-bag" />
            <span className="tooltip">Quick add</span>
          </a>
          <a
            onClick={() => addToWishlist(product.id)}
            className="box-icon wishlist style-3 hover-tooltip"
          >
            <span
              className={`icon icon-heart ${
                isAddedtoWishlist(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Add to Wishlist"}
            </span>
          </a>

          <a
            href="#compare"
            data-bs-toggle="offcanvas"
            aria-controls="offcanvasLeft"
            onClick={() => addToCompareItem(product.id)}
            className="box-icon compare style-3 hover-tooltip"
          >
            <span
              className={`icon icon-compare ${
                isAddedtoCompareItem(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {" "}
              {isAddedtoCompareItem(product.id)
                ? "Already Compared"
                : "Add to Compare"}
            </span>
          </a>
          <a
            href="#quick_view"
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            className="box-icon quickview style-3 hover-tooltip"
          >
            <span className="icon icon-view" />
            <span className="tooltip">Quick view</span>
          </a>
        </div>
      </div>
    </div>
  );
}
