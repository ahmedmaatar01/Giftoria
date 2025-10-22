import React, { useState, useEffect } from "react";
import i18n from "../../app/translation/i18n";

export default function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setCurrentLang(lang);

    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    localStorage.setItem("direction", JSON.stringify({ dir }));
  }, []);

  const toggleLang = () => {
    const newLang = currentLang === "ar" ? "en" : "ar";
    const newDir = newLang === "ar" ? "rtl" : "ltr";

    localStorage.setItem("lang", newLang);
    localStorage.setItem("direction", JSON.stringify({ dir: newDir }));

    i18n.changeLanguage(newLang).then(() => {
      document.documentElement.dir = newDir;
      setCurrentLang(newLang);
      window.location.reload();
    });
  };

  return (
    <a
      id="toggle-rtl"
      onClick={toggleLang}
      className="tf-btn animate-hover-btn btn-fill"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleLang(); }}
      style={{ cursor: "pointer" }}
      aria-label={`Switch language and direction to ${currentLang === "ar" ? "English LTR" : "Arabic RTL"}`}
    >
      <span>{currentLang === "ar" ? "ltr" : "rtl"}</span>
      <span>{currentLang === "ar" ? "rtl" : "ltr"}</span>
    </a>
  );
}
