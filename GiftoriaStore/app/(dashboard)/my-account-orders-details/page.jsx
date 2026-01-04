"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Header2 from "@/components/headers/Header2";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import OrderDetails from "@/components/othersPages/dashboard/OrderDetails";
import Orders from "@/components/othersPages/dashboard/Orders";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center raleway-regular text-uppercase">{t("order_details_title")}</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <OrderDetails />
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
