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
         
            <h4 className="heading mb-3">
              <span className="bell-bold heading-30">{t("banner2_heading")}</span>
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
              <span className="raleway-medium">{t("banner2_description")}</span>
            </p>
            <Link href={buttonLink} >
            <div className="ecomus-button-link ecomus-button em-button em-button-subtle" >
             
                <span className="raleway-regular text-uppercase" style={{textDecoration:"underline"}}>{t("banner2_button")} </span>
              
              
            </div>
            
          </Link>
        </div>
     
      </div>
    </section>
  );
}
