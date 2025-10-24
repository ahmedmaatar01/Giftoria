"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collectionCircles } from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useTranslation } from "react-i18next"; // ✅ i18n hook

export default function Categories() {
  const { t, i18n } = useTranslation(); // ✅ translation hook
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch occasions from API
    const fetchOccasions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/occasions');
        const data = await response.json();
        setOccasions(data);
      } catch (error) {
        console.error('Error fetching occasions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccasions();
  }, []);

  return (
    <section className="flat-spacing-20">
      {/* ✅ Add translated title */}
      <div className="container" style={{ marginTop: "45px" }}>
        <div className="flat-title flex-row justify-content-center mb-1">
          <span className="title fw-6 wow fadeInUp" data-wow-delay="0s">
            <span className="bell-t-medium">{t("categories.sectionTitle")}</span>
          </span>
        </div>
      </div>

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
                  slidesPerView="auto"
                  breakpoints={{
                    1024: { slidesPerView: 6, spaceBetween: 30 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    0: { slidesPerView: 1, spaceBetween: 10 },
                  }}
                >
                  {loading ? (
                    // Loading placeholder - show multiple skeleton items
                    Array.from({ length: 6 }).map((_, index) => (
                      <SwiperSlide key={`loading-${index}`} className="swiper-slide">
                        <div className="collection-item-circle hover-img position-relative">
                          <div className="collection-image img-style" style={{ 
                            width: '160px', 
                            height: '160px', 
                            background: '#f0f0f0',
                            borderRadius: '50%',
                            margin: '0 auto'
                          }} />
                          <div className="collection-content text-center">
                            <div style={{ 
                              height: '20px', 
                              background: '#f0f0f0', 
                              width: '100px',
                              margin: '10px auto',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    occasions.map((occasion) => {
                      // Get the featured image or first image
                      const featuredImage = occasion.images?.find(img => img.is_featured);
                      const imageUrl = featuredImage 
                        ? `http://localhost:8000/storage/${featuredImage.image_path}`
                        : occasion.featured_image 
                        ? `http://localhost:8000/storage/${occasion.featured_image}`
                        : '/images/no-image.png';

                      // Use arabic name if current language is arabic, otherwise use regular name
                      const displayName = i18n.language === 'ar' && occasion.arabic_name 
                        ? occasion.arabic_name 
                        : occasion.name;

                      return (
                        <SwiperSlide key={occasion.id} className="swiper-slide">
                          <div className="collection-item-circle hover-img position-relative">
                            <Link
                              href={`/shop-collection-sub?occasion=${occasion.id}`}
                              className="collection-image img-style"
                            >
                              <Image
                                className="lazyload"
                                data-src={imageUrl}
                                alt={displayName}
                                src={imageUrl}
                                width={160}
                                height={160}
                              />
                            </Link>
                            <div className="collection-content text-center">
                              <Link 
                                href={`/shop-collection-sub?occasion=${occasion.id}`} 
                                className="link title fw-6"
                              >
                                {displayName}
                              </Link>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })
                  )}
                </Swiper>
              </div>

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
