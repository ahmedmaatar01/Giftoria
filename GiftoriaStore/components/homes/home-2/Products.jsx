"use client";

import Productcart2 from "@/components/shopCards/Productcart2";
import { useContextElement } from "@/context/Context";
import React, { useState, useEffect } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Products() {
  const { apiProducts, loading: apiLoading } = useContextElement();
  const [displayProducts, setDisplayProducts] = useState([]);

  // Only use API products, no fallback to static
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      setDisplayProducts([...apiProducts]); // Show all API products
    }
  }, [apiProducts]);

  return (
    <section className="flat-spacing-2 pt_0">
      <div className="container">
        <div className="flat-title flex-row justify-content-between px-0">
          <span className="bell-medium heading-30 wow fadeInUp" data-wow-delay="0s">
            Best Seller
          </span>
          <div className="box-sw-navigation">
            <div className="nav-sw square nav-next-slider nav-next-product snbp114">
              <span className="icon icon-arrow1-left" />
            </div>
            <div className="nav-sw square nav-prev-slider nav-prev-product snbn114">
              <span className="icon icon-arrow1-right" />
            </div>
          </div>
        </div>
        
        {/* Show loading indicator when fetching API products */}
        {apiLoading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
            <p className="mt-2">Loading products from server...</p>
          </div>
        )}
        
        {/* Show message when no API products available */}
        {!apiLoading && (!apiProducts || apiProducts.length === 0) && (
          <div className="text-center py-5">
            <div className="alert alert-info">
              <h5>No Products Available</h5>
              <p>Please make sure your backend API is running at <code>http://localhost:8000/api</code></p>
              <p>Or add some products through your admin dashboard.</p>
            </div>
          </div>
        )}
        
        {/* Show Swiper only when we have API products */}
        {displayProducts.length > 0 && (
          <div className="hover-sw-nav hover-sw-2">
            <Swiper
              dir="ltr"
              className="swiper tf-sw-product-sell wrap-sw-over"
              slidesPerView={4} // Equivalent to data-preview={4}
              spaceBetween={30} // Equivalent to data-space-lg={30}
              breakpoints={{
                1024: {
                  slidesPerView: 4, // Equivalent to data-tablet={3}
                },
                640: {
                  slidesPerView: 3, // Equivalent to data-tablet={3}
                },
                0: {
                  slidesPerView: 2, // Equivalent to data-mobile={2}
                  spaceBetween: 15, // Equivalent to data-space-md={15}
                },
              }}
              modules={[Navigation]}
              navigation={{
                prevEl: ".snbp114",
                nextEl: ".snbn114",
              }}
            >
              ee
              {displayProducts.map((product, i) => (
                <SwiperSlide key={i} className="swiper-slide">
                  <Productcart2 product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round snbp114">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round snbn114">
              <span className="icon icon-arrow-right" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
