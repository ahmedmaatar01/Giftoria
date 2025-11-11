import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Products2 from "@/components/homes/home-baby/Products2";
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
      <Header10 />
      <div className="mb-5"></div>
      <ProductDetailClient productId={id} />
      <ShopDetailsTab productId={id} />
      <Products2 isProductDetail={true} />
      <div className="mb-5"></div>
      {/* <RecentProducts /> */}
      <Footer1 />
    </>
  );
}
      