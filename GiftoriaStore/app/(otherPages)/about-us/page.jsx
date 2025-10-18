import Footer1 from "@/components/footers/Footer1";
import About from "@/components/othersPages/about/About";
import Features from "@/components/othersPages/about/Features";
import FeaturesAbout from "@/components/othersPages/about/FeaturesAbout";
import Hero from "@/components/othersPages/about/Hero";
import Link from "next/link";
import Image from "next/image";
import Products2 from "@/components/homes/home-baby/Products2";
import React from "react";
import Header10 from "@/components/headers/Header10";
import Topbar1 from "@/components/headers/Topbar1";
export const metadata = {
  title: "About Us || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header10 />

      <Hero />
      {/* New FeaturesAbout component under the header */}
      <div style={{ marginTop: '60px' }}>
        <FeaturesAbout
          title="Brand Presentation"
          items={[
            { iconClass: "icon-star", title: "Premium Quality", description: "Only the finest materials and craftsmanship." },
            { iconClass: "icon-heart", title: "Thoughtful Curation", description: "Handpicked gifts for every occasion." },
            { iconClass: "icon-gift", title: "Personalized Touch", description: "Custom options for a unique experience." },

          ]}
          subtitle="GIFTORIA.me is a luxury brand born from a desire to transform the art of gifting into an unforgettable,
emotional experience. Every detail, from the design of our products to the personal touch behind each gift, is
carefully crafted to reflect elegance, intention, and meaning.
At GIFTORIA, we believe that a gift is never just a gift — it is a gesture, a story, a memory in the making. That’s
why we offer a curated universe of personalized and refined creations, designed to celebrate life’s most
precious moments in a deeply thoughtful way.
Whether it’s a symbolic token of love, a timeless expression of gratitude, or a meaningful surprise, GIFTORIA
turns each gift into an exceptional experience — one that’s tailored, elegant, and emotionally resonant. Our
brand is dedicated to those who seek to offer more than an object: a lasting impression."

        />
      </div>
      <About />
      <div style={{ marginBottom: '80px' }}>
        <Products2 />
      </div>
      <Features />
      <section className="flat-spacing-10">
        <div className="container">
          <div className="tf-grid-layout md-col-2">
            <div className="tf-ourstore-img">
              <Image
                className="lazyload"
                data-src="/images/shop/store/ourstore4.png"
                alt="our-store"
                src="/images/shop/store/ourstore4.png"
                width={550}
                height={420}
              />
            </div>
            <div className="tf-ourstore-content " style={{paddingLeft:"60px"}}>
              <h5 className="mb_24">Giftoria Qatar</h5>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Address</strong>
                </p>
                <p>66 Mott St, New York, New York, Zip Code: 10006, AS</p>
              </div>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Phone</strong>
                </p>
                <p>(623) 934-2400</p>
              </div>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Email</strong>
                </p>
                <p>EComposer@example.com</p>
              </div>
              <div className="mb_36">
                <p className="mb_15">
                  <strong>Open Time</strong>
                </p>
                <p className="mb_15">Our store has re-opened for shopping,</p>
                <p>exchange Every day 11am to 7pm</p>
              </div>
              <div className="mb_30">
                <ul className="tf-social-icon d-flex gap-15 style-default">
                  <li>
                    <a
                      href="#"
                      className="box-icon link round social-facebook border-line-black"
                    >
                      <i className="icon fs-16 icon-fb" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="box-icon link round social-twiter border-line-black"
                    >
                      <i className="icon fs-16 icon-Icon-x" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="box-icon link round social-instagram border-line-black"
                    >
                      <i className="icon fs-16 icon-instagram" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="box-icon link round social-tiktok border-line-black"
                    >
                      <i className="icon fs-16 icon-tiktok" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="box-icon link round social-pinterest border-line-black"
                    >
                      <i className="icon fs-16 icon-pinterest-1" />
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <Link
                  href={`/contact-2`}
                  className="tf-btn btn-outline-dark radius-3"
                >
                  <span>Get Directions</span>
                  <i className="icon icon-arrow-right" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
      <div className="container">
        <div className="line"></div>
      </div>
      <Footer1 />
    </>
  );
}
