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
                <div>
                  <div className="heading raleway-bold heading-30" style={{ fontSize: '30px', textTransform: 'uppercase' }}>{t("about.craft_title")}</div>
                  <div className="text raleway-light" style={{ textAlign: 'justify', fontSize: '15px' }}>
                    {t("about.craft_description")}

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
