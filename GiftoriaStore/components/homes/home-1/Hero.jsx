<<<<<<< HEAD
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
          src="/images/slider/exp1.mp4"
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
               <div className="ecomus-button-link ecomus-button em-button em-button-subtle"  style={{
                    marginTop: "20px",
                    padding: "22px 45px",     
                    borderRadius: "8px",      
                    fontSize: "20px",         
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "280px"         
                  }} >
              <span  className="raleway-regular text-uppercase  "style={{textDecoration:"underline", color: "#fff" }}>{t("hero_button")} </span>
              </div>
            </Link>
          
          </div>
        </div>
      </div>
    </section>
  );
}
=======
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_BASE_URL_WITH_API, API_STORAGE_URL } from "../../../utils/config";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [homeDetail, setHomeDetail] = useState(null);

  useEffect(() => {
    // Adjust the URL to your backend API endpoint
    axios.get(`${API_BASE_URL_WITH_API}/home-page-details`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setHomeDetail(res.data[0]);
        } else if (res.data && res.data.id) {
          setHomeDetail(res.data);
        }
      })
      .catch(() => setHomeDetail(null));
  }, []);

  // Dynamic content if available, else fallback
  const isArabic = i18n.language === 'ar';
  const heroType = homeDetail?.hero_type;
  const heroMedia = homeDetail?.hero_media;
  const heroTitle = isArabic ? homeDetail?.hero_title_ar : homeDetail?.hero_title_en;

  return (
    <section className="tf-slideshow slider-video position-relative">
      <div className="banner-wrapper">
        {homeDetail ? (
          heroType === 'video' ? (
            <video
              src={`${API_STORAGE_URL}/${heroMedia}`}
              autoPlay
              muted
              playsInline
              loop
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={`${API_STORAGE_URL}/${heroMedia}`}
              alt="Hero"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          )
        ) : (
          <video
            src="/images/slider/exp1.mp4"
            autoPlay
            muted
            playsInline
            loop
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        )}
        <div className="box-content text-center">
          <div className="container wow fadeInUp" data-wow-delay="0s">
            <p className="subheading text-white fw-7 raleway-medium">
              {t("hero_subheading")}
            </p>
            <h1 className="heading text-white bell-medium" style={{ fontSize: '60px' }}>
              {homeDetail && heroTitle ? heroTitle : t("hero_heading")}
            </h1>
            <p className="description text-white banner-title-montserrat">
              {t("hero_description")}
            </p>
            <Link href="/shop-left-sidebar">
              <div className="ecomus-button-link ecomus-button em-button em-button-subtle"  style={{
                marginTop: "20px",
                padding: isArabic ? "26px 55px" : "22px 45px",
                borderRadius: "8px",
                fontSize: isArabic ? "24px" : "20px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: isArabic ? "320px" : "280px"
              }} >
                <span className="raleway-regular text-uppercase" style={{textDecoration:"underline", color: "#fff"}}>
                  {t("hero_button")}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
>>>>>>> origin/main
