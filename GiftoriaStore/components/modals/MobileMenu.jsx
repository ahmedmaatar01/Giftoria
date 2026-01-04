<<<<<<< HEAD
"use client";
import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import { navItems } from "@/data/menu";
import { usePathname } from "next/navigation";
export default function MobileMenu() {
  const pathname = usePathname();
  const isMenuActive = (menuItem) => {
    let active = false;
    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
        active = true;
      }
    }
    if (menuItem.links) {
      menuItem.links?.forEach((elm2) => {
        if (elm2.href?.includes("/")) {
          if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        }
        if (elm2.links) {
          elm2.links.forEach((elm3) => {
            if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
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
            {navItems.map((item, i) => (
              <li key={i} className="nav-mb-item">
                <a
                  href={`#${item.id}`}
                  className={`collapsed mb-menu-link current ${
                    isMenuActive(item) ? "activeMenu" : ""
                  }`}
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls={item.id}
                >
                  <span>{item.label}</span>
                  <span className="btn-open-sub" />
                </a>
                <div id={item.id} className="collapse">
                  <ul className="sub-nav-menu">
                    {item.links.map((subItem, i2) => (
                      <li key={i2}>
                        {subItem.links ? (
                          <>
                            <a
                              href={`#${subItem.id}`}
                              className={`sub-nav-link collapsed  ${
                                isMenuActive(subItem) ? "activeMenu" : ""
                              }`}
                              data-bs-toggle="collapse"
                              aria-expanded="true"
                              aria-controls={subItem.id}
                            >
                              <span>{subItem.label}</span>
                              <span className="btn-open-sub" />
                            </a>
                            <div id={subItem.id} className="collapse">
                              <ul className="sub-nav-menu sub-menu-level-2">
                                {subItem.links.map((innerItem, i3) => (
                                  <li key={i3}>
                                    <Link
                                      href={innerItem.href}
                                      className={`sub-nav-link  ${
                                        isMenuActive(innerItem)
                                          ? "activeMenu"
                                          : ""
                                      }`}
                                    >
                                      {innerItem.label}
                                      {innerItem.demoLabel && (
                                        <div className="demo-label">
                                          <span className="demo-new">New</span>
                                        </div>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <Link
                            href={subItem.href}
                            className={`sub-nav-link ${
                              isMenuActive(subItem) ? "activeMenu" : ""
                            }`}
                          >
                            {subItem.label}
                            {subItem.demoLabel && (
                              <div className="demo-label">
                                <span className="demo-new">New</span>
                              </div>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li className="nav-mb-item">
              <a
                href="https://themeforest.net/item/ecomus-ultimate-html5-template/53417990?s_rank=3"
                className="mb-menu-link"
              >
                Buy now
              </a>
            </li>
          </ul>
          <div className="mb-other-content">
            <div className="d-flex group-icon">
              <Link href={`/wishlist`} className="site-nav-icon">
                <i className="icon icon-heart" />
                Wishlist
              </Link>
              <Link href={`/home-search`} className="site-nav-icon">
                <i className="icon icon-search" />
                Search
              </Link>
            </div>
            <div className="mb-notice">
              <Link href={`/contact-1`} className="text-need">
                Need help ?
              </Link>
            </div>
            <ul className="mb-info">
              <li>
                Address: 1234 Fashion Street, Suite 567, <br />
                New York, NY 10001
              </li>
              <li>
                Email: <b>info@fashionshop.com</b>
              </li>
              <li>
                Phone: <b>(212) 555-1234</b>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-bottom">
          <Link href={`/login`} className="site-nav-icon">
            <i className="icon icon-account" />
            Login
          </Link>
          <div className="bottom-bar-language">
            <div className="tf-currencies">
              <CurrencySelect />
            </div>
            <div className="tf-languages">
              <LanguageSelect
                parentClassName={
                  "image-select center style-default type-languages"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import { navItems } from "@/data/menu";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from '@/utils/config';

export default function MobileMenu() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const API_BASE = API_BASE_URL;
  
  const [occasions, setOccasions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [shopExpanded, setShopExpanded] = useState(false);

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
            {/* Home link */}
            <li className="nav-mb-item">
              <Link href="/" className={`mb-menu-link ${pathname === "/" ? "activeMenu" : ""}`}>
                {t("menu.home")}
              </Link>
            </li>
            {/* Shop expandable section */}
            <li className="nav-mb-item">
              <div 
                className={`mb-menu-link ${pathname.includes("shop") ? "activeMenu" : ""}`}
                onClick={() => setShopExpanded(!shopExpanded)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{t("menu.shop")}</span>
                <i className={`icon ${shopExpanded ? 'icon-arrow-up' : 'icon-arrow-down'}`} style={{ fontSize: '12px' }} />
              </div>
              {shopExpanded && (
                <ul className="sub-nav-menu" style={{ paddingLeft: '20px', marginTop: '10px' }}>
                  <li style={{ marginBottom: '15px' }}>
                    <div className="menu-heading" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                      {i18n.language === 'ar' ? 'التصنيفات' : 'Categories'}
                    </div>
                    <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                      {!loadingCategories && categories.length > 0 ? (
                        categories.map((category) => (
                          <li key={category.id} style={{ marginBottom: '6px' }}>
                            <Link
                              href={`/shop-default?category=${category.id}`}
                              className="mb-menu-link"
                              style={{ fontSize: '13px' }}
                            >
                              {i18n.language === 'ar' && category.name_ar 
                                ? category.name_ar 
                                : category.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted" style={{ fontSize: '12px' }}>
                          {loadingCategories ? 'Loading...' : 'No categories'}
                        </li>
                      )}
                    </ul>
                  </li>
                  <li>
                    <div className="menu-heading" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                      {i18n.language === 'ar' ? 'المناسبات' : 'Occasions'}
                    </div>
                    <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                      {!loadingOccasions && occasions.length > 0 ? (
                        occasions.map((occasion) => (
                          <li key={occasion.id} style={{ marginBottom: '6px' }}>
                            <Link
                              href={`/shop-collection-sub?occasion=${occasion.id}`}
                              className="mb-menu-link"
                              style={{ fontSize: '13px' }}
                            >
                              {i18n.language === 'ar' && occasion.arabic_name 
                                ? occasion.arabic_name 
                                : occasion.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted" style={{ fontSize: '12px' }}>
                          {loadingOccasions ? 'Loading...' : 'No occasions'}
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              )}
            </li>
            {/* About link */}
            <li className="nav-mb-item">
              <Link 
                href="/about-us" 
                className={`mb-menu-link ${pathname.includes("about") ? "activeMenu" : ""}`}
              >
                {t("menu.about")}
              </Link>
            </li>
            {/* Contact link */}
            <li className="nav-mb-item">
              <Link 
                href="/contact-2" 
                className={`mb-menu-link ${pathname.includes("contact") ? "activeMenu" : ""}`}
              >
                {t("menu.contact")}
              </Link>
            </li>
            {/* Cart icon intentionally omitted for mobile menu */}
          </ul>

          {/* Other content */}
          <div className="mb-other-content">

          

            <div className="mb-notice">
              <Link href="/contact-1" className="text-need">
                {t("menu.need_help")}
              </Link>
            </div>

            <ul className="mb-info">
              <li>
                {t("menu.email")}: 
                <a href="mailto:contact@giftoria.me" className="mb-link">
                  <b>contact@giftoria.me</b>
                </a>
              </li>
              <li>
                {t("menu.phone")}: 
                <a href="tel:+97477731974" className="mb-link">
                  <b className="arabic_div">(+974) 7773 1974</b>
                </a>
              </li>
            </ul>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="mb-bottom">
  <a href="#login" data-bs-toggle="modal" className="site-nav-icon">
    <i className="icon icon-account" />
    {t("menu.login")}
  </a>
</div>

      <style>
      ul, li{
        
      }
      </style>
      </div>
    </div>
  );
}
>>>>>>> origin/main
