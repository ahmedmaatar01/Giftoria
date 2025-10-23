"use client";

import { iconBoxData } from "@/data/features";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t, i18n } = useTranslation();

  return (
    <section className="flat-spacing-7 flat-iconbox wow fadeInUp" data-wow-delay="0s">
      <div className="container">
        <div className="wrap-carousel wrap-mobile">
          <Swiper
            dir={i18n.dir()} // Switches to rtl if Arabic is selected
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
                    <div className="title bell-t-medium">{t(elm.titleKey)}</div>
                    <p className="montserrat-regular">{t(elm.descriptionKey)}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="sw-dots style-2 sw-pagination-mb justify-content-center spd103" />
        </div>
      </div>
    </section>
  );
}
