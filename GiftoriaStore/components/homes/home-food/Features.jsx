"use client";

import { slides22 } from "@/data/categories";
import Link from "next/link";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t } = useTranslation();
  const features = slides22.slice(0, 4);

  return (
    <section className="flat-spacing-18 bg_beige-4">
      <div className="container">
        <div className="flat-title mb-lg text-center wow fadeInUp" data-wow-delay="0s">
          <span className="title bell-t-medium">
            {t("features_title_line1")} <br />
            {t("features_title_line2")}
          </span>
        </div>
        <div className="row justify-content-center wow fadeInUp" data-wow-delay="0s">
          {features.map((slide, idx) => (
            <div className="col-12 col-md-6 mb-4 d-flex align-items-stretch" key={idx}>
              <div className="tf-icon-box style-lg w-100 text-center p-4" style={{ boxShadow: "none" }}>
                <div className="content">
                  <Link href="/shop-default" className="title link fw-normal">
                    {t(`features_slide_${idx + 1}_title`)}

                  </Link>
                  <p>{t(`features_slide_${idx + 1}_description`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
