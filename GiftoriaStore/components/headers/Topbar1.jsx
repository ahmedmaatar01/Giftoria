"use client";
import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";

export default function Topbar1() {
  const { t, i18n } = useTranslation();

  return (
    <div className="tf-top-bar bg_white line">
      <div className="px_15 lg-px_40">
        <div className="tf-top-bar_wrap grid-2 gap-30 align-items-center">
          {/* Social Icons */}
          <ul className="tf-top-bar_item tf-social-icon d-flex gap-10">
            <li>
              <a href="#" className="box-icon w_28 round social-facebook bg_line" aria-label="Facebook">
                <i className="icon fs-12 icon-fb" />
              </a>
            </li>
            <li>
              <a href="#" className="box-icon w_28 round social-twiter bg_line" aria-label="Twitter / X">
                <i className="icon fs-10 icon-Icon-x" />
              </a>
            </li>
            <li>
              <a href="#" className="box-icon w_28 round social-instagram bg_line" aria-label="Instagram">
                <i className="icon fs-12 icon-instagram" />
              </a>
            </li>
            <li>
              <a href="#" className="box-icon w_28 round social-tiktok bg_line" aria-label="TikTok">
                <i className="icon fs-12 icon-tiktok" />
              </a>
            </li>
            <li>
              <a href="#" className="box-icon w_28 round social-pinterest bg_line" aria-label="Pinterest">
                <i className="icon fs-12 icon-pinterest-1" />
              </a>
            </li>
          </ul>

   

          {/* Currency and Language */}
          <div className="top-bar-language tf-cur justify-content-end">
          
            <div className="tf-languages">
              <LanguageSelect
                parentClassName={"image-select center style-default type-languages"}
                topStart
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
