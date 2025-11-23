"use client";

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";

import { aboutLinks, footerLinks, paymentImages } from "@/data/footerLinks";
import { useTranslation } from "react-i18next";

export default function Footer1({ bgColor = "" }) {
  const { t } = useTranslation();

  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-moblie");
    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");
      parent.classList.toggle("open");
    };
    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []);

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
                        {t("footer_email_label")} <a href="mailto:contact@giftoria.me" target="_blank" rel="noopener noreferrer" className="montserrat-regular" style={{ fontSize: '12px' }}>contact@giftoria.me</a>
                      </p>
                    </li>
                    <li>
                      <p className="montserrat-regular " style={{ fontSize: '12px' }}>
                        {t("footer_phone_label")} <a href="tel:+97477731974" className="montserrat-regular arabic_div" style={{ fontSize: '12px' }}><span dir="ltr" style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>+974 7773 1974</span></a>
                      </p>
                    </li>
                    <li>
                      <p className="montserrat-regular " style={{ fontSize: '12px' }}>
                        WhatsApp: <a href="https://wa.me/97477731974" target="_blank" rel="noopener noreferrer" className="montserrat-regular arabic_div" style={{ fontSize: '12px' }}><span dir="ltr" style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>+974 7773 1974</span></a>
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
                <div className="footer-heading footer-heading-desktop">
                  <h6 className="bell-t-medium text-uppercase">{t("footer_help")}</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6 className="bell-t-medium text-uppercase">{t("footer_help")}</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {footerLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className={`footer-menu_item montserrat-regular`} style={{ fontSize: '12px' }}>
                        <span className="montserrat-regular">{t(link.textKey || link.text)}</span> {/* adjust links data to include textKey */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About us section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6 className="bell-t-medium text-uppercase">{t("footer_about_us")}</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6 className="bell-t-medium">{t("footer_about_us")}</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
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
                    {t("footer_copyright", { year: new Date().getFullYear() })}
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
