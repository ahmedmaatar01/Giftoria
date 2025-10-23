"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Store() {
  const { t } = useTranslation();

  return (
    <section className="flat-spacing-9 pb_0">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title bell-t-medium heading-30">
            {t("store_title")}
          </span>
        </div>

        <div className="flat-tab-store flat-animate-tab">
          <div className="tab-content">
            {/* Qatar Store */}
            <div className="tab-pane active show" id="Qatar" role="tabpanel">
              <div className="widget-card-store align-items-center tf-grid-layout md-col-2">
                <div className="store-item-info">
                  <h5 className="store-heading bell-t-medium">{t("qatar_store_title")}</h5>

                  <div className="description">
                    <p>
                      {t("store_address")} <br />
                      giftoria@support.com <br />
                      (08) 8942 1299
                    </p>
                    <p>
                      {t("working_days")} <br />
                      {t("saturday_hours")} <br />
                      {t("sunday_closed")}
                    </p>
                  </div>
                </div>
                <div className="store-img">
                  <Image
                    className="lazyload"
                    data-src="/images/shop/store/ourstore1.png"
                    alt="store-img"
                    src="/images/shop/store/ourstore1.png"
                    width={720}
                    height={506}
                  />
                </div>
              </div>
            </div>

            {/* London Store */}
            <div className="tab-pane" id="london" role="tabpanel">
              <div className="widget-card-store align-items-center tf-grid-layout md-col-2">
                <div className="store-item-info">
                  <h5 className="store-heading bell-t-medium">{t("london_store_title")}</h5>
                  <div className="description">
                    <p>
                      {t("store_address")} <br />
                      ecomus@support.com <br />
                      (08) 8942 1299
                    </p>
                    <p>
                      {t("working_days")} <br />
                      {t("saturday_hours")} <br />
                      {t("sunday_closed")}
                    </p>
                  </div>
                </div>
                <div className="store-img">
                  <Image
                    className="lazyload"
                    data-src="/images/shop/store/ourstore2.png"
                    alt="store-img"
                    src="/images/shop/store/ourstore2.png"
                    width={720}
                    height={506}
                  />
                </div>
              </div>
            </div>

            {/* Paris Store */}
            <div className="tab-pane" id="paris" role="tabpanel">
              <div className="widget-card-store align-items-center tf-grid-layout md-col-2">
                <div className="store-item-info">
                  <h5 className="store-heading bell-t-medium">{t("paris_store_title")}</h5>
                  <div className="description">
                    <p>
                      {t("store_address")} <br />
                      ecomus@support.com <br />
                      (08) 8942 1299
                    </p>
                    <p>
                      {t("working_days")} <br />
                      {t("saturday_hours")} <br />
                      {t("sunday_closed")}
                    </p>
                  </div>
                </div>
                <div className="store-img">
                  <Image
                    className="lazyload"
                    data-src="/images/shop/store/ourstore3.png"
                    alt="store-img"
                    src="/images/shop/store/ourstore3.png"
                    width={720}
                    height={506}
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
