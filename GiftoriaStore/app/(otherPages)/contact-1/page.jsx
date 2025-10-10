import Footer1 from "@/components/footers/Footer1";
import ContactForm from "@/components/othersPages/contact/ContactForm";
import Map from "@/components/othersPages/contact/Map";
import React from "react";
import Header1 from "@/components/headers/Header1";
import Topbar1 from "@/components/headers/Topbar1";
export const metadata = {
  title: "Contact 1 || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Contact Us</div>
        </div>
      </div>

      <Map />
      <ContactForm />
      <Footer1 />
    </>
  );
}
