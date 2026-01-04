"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t, i18n } = useTranslation(); // Initialize translation
  const isArabic = i18n.language === "ar";

  return (
    <section className="tf-slideshow about-us-page position-relative">
      <div className="banner-wrapper ">
        <Image
          className="lazyload"
          src="/images/slider/aboutbanner.jpg"
          alt="image-collection"
          width={2000}
          height={1262}
        />
        <div className="box-content text-center ">
          <div className="container">
            <div className="text bell-medium text-start  text-white">
              <div className="container-te" style={isArabic ? { maxWidth: "350px", lineHeight: "24px" } : { maxWidth: "550px" }}>

                <span className="heading bell-medium text-white mb-5" style={{ fontSize: "60px", whiteSpace: "pre-line" }}>{t("hero.title")} </span> <br className="d-xl-block d-none" />
                <div className="mt-5" style={{ lineHeight: "28px", fontWeight: "500" }}>
                  <span className="description banner-title-montserrat text-white" >
                    {t("hero.subtitle")}
                  </span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
