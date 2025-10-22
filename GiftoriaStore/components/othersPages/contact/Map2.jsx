"use client";

import { socialLinksWithBorder } from "@/data/socials";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Map2() {
  const { t } = useTranslation();

  return (
    <section className="flat-spacing-9">
      <div className="container">
        <div className="tf-grid-layout gap-0 lg-col-2">
          <div className="w-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d317859.6089702069!2d-0.075949!3d51.508112!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760349331f38dd%3A0xa8bf49dde1d56467!2sTower%20of%20London!5e0!3m2!1sen!2sus!4v1719221598456!5m2!1sen!2sus"
              width="100%"
              height={894}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="tf-content-left has-mt">
            <div className="sticky-top">
              <h5 className="mb_20">{t("contact.visit_store")}</h5>
              <div className="mb_20">
                <p className="mb_15"><strong>{t("store_info.address")}</strong></p>
                <p>{t("contact.store_address")}</p>
              </div>

              <div className="mb_20">
                <p className="mb_15"><strong>{t("store_info.phone")}</strong></p>
                <p>{t("contact.phone_number")}</p>
              </div>

              <div className="mb_20">
                <p className="mb_15"><strong>{t("store_info.email")}</strong></p>
                <p>{t("contact.email_address")}</p>
              </div>

              <div className="mb_36">
                <p className="mb_15"><strong>{t("store_info.open_time")}</strong></p>
                <p className="mb_15">{t("contact.store_status")}</p>
                <p>{t("contact.store_hours")}</p>
              </div>

              <div>
                <ul className="tf-social-icon d-flex gap-20 style-default">
                  {socialLinksWithBorder.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className={`box-icon link round ${link.className} ${link.borderClass}`}
                      >
                        <i className={`icon ${link.iconSize} ${link.iconClass}`} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
