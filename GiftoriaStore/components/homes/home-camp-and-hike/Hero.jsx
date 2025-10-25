"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";

// Helper to resolve occasion image similar to categories/sidebars
const resolveOccasionImage = (o) => {
  const featured = o?.images?.find?.((img) => img?.is_featured == 1);
  let candidate =
    featured?.image_path ||
    featured?.url ||
    featured?.path ||
    o?.featured_image ||
    o?.image ||
    o?.thumbnail;
  if (!candidate || typeof candidate !== "string") return null;

  // Already absolute
  if (/^https?:\/\//i.test(candidate)) return candidate;

  // Normalize leading slashes
  candidate = candidate.replace(/^\/+/, "");

  if (candidate.startsWith("storage/")) return `http://localhost:8000/${candidate}`;
  if (candidate.startsWith("public/")) {
    const normalized = candidate.replace(/^public\//, "storage/");
    return `http://localhost:8000/${normalized}`;
  }
  return `http://localhost:8000/storage/${candidate}`;
};

export default function Hero() {
  const { i18n } = useTranslation();
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccasions = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/occasions");
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data?.data || []);
        setOccasions(items);
      } catch (err) {
        console.error("[Hero] Error fetching occasions:", err);
        setOccasions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
  }, []);

  return (
    <section className="tf-slideshow slider-effect-fade slider-camp-and-hike">
      <Swiper
        dir="ltr"
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        slidesPerGroupAuto
        initialSlide={1}
        breakpoints={{
          0: {
            slidesPerView: 1, // Mobile
          },
          768: {
            slidesPerView: 1, // Tablet
          },
          1200: {
            slidesPerView: 1.6, // Desktop
          },
        }}
        speed={1000}
        modules={[Autoplay, Navigation, Pagination]}
        navigation={{
          prevEl: ".snbhp1",
          nextEl: ".snbhn1",
        }}
        className="tf-sw-slideshow"
      >
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SwiperSlide key={`hero-loading-${idx}`}>
                <div className="wrap-slider">
                  <div style={{width: '100%', height: 649, background: '#f3f3f3'}} />
                </div>
              </SwiperSlide>
            ))
          : occasions.map((occasion) => {
              const imgSrc = resolveOccasionImage(occasion) || "/images/no-image.png";
              const title =
              i18n.language === 'ar' && occasion?.arabic_name
                ? occasion.arabic_name
                : occasion?.name || 'Occasion';             
                const desc =
                i18n.language === 'ar' && occasion?.arabic_description
                  ? occasion.arabic_description.replace(/<[^>]*>/g, '').slice(0, 140)
                  : occasion?.description
                  ? occasion.description.replace(/<[^>]*>/g, '').slice(0, 140)
                  : '';
            
              return (
                <SwiperSlide key={occasion.id}>
                  <div className="wrap-slider">
                    <Image
                      className="lazyload"
                      data-src={imgSrc}
                      src={imgSrc}
                      alt={title}
                      width={1000}
                      height={649}
                    />
                    <div className="box-content text-center">
                      <div className="container">
                        <h2 className="fade-item fade-item-1 heading text_white fw-7">
                          {title}
                        </h2>
                        {desc && (
                          <p className="fade-item fade-item-2 text_white">
                            {desc}
                          </p>
                        )}
                        <div className="fade-item fade-item-3">
                          <Link
                            href={`/shop-collection-sub?occasion=${occasion.id}`}
                            className="tf-btn btn-outline-light fw-5 btn-xl rounded-0"
                          >
                            <span>Shop Collection</span>
                            <i className="icon icon-arrow-right" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
      </Swiper>
      <div className="container wrap-navigation">
        <div className="nav-sw style-white nav-next-slider navigation-next-slider box-icon w_46 round snbhp1">
          <span className="icon icon-arrow-left" />
        </div>
        <div className="nav-sw style-white nav-prev-slider navigation-prev-slider box-icon w_46 round snbhn1">
          <span className="icon icon-arrow-right" />
        </div>
      </div>
    </section>
  );
}
