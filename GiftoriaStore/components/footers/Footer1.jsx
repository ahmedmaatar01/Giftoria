"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
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

  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        { email }
      );
      if ([200, 201].includes(response.status)) {
        e.target.reset();
        setSuccess(true);
        handleShowMessage();
      } else {
        setSuccess(false);
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || "An error occurred");
      setSuccess(false);
      handleShowMessage();
      e.target.reset();
    }
  };

  return (
    <footer id="footer" className={`footer md-pb-70 ${bgColor}`}>
      <div className="footer-wrap" style={{ backgroundColor: "#F1ECE4" }}>
        <div className="footer-body">
          <div className="container">
            <div className="row">
              {/* Info section */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <ul>
                    <li>
                      <p>
                        {t("footer_address_line1")}<br />
                        {t("footer_address_line2")}
                      </p>
                    </li>
                    <li>
                      <p>
                        {t("footer_email_label")} <a href="#">{t("footer_email")}</a>
                      </p>
                    </li>
                    <li>
                      <p>
                        {t("footer_phone_label")} <a href="#">{t("footer_phone")}</a>
                      </p>
                    </li>
                  </ul>
                  <Link href={`/contact-1`} className="tf-btn btn-line">
                    {t("footer_get_direction")}
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                  {/* Social icons */}
                  <ul className="tf-social-icon d-flex gap-10">
                    {/* (social icons unchanged) */}
                  </ul>
                </div>
              </div>

              {/* Help section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>{t("footer_help")}</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>{t("footer_help")}</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {footerLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {t(link.textKey || link.text)} {/* adjust links data to include textKey */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About us section */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>{t("footer_about_us")}</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>{t("footer_about_us")}</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {aboutLinks.slice(0, 4).map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {t(link.textKey || link.text)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter section */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>{t("footer_sign_up_email")}</h6>
                  </div>
                  <div className="footer-heading footer-heading-moblie">
                    <h6>{t("footer_sign_up_email")}</h6>
                  </div>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item">
                      {t("footer_newsletter_text")}
                    </div>
                    <div className={`tfSubscribeMsg ${showMessage ? "active" : ""}`}>
                      {success ? (
                        <p style={{ color: "rgb(52, 168, 83)" }}>
                          {t("footer_subscribe_success")}
                        </p>
                      ) : (
                        <p style={{ color: "red" }}>
                          {t("footer_subscribe_error")}
                        </p>
                      )}
                    </div>
                    <form
                      ref={formRef}
                      onSubmit={sendEmail}
                      className="form-newsletter subscribe-form"
                      action="#"
                      method="post"
                      acceptCharset="utf-8"
                      data-mailchimp="true"
                    >
                      <div className="subscribe-content">
                        <fieldset className="email">
                          <input
                            required
                            type="email"
                            name="email"
                            className="subscribe-email"
                            placeholder={t("footer_enter_email_placeholder")}
                            tabIndex={0}
                            aria-required="true"
                            autoComplete="abc@xyz.com"
                          />
                        </fieldset>
                        <div className="button-submit">
                          <button
                            className="subscribe-button tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                            type="submit"
                          >
                            {t("footer_subscribe_button")}
                            <i className="icon icon-arrow1-top-left" />
                          </button>
                        </div>
                      </div>
                      <div className="subscribe-msg" />
                    </form>
                    <div className="tf-cur">
                      <div className="tf-currencies">
                        <CurrencySelect />
                      </div>
                      <div className="tf-languages">
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
                src="/images/logo/logo_Plan de travail 1 copie 2.svg"
                width="300"
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
                  <div className="footer-menu_item">
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
