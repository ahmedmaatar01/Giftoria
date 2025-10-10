import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar1 from "@/components/headers/Topbar1";
import Banner from "@/components/homes/home-food/Banner";
import VideoBanner from "@/components/homes/home-3/VideoBanner";
import Products from "@/components/homes/home-2/Products";
import Store from "@/components/homes/home-2/Store";

import Categories from "@/components/homes/home-1/Categories";

import Hero from "@/components/homes/home-1/Hero";
import Marquee from "@/components/homes/home-1/Marquee";

export const metadata = {
  title: "Home 1 || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function Home() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <Hero />
      <Marquee />
      <Banner />
      <Categories />
      <Products />
            <VideoBanner />
    <Store />
  <div style={{ marginTop: '60px' }} />
  <Features />
      <Footer1 />
    </>
  );
}
