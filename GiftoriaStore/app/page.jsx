import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Topbar1 from "@/components/headers/Topbar1";
import Products2 from "@/components/homes/home-baby/Products2";
import Store from "@/components/homes/home-2/Store";
import Categories from "@/components/homes/multi-brand/Categories";
import CategoriesAlt from "@/components/homes/multi-brand/CategoriesAlt";


import Banner2 from "@/components/homes/home-food/Banner2";
import FeaturesHomeFood from "@/components/homes/home-food/Features";

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
      <Header10 />
      <Hero />
      <Marquee />

      <Categories />
      {/* Duplicate categories carousel with alternate images */}
      
  <CategoriesAlt />
  <div style={{ marginTop: '60px' }} />
  <Banner2 />
      <div style={{ marginTop: '60px' }} />
      <Products2 />
      <div style={{ marginTop: '60px' }} />
      <FeaturesHomeFood />
      
      <Banner2
        bgUrl="images/slider/fashion-slideshow-01.jpg"
        heading="Join the Giftoria Circle"
        description={`GIFTORIA.me invites you into a realm where gifting becomes poetry.
Born from a timeless passion for elegance and emotion, every creation carries a whisper of sophistication and care. From the graceful design of each piece to the tender thought behind every gesture, we craft not just gifts — but cherished moments, wrapped in meaning and beauty.`}
        buttonLink="/shop-collection-sub"
        buttonLabel="Get in Touch"
      />
      <Store />
      <div style={{ marginTop: '60px' }} />
      <Features />
      <Footer1 />
    </>
  );
}
