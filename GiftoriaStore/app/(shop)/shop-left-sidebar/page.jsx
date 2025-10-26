import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import ShopSidebarleft from "@/components/shop/ShopSidebarleft";
import React from "react";

export const metadata = {
  title: "Shop Left Sidebar || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
       <Header10 />
      <div className="tf-page-title" style={{ backgroundColor: '#F1ECE4' }}>
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <div className="heading text-center bell-t-medium">Our Products</div>
              <p className="text-center text-2 text_black-2 mt_5 montserrat-regular">
                Feel free to choose your products from our wide range of categories and collections.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ShopSidebarleft />
      <Footer1 />
    </>
  );
}
