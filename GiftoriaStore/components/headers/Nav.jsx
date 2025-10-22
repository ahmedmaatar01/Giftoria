"use client";
import Link from "next/link";
import React from "react";
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
  const { t } = useTranslation();

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
        <a
          href="#"
          className={`item-link ${Linkfs} ${textColor} ${isMenuActive(productsPages) ? "activeMenu" : ""}`}
        >
          {t("menu.shop")}
          {isArrow && <i className="icon icon-arrow-down" />}
        </a>
        <div className="sub-menu mega-menu">
          <div className="container">
            <div className="row">
              {productsPages.map((menu, index) => (
                <div className="col-lg-2" key={index}>
                  <div className="mega-menu-item">
                    <div className="menu-heading">{t(menu.heading)}</div>
                    <ul className="menu-list">
                      {menu.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className={`menu-link-text link ${isMenuActive(link) ? "activeMenu" : ""}`}
                          >
                            {t(link.text)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <div className="col-lg-3">
                <div className="collection-item hover-img">
                  <div className="collection-inner">
                    <Link href={`/home-men`} className="collection-image img-style">
                      <Image
                        className="lazyload"
                        data-src="/images/collections/collection-1.jpg"
                        alt="Men"
                        src="/images/collections/collection-1.jpg"
                        width="1000"
                        height="1215"
                      />
                    </Link>
                    <div className="collection-content">
                      <Link
                        href={`/home-men`}
                        className="tf-btn hover-icon btn-xl collection-title fs-16"
                      >
                        <span>{t("menu.men")}</span>
                        <i className="icon icon-arrow1-top-left" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="collection-item hover-img">
                  <div className="collection-inner">
                    <Link href={`/shop-women`} className="collection-image img-style">
                      <Image
                        className="lazyload"
                        data-src="/images/collections/collection-2.jpg"
                        alt="Women"
                        src="/images/collections/collection-2.jpg"
                        width="500"
                        height="607"
                      />
                    </Link>
                    <div className="collection-content">
                      <Link
                        href={`/shop-women`}
                        className="tf-btn btn-xl collection-title fs-16 hover-icon"
                      >
                        <span>{t("menu.women")}</span>
                        <i className="icon icon-arrow1-top-left" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
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
