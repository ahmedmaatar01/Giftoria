"use client";
import React, { useEffect, useRef, useState } from "react";
import i18n from "../../app/translation/i18n";

const languageOptions = [
  { id: "en", label: "English" },
  { id: "ar", label: "العربية" },
];

export default function LanguageSelect({
  parentClassName = "image-select center style-default type-languages",
  topStart = false,
}) {
  const [selected, setSelected] = useState(languageOptions[0]);
  const [isDDOpen, setIsDDOpen] = useState(false);
  const languageSelect = useRef();

  // Initialize selected language, direction, and font class on mount
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    const selectedOption = languageOptions.find((opt) => opt.id === lang) || languageOptions[0];
    setSelected(selectedOption);

    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;

    if (lang === "ar") {
      document.documentElement.classList.add("arabic-font");
    } else {
      document.documentElement.classList.remove("arabic-font");
    }

    localStorage.setItem("direction", JSON.stringify({ dir }));

    i18n.changeLanguage(lang);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageSelect.current &&
        !languageSelect.current.contains(event.target)
      ) {
        setIsDDOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLanguageChange = async (langObj) => {
    const newLang = langObj.id;
    const newDir = newLang === "ar" ? "rtl" : "ltr";

    localStorage.setItem("lang", newLang);
    localStorage.setItem("direction", JSON.stringify({ dir: newDir }));

    await i18n.changeLanguage(newLang);
    document.documentElement.dir = newDir;

    if (newLang === "ar") {
      document.documentElement.classList.add("arabic-font");
    } else {
      document.documentElement.classList.remove("arabic-font");
    }

    setSelected(langObj);
    setIsDDOpen(false);

    // Reload page to apply language & styles site-wide
    window.location.reload();
  };

  return (
    <div
      className={`dropdown bootstrap-select ${parentClassName} dropup`}
      onClick={() => setIsDDOpen((prev) => !prev)}
      ref={languageSelect}
    >
      <select
        className="image-select center style-default type-languages"
        tabIndex="-1"
      >
        {languageOptions.map((option, i) => (
          <option key={i} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        tabIndex={-1}
        className={`btn dropdown-toggle btn-light ${isDDOpen ? "show" : ""}`}
      >
        <div className="filter-option">
          <div className="filter-option-inner">
            <div className="filter-option-inner-inner">{selected.label}</div>
          </div>
        </div>
      </button>

      <div
        className={`dropdown-menu ${isDDOpen ? "show" : ""}`}
        style={{
          maxHeight: "899.688px",
          overflow: "hidden",
          minHeight: 142,
          position: "absolute",
          inset: "auto auto 0px 0px",
          margin: 0,
          transform: `translate(0px, ${topStart ? 22 : -20}px)`,
        }}
        data-popper-placement={`${!topStart ? "top" : "bottom"}-start`}
      >
        <div
          className="inner show"
          style={{
            maxHeight: "869.688px",
            overflowY: "auto",
            minHeight: 112,
          }}
        >
          <ul
            className="dropdown-menu inner show"
            role="presentation"
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            {languageOptions.map((elm, i) => (
              <li
                key={i}
                onClick={() => handleLanguageChange(elm)}
                className={selected.id === elm.id ? "selected active" : ""}
              >
                <a
                  className={`dropdown-item ${selected.id === elm.id ? "active selected" : ""}`}
                  role="button"
                >
                  <span className="text">{elm.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
