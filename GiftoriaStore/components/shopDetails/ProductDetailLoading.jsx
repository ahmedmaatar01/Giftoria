"use client";
import React from "react";

export default function ProductDetailLoading() {
  return (
    <section className="flat-spacing-4 pt_0">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="thumbs-slider">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 h-96 w-full rounded mb-4"></div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-300 h-16 w-16 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2 w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4 w-1/4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>
                  <div className="h-12 bg-gray-300 rounded mb-4 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}