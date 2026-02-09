"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function OptimizedScripts() {
  const pathname = usePathname();
  
  // Handle static generation where pathname might be null
  const currentPath = pathname || '';
  
  const lastScrollY = useRef(0);
  const scrollDirection = useRef("down");

  useEffect(() => {
    // Import bootstrap only once on client
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm");
    }
  }, []);

  useEffect(() => {
    let headerScrollTimeout;
    const header = document.querySelector("header");

    const handleScroll = () => {
      if (headerScrollTimeout) return;
      
      headerScrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;

        // Header background
        if (header) {
          if (currentScrollY > 100) {
            header.classList.add("header-bg");
          } else {
            header.classList.remove("header-bg");
          }
        }

        // Scroll direction for header visibility
        if (currentScrollY > 250) {
          if (currentScrollY > lastScrollY.current) {
            scrollDirection.current = "down";
          } else {
            scrollDirection.current = "up";
            if (header) header.style.top = "0px";
          }
        } else {
          scrollDirection.current = "down";
        }

        lastScrollY.current = currentScrollY;
        headerScrollTimeout = null;
      }, 100); // Throttle scroll events
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (headerScrollTimeout) clearTimeout(headerScrollTimeout);
    };
  }, []);

  useEffect(() => {
    // Close modals and offcanvas on route change
    const closeBootstrapComponents = async () => {
      const bootstrap = await import("bootstrap/dist/js/bootstrap.esm");
      
      const modalElements = document.querySelectorAll(".modal.show");
      modalElements.forEach((modal) => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
      });

      const offcanvasElements = document.querySelectorAll(".offcanvas.show");
      offcanvasElements.forEach((offcanvas) => {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
        if (offcanvasInstance) offcanvasInstance.hide();
      });
    };

    closeBootstrapComponents();
  }, [currentPath]);

  useEffect(() => {
    // Initialize WOW.js only once per route
    const initWow = async () => {
      const WOW = await import("@/utlis/wow");
      const wow = new WOW.default({
        mobile: false,
        live: false,
      });
      wow.init();
    };

    initWow();
  }, [currentPath]);

  return null;
}
