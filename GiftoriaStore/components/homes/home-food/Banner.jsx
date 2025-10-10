import Image from "next/image";
import React from "react";

export default function Banner() {
  return (
    <>
      <section className="flat-spacing-31">
        <div className="container">
          <div className="flat-title mb-lg text-center">
            <span className="title banner-title-montserrat">
              Step Into the World of Giftoria
            </span>
          </div>
          <div className="tf-grid-layout lg-col-2 tf-img-with-text-2">
            <div className="tf-image-wrap wow fadeInUp" data-wow-delay="0s">
              <Image
                className="lazyload"
                data-src="/images/collections/banner-cls-food1.jpg"
                alt="collection-img"
                src="/images/collections/banner-cls-food1.jpg"
                width={800}
                height={913}
              />
            </div>
            <div className="tf-content-wrap wow fadeInUp" data-wow-delay="0s">
              <div className="item text-center text-md-start">
                <p className="bell-t-medium" style={{fontSize: '20px', lineHeight: '1.7', margin: 0}}>
                  GIFTORIA.me is a luxury brand born from a desire to transform the art of gifting into an unforgettable, emotional experience. Every detail, from the design of our products to the personal touch behind each gift, is carefully crafted to reflect elegance, intention, and meaning.<br /><br />
                  At GIFTORIA, we believe that a gift is never just a gift — it is a gesture, a story, a memory in the making. That’s why we offer a curated universe of personalized and refined creations, designed to celebrate life’s most precious moments in a deeply thoughtful way.<br /><br />
                  Whether it’s a symbolic token of love, a timeless expression of gratitude, or a meaningful surprise, GIFTORIA turns each gift into an exceptional experience — one that’s tailored, elegant, and emotionally resonant. Our brand is dedicated to those who seek to offer more than an object: a lasting impression.<br /><br />
                  Let your heart bloom, discover flowers that whisper stories of timeless love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Banner Width Text */}
      {/* Banner Width Text 2 */}
      {/* <section>
        <div className="container">
          <div className="tf-grid-layout lg-col-2 tf-img-with-text-2 style-2 bg_green-8">
            <div className="tf-content-wrap wow fadeInUp" data-wow-delay=".1s">
              <h4 className="text-center text-md-start">
                The Ecomus difference
              </h4>
              <div className="item-list-box">
                <div className="img-box">
                  <Image
                    alt="img"
                    src="/images/collections/cls-food.png"
                    width={220}
                    height={220}
                  />
                </div>
                <div className="content text-center text-md-start">
                  <h5>Diverse and Delicious</h5>
                  <p>
                    Utilise a combination of protein-rich wholefoods like
                    legumes, tempeh, nuts, and seeds to ensure your body is
                    getting everything it needs to thrive.
                  </p>
                </div>
              </div>
              <div className="item-list-box">
                <div className="img-box">
                  <Image
                    alt="img"
                    src="/images/collections/cls-food2.png"
                    width={220}
                    height={220}
                  />
                </div>
                <div className="content text-center text-md-start">
                  <h5>Customizable and Convenient</h5>
                  <p>
                    Utilise a combination of protein-rich wholefoods like
                    legumes, tempeh, nuts, and seeds to ensure your body is
                    getting everything it needs to thrive.
                  </p>
                </div>
              </div>
              <div className="item-list-box">
                <div className="img-box">
                  <Image
                    alt="img"
                    src="/images/collections/cls-food3.png"
                    width={220}
                    height={220}
                  />
                </div>
                <div className="content text-center text-md-start">
                  <h5>Nutrient-Rich and Balanced</h5>
                  <p>
                    Utilise a combination of protein-rich wholefoods like
                    legumes, tempeh, nuts, and seeds to ensure your body is
                    getting everything it needs to thrive.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="tf-image-wrap rounded-0 wow fadeInUp"
              data-wow-delay="0s"
            >
              <Image
                className="lazyload"
                data-src="/images/collections/banner-cls-food2.png"
                alt="collection-img"
                src="/images/collections/banner-cls-food2.png"
                width={800}
                height={798}
              />
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
