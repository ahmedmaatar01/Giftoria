
import React from "react";
import Sidebar from "../shop/Sidebar";
import { useTranslation } from "react-i18next";

export default function ProductSidebar({ onCategorySelect, display = false }) {
  const { i18n, t } = useTranslation();
  return (
    <div
      className="offcanvas offcanvas-start canvas-filter canvas-sidebar"
      id="sidebarmobile"
    >
      <div className="canvas-wrapper">
        <header className="canvas-header">
          <span className="title">
            {i18n.language === "en"
              ? "Sidebar"
              : t("shop.sidebar.sidebar")}
          </span>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </header>
        <div className="canvas-body">
          <Sidebar onCategorySelect={onCategorySelect} display={true} />
        </div>
      </div>
    </div>
  );
}
