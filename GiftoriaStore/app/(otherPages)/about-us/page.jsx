import Footer1 from "@/components/footers/Footer1";
import About from "@/components/othersPages/about/About";
import Features from "@/components/othersPages/about/Features";
import FeaturesAbout from "@/components/othersPages/about/FeaturesAbout";
import Banner from "@/components/homes/home-pickleball/Banner";
import Hero from "@/components/othersPages/about/Hero";
import Link from "next/link";
import Image from "next/image";
import Products2 from "@/components/homes/home-baby/Products2";
import React from "react";
import Header10 from "@/components/headers/Header10";
import Topbar1 from "@/components/headers/Topbar1";
export const metadata = {
  title: "About Us || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header10 />

      <Hero />
      {/* New FeaturesAbout component under the header */}
      <div style={{ marginTop: '60px' }}>
        <FeaturesAbout
          title="Brand Presentation"
          items={[
            { iconClass: "icon-star", title: "Premium Quality", description: "Only the finest materials and craftsmanship." },
            { iconClass: "icon-heart", title: "Thoughtful Curation", description: "Handpicked gifts for every occasion." },
            { iconClass: "icon-gift", title: "Personalized Touch", description: "Custom options for a unique experience." },

          ]}
          subtitle={`In the timeless art of gifting, collaboration is our finest treasure. We take pride in joining hands with distinguished artisans, chocolatiers, florists, and creators who share our devotion to elegance and authenticity. Together, we craft experiences that transcend mere presents — weaving stories of craftsmanship, trust, and enduring grace.`}

        />
      </div>
      <About />
      <div style={{ marginBottom: '80px' }}>
        <Products2 />
      </div>
  <Features />
  <div style={{ marginTop: '60px' }} />
  <Banner />
      <section className="flat-spacing-10">
        <div className="container">
          <div className="tf-grid-layout md-col-2">
            <div className="tf-ourstore-img">
              
              <Image
                className="lazyload"
                data-src="/images/shop/store/ourstore4.png"
                alt="our-store"
                src="/images/shop/store/ourstore4.png"
                width={550}
                height={420}
              />
            </div>
            
            <div className="tf-ourstore-content " style={{paddingLeft:"60px"}}>
              <h5 className="mb_24 bell-t-medium">Giftoria Qatar</h5>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Address</strong>
                </p>
                <p>66 Mott St, New York, New York, Zip Code: 10006, AS</p>
              </div>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Phone</strong>
                </p>
                <p>(623) 934-2400</p>
              </div>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Email</strong>
                </p>
                <p>EComposer@example.com</p>
              </div>
              <div className="mb_36">
                <p className="mb_15">
                  <strong>Open Time</strong>
                </p>
                <p className="mb_15">Our store has re-opened for shopping,</p>
                <p>exchange Every day 11am to 7pm</p>
              </div>
              {/* social icons removed per request */}
              <div>
                <Link
                  href={`/contact-2`}
                  className="tf-btn btn-outline-dark radius-3"
                >
                  <span>Get Directions</span>
                  <i className="icon icon-arrow-right" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
      <div className="container">
        <div className="line"></div>
      </div>
      <Footer1 />
    </>
  );
}
