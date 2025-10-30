"use client";
import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t, i18n } = useTranslation();

  return (
    <section className="tf-slideshow slider-video position-relative">
      <div className="banner-wrapper">
        <video
          src="/images/slider/slider-video-2.mp4"
          autoPlay
          muted
          playsInline
          loop
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
        <div className="box-content text-center">
          <div className="container wow fadeInUp" data-wow-delay="0s">
            <p className="subheading text-white fw-7 raleway-medium">
              {t("hero_subheading")}
            </p>
            <h1 className="heading text-white bell-medium" style={{ fontSize: '60px' }}>
              {t("hero_heading")}
            </h1>
            <p className="description text-white banner-title-montserrat">
              {t("hero_description")}
            </p>
            <Link
              href="/shop-left-sidebar"
           
            >
               <div className="ecomus-button-link ecomus-button em-button em-button-subtle" style={{ marginTop: "10px" }}>
              <span  className="raleway-regular text-uppercase  "style={{textDecoration:"underline", color: "#fff" }}>{t("hero_button")} </span>
              </div>
            </Link>
          
          </div>
        </div>
      </div>
    </section>
  );
}
