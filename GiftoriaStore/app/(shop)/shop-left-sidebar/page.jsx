"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import ShopSidebarleft from "@/components/shop/ShopSidebarleft";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className="tf-page-title" style={{ backgroundColor: '#F1ECE4' }}>
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <div className="heading text-center raleway-regular 0" style={{  textTransform: "uppercase" }}>{t("shop.page_title")}</div>
              <p className="text-center text-2 text_black-2 mt_5 raleway-medium">
                {t("shop.page_description")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ShopSidebarleft />
      <Footer1 />
    </>
  );
}
