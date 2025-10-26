import Footer1 from "@/components/footers/Footer1";
import Header6 from "@/components/headers/Header6";
import ContactForm2 from "@/components/othersPages/contact/ContactForm2";
import Map2 from "@/components/othersPages/contact/Map2";
import React from "react";
import HeroContact from "@/components/othersPages/contact/HeroContact";
import Topbar1 from "@/components/headers/Topbar1";

export const metadata = {
  title: "Contact 2 || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <Header10 />
      <HeroContact />
      <Map2 />
      <ContactForm2 />
      <Footer1 />
    </>
  );
}
