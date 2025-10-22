"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation(); // Initialize translation

  return (
    <>
      <section className="flat-spacing-23 flat-image-text-section">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
            <div className="tf-image-wrap">
              <Image
                className="lazyload w-100"
                data-src="/images/collections/collection-69.jpg"
                alt={t("about.image_alt")}
                src="/images/collections/collection-69.jpg"
                width={600}
                height={499}
              />
            </div>
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div>
                <div className="heading bell-t-medium">{t("about.our_mission_title")}</div>
                <div className="text montserrat-medium" style={{ textAlign: 'justify' }}>
                  {t("about.our_mission_text")}
                </div>

                {/* 'Our Vision' Block */}
                <div style={{ marginTop: '24px' }}>
                  <div className="heading bell-t-medium">{t("about.our_vision_title")}</div>
                  <div className="text montserrat-medium" style={{ textAlign: 'justify' }}>
                    {t("about.our_vision_text")}
                  </div>
                </div>

                {/* 'Our Values' Block */}
                <div style={{ marginTop: '24px' }}>
                  <div className="heading bell-t-medium">{t("about.our_values_title")}</div>
                  <div className="text montserrat-medium" style={{ textAlign: 'justify' }}>
                    <span className="montserrat-medium">
                      <strong>{t("about.elegance_title")} :</strong> {t("about.elegance_text")}
                      <br /><strong>{t("about.personalization_title")} :</strong> {t("about.personalization_text")}
                      <br /><strong>{t("about.excellence_title")} :</strong> {t("about.excellence_text")}
                      <br /><strong>{t("about.emotion_title")} :</strong> {t("about.emotion_text")}
                      <br /><strong>{t("about.creativity_title")} :</strong> {t("about.creativity_text")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
