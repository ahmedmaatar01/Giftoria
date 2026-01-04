"use client";

import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import ShopDefault from "@/components/shop/ShopDefault";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center text-uppercase">{t('shop_page.our_products')}</div>
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
