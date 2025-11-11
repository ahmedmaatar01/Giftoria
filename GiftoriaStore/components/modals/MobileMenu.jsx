"use client";
import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import { navItems } from "@/data/menu";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function MobileMenu() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isMenuActive = (menuItem) => {
    let active = false;

    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] === pathname.split("/")[1]) {
        active = true;
      }
    }

    if (menuItem.links) {
      menuItem.links.forEach((elm2) => {
        if (elm2.href?.includes("/")) {
          if (elm2.href?.split("/")[1] === pathname.split("/")[1]) {
            active = true;
          }
        }

        if (elm2.links) {
          elm2.links.forEach((elm3) => {
            if (elm3.href?.split("/")[1] === pathname.split("/")[1]) {
              active = true;
            }
          });
        }
      });
    }

    return active;
  };

  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />

      <div className="mb-canvas-content">
        <div className="mb-body">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">

          <ul className="nav-ul-mb">

<li className="nav-mb-item">
  <Link href="/" className={`mb-menu-link ${pathname === "/" ? "activeMenu" : ""}`}>
    {t("menu.home")}
  </Link>
</li>

<li className="nav-mb-item">
  <Link 
    href="/shop-left-sidebar" 
    className={`mb-menu-link ${pathname.includes("shop") ? "activeMenu" : ""}`}
  >
    {t("menu.shop")}
  </Link>
</li>

<li className="nav-mb-item">
  <Link 
    href="/about-us" 
    className={`mb-menu-link ${pathname.includes("about") ? "activeMenu" : ""}`}
  >
    {t("menu.about")}
  </Link>
</li>

<li className="nav-mb-item">
  <Link 
    href="/contact-2" 
    className={`mb-menu-link ${pathname.includes("contact") ? "activeMenu" : ""}`}
  >
    {t("menu.contact")}
  </Link>
</li>

</ul>


          
          </ul>

          {/* Other content */}
          <div className="mb-other-content">

          

            <div className="mb-notice">
              <Link href="/contact-1" className="text-need">
                {t("menu.need_help")}
              </Link>
            </div>

            <ul className="mb-info">
              <li>{t("menu.email")}: <b>info@fashionshop.com</b></li>
              <li>{t("menu.phone")}: <b>(212) 555-1234</b></li>
            </ul>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="mb-bottom">
          <Link href="/login" className="site-nav-icon">
            <i className="icon icon-account" />
            {t("menu.login")}
          </Link>

          
        </div>

      </div>
    </div>
  );
}
