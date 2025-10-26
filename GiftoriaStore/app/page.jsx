import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Products2 from "@/components/homes/home-baby/Products2";
import Store from "@/components/homes/home-2/Store";
import HeroCamp from "@/components/homes/home-camp-and-hike/Hero";
import Banner2 from "@/components/homes/home-food/Banner2";
import BannerHome1 from "@/components/homes/home-1/BannerHome1";
import FeaturesHomeFood from "@/components/homes/home-food/Features";
import HeroHome1 from "@/components/homes/home-1/Hero";
import Marquee from "@/components/homes/home-1/Marquee";
import Categories from "@/components/homes/home-6/Categories";
import Header6 from "@/components/headers/Header6";


export const metadata = {
  title: "Giftoria Store",
  description: "Luxury personalized gifts crafted with elegance and emotion for every special moment.",
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
        buttonLink="/contact-2"
        buttonLabel="Get in Touch"
      />
      <Store />
      <div style={{ marginTop: '60px' }} />
      <Features />
      <Footer1 />
    </>
  );
}
