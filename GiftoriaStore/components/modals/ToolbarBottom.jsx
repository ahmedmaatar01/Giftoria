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

      <div className="toolbar-item">
        <a href="https://wa.me/97477731974" target="_blank" rel="noopener noreferrer">
          <div className="toolbar-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="24"
              height="24"
              style={{ display: 'block' }}
            >
              <path
                fill="currentColor"
                d="M16 5.333c-5.867 0-10.64 4.64-10.64 10.36 0 1.828.533 3.64 1.547 5.2L5.333 26.667l6.107-1.893a10.56 10.56 0 0 0 4.56 1.027h.004c5.867 0 10.64-4.64 10.64-10.36 0-2.773-1.133-5.387-3.187-7.347-2.053-1.96-4.747-3.093-7.56-3.093Zm0 19.2h-.004a8.987 8.987 0 0 1-4.28-1.12l-.307-.173-3.627 1.12 1.187-3.44-.2-.32a8.76 8.76 0 0 1-1.4-4.773c0-4.84 3.987-8.787 8.88-8.787 2.373 0 4.6.893 6.273 2.507 1.667 1.613 2.587 3.733 2.587 6.053 0 4.84-3.987 8.787-9.11 8.787Zm5.013-6.547c-.273-.147-1.613-.8-1.86-.88-.253-.093-.44-.147-.627.147-.187.293-.72.88-.88 1.067-.16.187-.32.2-.593.053-.273-.147-1.153-.427-2.197-1.36-.813-.72-1.36-1.6-1.513-1.873-.16-.28-.017-.427.12-.573.12-.12.267-.32.4-.48.133-.16.18-.28.267-.467.093-.187.047-.347-.02-.493-.067-.147-.627-1.52-.86-2.08-.227-.547-.453-.467-.627-.467-.16-.013-.347-.013-.533-.013-.187 0-.493.067-.747.347-.253.28-.973.947-.973 2.307 0 1.36.997 2.667 1.133 2.853.133.187 1.96 2.987 4.76 4.053.667.28 1.187.453 1.593.587.667.213 1.273.187 1.753.12.533-.08 1.613-.653 1.84-1.293.227-.64.227-1.187.16-1.293-.066-.107-.24-.173-.513-.32Z"
              />
            </svg>
          </div>
          <div className="toolbar-label">{t("toolbar_whatsapp")}</div>
        </a>
      </div>
      
    </div>
  );
}
