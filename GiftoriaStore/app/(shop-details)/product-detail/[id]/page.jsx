import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Products from "@/components/homes/home-2/Products";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";
import ProductDetailClient from "@/components/shopDetails/ProductDetailClient";
export const metadata = {
  title: "Shop Details || Giftoria - Ultimate Nextjs Ecommerce Template",
  description: "Giftoria - Ultimate Nextjs Ecommerce Template",
};
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";

export default async function page({ params }) {
  const { id } = await params;

  return (
    <>
      <Header1 />
      <div className="tf-breadcrumb" style={{marginTop:"80px"}}>
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link href={`/`} className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />
              <span className="text">Product Details</span>
            </div>
            <ProductSinglePrevNext currentId={id} />
          </div>
        </div>
      </div>
      <ProductDetailClient productId={id} />
      <ShopDetailsTab productId={id} />
      <Products />
      <RecentProducts />
      <Footer1 />
    </>
  );
}
      