"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function StoreContent({
  storeName,
  address,
  phone,
  email,
  openTime,
  socialLinks = [],  // Default to an empty array if socialLinks is undefined
  getDirectionsLink = "/contact-2",  // Provide default fallback
}) {
  const { t } = useTranslation();

  return (
    <div className="tf-ourstore-content" style={{ paddingLeft: "60px" }}>
      <h5 className="mb_24">{storeName}</h5>
      <div className="mb_20">
        <p className="mb_15">
          <strong>{t("store_info.address")}</strong>
        </p>
        <p>{address}</p>
      </div>
      <div className="mb_20">
        <p className="mb_15">
          <strong>{t("store_info.phone")}</strong>
        </p>
        <p>{phone}</p>
      </div>
      <div className="mb_20">
        <p className="mb_15">
          <strong>{t("store_info.email")}</strong>
        </p>
        <p>{email}</p>
      </div>
      <div className="mb_36">
        <p className="mb_15">
          <strong>{t("store_info.open_time")}</strong>
        </p>
        <p className="mb_15">{openTime}</p>
      </div>
      <div className="mb_30">
        <ul className="tf-social-icon d-flex gap-15 style-default">
          {socialLinks.length > 0 ? (
            socialLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  className={`box-icon link round ${link.className}`}
                >
                  <i className={`icon fs-16 ${link.iconClass}`} />
                </a>
              </li>
            ))
          ) : (
            <p>No social links available</p> // Handle empty social links
          )}
        </ul>
      </div>
      <div>
        <Link href={getDirectionsLink} className="tf-btn btn-outline-dark radius-3">
          <span>{t("store_info.get_directions")}</span>
          <i className="icon icon-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
