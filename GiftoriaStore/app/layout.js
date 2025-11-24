"use client";

import { useEffect, useState } from "react";
import "./translation/i18n";
import i18n from "./translation/i18n";
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "./globals.css";
import "rc-slider/assets/index.css";
import Context from "@/context/Context";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import OptimizedScripts from "@/components/common/OptimizedScripts";
import ScrollTop from "@/components/common/ScrollTop";
import RtlToggle from "@/components/common/RtlToggle";

// Lazy load all modals
import {
  LazyHomesModal,
  LazyQuickView,
  LazyQuickAdd,
  LazyProductSidebar,
  LazyShopCart,
  LazyAskQuestion,
  LazyDeliveryReturn,
  LazyLogin,
  LazyMobileMenu,
  LazyRegister,
  LazyResetPass,
  LazySearchModal,
  LazyToolbarBottom,
  LazyToolbarShop,
  LazyShareModal,
} from "@/components/modals/LazyModals";

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting and language initialization
  useEffect(() => {
    setIsClient(true);
    
    // Restore saved language after hydration
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }

    // Initialize direction
    const direction = localStorage.getItem("direction");
    if (direction) {
      const parsedDirection = JSON.parse(direction);
      document.documentElement.dir = parsedDirection.dir;
      document.body.classList.add(parsedDirection.dir);
    } else {
      document.documentElement.dir = "ltr";
    }

    // Remove preloader
    const preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(() => preloader.classList.add("disabled"), 100);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="preload-wrapper" suppressHydrationWarning>
        <div className="preload preload-container" id="preloader">
          <div className="preload-logo">
            <div className="spinner"></div>
          </div>
        </div>
        
        <Context>
          <ErrorBoundary componentName="Main App">
            <div id="wrapper">{children}</div>
          </ErrorBoundary>
          
          <RtlToggle />
          <ScrollTop />
          <OptimizedScripts />
          
          {/* Lazy-loaded modals - only load when needed */}
          {isClient && (
            <ErrorBoundary componentName="Modals">
              <LazyHomesModal />
              <LazyQuickView />
              <LazyQuickAdd />
              <LazyProductSidebar />
              <LazyShopCart />
              <LazyAskQuestion />
              <LazyDeliveryReturn />
              <LazyLogin />
              <LazyMobileMenu />
              <LazyRegister />
              <LazyResetPass />
              <LazySearchModal />
              <LazyToolbarBottom />
              <LazyToolbarShop />
              <LazyShareModal />
            </ErrorBoundary>
          )}
        </Context>
      </body>
    </html>
  );
}
