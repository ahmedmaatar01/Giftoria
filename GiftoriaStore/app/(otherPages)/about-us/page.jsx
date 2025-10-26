import Footer1 from "@/components/footers/Footer1";
import About from "@/components/othersPages/about/About";
import Features from "@/components/othersPages/about/Features";
import FeaturesAbout from "@/components/othersPages/about/FeaturesAbout";
import Banner from "@/components/homes/home-pickleball/Banner";
import Hero from "@/components/othersPages/about/Hero";
import Link from "next/link";
import Image from "next/image";
import Products2 from "@/components/homes/home-baby/Products2";
import React from "react";
import Header10 from "@/components/headers/Header10";
import Topbar1 from "@/components/headers/Topbar1";
import StoreContent from "@/components/othersPages/about/StoreContent";
import Header6 from "@/components/headers/Header6";
import AboutUsPageContent from "@/components/othersPages/about/AboutUsPageContent";

export const metadata = {
  title: "About Us || Giftoria - Premium Gift Store",
  description: "Learn about Giftoria - Premium Gift Store",
};

export default function page() {
  return <AboutUsPageContent />;
}
