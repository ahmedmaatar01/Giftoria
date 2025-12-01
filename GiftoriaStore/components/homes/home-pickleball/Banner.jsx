"use client";

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Banner() {
  const { t } = useTranslation();

  return (
    <section className="flat-spacing-22 mb-5 about-partners-banner">
      <div className="container">
        <div
          className="tf-grid-layout md-col-2 tf-img-with-text style-5"
          style={{ background: '#ffffff', borderRadius: '0px' }}
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
            <p className="description text_black-2 montserrat-regular" style={{ fontSize: '15px', lineHeight: '2.5' }}>
              {t("partners_description")}
            </p>

            <div
              className="partners-logos d-flex gap-30 mb_30"
              style={{ marginTop: '50px' }}
            >
              <div className="partner-logo">
                <Image
                  src="/images/logo/partner1.png"
                  alt="Partner 1"
                  width={130}
                  height={64}
                />
              </div>
              <div className="partner-logo">
                <Image
                  src="/images/logo/partner2.png"
                  alt="Partner 2"
                  width={140}
                  height={64}
                />
              </div>
            </div>
          </div>
          <div className="tf-image-wrap ">
            <Image
              className="lazyload"
              data-src="/images/about/partners.png"
              alt="collection-img"
              src="/images/about/partners.png"
              width={800}
              height={598}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
