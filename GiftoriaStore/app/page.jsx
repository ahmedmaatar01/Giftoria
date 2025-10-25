import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Topbar1 from "@/components/headers/Topbar1";
import Products2 from "@/components/homes/home-baby/Products2";
import Store from "@/components/homes/home-2/Store";
import CategoriesAlt from "@/components/homes/multi-brand/CategoriesAlt";
import HeroCamp from "@/components/homes/home-camp-and-hike/Hero";
import Banner2 from "@/components/homes/home-food/Banner2";
import BannerHome1 from "@/components/homes/home-1/BannerHome1";
import FeaturesHomeFood from "@/components/homes/home-food/Features";
import HeroHome1 from "@/components/homes/home-1/Hero";
import Marquee from "@/components/homes/home-1/Marquee";
import Categories from "@/components/homes/home-6/Categories";
import Header6 from "@/components/headers/Header6";


export const metadata = {
  title: "Home 1 || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function Home() {
  return (
    <>
      <Header6 />
      <HeroHome1 />
      <Marquee />
      <HeroCamp />
      <Categories />
      <Banner2 />
      <div style={{ marginTop: '60px' }} />
      <Products2 />
      <div style={{ marginTop: '60px' }} />
      <FeaturesHomeFood />

      <BannerHome1
        bgUrl="images/slider/fashion-slideshow-01.jpg"
        heading="JOIN THE GIFTORIA CIRCLE"
        description={`Become a part of our exclusive community and enjoy special benefits, early access to new collections, and personalized offers.`}
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
