<<<<<<< HEAD
"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Header2 from "@/components/headers/Header2";
import AccountEdit from "@/components/othersPages/dashboard/AccountEdit";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import React from "react";
import { useTranslation } from "react-i18next";

export default function page() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center raleway-regular text-uppercase" style={{ fontSize: "32px" }}>{t("my_account_edit_title")}</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <AccountEdit />
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
=======
"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Header2 from "@/components/headers/Header2";
import AccountEdit from "@/components/othersPages/dashboard/AccountEdit";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
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
            {t("my_account_edit_title")}
          </h1>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <AccountEdit />
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
>>>>>>> origin/main
