import React from "react";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="tf-slideshow about-us-page position-relative">
      <div className="banner-wrapper">
        <Image
          className="lazyload"
          src="/images/slider/about-banner-01.jpg"
          data-=""
          alt="image-collection"
          width={2000}
          height={1262}
        />
        <div className="box-content text-center">
          <div className="container">
            <div className="text bell-t-medium text-start" style={{ color: 'black' }}>
              The Story of Giftoria <br className="d-xl-block d-none" />
              <span className="hero-title-small montserrat-medium" style={{fontFamily: 'Montserrat, Arial, Helvetica, sans-serif !important', fontWeight: '600 !important', lineHeight: '2'}}>Where every gift is wrapped in timeless grace, a blend <br /> of elegance, emotion, and lasting charm.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
