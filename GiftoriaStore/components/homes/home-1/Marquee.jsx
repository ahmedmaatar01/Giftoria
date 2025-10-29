"use client";
import React from "react";
import { marqueeItems } from "@/data/marquees";
import { useTranslation } from "react-i18next";

export default function Marquee() {
  const { t } = useTranslation();

  return (
    <div className="tf-marquee bg_beige-4">
      <div className="wrap-marquee">
        {marqueeItems.map((key, index) => (
          <div className="marquee-item" key={index}>
        <div className="icon" style={{ width: "20px", height: "20px", background: "transparent" ,marginRight:"22px"}}>
  <img
    src="/images/11000_Plan_de_travail_1.svg"
    alt="icon"
    width="20px"
    height="20px"
    style={{transform:'scale(6)'}}
  />
</div>


            <p className="text raleway-light">{t(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
