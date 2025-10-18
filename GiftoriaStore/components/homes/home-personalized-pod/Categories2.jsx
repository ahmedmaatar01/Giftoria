import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Categories2() {
  return (
    <section className="flat-spacing-4 section-cls-personalized-pod section-full-1">
      <div className="container">
        <div className="flat-title gap-14">
          <span className="title wow fadeInUp fw-6 text-center" data-wow-delay="0s">
            <span className="bell-t-medium">Explore our chocolate categories</span>
          </span>
        </div>
        <div className="masonry-layout style-3">
          <div className="item-1 collection-item large hover-img wow fadeInUp" data-wow-delay="0s">
            <div className="collection-inner">
              <Link href={`/shop-chocolate-1`} className="collection-image img-style rounded-0">
                <Image className="lazyload" src="/images/collections/img1.jpg" alt="chocolate-1" width={600} height={835} />
              </Link>
              <div className="collection-content">
                <Link href={`/shop-chocolate-1`} className="tf-btn collection-title hover-icon">
                  <span>Chocolate 1</span>
                  <i className="icon icon-arrow1-top-left" />
                </Link>
              </div>
            </div>
          </div>
          <div className="item-2 collection-item large hover-img wow fadeInUp" data-wow-delay=".1s">
            <div className="collection-inner">
              <Link href={`/shop-chocolate-2`} className="collection-image img-style rounded-0">
                <Image className="lazyload" src="/images/collections/img2.jpg" alt="chocolate-2" width={600} height={396} />
              </Link>
              <div className="collection-content">
                <Link href={`/shop-chocolate-2`} className="tf-btn collection-title hover-icon">
                  <span>Chocolate 2</span>
                  <i className="icon icon-arrow1-top-left" />
                </Link>
              </div>
            </div>
          </div>
          <div className="item-3 collection-item large hover-img wow fadeInUp" data-wow-delay=".2s">
            <div className="collection-inner">
              <Link href={`/shop-chocolate-3`} className="collection-image img-style rounded-0">
                <Image className="lazyload" src="/images/collections/img3.jpg" alt="chocolate-3" width={600} height={399} />
              </Link>
              <div className="collection-content">
                <Link href={`/shop-chocolate-3`} className="tf-btn collection-title hover-icon">
                  <span>Chocolate 3</span>
                  <i className="icon icon-arrow1-top-left" />
                </Link>
              </div>
            </div>
          </div>
          <div className="item-4 collection-item large hover-img wow fadeInUp" data-wow-delay=".3s">
            <div className="collection-inner">
              <Link href={`/shop-chocolate-4`} className="collection-image img-style rounded-0">
                <Image className="lazyload" src="/images/collections/img4.jpg" alt="chocolate-4" width={600} height={835} />
              </Link>
              <div className="collection-content">
                <Link href={`/shop-chocolate-4`} className="tf-btn collection-title hover-icon">
                  <span>Chocolate 4</span>
                  <i className="icon icon-arrow1-top-left" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
