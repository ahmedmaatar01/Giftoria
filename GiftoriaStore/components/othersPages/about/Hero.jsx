"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation(); // Initialize translation

  return (
    <section className="tf-slideshow about-us-page position-relative">
      <div className="banner-wrapper">
        <Image
          className="lazyload"
          src="/images/slider/about-banner-01.jpg"
          alt="image-collection"
          width={2000}
          height={1262}
        />
        <div className="box-content text-center">
          <div className="container">
            <div className="text bell-t-medium text-start" style={{ color: 'black' }}>
              {t("hero.title")} <br className="d-xl-block d-none" />
              <span className="hero-title-small montserrat-medium" 
                style={{ fontFamily: 'Montserrat, Arial, Helvetica, sans-serif !important', fontWeight: '600 !important', lineHeight: '2' }}>
                {t("hero.subtitle")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
