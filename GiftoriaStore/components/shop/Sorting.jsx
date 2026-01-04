"use client";
import { products1 } from "@/data/products";
import { sortingOptions } from "@/data/shop";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Sorting({ products = products1, setFinalSorted }) {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState(sortingOptions[0]);

  // Map sorting option texts to translation keys
  const getTranslatedText = (optionText) => {
    const translationMap = {
      "Default": t('shop.sorting.default'),
      "Alphabetically, A-Z": t('shop.sorting.alphabetically_az'),
      "Alphabetically, Z-A": t('shop.sorting.alphabetically_za'),
      "Price, low to high": t('shop.sorting.price_low_high'),
      "Price, high to low": t('shop.sorting.price_high_low')
    };
    return translationMap[optionText] || optionText;
  };

  useEffect(() => {
    console.log('[Sorting] Running sort with option:', selectedOptions?.text, 'on products:', products?.length);
    if (selectedOptions.text == "Default") {
      const out = [...products];
      console.log('[Sorting] Default sort result count:', out.length);
      setFinalSorted(out);
    } else if (selectedOptions.text == "Alphabetically, A-Z") {
      const out = [...products].sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
      console.log('[Sorting] A-Z result count:', out.length);
      setFinalSorted(out);
    } else if (selectedOptions.text == "Alphabetically, Z-A") {
      const out = [...products].sort((a, b) => (b.title || b.name || '').localeCompare(a.title || a.name || ''));
      console.log('[Sorting] Z-A result count:', out.length);
      setFinalSorted(out);
    } else if (selectedOptions.text == "Price, low to high") {
      const out = [...products].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
      console.log('[Sorting] Price low->high result count:', out.length);
      setFinalSorted(out);
    } else if (selectedOptions.text == "Price, high to low") {
      const out = [...products].sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
      console.log('[Sorting] Price high->low result count:', out.length);
      setFinalSorted(out);
    }
  }, [products, selectedOptions]);

  return (
    <>
      {" "}
      <div className="btn-select">
        <span className="text-sort-value">{getTranslatedText(selectedOptions.text)}</span>
        <span className="icon icon-arrow-down" />
      </div>
      <div className="dropdown-menu">
        {sortingOptions.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              console.log('[Sorting] Selected option changed to:', item.text);
              setSelectedOptions(item);
            }}
            className={`select-item ${item == selectedOptions ? "active" : ""}`}
          >
            <span className="text-value-item">{getTranslatedText(item.text)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
