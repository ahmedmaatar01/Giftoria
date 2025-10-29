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
  const [categories, setCategories] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Fetch occasions
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

    // Fetch categories
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          headers: { "Accept": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        if (isMounted) setLoadingCategories(false);
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
          className={`item-link raleway-medium ${Linkfs} ${textColor} ${pathname === "/" ? "activeMenu" : ""}`}
        >
          {t("menu.home")}
        </Link>
      </li>
     <li className="menu-item">
        <a
          href="#"
          className={`item-link raleway-medium ${Linkfs} ${textColor} ${
            pathname.includes('/shop') || pathname.includes('/category') || pathname.includes('/occasion') ? "activeMenu" : ""
          } `}
        >
          {t("menu.shop")}
          {isArrow ? <i className="icon icon-arrow-down" /> : ""}
        </a>
        <div className="sub-menu mega-menu" style={{marginTop:"-8px"}}>
          <div className="container">
            <div className="row">
              {/* Categories Column */}
              <div className="col-lg-6">
                <div className="mega-menu-item">
                  <div className="menu-heading">{i18n.language === 'ar' ? 'التصنيفات' : 'Categories'}</div>
                  <ul className="menu-list">
                    {!loadingCategories && categories.length > 0 ? (
                      categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/shop-default?category=${category.id}`}
                            className={`menu-link-text link ${
                              pathname.includes('shop-default') && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('category') === String(category.id) ? "activeMenu" : ""
                            }`}
                          >
                            {i18n.language === 'ar' && category.name_ar 
                              ? category.name_ar 
                              : category.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted small">
                        {loadingCategories ? 'Loading...' : 'No categories available'}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* Occasions Column */}
              <div className="col-lg-6">
                <div className="mega-menu-item">
                  <div className="menu-heading">{i18n.language === 'ar' ? 'المناسبات' : 'Occasions'}</div>
                  <ul className="menu-list">
                    {!loadingOccasions && occasions.length > 0 ? (
                      occasions.map((occasion) => (
                        <li key={occasion.id}>
                          <Link
                            href={`/shop-collection-sub?occasion=${occasion.id}`}
                            className={`menu-link-text link ${
                              pathname.includes('shop-collection-sub') && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('occasion') === String(occasion.id) ? "activeMenu" : ""
                            }`}
                          >
                            {i18n.language === 'ar' && occasion.arabic_name 
                              ? occasion.arabic_name 
                              : occasion.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted small">
                        {loadingOccasions ? 'Loading...' : 'No occasions available'}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>

      <li className="menu-item">
        <Link href="/about-us" className={`item-link raleway-medium ${Linkfs} ${textColor}`}>
          {t("menu.about")}
        </Link>
      </li>

      <li className="menu-item">
        <Link href="/contact-2" className={`item-link raleway-medium ${Linkfs} ${textColor}`}>
          {t("menu.contact")}
        </Link>
      </li>

      <li className="menu-item">
        <Link href="/faq-1" className={`item-link raleway-medium ${Linkfs} ${textColor}`}>
          {t("menu.faq")}
        </Link>
      </li>

    </>
  );
}
