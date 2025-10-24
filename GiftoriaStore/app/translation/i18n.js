import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";

const getLang = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lang") || "en";
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "en", // Always start with 'en' for SSR consistency
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Disable suspense for SSR
  },
});

// Update language after hydration on client side
if (typeof window !== "undefined") {
  const savedLang = localStorage.getItem("lang");
  if (savedLang && savedLang !== i18n.language) {
    i18n.changeLanguage(savedLang);
  }
}

export default i18n;
