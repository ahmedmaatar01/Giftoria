"use client";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function FeaturesAbout({ title, subtitle, items }) {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <section>
      <div className="container">
        <div className="bg_grey-2 radius-10 flat-wrap-iconbox">
          <div className="flat-title lg p-0">
            <span className="title bell-medium heading-30 mb-4">{t(title)}</span> {/* Translate title */}
            <div>
              <p className="sub-title text_black-2 raleway-light text-justify " style={{ lineHeight: '2', textAlign: 'justify', fontSize: '15px' }}>
                {t(subtitle)} {/* Translate subtitle */}
              </p>
            </div>
          </div>
          <div className="flat-iconbox-v3 lg">
            <div className="wrap-carousel wrap-mobile">
   
                <div className="box3">
                  {items.map((box, index) => (
                    <div className="boxabout">
                      <div className="tf-icon-box text-center">
                        <div className="content content ">
                          <div className="raleway-medium title  fw-normal d-block pfs-4 text-uppercase text-start" style={{ marginBottom:"0px"}}>{t(box.title)}</div> {/* Translate item title */}
                          <p className="text_black-2 raleway-light raleway-light  text-uppercase text-justify" style={{ fontSize: '15px' }}>{t(box.description)}</p> {/* Translate item description */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sw-dots style-2 sw-pagination-mb justify-content-center spd303about" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
