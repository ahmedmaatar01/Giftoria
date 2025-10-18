import Link from "next/link";
import React from "react";

export default function Banner2({
  bgUrl = "images/slider/food-banner-collection.jpg",
  heading = "Step Into the World of Giftoria",
  description = `GIFTORIA.me is a luxury brand born from a desire to transform the art of gifting into an unforgettable, emotional experience. Every detail, from the design of our products to the personal touch behind each gift, is carefully crafted to reflect elegance, intention, and meaning.`,
  buttonLink = "/shop-collection-sub",
  buttonLabel = "Start shopping"
}) {
  return (
    <section
      className="banner-hero-collection-wrap banner-parallax"
      style={{
        backgroundImage: `url(${bgUrl})`,
      }}
    >
      <div className="box-content">
        <div className="container">
          <Link
            href={buttonLink}
            className="text-md-start text-center"
          >
            <h4 className="heading mb-3"><span className="bell-t-medium">{heading}</span></h4>
            <p className="text mb-4" style={{ maxWidth: '600px', margin: '0', textAlign: 'left' }}>
              <span className="montserrat-medium">
                {description}
              </span>
            </p>
            <div className="wow fadeInUp" data-wow-delay="0s">
              <button className="tf-btn style-2 fw-6 btn-fill animate-hover-btn mt-2">
                <span className="montserrat-semi-bold">{buttonLabel}</span>
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
