<<<<<<< HEAD
"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { layouts, sortingOptions } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import Pagination from "../common/Pagination";
import Sorting from "./Sorting";
import { useTranslation } from "react-i18next";
// import { products1 } from "@/data/products";

export default function ShopSidebarleft() {
  const { t, i18n } = useTranslation();
  const [gridItems, setGridItems] = useState(3);
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const ITEMS_PER_PAGE = 30;

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        const items = Array.isArray(data) ? data : (data?.data || []);
        setProducts(items);
        setFinalSorted(items);
      } catch (err) {
        setProducts([]);
        setFinalSorted([]);
        console.error('[ShopSidebarleft] Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Filter products by activeCategory
  useEffect(() => {
    if (!activeCategory) {
      setFinalSorted(products);
    } else {
      setFinalSorted(products.filter(p => p.category_id === activeCategory));
    }
  }, [activeCategory, products]);

  // Reset to first page whenever the result set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [finalSorted]);

  // Pagination logic
  const totalPages = Math.ceil(finalSorted.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = finalSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <section className="flat-spacing-1" style={{direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
        <div className="container">
          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter"></div>
            <ul className="tf-control-layout d-flex justify-content-center">
              {layouts.slice(0, 4).map((layout, index) => (
                <li
                  key={index}
                  className={`tf-view-layout-switch ${layout.className} ${
                    gridItems == layout.dataValueGrid ? "active" : ""
                  }`}
                  onClick={() => setGridItems(layout.dataValueGrid)}
                >
                  <div className="item">
                    <span className={`icon ${layout.iconClass}`} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="tf-control-sorting d-flex justify-content-end">
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <Sorting setFinalSorted={setFinalSorted} products={products} />
              </div>
            </div>
          </div>
          <div className="tf-row-flex">
            <Sidebar onCategorySelect={cat => setActiveCategory(cat ? cat.id : null)} />
            <div className="tf-shop-content">
              {loading ? (
                <div className="text-center py-5">
                  <p>{t("shop.loading_products")}</p>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <>
                  <ProductGrid allproducts={paginatedProducts} gridItems={gridItems} />
                  <ul className="tf-pagination-wrap tf-pagination-list">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <li key={idx + 1} className={currentPage === idx + 1 ? "active" : ""}>
                        <a
                          className="pagination-link animate-hover-btn"
                          onClick={() => setCurrentPage(idx + 1)}
                        >
                          {idx + 1}
                        </a>
                      </li>
                    ))}
                    {currentPage < totalPages && (
                      <li>
                        <a
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="pagination-link animate-hover-btn"
                        >
                          <span className="icon icon-arrow-right" />
                        </a>
                      </li>
                    )}
                  </ul>
                </>
              ) : (
                <div className="text-center py-5">
                  <p>{t("shop.no_products_found")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="btn-sidebar-style2">
        <button
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarmobile"
          aria-controls="offcanvas"
        >
          <i className="icon icon-sidebar-2" />
        </button>
      </div>
    </>
  );
}
=======
"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { layouts, sortingOptions } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import Pagination from "../common/Pagination";
import Sorting from "./Sorting";
import { useTranslation } from "react-i18next";
// import { products1 } from "@/data/products";

export default function ShopSidebarleft() {
    // Helper to wrap only the number in arabic_div
    function wrapProductCountText(text) {
      return text.replace(/(\d+)/, '<span class="arabic_div">$1</span>');
    }
  const { t, i18n } = useTranslation();
  const [gridItems, setGridItems] = useState(3);
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const ITEMS_PER_PAGE = 30;

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        const items = Array.isArray(data) ? data : (data?.data || []);
        setProducts(items);
        setFinalSorted(items);
      } catch (err) {
        setProducts([]);
        setFinalSorted([]);
        console.error('[ShopSidebarleft] Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Filter products by activeCategory
  useEffect(() => {
    if (!activeCategory) {
      setFinalSorted(products);
    } else {
      setFinalSorted(products.filter(p => p.category_id === activeCategory));
    }
  }, [activeCategory, products]);

  // Reset to first page whenever the result set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [finalSorted]);

  // Pagination logic
  const totalPages = Math.ceil(finalSorted.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = finalSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <section className="flat-spacing-1" style={{direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
        <div className="container">
          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter"></div>
            <ul className="tf-control-layout d-flex justify-content-center">
              {layouts.slice(0, 4).map((layout, index) => (
                <li
                  key={index}
                  className={`tf-view-layout-switch ${layout.className} ${
                    gridItems == layout.dataValueGrid ? "active" : ""
                  }`}
                  onClick={() => setGridItems(layout.dataValueGrid)}
                >
                  <div className="item">
                    <span className={`icon ${layout.iconClass}`} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="tf-control-sorting d-flex justify-content-end">
              <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
                <Sorting setFinalSorted={setFinalSorted} products={products} />
              </div>
            </div>
          </div>
          <div className="tf-row-flex">
            <Sidebar onCategorySelect={cat => setActiveCategory(cat ? cat.id : null)} />
            <div className="tf-shop-content">
              {loading ? (
                <div className="text-center py-5">
                  <p>{t("shop.loading_products")}</p>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <>
                  {/* Product count sentence with only the number wrapped in arabic_div */}
                  <div style={{width: 'fit-content', margin: '0px auto 24px', fontSize: 17}}>
                    {i18n.language === 'ar'
                      ? <span dangerouslySetInnerHTML={{__html: wrapProductCountText(`${finalSorted.length} منتج تم العثور عليه`)}} />
                      : `${finalSorted.length} products found`}
                  </div>
                  <ProductGrid allproducts={paginatedProducts} gridItems={gridItems} />
                  <ul className="tf-pagination-wrap tf-pagination-list">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <li key={idx + 1} className={currentPage === idx + 1 ? "active" : ""}>
                        <a
                          className="pagination-link animate-hover-btn"
                          onClick={() => setCurrentPage(idx + 1)}
                        >
                          {idx + 1}
                        </a>
                      </li>
                    ))}
                    {currentPage < totalPages && (
                      <li>
                        <a
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="pagination-link animate-hover-btn"
                        >
                          <span className="icon icon-arrow-right" />
                        </a>
                      </li>
                    )}
                  </ul>
                </>
              ) : (
                <div className="text-center py-5 arabic_div">
                  <p>{t("shop.no_products_found")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="btn-sidebar-style2">
        <button
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarmobile"
          aria-controls="offcanvas"
        >
          <i className="icon icon-sidebar-2" />
        </button>
      </div>
    </>
  );
}
>>>>>>> origin/main
