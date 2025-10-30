"use client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function BannerHome1({
  bgUrl = "images/slider/fashion-slideshow-01.jpg",
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
              <span className="bell-bold heading-30">{heading ? heading : t("banner3_heading")}</span>
            </h4>
            <p
              className="text mb-4"
              style={{ maxWidth: "600px", margin: "0", textAlign: "left" }}
            >
              <span className="montserrat-regular text-start" style={{  textTransform: "uppercase" }}>{description ? description : t("banner3_description")}</span>
            </p>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <Link href={buttonLink}>
                <div className="ecomus-button-link ecomus-button em-button em-button-subtle">
                  <span className="raleway-regular text-uppercase  "style={{textDecoration:"underline"}}  >{buttonLabel ? buttonLabel : t("banner3_button")}  </span>
                </div>
              </Link>
              {/* <a href="#" className="ecomus-button-link ecomus-button em-button em-button-subtle"> <span className="ecomus-button-text">Button Underline</span> </a>  */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
