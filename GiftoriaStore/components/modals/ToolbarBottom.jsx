"use client";
import React from "react";
import Link from "next/link";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import { useTranslation } from "react-i18next";

export default function ToolbarBottom() {
  const { t } = useTranslation();

  return (
    <div className="tf-toolbar-bottom type-1150">
      <div className="toolbar-item">
        <Link href="/shop-left-sidebar" className="toolbar-link">
          <div className="toolbar-icon">
            <i className="icon-shop" />
          </div>
          <div className="toolbar-label">{t("toolbar_shop")}</div>
        </Link>
      </div>

      <div className="toolbar-item">
        <a href="#login" data-bs-toggle="modal">
          <div className="toolbar-icon">
            <i className="icon-account" />
          </div>
          <div className="toolbar-label">{t("toolbar_account")}</div>
        </a>
      </div>

      <div className="toolbar-item">
        <a href="#shoppingCart" data-bs-toggle="modal">
          <div className="toolbar-icon">
            <i className="icon-bag" />
            <div className="toolbar-count">
              <CartLength />
            </div>
          </div>
          <div className="toolbar-label">{t("toolbar_cart")}</div>
        </a>
      </div>
    </div>
  );
}
