"use client";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function FeaturesAbout({ title, subtitle, items }) {
  return (
    <section>
      <div className="container">
        <div className="bg_grey-2 radius-10 flat-wrap-iconbox">
          <div className="flat-title lg">
            <span className="title fw-5 bell-t-medium">{title}</span>
            <div>
              <p className="sub-title text_black-2 montserrat-medium" style={{ lineHeight: '2', textAlign: 'justify' }}>{subtitle}</p>
            </div>
          </div>
          <div className="flat-iconbox-v3 lg">
            <div className="wrap-carousel wrap-mobile">
              <Swiper
                dir="ltr"
                spaceBetween={15}
                slidesPerView={3}
                breakpoints={{
                  768: { slidesPerView: 3, spaceBetween: 15 },
                  480: { slidesPerView: 2, spaceBetween: 15 },
                  0: { slidesPerView: 1, spaceBetween: 15 },
                }}
                className="swiper tf-sw-mobile"
                modules={[Pagination]}
                pagination={{ clickable: true, el: ".spd303about" }}
              >
                {items.map((box, index) => (
                  <SwiperSlide key={index}>
                    <div className="tf-icon-box text-center">
                      <div className="content">
                        <div className="title bell-t-medium">{box.title}</div>
                        <p className="text_black-2 desc-lg">{box.description}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                <div className="sw-dots style-2 sw-pagination-mb justify-content-center spd303about" />
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
