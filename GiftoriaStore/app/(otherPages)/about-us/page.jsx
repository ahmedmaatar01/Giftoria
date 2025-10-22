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
import StoreContent from "@/components/othersPages/about/StoreContent";
export const metadata = {
  title: "About Us || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
const storeData = {
  storeName: "Giftoria Qatar",
  address: "66 Mott St, New York, New York, Zip Code: 10006, AS",
  phone: "(623) 934-2400",
  email: "EComposer@example.com",
  openTime: "Our store has re-opened for shopping, exchange Every day 11am to 7pm",
  socialLinks: [
    {
      url: "#",
      className: "social-facebook border-line-black",
      iconClass: "icon-fb",
    },
    {
      url: "#",
      className: "social-twiter border-line-black",
      iconClass: "icon-Icon-x",
    },
    {
      url: "#",
      className: "social-instagram border-line-black",
      iconClass: "icon-instagram",
    },
    {
      url: "#",
      className: "social-tiktok border-line-black",
      iconClass: "icon-tiktok",
    },
    {
      url: "#",
      className: "social-pinterest border-line-black",
      iconClass: "icon-pinterest-1",
    },
  ],
  getDirectionsLink: "/contact-2",
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
  title="company.brand_presentation_title"
  subtitle="company.brand_presentation_subtitle"
  items={[
    { iconClass: "icon-star", title: "company.premium_quality_title", description: "company.premium_quality_description" },
    { iconClass: "icon-heart", title: "company.thoughtful_curation_title", description: "company.thoughtful_curation_description" },
    { iconClass: "icon-gift", title: "company.personalized_touch_title", description: "company.personalized_touch_description" },
  ]}
/>
          subtitle={`In the timeless art of gifting, collaboration is our finest treasure. We take pride in joining hands with distinguished artisans, chocolatiers, florists, and creators who share our devotion to elegance and authenticity. Together, we craft experiences that transcend mere presents — weaving stories of craftsmanship, trust, and enduring grace.`}
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
            <StoreContent {...storeData} />

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
