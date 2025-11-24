"use client";

import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import ShopDefault from "@/components/shop/ShopDefault";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t, i18n } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <h1 
          
            style={{ 
              fontSize: i18n.language === "ar" ? "36px" : "32px",
              textAlign: "center",
              textTransform: "uppercase",
              fontFamily: "Raleway, sans-serif",
              fontWeight: "400",
              margin: "20px 0",
              padding: "0",
              lineHeight: "1.2",
              color: "#000"
            }}
          >
            {t('shop_page.our_products')}
          </h1>
          <p className="text-center text-2 text_black-2 mt_5 text-uppercase montserrat-regular">
            {t('shop_page.shop_latest_selection')}
          </p>
        </div>
      </div>
      <ShopDefault />
      <Footer1 />
    </>
  );
}
