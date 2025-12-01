"use client";

import { iconBoxData } from "@/data/features";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section className="flat-spacing-7 flat-iconbox wow fadeInUp" data-wow-delay="0s">
      <div className="container">
        <div className="wrap-carousel wrap-mobile">
          {isMobile ? (
            <div className="features-list-mobile">
              {iconBoxData.map((elm, i) => (
                <div key={i} className="tf-icon-box style-border-line text-center" style={{marginBottom: 20}}>
                  <div className="icon">
                    <i className={elm.iconClass} />
                  </div>
                  <div className="content">
                    <div className="title raleway-medium arabic_div" style={{ textTransform: "uppercase" }}>{t(elm.titleKey)}</div>
                    <p className="raleway-light" style={{ textTransform: "uppercase" }}>{t(elm.descriptionKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              dir={i18n.dir()}
              slidesPerView={4}
              spaceBetween={30}
              breakpoints={{
                1200: { slidesPerView: 4 },
                800: { slidesPerView: 3 },
                600: { slidesPerView: 2 },
                0: { slidesPerView: 1 },
              }}
              className="swiper tf-sw-mobile"
              data-preview={1}
              data-space={15}
              modules={[Pagination]}
              pagination={{ clickable: true, el: ".spd103" }}
            >
              {iconBoxData.map((elm, i) => (
                <SwiperSlide key={i} className="swiper-slide">
                  <div className="tf-icon-box style-border-line text-center">
                    <div className="icon">
                      <i className={elm.iconClass} />
                    </div>
                    <div className="content">
                      <div className="title raleway-medium arabic_div" style={{  textTransform: "uppercase" }}>{t(elm.titleKey)}</div>
                      <p className="raleway-light" style={{  textTransform: "uppercase" }}>{t(elm.descriptionKey)}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
