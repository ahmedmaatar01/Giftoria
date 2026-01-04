"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Cart from "@/components/othersPages/Cart";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center raleway-regular text-uppercase">{t("cart.title")}</div>
        </div>
      </div>

      <Cart />
   
      <Footer1 />
    </>
  );
}
