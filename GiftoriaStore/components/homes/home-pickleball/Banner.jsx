"use client";

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Banner() {
  const { t } = useTranslation();

  return (
    <section className="flat-spacing-22">
      <div className="container">
        <div
          className="tf-grid-layout md-col-2 tf-img-with-text style-5"
          style={{ background: '#ffffff', border: '1px solid #E8DBC8', borderRadius: '50px' }}
        >
          <div
            className="tf-content-wrap w-100 pe-xl-5 wow fadeInUp"
            data-wow-delay="0s"
          >
            <div className="heading">
              <span className="bell-medium" style={{ fontSize: '30px', textTransform: 'uppercase' }}>
                {t("partners_heading")}
              </span>
            </div>
            <p className="description text_black-2 montserrat-regular" style={{ fontSize: '15px' }}>
              {t("partners_description")}
            </p>

            <div
              className="partners-logos d-flex justify-content-center gap-30 mb_30"
              style={{ marginTop: '50px' }}
            >
              <div className="partner-logo">
                <Image
                  src="/images/logo/partner1.png"
                  alt="Partner 1"
                  width={179}
                  height={64}
                />
              </div>
              <div className="partner-logo">
                <Image
                  src="/images/logo/partner2.png"
                  alt="Partner 2"
                  width={179}
                  height={64}
                />
              </div>
            </div>
          </div>
          <div className="tf-image-wrap">
            <Image
              className="lazyload"
              data-src="/images/collections/banner-cls-pickleball.jpg"
              alt="collection-img"
              src="/images/collections/banner-cls-pickleball.jpg"
              width={800}
              height={598}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
