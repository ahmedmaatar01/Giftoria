"use client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Banner2({
  bgUrl = "/images/slider/food-banner-collection.jpg",
  buttonLink = "/shop-left-sidebar",
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <section
      className="banner-hero-collection-wrap banner-parallax"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="box-content">
        <div className="container">
          <Link href={buttonLink} className="text-md-start text-center">
            <h4 className="heading mb-3">
              <span className="bell-bold heading-30">{t("banner3_heading")}</span>
            </h4>

            {/* ✅ Dynamic text alignment */}
            <p
              className="text mb-4"
              style={{
                maxWidth: "600px",
                margin: "0",
                textAlign: isArabic ? "right" : "left",
                direction: isArabic ? "rtl" : "ltr",
              }}
            >
              <span className="raleway-medium">{t("banner3_description")}</span>
            </p>

            <div className="wow fadeInUp" data-wow-delay="0s">
              <button className="btn-link-arrow raleway-light ">
                <span className="montserrat-semi-bold">{t("banner3_button")} </span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
