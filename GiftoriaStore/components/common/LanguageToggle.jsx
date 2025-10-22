"use client";

import React from "react";
import i18n from "@/i18n"; // adjust the path if needed

export default function LanguageToggle() {
  const toggleLang = () => {
    const currentLang = localStorage.getItem("lang") || "en";
    const newLang = currentLang === "ar" ? "en" : "ar";

    localStorage.setItem("lang", newLang);
    i18n.changeLanguage(newLang).then(() => {
      window.location.reload();
    });
  };

  const currentLang =
    typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en";

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button onClick={toggleLang}>
        Switch to {currentLang === "ar" ? "English" : "Arabic"}
      </button>
    </div>
  );
}
