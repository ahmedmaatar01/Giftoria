"use client";
import React from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";

export default function MyAccount() {
  const { user } = useContextElement();
  const { t } = useTranslation();
  
  // Get user's first name from the full name
  const getFirstName = (fullName) => {
    if (!fullName) return t("dashboard.guest");
    return fullName.split(" ")[0];
  };

  return (
    <div className="my-account-content account-dashboard">
      <div className="mb_60">
        <h5 className="fw-5 mb_20">{t("dashboard.hello")} {user ? getFirstName(user.name) : t("dashboard.guest")}</h5>
        <p>
          {t("dashboard.description_part1")}{' '}
          <Link className="text_primary raleway-regular" href={`/my-account-orders`}>
            {t("dashboard.recent_orders")}
          </Link>
          {' '}{t("dashboard.description_part2")}{' '}
          <Link className="text_primary raleway-regular" href={`/my-account-edit`}>
            {t("dashboard.edit_account")}
          </Link>
          {t("dashboard.description_part3")}
        </p>
      </div>
    </div>
  );
}
