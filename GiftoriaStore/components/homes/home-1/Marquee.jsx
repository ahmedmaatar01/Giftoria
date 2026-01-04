"use client";
import React from "react";
import { marqueeItems } from "@/data/marquees";
import { useTranslation } from "react-i18next";

export default function Marquee() {
  const { t, i18n } = useTranslation();

  return (
    <div className="tf-marquee bg_beige-4">
      <div className="wrap-marquee">
        {marqueeItems.map((key, index) => (
          <div 
            className="marquee-item" 
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: i18n.language === "ar" ? "30px" : "22px",
              justifyContent: "center",
              direction: i18n.language === "ar" ? "rtl" : "ltr"
            }}
          >
            <div 
              className="icon" 
              style={{ 
                width: "70px", 
                height: "20px", 
                background: "transparent", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <img
                src="/images/11000_Plan_de_travail_1.svg"
                alt="icon"
                width="20px"
                height="20px"
                style={{ transform: 'scale(6)' }}
              />
            </div>
            <p 
               className={`text ${
                i18n.language === "ar" ? "muslimah-font" : "bell-medium"
              }`}
              style={{
                margin: 0,
                textAlign: "center",
                paddingRight: i18n.language === "ar" ? "10px" : "0",
                paddingLeft: i18n.language === "ar" ? "0" : "0",
                textTransform: i18n.language === "ar" ? "none" : "lowercase"
              }}
            >
              {t(key)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
