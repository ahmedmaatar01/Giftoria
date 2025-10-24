"use client";
import { layouts } from "@/data/shop";
import ProductGrid from "./ProductGrid";
import { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import ShopFilterOccasion from "./ShopFilterOccasion";
import Sorting from "./Sorting";
import { useSearchParams } from "next/navigation";

// Pagination: 30 items per page
const ITEMS_PER_PAGE = 30;

export default function ShopByOccasion() {
  const searchParams = useSearchParams();
  const occasionId = searchParams.get('occasion');
  const [gridItems, setGridItems] = useState(4);
  const [products, setProducts] = useState([]);
  const [finalSorted, setFinalSorted] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch occasion and its categories
  useEffect(() => {
    const fetchOccasionData = async () => {
      if (!occasionId) {
        console.warn('[ShopByOccasion] No occasionId in query params');
        setLoading(false);
        return;
      }

      try {
        console.log('[ShopByOccasion] Fetching occasion details for id:', occasionId);
        const response = await fetch(`http://localhost:8000/api/occasions/${occasionId}`);
        const data = await response.json();
        console.log('[ShopByOccasion] Occasion loaded. Categories count:', data?.categories?.length || 0);
        
        // Extract category IDs from the occasion
        const catIds = data.categories?.map(cat => cat.id) || [];
        setCategoryIds(catIds);
        
        // Fetch all products
        console.log('[ShopByOccasion] Fetching all products to filter by occasion categories...');
        const productsResponse = await fetch('http://localhost:8000/api/products');
        const allProducts = await productsResponse.json();
        console.log('[ShopByOccasion] Total products loaded:', Array.isArray(allProducts) ? allProducts.length : 0);
        
        // Filter products that belong to any of the occasion's categories
        const filteredProducts = allProducts.filter(product => 
          product.category_id && catIds.includes(product.category_id)
        );
        console.log('[ShopByOccasion] Filtered products for occasion:', filteredProducts.length);
        
        setProducts(filteredProducts);
        setFinalSorted(filteredProducts);
      } catch (error) {
        console.error('[ShopByOccasion] Error fetching occasion products:', error);
      } finally {
        setLoading(false);
        console.log('[ShopByOccasion] Loading set to false');
      }
    };

    fetchOccasionData();
  }, [occasionId]);

  // Pagination logic
  const totalPages = Math.ceil(finalSorted.length / ITEMS_PER_PAGE);
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
            ) : finalSorted.length > 0 ? (
              <>
                <ProductGrid allproducts={paginatedProducts} gridItems={gridItems} />
                {/* pagination */}
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
                <p>No products found for this occasion.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <ShopFilterOccasion 
        setProducts={setFinalSorted} 
        allProducts={products}
        categoryIds={categoryIds}
      />
    </>
  );
}
