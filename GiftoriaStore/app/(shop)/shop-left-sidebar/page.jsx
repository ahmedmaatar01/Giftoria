import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import ShopSidebarleft from "@/components/shop/ShopSidebarleft";
import React from "react";

export const metadata = {
  title: "Giftoria Store",
  description: "Luxury personalized gifts crafted with elegance and emotion for every special moment.",
};
export default function page() {
  return (
    <>
       <Header10 />
      <div className="tf-page-title" style={{ backgroundColor: '#F1ECE4' }}>
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <div className="heading text-center raleway-bold ">Our Products</div>
              <p className="text-center text-2 text_black-2 mt_5 raleway-regular">
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
