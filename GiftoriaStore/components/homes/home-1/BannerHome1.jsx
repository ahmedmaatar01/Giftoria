"use client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function BannerHome1({
  bgUrl = "/images/slider/food-banner-collection.jpg",
  buttonLink = "/contact-2",
  heading,
  description,
  buttonLabel,
}) {
  const { t } = useTranslation();

  return (
    <section
      className="banner-hero-collection-wrap banner-parallax"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="box-content">
        <div className="container">
          <div className="text-md-start text-center">
            <h4 className="heading mb-3">
              <span className="bell-t-medium heading-30">{heading ? heading : t("banner3_heading")}</span>
            </h4>
            <p
              className="text mb-4"
              style={{ maxWidth: "600px", margin: "0", textAlign: "left" }}
            >
              <span className="montserrat-regular">{description ? description : t("banner3_description")}</span>
            </p>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <Link href={buttonLink}>
                <button className="tf-btn style-2 fw-6 btn-fill animate-hover-btn mt-2">
                  <span className="montserrat-semi-bold">{buttonLabel ? buttonLabel : t("banner3_button")}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
