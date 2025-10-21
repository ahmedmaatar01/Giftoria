"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/categories");
        setCategories(res.data);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="flat-spacing-4 flat-categorie">
      <div className="container-full">
        <div className="flat-title-v2">
          <div className="box-sw-navigation">
            <div className="nav-sw nav-next-slider snbp1 nav-next-collection snbp107">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider snbn1 nav-prev-collection snbn107">
              <span className="icon icon-arrow-right" />
            </div>
          </div>
          <span
            className="text-3 fw-7 text-uppercase title wow fadeInUp"
            data-wow-delay="0s"
          >
            <span className="banner-title-montserrat">SHOP BY CATEGORIES</span>
          </span>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8 col-md-8">
            {loading ? (
              <div className="py-5 text-center">Loading categories...</div>
            ) : (
              <Swiper
                dir="ltr"
                className="swiper tf-sw-collection"
                spaceBetween={15}
                modules={[Navigation]}
                navigation={{
                  prevEl: ".snbp107",
                  nextEl: ".snbn107",
                }}
                breakpoints={{
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                }}
              >
                {categories.length === 0 ? (
                  <SwiperSlide className="swiper-slide">
                    <div className="collection-item style-left hover-img text-center py-5">
                      <span className="text-muted">No categories found.</span>
                    </div>
                  </SwiperSlide>
                ) : (
                  categories.map((item, index) => (
                    <SwiperSlide className="swiper-slide" key={index}>
                      <div className="collection-item style-left hover-img">
                        <div className="collection-inner">
                          <Link
                            href={`/shop-default`}
                            className="collection-image img-style"
                          >
                            <Image
                              className="lazyload"
                              data-src={item.featured_image ? `http://localhost:8000/storage/${item.featured_image}` : "/no-image.png"}
                              alt={item.name}
                              src={item.featured_image ? `http://localhost:8000/storage/${item.featured_image}` : "/no-image.png"}
                              width="600"
                              height="721"
                            />
                          </Link>
                          <div className="collection-content">
                            <Link
                              href={`/shop-default`}
                              className="tf-btn collection-title hover-icon fs-15"
                            >
                              <span>{item.name}</span>
                              <i className="icon icon-arrow1-top-left" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            )}
          </div>
          <div className="col-xl-3 col-lg-4 col-md-4">
            <div className="discovery-new-item">
              <h5>Discovery all new items</h5>
              <Link href={`/shop-collection-list`}>
                <i className="icon-arrow1-top-left" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
