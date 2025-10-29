"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
  if (candidate.startsWith("storage/")) return `http://localhost:8000/${candidate}`;
  if (candidate.startsWith("public/")) {
    const normalized = candidate.replace(/^public\//, "storage/");
    return `http://localhost:8000/${normalized}`;
  }
  return `http://localhost:8000/storage/${candidate}`;
};

export default function Collection() {
  const { i18n } = useTranslation();
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccasions = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/occasions");
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
    <section className="flat-spacing-15">
      <div className="container-full">
        <div className="flat-title flex-row justify-content-between px-0">
        <span className="title wow fadeInUp" data-wow-delay="0s">
  {i18n.language === "ar" ? "المناسبات" : "Occasions"}
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
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          slidesPerView={3.5}
          spaceBetween={30}
          loop={false}
          breakpoints={{
            1200: { slidesPerView: 3.5 },
            768: { slidesPerView: 2.4 },
            0: { slidesPerView: 1.2 },
          }}
          modules={[Navigation]}
          navigation={{
            prevEl: ".snbp123",
            nextEl: ".snbn123",
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
    width:"100%",
    borderRadius: "0",
    objectFit: "cover",
  }}
/>

                      </div>

                      {/* ✅ Text left-aligned under image */}
                      <div className="collection-content text-left mt-4 px-1">
                      <h3
                          className="raleway-bold uppercase text-lg mb-2"
                          style={{ letterSpacing: "1px", textTransform: "uppercase" }}
                        >
                          {title}
                        </h3>

                        {desc && (
                          <p
                            className="raleway-light text-base mb-3 leading-relaxed"
                            style={{ color: "#555" ,textTransform: "uppercase" }}
                          >
                            {desc}
                          </p>
                        )}
                        <Link
                          href={`/shop-collection-sub?occasion=${occasion.id}`}
                          className="raleway-bold uppercase underline text-sm"
                          style={{ color: "#000" }}
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
