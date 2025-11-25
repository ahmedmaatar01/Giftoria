"use client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Banner2({
  bgUrl = "/images/slider/stepintov12.mp4",
  buttonLink = "/shop-left-sidebar",
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <section
      className="banner-hero-collection-wrap banner-parallax home-b-1"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          objectFit: 'cover'
        }}
      >
        <source src={bgUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0
        }}
      />

      <div className="box-content first-banner-home" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container" >
          <div className="text-c" style={{ width: "550px" }}>
            <h4 className="heading mb-4">
              <span className="bell-bold c-titre text-white" style={{ fontSize: "42px" }}>{t("banner2_heading")}</span>
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
              <span className="raleway-regular c-paragraph text-white text-uppercase">{t("banner2_description")}</span>
            </p>
            <Link href={buttonLink} >
              <div className="ecomus-button-link ecomus-button em-button em-button-subtle " style={{
                borderBottom: '1px solid #ffffffff',
                display: 'inline-block',
                paddingBottom: '2px'
              }}>

                <span className={`${isArabic ? "arabic_vip" : "raleway-regular"} text-uppercase c-butn text-white`} style={{ textDecoration: "none" }}>{t("banner2_button")} </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
