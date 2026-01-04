<<<<<<< HEAD
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
import { useTranslation } from "react-i18next";

export const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  // Helpers to resolve API image paths
  const resolveImageUrl = (p) => {
    if (!p) return "/images/no-image.png";
    if (typeof p !== 'string') return "/images/no-image.png";
    if (p.startsWith('http')) return p;
    if (p.startsWith('/')) return `http://localhost:8000${p}`;
    // Assume storage path like "products/xxx.jpg"
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
    console.log('[ProductCard] Resolved images for product', product?.id, {
      primary,
      hover: getHoverImage(product),
    });
  }, [product]);

  // Safe name/price handling for API data (price may be string)
  const getProductName = () => {
    if (i18n.language === 'ar' && product?.arabic_name) {
      return product.arabic_name;
    }
    return product?.title || product?.name || "Product";
  };
  const displayName = getProductName();
  const priceNumber = parseFloat(product?.price ?? 0);
  const priceDisplay = isNaN(priceNumber) ? null : priceNumber.toFixed(2);
  if (isNaN(priceNumber)) {
    console.warn('[ProductCard] Non-numeric price for product id:', product?.id, 'value:', product?.price);
  }

  return (
    <div className="card-product fl-item" key={product.id}>
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={currentImage}
            src={currentImage}
            alt="image-product"
            width={720}
            height={1005}
          />
          <Image
            className="lazyload img-hover"
            data-src={getHoverImage(product)}
            src={getHoverImage(product)}
            alt="image-product"
            width={720}
            height={1005}
          />
        </Link>
        {product.soldOut ? (
          <div className="sold-out">
            <span>{t('product_card.sold_out')}</span>
          </div>
        ) : (
          <>
            <div className="list-product-btn">
              <a
                href="#quick_add"
                onClick={() => setQuickAddItem(product.id)}
                data-bs-toggle="modal"
                className="box-icon bg_white quick-add tf-btn-loading"
              >
                <span className="icon icon-bag" />
                <span className="tooltip">{t('product_card.quick_add')}</span>
              </a>
              <a
                onClick={() => addToWishlist(product.id)}
                className="box-icon bg_white wishlist btn-icon-action"
              >
                <span
                  className={`icon icon-heart ${
                    isAddedtoWishlist(product.id) ? "added" : ""
                  }`}
                />
                <span className="tooltip">
                  {isAddedtoWishlist(product.id)
                    ? t('product_card.already_wishlisted')
                    : t('product_card.add_to_wishlist')}
                </span>
                <span className="icon icon-delete" />
              </a>
              <a
                href="#compare"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                onClick={() => addToCompareItem(product.id)}
                className="box-icon bg_white compare btn-icon-action"
              >
                <span
                  className={`icon icon-compare ${
                    isAddedtoCompareItem(product.id) ? "added" : ""
                  }`}
                />
                <span className="tooltip">
                  {" "}
                  {isAddedtoCompareItem(product.id)
                    ? t('product_card.already_compared')
                    : t('product_card.add_to_compare')}
                </span>
                <span className="icon icon-check" />
              </a>
              <a
                href="#quick_view"
                onClick={() => setQuickViewItem(product)}
                data-bs-toggle="modal"
                className="box-icon bg_white quickview tf-btn-loading"
              >
                <span className="icon icon-view" />
                <span className="tooltip">{t('product_card.quick_view')}</span>
              </a>
            </div>
            {product.countdown && (
              <div className="countdown-box">
                <div className="js-countdown">
                  <CountdownComponent />
                </div>
              </div>
            )}
            {product.sizes && (
              <div className="size-list">
                {product.sizes.map((size) => (
                  <span key={size}>{size}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="title link">
          {displayName}
        </Link>
        <span className="price">{priceDisplay !== null ? `$${priceDisplay}` : '—'}</span>
        {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color, i) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } `}
                key={i}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
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
      </div>
    </div>
  );
};
=======
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
import { useTranslation } from "react-i18next";
  import { API_BASE_URL, API_STORAGE_URL } from '../../utils/config';

export const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  // Helpers to resolve API image paths
  const resolveImageUrl = (p) => {
    if (!p) return "/images/no-image.png";
    if (typeof p !== 'string') return "/images/no-image.png";
    if (p.startsWith('http')) return p;
    if (p.startsWith('/')) return `${API_BASE_URL}${p}`;
    // Assume storage path like "products/xxx.jpg"
    return `${API_STORAGE_URL}/${p}`;
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
  } = useContextElement();
  useEffect(() => {
    const primary = getPrimaryImage(product);
    setCurrentImage(primary);
    console.log('[ProductCard] Resolved images for product', product?.id, {
      primary,
      hover: getHoverImage(product),
    });
  }, [product]);

  // Safe name/price handling for API data (price may be string)
  const getProductName = () => {
    if (i18n.language === 'ar' && product?.arabic_name) {
      return product.arabic_name;
    }
    return product?.title || product?.name || "Product";
  };
  const displayName = getProductName();
  const priceNumber = parseFloat(product?.price ?? 0);
  const priceDisplay = isNaN(priceNumber) ? null : priceNumber.toFixed(2);
  if (isNaN(priceNumber)) {
    console.warn('[ProductCard] Non-numeric price for product id:', product?.id, 'value:', product?.price);
  }

  return (
    <div className="card-product fl-item" key={product.id}>
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={currentImage}
            src={currentImage}
            alt="image-product"
            width={720}
            height={1005}
          />
          <Image
            className="lazyload img-hover"
            data-src={getHoverImage(product)}
            src={getHoverImage(product)}
            alt="image-product"
            width={720}
            height={1005}
          />
        </Link>
        {product.soldOut ? (
          <div className="sold-out">
            <span>{t('product_card.sold_out')}</span>
          </div>
        ) : (
          <>
            <div className="list-product-btn">
              <a
                href="#quick_add"
                onClick={() => setQuickAddItem(product.id)}
                data-bs-toggle="modal"
                className="box-icon bg_white quick-add tf-btn-loading"
              >
                <span className="icon icon-bag" />
                <span className="tooltip">{t('product_card.quick_add')}</span>
              </a>
              <a
                href="#quick_view"
                onClick={() => setQuickViewItem(product)}
                data-bs-toggle="modal"
                className="box-icon bg_white quickview tf-btn-loading"
              >
                <span className="icon icon-view" />
                <span className="tooltip">{t('product_card.quick_view')}</span>
              </a>
            </div>
            {product.countdown && (
              <div className="countdown-box">
                <div className="js-countdown">
                  <CountdownComponent />
                </div>
              </div>
            )}
            {product.sizes && (
              <div className="size-list">
                {product.sizes.map((size) => (
                  <span key={size}>{size}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="title link">
          {displayName}
        </Link>
        <span className="price arabic_div">{priceDisplay !== null ? `$${priceDisplay}` : '—'}</span>
        {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color, i) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } `}
                key={i}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
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
      </div>
    </div>
  );
};
>>>>>>> origin/main
