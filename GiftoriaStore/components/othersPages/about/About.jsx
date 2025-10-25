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
                  <div className="heading bell-t-medium heading-30" style={{ fontSize: '30px', textTransform: 'uppercase' }}>THE ART BEHIND OUR CRAFT</div>
                  <div className="text montserrat-regular" style={{ textAlign: 'justify', fontSize: '15px', fontFamily: 'Montserrat, Arial, Helvetica, sans-serif' }}>
                    From delicate blooms to hand-crafted cakes and bespoke wedding treasures, we turn every idea into a masterpiece made just for you. Our craft is rooted in timeless elegance — where every petal, ribbon, and shade of ivory whispers the language of love.




Imagine a charming flower cart adorned with lace and antique brass, overflowing with soft garden roses, baby’s breath, and fresh lavender — a vintage dream come to life. It greets your guests with fragrance and romance, a moving piece of art that captures the soul of your celebration.




Each creation we design, from sugared petals on a cake to hand-tied bouquets, carries a touch of nostalgia and grace. We believe beauty lives in the smallest gestures — in the twirl of satin, the sparkle of glass, the gentle flutter of a ribbon caught by the wind.




Whether it’s the whisper of petals, the sweetness of icing, or the magic of your “I do,” our art tells your love story in the most enchanting way. Beautifully personal, eternally timeless — a celebration wrapped in charm, crafted with heart, and remembered forever.
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
