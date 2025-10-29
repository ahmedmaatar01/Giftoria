"use client";

import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function Products2() {
  const { t } = useTranslation(); // ✅ use translation hook

  // Backend API base (env override with sensible fallback)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to resolve product image from API data
  const getItemImage = (product) => {
    try {
      if (product?.images && product.images.length > 0) {
        const featured = product.images.find((img) => img.is_featured);
        const src = featured ? featured.image_path : product.images[0].image_path;
        return src ? `${API_BASE}${src}` : "/images/no-image.png";
      }
      if (product?.featured_image) return `${API_BASE}${product.featured_image}`;
      // fallback for any static demo products that might slip in
      return product?.imgSrc || "/images/no-image.png";
    } catch (e) {
      return "/images/no-image.png";
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/products/featured`, {
          headers: { "Accept": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError(String(err?.message || err));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [API_BASE]);

  const swiperOptions = {
    slidesPerView: 4,
    spaceBetween: 30,
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      480: {
        slidesPerView: 3,
      },
      0: {
        slidesPerView: 2,
      },
    },
  };

  const { setQuickViewItem } = useContextElement();
  const {
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  return (
    <>
      <style jsx>{`
        .box-icon.quick-add.tf-btn-loading {
          background-color: #000000 !important;
          background: #000000 !important;
        }
        .box-icon.quick-add.tf-btn-loading .icon {
          color: white !important;
        }
      `}</style>
      <section className="flat-spacing-13 pb_0">
      <div className="container">
        <div className="flat-title flex-row justify-content-center">
          <span className="title fw-6 wow fadeInUp" data-wow-delay="0s">
            <span className="bell-medium heading-30" style={{ textTransform: 'uppercase', fontSize: '30px' }}>{t("products2_title")}</span>
          </span>
        </div>

        <div className="wrap-carousel wrap-sw-2">
          <Swiper
            dir="ltr"
            modules={[Pagination, Navigation]}
            pagination={{ el: ".spdp21" }}
            navigation={{ prevEl: ".snbp21", nextEl: ".snbn21" }}
            className="swiper tf-sw-product-sell-1"
            {...swiperOptions}
          >
            {(loading ? [] : featuredProducts).map((product, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <div className="card-product style-9">
                  <div className="card-product-wrapper">
                    <Link href={`/product-detail/${product.id}`} className="product-img">
                      <Image
                        className="lazyload img-product"
                        data-src={getItemImage(product)}
                        alt="image-product"
                        src={getItemImage(product)}
                        width={360}
                        height={360}
                      />
                      <Image
                        className="lazyload img-hover"
                        data-src={getItemImage(product)}
                        alt="image-product"
                        src={getItemImage(product)}
                        width={360}
                        height={360}
                      />
                    </Link>

                    <div className="list-product-btn absolute-2">
                      <a
                        onClick={() => addToWishlist(product.id)}
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span
                          className={`icon icon-heart ${isAddedtoWishlist(product.id) ? "added" : ""}`}
                        />
                        <span className="tooltip">
                          {isAddedtoWishlist(product.id)
                            ? t("already_wishlisted")
                            : t("add_to_wishlist")}
                        </span>
                      </a>

                      <a
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        onClick={() => addToCompareItem(product.id)}
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span
                          className={`icon icon-compare ${isAddedtoCompareItem(product.id) ? "added" : ""}`}
                        />
                        <span className="tooltip">
                          {isAddedtoCompareItem(product.id)
                            ? t("already_compared")
                            : t("add_to_compare")}
                        </span>
                      </a>

                      <a
                        href="#quick_view"
                        data-bs-toggle="modal"
                        onClick={() => setQuickViewItem(product)}
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view" />
                        <span className="tooltip">{t("quick_view")}</span>
                      </a>
                    </div>
                  </div>

                  <div className="card-product-info">
                    <div className="inner-info">
                      <Link href={`/product-detail/${product.id}`} className="raleway-light" style={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                        {product.name || product.title}
                      </Link>
                      <div>
                        <span className="new-price price-primary" style={{ color: '#000000ff' }}>
                          <span style={{ fontSize: '15px' }}>$</span>
                          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{Number(product.price || 0).toFixed(2)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="list-product-btn">
                      <a
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon quick-add tf-btn-loading"
                        style={{ 
                          backgroundColor: '#000000 !important',
                          background: '#000000 !important',
                          color: 'white !important'
                        }}
                      >
                        <span className="icon icon-bag" style={{ color: 'white !important' }} />
                        <span className="tooltip">{t("add_to_cart")}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center mt-4">
              <span className="text-muted">{t("no_featured_products")}</span>
            </div>
          )}
          {error && (
            <div className="text-center mt-3">
              <span className="text-danger small">{error}</span>
            </div>
          )}

          <div className="nav-sw nav-next-slider style-white-line nav-next-sell-1 box-icon w_46 round snbp21">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider style-white-line nav-prev-sell-1 box-icon w_46 round snbn21">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-sell-1 justify-content-center spdp21" />
        </div>
      </div>
    </section>
    </>
  );
}
