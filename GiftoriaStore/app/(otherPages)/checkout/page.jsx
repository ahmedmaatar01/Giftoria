"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Checkout from "@/components/othersPages/Checkout";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center raleway-regular text-uppercase fs-2">{t('checkout_page.title')}</div>
        </div>
      </div>

      <Checkout />
      <Footer1 />
    </>
  );
}
