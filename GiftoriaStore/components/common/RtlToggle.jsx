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

}
