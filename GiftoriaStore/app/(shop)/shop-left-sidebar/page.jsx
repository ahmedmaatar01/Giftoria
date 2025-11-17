"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import ShopSidebarleft from "@/components/shop/ShopSidebarleft";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t, i18n } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className={`tf-page-title ${i18n.language === "ar" ? "arabic_div" : ""}`} style={{ backgroundColor: '#F1ECE4' }}>
        <div className="container-full">
          <div className="row">
            <div className="col-12">
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
                {t("shop.page_title")}
              </h1>
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
