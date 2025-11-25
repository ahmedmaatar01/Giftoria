"use client";

import { slides22 } from "@/data/categories";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t, i18n } = useTranslation();
  const features = slides22.slice(0, 4);

  return (
    <section className="flat-spacing-18 bg_beige-4 experience1-home">
      <div className="container">
        <div className="flat-title mb-lg text-center wow fadeInUp" data-wow-delay="0s">
          <span className={`title bell-medium heading-30`}>
            {i18n.language === "ar" ? (
              // Arabic — 1 line
              <>
                {t("features_title_line1")} {t("features_title_line2")}
              </>
            ) : (
              // English — 2 lines
              <>
                {t("features_title_line1")} <br />
                <span className="title2ndline" style={{ marginTop: "10px", display: "inline-block" }}>
                  {t("features_title_line2")}
                </span>
              </>
            )}
          </span>
        </div>

        <div className="row justify-content-center wow fadeInUp" data-wow-delay="0s">
          {features.map((slide, idx) => (
            <div className="col-12 col-md-6 mb-4 d-flex align-items-stretch justify-content-center" key={idx}>
              <div className="tf-icon-box style-lg w-100 text-center p-4 d-flex justify-content-center" style={{ boxShadow: "none" }}>
                <div className="content " style={{ width: "360px" }}>
                  <span className={`${i18n.language === "ar" ? "arabic_vip" : "raleway-medium"} title fw-normal d-block text-start pfs-4`} style={{ letterSpacing: "1px", textTransform: "uppercase" }}>{t(`features_slide_${idx + 1}_title`)}</span>
                  <p className={`${i18n.language === "ar" ? "arabic_vip" : "raleway-light"} text-start`} style={{ textTransform: "uppercase" }}>{t(`features_slide_${idx + 1}_description`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
