import React from "react";
import Image from "next/image";
export default function About() {
  return (
    <>
      <section className="flat-spacing-23 flat-image-text-section">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
            <div className="tf-image-wrap">
              <Image
                className="lazyload w-100"
                data-src="/images/collections/collection-69.jpg"
                alt="collection-img"
                src="/images/collections/collection-69.jpg"
                width={600}
                height={499}
              />
            </div>
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div>
                <div className="heading bell-t-medium">Our Mission</div>
                <div className="text montserrat-medium" style={{textAlign: 'justify'}}>
                  Our mission is to offer a unique and luxurious gifting experience,
                  where every creation is designed with care, personalization,
                   and a true sense of meaning making every moment memorable.
                 Givtooria the go-to destination for exceptional, personalized luxury gifts
                  crafted to leave a lasting impact.
                </div>
                {/* Duplicated 'Our Vision' block */}
                <div style={{marginTop: '24px'}}>
                  <div className="heading bell-t-medium">Our Vision</div>
                  <div className="text montserrat-medium" style={{textAlign: 'justify'}}>
                    We envision a world where gifting becomes an elevated art form, a celebration of connection and emotion. Our goal is to make Givtooria the go-to destination for exceptional, personalized luxury gifts crafted to leave a lasting impact.
                  </div>
                </div>
                {/* Second duplicate of 'Our Vision' block */}
                <div style={{marginTop: '24px'}}>
                  <div className="heading bell-t-medium">Our Values</div>
                  <div className="text montserrat-medium" style={{textAlign: 'justify'}}>
                            <span className="montserrat-medium">
                              <strong>Elegance :</strong> We design with timeless beauty and grace in mind.
                            <br /><strong>Personalization :</strong> Every gift is a reflection of the giver’s heart and the
                          recipient’s uniqueness.
                          <br /><strong>Excellence :</strong> We hold ourselves to the highest standards in every
                          detail, every time.
                          <br /><strong>Emotion :</strong> Our gifts carry meaning — they tell stories and create memories.
                          <br /><strong>Creativity :</strong> We explore endless ways to surprise and delight through
                          thoughtful design.
                            </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
