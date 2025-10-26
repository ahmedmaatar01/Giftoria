"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { products1 } from "@/data/products";
import { ProductCard } from "../shopCards/ProductCard";
import { Navigation } from "swiper/modules";
import {
  blogLinks,
  productsPages,
  pages,
} from "@/data/menu";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Nav({ isArrow = true, textColor = "", Linkfs = "" }) {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  
  const [occasions, setOccasions] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/occasions`, {
          headers: { "Accept": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          // Filter occasions that have show_menu = true
          const menuOccasions = Array.isArray(data) 
            ? data.filter(occ => occ.show_menu === true || occ.show_menu === 1)
            : [];
          setOccasions(menuOccasions);
        }
      } catch (err) {
        console.error("Failed to fetch occasions:", err);
      } finally {
        if (isMounted) setLoadingOccasions(false);
      }
    })();
    return () => { isMounted = false; };
  }, [API_BASE]);

  const isMenuActive = (menuItem) => {
    let active = false;
    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
        active = true;
      }
    }
    if (menuItem.length) {
      active = menuItem.some(
        (elm) => elm.href?.split("/")[1] == pathname.split("/")[1]
      );
    }
    if (menuItem.length) {
      menuItem.forEach((item) => {
        item.links?.forEach((elm2) => {
          if (elm2.href?.includes("/")) {
            if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
              active = true;
            }
          }
          if (elm2.length) {
            elm2.forEach((item2) => {
              item2?.links?.forEach((elm3) => {
                if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
                  active = true;
                }
              });
            });
          }
        });
        if (item.href?.includes("/")) {
          if (item.href?.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        }
      });
    }

    return active;
  };

  return (
    <>
      <li className="menu-item">
        <Link
          href="/"
          className={`item-link ${Linkfs} ${textColor} ${pathname === "/" ? "activeMenu" : ""}`}
        >
          {t("menu.home")}
        </Link>
      </li>
      <li className="menu-item">
        <Link
          href="/shop-left-sidebar"
          className={`item-link ${Linkfs} ${textColor} ${pathname === "/shop-left-sidebar" ? "activeMenu" : ""}`}
        >
          {t("menu.shop")}
        </Link>
      </li>
      <li className="menu-item position-relative">
        <a
          href="#"
          className={`item-link ${Linkfs} ${textColor} ${pathname.includes('/occasion') ? "activeMenu" : ""}`}
        >
          {i18n.language === 'ar' ? 'المناسبات' : 'Occasions'}
          {isArrow ? <i className="icon icon-arrow-down" /> : ""}
        </a>
        <div className="sub-menu links-default">
          <ul className="menu-list">
            {!loadingOccasions && occasions.length > 0 ? (
              occasions.map((occasion, index) => (
                <li key={index}>
                  <Link
                    href={`/shop-collection-sub?occasion=${occasion.id}`}
                    className={`menu-link-text link text_black-2 ${pathname.includes('shop-collection-sub') && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('occasion') === String(occasion.id) ? "activeMenu" : ""}`}
                  >
                    {i18n.language === 'ar' && occasion.arabic_name 
                      ? occasion.arabic_name 
                      : occasion.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-muted small px-3">
                {loadingOccasions ? 'Loading...' : 'No occasions available'}
              </li>
            )}
          </ul>
        </div>
      </li>
      <li className="menu-item">
        <Link href="/about-us" className={`item-link ${Linkfs} ${textColor}`}>
          {t("menu.about")}
        </Link>
      </li>

      <li className="menu-item">
        <Link href="/contact-2" className={`item-link ${Linkfs} ${textColor}`}>
          {t("menu.contact")}
        </Link>
      </li>

      <li className="menu-item">
        <Link href="/faq-1" className={`item-link ${Linkfs} ${textColor}`}>
          {t("menu.faq")}
        </Link>
      </li>

    </>
  );
}
