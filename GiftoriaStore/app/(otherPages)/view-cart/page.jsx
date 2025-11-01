import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Cart from "@/components/othersPages/Cart";
import React from "react";

export const metadata = {
  title: "View Cart || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center raleway-regular text-uppercase">Shopping Cart</div>
        </div>
      </div>

      <Cart />
   
      <Footer1 />
    </>
  );
}
