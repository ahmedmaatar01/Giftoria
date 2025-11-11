"use client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function BannerHome1({
  bgUrl = "images/slider/shop012.jpg",
  buttonLink = "/contact-2",
  heading,
  description,
  buttonLabel,
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <section
      className="banner-hero-collection-wrap banner-parallax "
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.23), rgba(0, 0, 0, 0.30)),url(${bgUrl})` }}
    >
      <div className="box-content ">
        <div className="container">
          {/* <div className="text-md-start text-center">
            <h4 className="heading mb-4">
              <span className="bell-bold heading-30 c-titre">{heading ? heading : t("banner3_heading")}</span>
            </h4>
            <p
              className="text mb-4"
              style={{ maxWidth: "600px", margin: "0" }}
            >
              <span className="montserrat-regular text-start c-paragraph" style={{ textTransform: "uppercase" }}>{description ? description : t("banner3_description")}</span>
            </p>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <Link href={buttonLink}>
                <div className="ecomus-button-link ecomus-button em-button em-button-subtle" style={{
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  display: 'inline-block'
                }}>
                  <span className="raleway-regular text-uppercase   c-butn" style={{ textDecoration: "none" }}  >{buttonLabel ? buttonLabel : t("banner3_button")}  </span>
                </div>
              </Link>
            </div>
          </div> */}
          <div className="text-c" style={{ width: "550px" }}>
            <h4 className="heading mb-4">
              <span className="bell-bold c-titre text-white" style={{ fontSize: "42px" }}>{t("banner3_heading")}</span>
            </h4>
            {/* ✅ Dynamic text alignment */}
            <p
              className="text mb-4 text-white "
              style={{
                maxWidth: "600px",
                margin: "0",
                textAlign: isArabic ? "right" : "left",
                direction: isArabic ? "rtl" : "ltr",
                letterSpacing: "2px",
                fontSize: isArabic ? "20px" : "15px"
              }}
            >
              <span className={`${isArabic ? "arabic_vip" : "raleway-regular"} c-paragraph text-white text-uppercase`}>{description ? description : t("banner3_description")}</span>
            </p>
            <Link href={buttonLink} >
              <div className="ecomus-button-link ecomus-button em-button em-button-subtle" style={{
                borderBottom: '1px solid #ffffffff',
                display: 'inline-block',
                paddingBottom: '2px'
              }}>

                <span className={`${isArabic ? "arabic_vip" : "raleway-regular"} text-uppercase c-butn text-white`} style={{ textDecoration: "none" }}>{t("banner3_button")} </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
