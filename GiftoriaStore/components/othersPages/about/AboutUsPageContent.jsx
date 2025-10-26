"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Footer1 from "@/components/footers/Footer1";
import About from "@/components/othersPages/about/About";
import Features from "@/components/othersPages/about/Features";
import FeaturesAbout from "@/components/othersPages/about/FeaturesAbout";
import Banner from "@/components/homes/home-pickleball/Banner";
import Hero from "@/components/othersPages/about/Hero";
import Image from "next/image";
import Products2 from "@/components/homes/home-baby/Products2";
import StoreContent from "@/components/othersPages/about/StoreContent";
import Header6 from "@/components/headers/Header6";

export default function AboutUsPageContent() {
  const { t } = useTranslation();

  const storeData = {
    storeName: t("store_info.store_name"),
    address: t("store_info.store_address"),
    phone: t("store_info.store_phone"),
    email: t("store_info.store_email"),
    openTime: t("store_info.store_hours"),
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

  return (
    <>
      <Header6/>
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
                alt={t("about.image_alt")}
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