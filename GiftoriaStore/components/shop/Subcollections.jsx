"use client";

import { collectionSlides2 } from "@/data/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Subcollections() {
  const searchParams = useSearchParams();
  const occasionId = searchParams.get('occasion');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccasionCategories = async () => {
      if (!occasionId) {
        setCategories([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/occasions/${occasionId}`);
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching occasion categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOccasionCategories();
  }, [occasionId]);
  // Don't render if no occasion is selected or no categories
  if (!occasionId || (!loading && categories.length === 0)) {
    return null;
  }

  return (
    <section className="flat-spacing-3 pb_0">
      <div className="container">
        <div className="hover-sw-nav">
          <Swiper
            dir="ltr"
            slidesPerView={5}
            spaceBetween={30}
            breakpoints={{
              1024: { slidesPerView: 5, spaceBetween: 30 },
              768: { slidesPerView: 4, spaceBetween: 30 },
              576: { slidesPerView: 3, spaceBetween: 30 },
              0: { slidesPerView: 2, spaceBetween: 30 },
            }}
            loop={false}
            autoplay={false}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp306",
              nextEl: ".snbn306",
            }}
            pagination={{ clickable: true, el: ".spd306" }}
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <SwiperSlide key={`loading-${index}`}>
                  <div className="collection-item style-2 hover-img">
                    <div className="collection-inner">
                      <div className="collection-image img-style" style={{
                        width: '100%',
                        height: '400px',
                        background: '#f0f0f0',
                        borderRadius: '8px'
                      }} />
                      <div className="collection-content">
                        <div style={{
                          height: '20px',
                          background: '#f0f0f0',
                          width: '120px',
                          margin: '10px 0',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              categories.map((category) => {
                // Get the featured image or first image
                const featuredImage = category.images?.find(img => img.is_featured);
                const imageUrl = featuredImage 
                  ? `http://localhost:8000/storage/${featuredImage.image_path}`
                  : category.featured_image 
                  ? `http://localhost:8000/storage/${category.featured_image}`
                  : '/images/no-image.png';

                return (
                  <SwiperSlide key={category.id}>
                    <div className="collection-item style-2 hover-img">
                      <div className="collection-inner">
                        <Link
                          href={`/shop-default?category=${category.id}`}
                          className="collection-image img-style"
                        >
                          <Image
                            className="lazyload"
                            data-src={imageUrl}
                            alt={category.name}
                            src={imageUrl}
                            width={600}
                            height={721}
                          />
                        </Link>
                        <div className="collection-content">
                          <Link
                            href={`/shop-default?category=${category.id}`}
                            className="tf-btn collection-title hover-icon fs-15"
                          >
                            <span>{category.name}</span>
                            <i className="icon icon-arrow1-top-left" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-collection box-icon w_46 round snbp306">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-collection box-icon w_46 round snbn306">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-collection justify-content-center spd306" />
        </div>
      </div>
    </section>
  );
}
