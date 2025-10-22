import React from "react";
import Image from "next/image";
export default function Store() {
  return (
    <section className="flat-spacing-9 pb_0">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title bell-t-medium">Come Stroll Through Our Flower Parlour</span>
        </div>
        <div className="flat-tab-store flat-animate-tab">

          <div className="tab-content">
            <div className="tab-pane active show" id="Qatar" role="tabpanel">
              <div className="widget-card-store align-items-center tf-grid-layout md-col-2">
                <div className="store-item-info">
                  <h5 className="store-heading bell-t-medium">Qatar Store</h5>
                  <div className="description">
                    <p>
                      301 Front St WToronto,
                      <br />
                      giftoria@support.com
                      <br />
                      (08) 8942 1299
                    </p>
                    <p>
                      Mon - Fri, 8:30am - 10:30pm
                      <br />
                      Saturday, 8:30am - 10:30pm <br />
                      Sunday Closed
                    </p>
                  </div>
                </div>
                <div className="store-img">
                  <Image
                    className="lazyload"
                    data-src="/images/shop/store/ourstore1.png"
                    alt="store-img"
                    src="/images/shop/store/ourstore1.png"
                    width="720"
                    height="506"
                  />
                </div>
              </div>
            </div>
            <div className="tab-pane" id="london" role="tabpanel">
              <div className="widget-card-store align-items-center tf-grid-layout md-col-2">
                <div className="store-item-info">
                  <h5 className="store-heading">London Store</h5>
                  <div className="description">
                    <p>
                      301 Front St WToronto,
                      <br />
                      Ecomus@support.com
                      <br />
                      (08) 8942 1299
                    </p>
                    <p>
                      Mon - Fri, 8:30am - 10:30pm
                      <br />
                      Saturday, 8:30am - 10:30pm <br />
                      Sunday Closed
                    </p>
                  </div>
                </div>
                <div className="store-img">
                  <Image
                    className="lazyload"
                    data-src="/images/shop/store/ourstore2.png"
                    alt="store-img"
                    src="/images/shop/store/ourstore2.png"
                    width="720"
                    height="506"
                  />
                </div>
              </div>
            </div>
            <div className="tab-pane" id="paris" role="tabpanel">
              <div className="widget-card-store align-items-center tf-grid-layout md-col-2">
                <div className="store-item-info">
                  <h5 className="store-heading">Paris Store</h5>
                  <div className="description">
                    <p>
                      301 Front St WToronto,
                      <br />
                      Ecomus@support.com
                      <br />
                      (08) 8942 1299
                    </p>
                    <p>
                      Mon - Fri, 8:30am - 10:30pm
                      <br />
                      Saturday, 8:30am - 10:30pm <br />
                      Sunday Closed
                    </p>
                  </div>
                </div>
                <div className="store-img">
                  <Image
                    className="lazyload"
                    data-src="/images/shop/store/ourstore3.png"
                    alt="store-img"
                    src="/images/shop/store/ourstore3.png"
                    width="720"
                    height="506"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
