"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { collectionCirclesAlt } from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useTranslation } from "react-i18next"; // ✅ Import i18n hook

export default function CategoriesAlt() {
  const { t } = useTranslation(); // ✅ use translation

  return (
    <section className="flat-spacing-20">
      {/* ✅ Section Title */}
      <div className="container" style={{ marginTop: "45px", marginBottom: "45px" }}>
        <div className="flat-title flex-row justify-content-center mb-1">
          <span className="title fw-6 wow fadeInUp" data-wow-delay="0s">
            <span className="bell-t-medium heading-30">{t("categoriesAlt.sectionTitle")}</span>
          </span>
        </div>
      </div>

      {/* ✅ Swiper Categories */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tf-categories-wrap">
              <div className="tf-categories-container">
                <Swiper
                  dir="ltr"
                  className="swiper tf-sw-collection"
                  spaceBetween={15}
                  modules={[Navigation]}
                  navigation={{
                    prevEl: ".snbp-multi",
                    nextEl: ".snbn-multi",
                  }}
                  breakpoints={{
                    1200: { slidesPerView: 6, spaceBetween: 30 },
                    1024: { slidesPerView: 4, spaceBetween: 30 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    0: { slidesPerView: 1, spaceBetween: 10 },
                  }}
                >
                  {collectionCirclesAlt.map((item) => (
                    <SwiperSlide key={item.id} className="swiper-slide">
                      <div className="collection-item-circle hover-img position-relative">
                        <Link href={item.href} className="collection-image img-style">
                          <Image
                            className="lazyload"
                            data-src={item.imgSrc}
                            alt={item.alt}
                            src={item.imgSrc}
                            width={item.width}
                            height={item.height}
                          />
                        </Link>
                        {item.hasSale && (
                          <div
                            className="has-saleoff-wrap"
                            style={{ position: "absolute", top: 0 }}
                          >
                            <div className="sale-off fw-5">{item.saleText}</div>
                          </div>
                        )}
                        <div className="collection-content text-center">
                          <Link href={item.href} className="link title fw-6">
                            {item.title}
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* ✅ Shop all */}
              <div className="tf-shopall-wrap">
                <div className="collection-item-circle tf-shopall">
                  <Link
                    href={`/shop-collection-sub`}
                    className="collection-image img-style tf-shopall-icon"
                  >
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                  <div className="collection-content text-center">
                    <Link
                      href={`/shop-collection-sub`}
                      className="link title fw-6"
                    >
                      {t("common.shopAll", "Shop all")} {/* optional fallback */}
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
