"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function HeroContact() {
  const { t } = useTranslation(); // Translation hook

  return (
    <section className="tf-slideshow contact-page position-relative">
      <div className="banner-wrapper">
        <Image
          className="lazyload"
          src="/images/slider/hero-banner.jpg"
          alt="contact-banner"
          width={2000}
          height={1262}
        />
        <div className="box-content text-center">
          <div className="container">
            <div className="text text-start" style={{ color: "black" }}>
              <h1 className="heading bell-t-medium">{t("contact.hero_title")}</h1>
              <p
                className="hero-title-small montserrat-medium"
                style={{ lineHeight: "1.6" }}
              >
                {t("contact.hero_description_line1")}
                <br />
                {t("contact.hero_description_line2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
