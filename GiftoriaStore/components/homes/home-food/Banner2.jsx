"use client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Banner2({
  bgUrl = "/images/slider/food-banner-collection.jpg",
  buttonLink = "/shop-collection-sub",
}) {
  const { t } = useTranslation();

  return (
    <section
      className="banner-hero-collection-wrap banner-parallax"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="box-content">
        <div className="container">
          <Link href={buttonLink} className="text-md-start text-center">
            <h4 className="heading mb-3">
              <span className="bell-t-medium">{t("banner2_heading")}</span>
            </h4>
            <p
              className="text mb-4"
              style={{ maxWidth: "600px", margin: "0", textAlign: "left" }}
            >
              <span className="montserrat-medium">{t("banner2_description")}</span>
            </p>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <button className="tf-btn style-2 fw-6 btn-fill animate-hover-btn mt-2">
                <span className="montserrat-semi-bold">{t("banner2_button")}</span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
