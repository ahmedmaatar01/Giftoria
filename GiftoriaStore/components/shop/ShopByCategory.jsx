"use client";
import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import { useState, useEffect } from "react";
import ShopFilterOccasion from "./ShopFilterOccasion";
import Sorting from "./Sorting";
import { useSearchParams } from "next/navigation";

// Pagination: 30 items per page
const ITEMS_PER_PAGE = 30;

export default function ShopByCategory() {
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get('category');
  const categoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : null;

  const [gridItems, setGridItems] = useState(4);
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryId) {
        console.warn('[ShopByCategory] No category id provided in query');
        setLoading(false);
        return;
      }
      try {
        console.log('[ShopByCategory] Fetching products for category:', categoryId);
        const response = await fetch(`http://localhost:8000/api/products?category_id=${categoryId}`);
        const data = await response.json();
        const items = Array.isArray(data) ? data : (data?.data || []); // handle pagination payloads if any
        // Safety: ensure only products from this category are included even if API ignores the query param
        const filtered = items.filter((p) => {
          const pid = typeof p?.category_id === 'string' ? parseInt(p.category_id, 10) : p?.category_id;
          return pid === categoryId;
        });
        console.log('[ShopByCategory] Loaded products count:', items.length, 'Filtered count:', filtered.length);
        setProducts(filtered);
        setFinalSorted(filtered);
      } catch (err) {
        console.error('[ShopByCategory] Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryId]);

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
      <section className="flat-spacing-2">
        <div className="container">
          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter">
              <a
                href="#filterShopOccasion"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Filter</span>
              </a>
            </div>
            <ul className="tf-control-layout d-flex justify-content-center">
              {layouts.map((layout, index) => (
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
          <div className="wrapper-control-shop">
            <div className="meta-filter-shop" />
            {loading ? (
              <div className="text-center py-5">
                <p>Loading products...</p>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <ProductGrid allproducts={paginatedProducts} gridItems={gridItems} />
                <ul className="tf-pagination-wrap tf-pagination-list tf-pagination-btn">
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
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Reuse ShopFilterOccasion by passing a single category id */}
      <ShopFilterOccasion
        setProducts={setFinalSorted}
        allProducts={products}
        categoryIds={categoryId ? [categoryId] : []}
      />
    </>
  );
}
