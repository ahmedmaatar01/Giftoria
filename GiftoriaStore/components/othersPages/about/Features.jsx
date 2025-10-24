"use client";

import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { iconBoxes4 } from "@/data/features"; // Assume this data has titles and descriptions to translate
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Features() {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <section>
      <div className="container">
        <div className="bg_grey-2 radius-10 flat-wrap-iconbox">
          <div className="flat-title lg">
            <span className="title fw-5 bell-t-medium heading-30" style={{ fontSize: '30px', textTransform: 'uppercase' }}>{t("productFeatures.title")}</span> {/* Translate title */}
            <div>
              <p className="sub-title text_black-2 montserrat-regular" style={{ fontSize: '15px' }}>
                {t("productFeatures.subtitle")}
              </p> {/* Translate subtitle */}

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
                pagination={{ clickable: true, el: ".spd303" }}
              >
                {iconBoxes4.map((box, index) => (
                  <SwiperSlide key={index}>
                    <div className="tf-icon-box text-center">
                      <div className="icon">
                        <i className={box.iconClass} />
                      </div>
                      <div className="content">
                        <div className="title bell-t-medium" style={{ fontSize: '28px' }}>{t(box.title)}</div> {/* Translate item title */}
                        <p className="text_black-2 montserrat-regular" style={{ fontSize: '15px' }}>{t(box.description)}</p> {/* Translate item description */}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                <div className="sw-dots style-2 sw-pagination-mb justify-content-center spd303" />
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
