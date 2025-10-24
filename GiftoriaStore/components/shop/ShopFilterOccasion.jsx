"use client";

import { useEffect, useState } from "react";
import Slider from "rc-slider";
import Link from "next/link";

const filterColors = [
  { name: "Orange", colorClass: "bg_orange-3" },
  { name: "Black", colorClass: "bg_dark" },
  { name: "White", colorClass: "bg_white" },
  { name: "Brown", colorClass: "bg_brown" },
  { name: "Light Purple", colorClass: "bg_purple" },
  { name: "Light Green", colorClass: "bg_light-green" },
  { name: "Pink", colorClass: "bg_purple" },
  { name: "Blue", colorClass: "bg_blue-2" },
  { name: "Dark Blue", colorClass: "bg_dark-blue" },
  { name: "Light Grey", colorClass: "bg_light-grey" },
  { name: "Beige", colorClass: "bg_beige" },
  { name: "Light Blue", colorClass: "bg_light-blue" },
  { name: "Grey", colorClass: "bg_grey" },
  { name: "Light Pink", colorClass: "bg_light-pink" },
];

const availabilities = [
  { id: 1, isAvailable: true, text: "Available", count: 14 },
  { id: 2, isAvailable: false, text: "Out of Stock", count: 2 },
];

export default function ShopFilterOccasion({ 
  setProducts, 
  allProducts = [], 
  categoryIds = [] 
}) {
  const [categories, setCategories] = useState([]);
  // price: current selected range; priceBounds: fixed min/max derived from all products
  const [price, setPrice] = useState([0, 1000]);
  const [priceBounds, setPriceBounds] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  // Removed color and availability filters
  
  // Fetch categories based on categoryIds
  useEffect(() => {
    const fetchCategories = async () => {
      if (!categoryIds.length) {
        console.warn('[ShopFilterOccasion] No categoryIds provided for occasion');
        setCategories([]);
        return;
      }

      try {
        console.log('[ShopFilterOccasion] Fetching categories to match ids:', categoryIds);
        const response = await fetch('http://localhost:8000/api/categories');
        const allCategories = await response.json();
        console.log('[ShopFilterOccasion] Total categories loaded:', Array.isArray(allCategories) ? allCategories.length : 0);
        
        // Filter only categories that belong to the occasion
        const filteredCategories = allCategories.filter(cat => 
          categoryIds.includes(cat.id)
        );
        console.log('[ShopFilterOccasion] Occasion categories resolved:', filteredCategories.length);
        
        setCategories(filteredCategories);
      } catch (error) {
        console.error('[ShopFilterOccasion] Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [categoryIds]);

  // Set initial price bounds and default selected price based on products
  useEffect(() => {
    console.log('[ShopFilterOccasion] Base products for filtering:', allProducts?.length);
    if (allProducts.length > 0) {
      const prices = allProducts
        .map(p => parseFloat(p?.price))
        .filter(v => !isNaN(v));
      const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
      const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 1000;
      console.log('[ShopFilterOccasion] Computed price bounds:', { minPrice, maxPrice });
      setPriceBounds([minPrice, maxPrice]);
      // If current selection is outside new bounds or initial load, reset to bounds
      setPrice(prev => {
        const [curMin, curMax] = prev || [];
        if (
          !Array.isArray(prev) ||
          isNaN(curMin) ||
          isNaN(curMax) ||
          curMin < minPrice ||
          curMax > maxPrice
        ) {
          return [minPrice, maxPrice];
        }
        return [Math.max(curMin, minPrice), Math.min(curMax, maxPrice)];
      });
    }
  }, [allProducts]);

  const handlePrice = (value) => {
    setPrice(value);
  };

  const handleSelectCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories((pre) => pre.filter((el) => el !== categoryId));
    } else {
      setSelectedCategories((pre) => [...pre, categoryId]);
    }
  };

  // Removed color and availability handlers

  // Apply filters
  useEffect(() => {
    console.log('[ShopFilterOccasion] Applying filters:', { price, selectedCategories });
    let filtered = [...allProducts];

    // Filter by price
    filtered = filtered.filter(
      (elm) => parseFloat(elm.price) >= price[0] && parseFloat(elm.price) <= price[1]
    );

    // Filter by selected categories
    if (selectedCategories.length) {
      filtered = filtered.filter((elm) =>
        selectedCategories.includes(elm.category_id)
      );
    }

    console.log('[ShopFilterOccasion] Filter result count:', filtered.length);
    setProducts(filtered);
  }, [
    price,
    selectedCategories,
    allProducts,
  ]);

  const clearFilter = () => {
    setSelectedCategories([]);
    // Reset price to full bounds
    setPrice(priceBounds);
  };

  return (
    <div className="offcanvas offcanvas-start canvas-filter" id="filterShopOccasion">
      <div className="canvas-wrapper">
        <header className="canvas-header">
          <div className="filter-icon">
            <span className="icon icon-filter" />
            <span>Filter</span>
          </div>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </header>
        <div className="canvas-body">
          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className="widget-facet wd-categories">
              <div
                className="facet-title"
                data-bs-target="#categories"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="categories"
              >
                <span>Categories</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="categories" className="collapse show">
                <ul className="list-categoris current-scrollbar mb_36">
                  {categories.map((category) => (
                    <li 
                      key={category.id} 
                      className={`cate-item ${selectedCategories.includes(category.id) ? 'current' : ''}`}
                      onClick={() => handleSelectCategory(category.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>{category.name}</span>
                      <span className="text-secondary ms-2">
                        ({allProducts.filter(p => p.category_id === category.id).length})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => e.preventDefault()}
            action="#"
            id="facet-filter-form"
            className="facet-filter-form"
          >
            {/* Availability Filter removed */}

            {/* Price Filter */}
            <div className="widget-facet wrap-price">
              <div
                className="facet-title"
                data-bs-target="#price"
                data-bs-toggle="collapse"
                aria-expanded="true"
                aria-controls="price"
              >
                <span>Price</span>
                <span className="icon icon-arrow-up" />
              </div>
              <div id="price" className="collapse show">
                <div className="widget-price filter-price">
                  <Slider
                    formatLabel={() => ``}
                    range
                    max={priceBounds[1] > 0 ? priceBounds[1] : 1000}
                    min={priceBounds[0]}
                    value={price}
                    onChange={(value) => handlePrice(value)}
                    id="slider"
                  />
                  <div className="box-title-price">
                    <span className="title-price">Price :</span>
                    <div className="caption-price">
                      <div>
                        <span>$</span>
                        <span className="min-price">{price[0]}</span>
                      </div>
                      <span>-</span>
                      <div>
                        <span>$</span>
                        <span className="max-price">{price[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Filter removed */}
          </form>
          
          <div className="mt-5"></div>
          <a
            className="tf-btn style-2 btn-fill rounded animate-hover-btn"
            onClick={clearFilter}
            style={{ cursor: 'pointer' }}
          >
            Clear Filter
          </a>
        </div>
      </div>
    </div>
  );
}
