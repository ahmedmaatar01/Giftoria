"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next"; // ✅ Import i18n hook

import { Navigation } from "swiper/modules";
import React, { useEffect, useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // ✅ use translation

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data?.data || []);
        setCategories(items);
      } catch (err) {
        console.error("[Home-6/Categories] Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const resolveCategoryImage = (c) => {
    const featured = c?.images?.find?.((img) => img?.is_featured == 1);
    let candidate =
      featured?.image_path ||
      featured?.url ||
      featured?.path ||
      c?.featured_image ||
      c?.image ||
      c?.thumbnail;
    if (!candidate || typeof candidate !== "string") return null;
    if (/^https?:\/\//i.test(candidate)) return candidate;
    candidate = candidate.replace(/^\/+/, "");
    if (candidate.startsWith("storage/")) return `http://localhost:8000/${candidate}`;
    if (candidate.startsWith("public/")) {
      const normalized = candidate.replace(/^public\//, "storage/");
      return `http://localhost:8000/${normalized}`;
    }
    return `http://localhost:8000/storage/${candidate}`;
  };
  return (
    <section className="flat-spacing-12">
      <div className="container">
        <div
          className="flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp"
          data-wow-delay="0s"
        >
          <h3 className="bell-t-medium heading-30">{t("categoriesAlt.sectionTitle")}</h3>
          <Link href={`/shop-collection-sub`} className="tf-btn btn-line">
            {t("categoriesAlt.viewAllCategories")}
            <i className="icon icon-arrow1-top-left" />
          </Link>
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="tf-sw-collection"
            slidesPerView={6}
            breakpoints={{
              768: {
                slidesPerView: 6,
              },
              576: {
                slidesPerView: 3,
              },
              0: {
                slidesPerView: 2,
              },
            }}
            spaceBetween={15}
            loop={false}
            autoplay={false}
            modules={[Navigation]}
            navigation={{
              prevEl: ".snbp130",
              nextEl: ".snbn130",
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <SwiperSlide key={`cat-loading-${idx}`}>
                    <div className="collection-item-circle hover-img">
                      <div className="collection-image img-style" style={{ width: 180, height: 180, background: "#f0f0f0", borderRadius: "50%" }} />
                      <div className="collection-content text-center">
                        <div style={{ height: 18, width: 100, background: "#f0f0f0", margin: "10px auto", borderRadius: 4 }} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              : categories.map((cat) => {
                  const imageUrl = resolveCategoryImage(cat) || "/images/no-image.png";
                  const title = cat?.name || "Category";
                  return (
                    <SwiperSlide key={cat.id}>
                      <div className="collection-item-circle hover-img">
                        <Link
                          href={`/shop-default?category=${cat.id}`}
                          className="collection-image img-style"
                        >
                          <Image
                            className="lazyload"
                            data-src={imageUrl}
                            alt={title}
                            src={imageUrl}
                            width={180}
                            height={180}
                          />
                        </Link>
                        <div className="collection-content text-center">
                          <Link
                            href={`/shop-default?category=${cat.id}`}
                            className="link title fw-5"
                          >
                            {title}
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
          </Swiper>
          <div className="sw-dots style-2 sw-pagination-collection justify-content-center" />
          <div className="nav-sw nav-next-slider nav-next-collection snbp130">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-collection snbn130">
            <span className="icon icon-arrow-right" />
          </div>
        </div>
      </div>
    </section>
  );
}
