import React from "react";
import Image from "next/image";

export default function HeroContact() {
  return (
    <section className="tf-slideshow contact-page position-relative">
      <div className="banner-wrapper">
        <Image
          className="lazyload"
          src="/images/slider/hero-banner.jpg"
          data-=""
          alt="contact-banner"
          width={2000}
          height={1262}
        />
        <div className="box-content text-center">
          <div className="container">
            <div className="text text-start" style={{ color: "black" }}>
              <h1 className="heading bell-t-medium">Contact Us</h1>
              <p className="hero-title-small montserrat-medium" style={{ lineHeight: "1.6" }}>
                We’d love to hear from you — questions, custom orders, <br />and feedback are welcome.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
