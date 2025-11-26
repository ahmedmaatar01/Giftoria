"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, API_BASE_URL_WITH_API } from "@/utils/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";

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
  if (/^https?:\/\//i.test(candidate)) return candidate;
  candidate = candidate.replace(/^\/+/, "");
  // Use API_BASE_URL for all backend image links
  const base = API_BASE_URL;
  if (candidate.startsWith("storage/")) return `${base}/${candidate}`;
  if (candidate.startsWith("public/")) {
    const normalized = candidate.replace(/^public\//, "storage/");
    return `${base}/${normalized}`;
  }
  return `${base}/storage/${candidate}`;
};

export default function Collection() {
  const { i18n } = useTranslation();
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccasions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL_WITH_API}/occasions`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.data || [];
        setOccasions(items);
      } catch (err) {
        console.error("[Collection] Error fetching occasions:", err);
        setOccasions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
  }, []);

  return (
    <section className="flat-spacing-15 occasions" >
      <div className="container-full">
        <div className="flat-title flex-row justify-content-between px-0">
          <span className="bell-medium heading-30" data-wow-delay="0s">
            {i18n.language === "ar" ? "المناسبات" : "OCCASIONS"}
          </span>

          <div className="box-sw-navigation">
            <div className="nav-sw nav-next-slider nav-next-collection snbp123">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider nav-prev-collection snbn123">
              <span className="icon icon-arrow-right" />
            </div>
          </div>
        </div>

        <Swiper
          key={`collection-swiper-${i18n.language}`}
          dir="ltr"
          slidesPerView={3.5}
          spaceBetween={30}
          loop={occasions.length > 3}
          centeredSlides={false}
          allowTouchMove={true}
          grabCursor={true}
          watchSlidesProgress={true}
          watchOverflow={true}
          speed={800}
          freeMode={false}
          slidesPerGroup={1}
          touchRatio={1}
          touchAngle={45}
          simulateTouch={true}
          followFinger={true}
          shortSwipes={true}
          longSwipes={true}
          longSwipesRatio={0.5}
          longSwipesMs={300}
          resistance={true}
          resistanceRatio={0.85}
          threshold={0}
          touchMoveStopPropagation={false}
          breakpoints={{
            1200: { slidesPerView: 3.5, spaceBetween: 30 },
            768: { slidesPerView: 2.4, spaceBetween: 25 },
            0: { slidesPerView: 2, spaceBetween: 20 },
          }}
          modules={[Navigation]}
          navigation={{
            prevEl: ".snbp123",
            nextEl: ".snbn123",
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.navigation.update();
              swiper.update();
            }, 150);
          }}
          onSlideChange={() => {
            // Additional smoothness on slide change
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
              <SwiperSlide key={`collection-loading-${idx}`}>
                <div
                  style={{
                    width: "100%",
                    height: 600,
                    background: "#f3f3f3",
                  }}
                />
              </SwiperSlide>
            ))
            : occasions.map((occasion) => {
              const imgSrc = resolveOccasionImage(occasion) || "/images/no-image.png";
              const title =
                i18n.language === "ar" && occasion?.arabic_name
                  ? occasion.arabic_name
                  : occasion?.name || "Occasion";
              const desc =
                i18n.language === "ar" && occasion?.arabic_description
                  ? occasion.arabic_description.replace(/<[^>]*>/g, "").slice(0, 140)
                  : occasion?.description
                    ? occasion.description.replace(/<[^>]*>/g, "").slice(0, 140)
                    : "";

              return (
                <SwiperSlide key={occasion.id}>
                  <div className="collection-item-v3 hover-img">

                    <div className="collection-image w-full h-[900px] overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={title}
                        width={300}
                        height={500}
                        className="lazyload object-cover"
                        style={{
                          width: "100%",
                          borderRadius: "0",
                          objectFit: "cover",
                        }}
                      />

                    </div>

                    {/* Text alignment based on language direction */}
                    <div
                      className="collection-content mt-4 px-1"
                      style={{
                        textAlign: i18n.language === "ar" ? "right" : "left",
                        direction: i18n.language === "ar" ? "rtl" : "ltr"
                      }}
                    >
                      <h3
                        className="raleway-bold uppercase text-lg mb-2"
                        style={{
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          direction: i18n.language === "ar" ? "rtl" : "ltr"
                        }}
                      >
                        {title}
                      </h3>

                      {desc && (
                        <p
                          className="raleway-light text-base mb-3 leading-relaxed"
                          style={{
                            color: "#555",
                            direction: i18n.language === "ar" ? "rtl" : "ltr"
                          }}
                        >
                          {desc}
                        </p>
                      )}
                      <Link
                        href={`/shop-collection-sub?occasion=${occasion.id}`}
                        className="raleway-light uppercase text-sm"
                        style={{
                          textDecoration: "underline",
                          direction: i18n.language === "ar" ? "rtl" : "ltr"
                        }}
                      >
                        {i18n.language === "ar" ? "اقرأ المزيد" : "READ MORE"}
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </section>
  );
}
