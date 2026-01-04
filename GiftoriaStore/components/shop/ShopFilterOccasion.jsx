<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";
import Slider from "rc-slider";
import Link from "next/link";
import { useTranslation } from "react-i18next"; // ✅ add this

export default function ShopFilterOccasion({ 
  setProducts, 
  allProducts = [], 
  categoryIds = [] 
}) {
  const { t } = useTranslation(); // ✅ translation hook

  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState([0, 1000]);
  const [priceBounds, setPriceBounds] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!categoryIds.length) {
        setCategories([]);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/categories');
        const allCategories = await response.json();
        const filteredCategories = allCategories.filter(cat => 
          categoryIds.includes(cat.id)
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error('[ShopFilterOccasion] Error:', error);
      }
    };

    fetchCategories();
  }, [categoryIds]);

  useEffect(() => {
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => parseFloat(p?.price)).filter(v => !isNaN(v));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceBounds([minPrice, maxPrice]);
      setPrice([minPrice, maxPrice]);
    }
  }, [allProducts]);

  const handlePrice = (value) => setPrice(value);
  const handleSelectCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(el => el !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    let filtered = [...allProducts];
    filtered = filtered.filter(elm => parseFloat(elm.price) >= price[0] && parseFloat(elm.price) <= price[1]);

    if (selectedCategories.length) {
      filtered = filtered.filter(elm => selectedCategories.includes(elm.category_id));
    }

    setProducts(filtered);
  }, [price, selectedCategories, allProducts]);

  const clearFilter = () => {
    setSelectedCategories([]);
    setPrice(priceBounds);
  };

  return (
    <div className="offcanvas offcanvas-start canvas-filter" id="filterShopOccasion">
      <div className="canvas-wrapper">
        <header className="canvas-header">
          <div className="filter-icon">
            <span className="icon icon-filter" />
            <span>{t("filter.title")}</span> {/* ✅ Filter */}
          </div>
          <span className="icon-close icon-close-popup" data-bs-dismiss="offcanvas" />
        </header>

        <div className="canvas-body">
          
          {categories.length > 0 && (
            <div className="widget-facet wd-categories">
              <div className="facet-title"
                data-bs-toggle="collapse"
                data-bs-target="#categories"
              >
                <span>{t("filter.categories")}</span> {/* ✅ Categories */}
                <span className="icon icon-arrow-up" />
              </div>

              <div id="categories" className="collapse show">
                <ul className="list-categoris current-scrollbar mb_36">
                  {categories.map((cat) => (
                    <li key={cat.id}
                        className={`cate-item ${selectedCategories.includes(cat.id) ? "current" : ""}`}
                        onClick={() => handleSelectCategory(cat.id)}
                    >
                      <span>{cat.name_ar ?? cat.name}</span> {/* ✅ Arabic if exists */}
                      <span className="text-secondary ms-2">
                        ({allProducts.filter(p => p.category_id === cat.id).length})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="widget-facet wrap-price">
            <div className="facet-title" data-bs-target="#price" data-bs-toggle="collapse">
              <span>{t("filter.price")}</span> {/* ✅ Price */}
              <span className="icon icon-arrow-up" />
            </div>

            <div id="price" className="collapse show">
              <div className="widget-price filter-price">
                <Slider range value={price} min={priceBounds[0]} max={priceBounds[1]} onChange={handlePrice} />

                <div className="box-title-price">
                  <span className="title-price">{t("filter.price")} :</span>
                  <div className="caption-price">
                    <div>
                      <span>$</span><span>{price[0]}</span>
                    </div>
                    <span>-</span>
                    <div>
                      <span>$</span><span>{price[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a className="tf-btn style-2 btn-fill rounded animate-hover-btn"
             onClick={clearFilter}
             style={{ cursor: "pointer" }}>
            {t("filter.clear")} {/* ✅ Clear Filter */}
          </a>

        </div>
      </div>
    </div>
  );
}
=======
"use client";

import { useEffect, useState } from "react";
import Slider from "rc-slider";
import Link from "next/link";
import { useTranslation } from "react-i18next"; // ✅ add this
        import { API_BASE_URL_WITH_API } from '../../utils/config';

export default function ShopFilterOccasion({ 
  setProducts, 
  allProducts = [], 
  categoryIds = [] 
}) {
  const { t, i18n } = useTranslation(); // ✅ translation hook

  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState([0, 1000]);
  const [priceBounds, setPriceBounds] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!categoryIds.length) {
        setCategories([]);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL_WITH_API}/categories`);
        const allCategories = await response.json();
        const filteredCategories = allCategories.filter(cat => 
          categoryIds.includes(cat.id)
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error('[ShopFilterOccasion] Error:', error);
      }
    };

    fetchCategories();
  }, [categoryIds]);

  useEffect(() => {
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => parseFloat(p?.price)).filter(v => !isNaN(v));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceBounds([minPrice, maxPrice]);
      setPrice([minPrice, maxPrice]);
    }
  }, [allProducts]);

  const handlePrice = (value) => setPrice(value);
  const handleSelectCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(el => el !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    let filtered = [...allProducts];
    filtered = filtered.filter(elm => parseFloat(elm.price) >= price[0] && parseFloat(elm.price) <= price[1]);

    if (selectedCategories.length) {
      filtered = filtered.filter(elm => selectedCategories.includes(elm.category_id));
    }

    setProducts(filtered);
  }, [price, selectedCategories, allProducts]);

  const clearFilter = () => {
    setSelectedCategories([]);
    setPrice(priceBounds);
  };

  return (
    <div className="offcanvas offcanvas-start canvas-filter" id="filterShopOccasion">
      <div className="canvas-wrapper">
        <header className="canvas-header">
          <div className="filter-icon">
            <span className="icon icon-filter" />
            <span>{i18n.language === 'ar' ? 'تصفية' : 'Filter'}</span>
          </div>
          <span className="icon-close icon-close-popup" data-bs-dismiss="offcanvas" />
        </header>

        <div className="canvas-body">
          
          {categories.length > 0 && (
            <div className="widget-facet wd-categories">
              <div className="facet-title"
                data-bs-toggle="collapse"
                data-bs-target="#categories"
              >
                <span>{i18n.language === 'ar' ? 'الفئات' : 'Categories'}</span>
                <span className="icon icon-arrow-up" />
              </div>

              <div id="categories" className="collapse show">
                <ul className="list-categoris current-scrollbar mb_36">
                  {categories.map((cat) => {
                    const categoryName = i18n.language === 'ar' && cat.name_ar 
                      ? cat.name_ar 
                      : cat.name;
                    return (
                      <li key={cat.id}
                          className={`cate-item ${selectedCategories.includes(cat.id) ? "current" : ""}`}
                          onClick={() => handleSelectCategory(cat.id)}
                      >
                        <span>{categoryName}</span>
                        <span className="text-secondary ms-2">
                          ({allProducts.filter(p => p.category_id === cat.id).length})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="widget-facet wrap-price">
            <div className="facet-title" data-bs-target="#price" data-bs-toggle="collapse">
              <span>{i18n.language === 'ar' ? 'السعر' : 'Price'}</span>
              <span className="icon icon-arrow-up" />
            </div>

            <div id="price" className="collapse show">
              <div className="widget-price filter-price">
                <Slider range value={price} min={priceBounds[0]} max={priceBounds[1]} onChange={handlePrice} />

                <div className="box-title-price">
                  <span className="title-price">{i18n.language === 'ar' ? 'السعر' : 'Price'} :</span>
                  <div className="caption-price">
                    <div>
                      <span>$</span><span>{price[0]}</span>
                    </div>
                    <span>-</span>
                    <div>
                      <span>$</span><span>{price[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a className="tf-btn style-2 btn-fill rounded animate-hover-btn"
             onClick={clearFilter}
             style={{ cursor: "pointer" }}>
            {i18n.language === 'ar' ? 'مسح الفلتر' : 'Clear Filter'}
          </a>

        </div>
      </div>
    </div>
  );
}
>>>>>>> origin/main
