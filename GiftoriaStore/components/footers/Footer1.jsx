"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";

import { aboutLinks, footerLinks, paymentImages } from "@/data/footerLinks";
import { useTranslation } from "react-i18next";

export default function Footer1({ bgColor = "" }) {
  const { t } = useTranslation();

  // Removed mobile heading event/collapsible logic

  return (
    <footer id="footer" className={`footer md-pb-70 ${bgColor}`}>
      <div className="footer-wrap" style={{
        backgroundImage: "url('/images/footer_bg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="footer-body">
          <div className="container">
            <div className="row">
              {/* Info section */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <ul>
                   
                    <li>
                      <p className="montserrat-regular" style={{ fontSize: '12px' }}>
                        {t("footer_email_label")} <a href="#" className="montserrat-regular" style={{ fontSize: '12px' }}>{t("footer_email")}</a>
                      </p>
                    </li>
                    <li>
                      <p className="montserrat-regular" style={{ fontSize: '12px' }}>
                        {t("footer_phone_label")} <a href="#" className="montserrat-regular" style={{ fontSize: '12px' }}>{t("footer_phone")}</a>
                      </p>
                    </li>
                  </ul>
                  {/* Social icons */}
                  <ul className="tf-social-icon d-flex gap-10">
                    {/* (social icons unchanged) */}
                  </ul>
                </div>
              </div>

              {/* Help section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading">
                  <h6 className="bell-t-medium text-uppercase">{t("footer_help")}</h6>
                </div>
                <ul className="footer-menu-list">
                  {footerLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className={`footer-menu_item montserrat-regular`} style={{ fontSize: '12px' }}>
                        <span className="montserrat-regular">{t(link.textKey || link.text)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About us section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading">
                  <h6 className="bell-t-medium text-uppercase">{t("footer_about_us")}</h6>
                </div>
                <ul className="footer-menu-list">
                  {aboutLinks.slice(0, 4).map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className={`footer-menu_item montserrat-regular`} style={{ fontSize: '12px' }}>
                        <span className="montserrat-regular">{t(link.textKey || link.text)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Language and Currency section */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <h6 className="bell-t-medium text-uppercase">{t("footer_language_support")}</h6>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item montserrat-regular" style={{ fontSize: '12px' }}>
                      <span className="montserrat-regular">
                        {t("footer_language_text")}
                      </span>
                    </div>
                    <div className="tf-cur">
                      <div className="tf-languages" id="footer-lang">
                        <LanguageSelect />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="footer-log">
          <div className="footer-logo d-flex justify-content-center">
            <Link href={`/`}>
              <Image
                alt="image"
                src="/images/logo/logoFooter.svg"
                width="450"
                height="21"
              />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-center align-items-center">
                  <div className="footer-menu_item montserrat-regular" style={{ fontSize: '12px' }}>
                    <span className="arabic_div" dir="ltr" style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>2025</span> متجر جيفتوريا. كل الحقوق محفوظة
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
