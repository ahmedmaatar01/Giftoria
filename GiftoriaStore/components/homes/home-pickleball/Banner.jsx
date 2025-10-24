import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Banner() {
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
              <span className="bell-t-medium" style={{ fontSize: '30px', textTransform: 'uppercase' }}>OUR ESTEEMED PARTNERS</span>
            </div>
            <p className="description text_black-2 montserrat-regular" style={{ fontSize: '15px' }}>
             In the timeless art of gifting, collaboration is our finest treasure.
             We take pride in joining hands with distinguished artisans, chocolatiers,
             florists, and creators who share our devotion to elegance and authenticity.
             Together, we craft experiences that transcend mere presents —
             weaving stories of craftsmanship, trust, and enduring grace.
            </p>

            <div className="partners-logos d-flex justify-content-center gap-30 mb_30" style={{ marginTop: '50px' }}>
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
