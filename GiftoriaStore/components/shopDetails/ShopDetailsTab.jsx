"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

export default function ShopDetailsTab({ productId }) {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = useState(1);
  const [product, setProduct] = useState(null);

  const tabs = [
    { title: t('product_details.tabs.description'), active: true },
    // { title: "Review", active: false },
    { title: t('product_details.tabs.shipping'), active: false },
    { title: t('product_details.tabs.return_policies'), active: false },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product for description:', err);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return (
    <section
      className="flat-spacing-17 pt_0 shop-details-page"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="widget-tabs style-has-border">
              <ul className="widget-menu-tab">
                {tabs.map((elm, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentTab(i + 1)}
                    className={`item-title ${
                      currentTab == i + 1 ? "active" : ""
                    } `}
                  >
                    <span className="inner">{elm.title}</span>
                  </li>
                ))}
              </ul>
              <div className="widget-content-tab">
                <div
                  className={`widget-content-inner ${
                    currentTab == 1 ? "active" : ""
                  } `}
                >
                  <div className="">
                    {/* Render HTML description from product based on language */}
                    {product && (
                      <>
                        {i18n.language === 'ar' && product.arabic_description ? (
                          <div 
                            className="product-description-html arabic_div"
                            dangerouslySetInnerHTML={{ __html: product.arabic_description }}
                          />
                        ) : product.description ? (
                          <div 
                            className="product-description-html"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                          />
                        ) : (
                          <p className="mb_30">
                            {t('product_details.default_description')}
                          </p>
                        )}
                      </>
                    )}
                    {/* <div className="tf-product-des-demo">
                      <div className="right">
                        <h3 className="fs-16 fw-5">Features</h3>
                        <ul>
                          <li>Front button placket</li>
                          <li>Adjustable sleeve tabs</li>
                          <li>Babaton embroidered crest at placket and hem</li>
                        </ul>
                        <h3 className="fs-16 fw-5">Materials Care</h3>
                        <ul className="mb-0">
                          <li>Content: 100% LENZING™ ECOVERO™ Viscose</li>
                          <li>Care: Hand wash</li>
                          <li>Imported</li>
                        </ul>
                      </div>
                      <div className="left">
                        <h3 className="fs-16 fw-5">Materials Care</h3>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-machine" />
                          </div>
                          <span>Machine wash max. 30ºC. Short spin.</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-iron" />
                          </div>
                          <span>Iron maximum 110ºC.</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-bleach" />
                          </div>
                          <span>Do not bleach/bleach.</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-dry-clean" />
                          </div>
                          <span>Do not dry clean.</span>
                        </div>
                        <div className="d-flex gap-10 align-items-center">
                          <div className="icon">
                            <i className="icon-tumble-dry" />
                          </div>
                          <span>Tumble dry, medium hear.</span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/* <div
                  className={`widget-content-inner ${
                    currentTab == 2 ? "active" : ""
                  } `}
                >
                  <table className="tf-pr-attrs">
                    <tbody>
                      <tr className="tf-attr-pa-color">
                        <th className="tf-attr-label">Color</th>
                        <td className="tf-attr-value">
                          <p>White, Pink, Black</p>
                        </td>
                      </tr>
                      <tr className="tf-attr-pa-size">
                        <th className="tf-attr-label">Size</th>
                        <td className="tf-attr-value">
                          <p>S, M, L, XL</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> */}
                <div
                  className={`widget-content-inner ${
                    currentTab == 2? "active" : ""
                  } `}
                >
                  <div className="tf-page-privacy-policy">
                    <div className="title">
                      {t('product_details.shipping.title')}
                    </div>
                    <p>
                      {t('product_details.shipping.paragraph1')}
                    </p>
                    <p>
                      {t('product_details.shipping.paragraph2')}
                    </p>
                    <p>
                      {t('product_details.shipping.paragraph3')}
                    </p>
                    <p>
                      {t('product_details.shipping.paragraph4')}
                    </p>
                    <p>
                      {t('product_details.shipping.paragraph5')}
                    </p>
                    <p>
                      {t('product_details.shipping.paragraph6')}
                    </p>
                  </div>
                </div>
                <div
                  className={`widget-content-inner ${
                    currentTab == 3 ? "active" : ""
                  } `}
                >
<div className="tf-page-privacy-policy">
  <div className="title mb-3">
    {t('product_details.return_policy.title')}
  </div>

  <p className="mb-3">
    <strong>{t('product_details.return_policy.freshness_guarantee')}</strong><br />
    {t('product_details.return_policy.freshness_text')}
  </p>

  <p className="mb-3">
    <strong>{t('product_details.return_policy.return_window')}</strong><br />
    {t('product_details.return_policy.return_window_text')}
  </p>

  <p className="mb-3">
    <strong>{t('product_details.return_policy.conditions')}</strong><br />
    <ul>
      <li className="arabic_div">{t('product_details.return_policy.condition1')}</li>
      <li className="arabic_div">{t('product_details.return_policy.condition2')}</li>
      <li className="arabic_div">{t('product_details.return_policy.condition3')}</li>
      <li className="arabic_div">{t('product_details.return_policy.condition4')}</li>
    </ul>
  </p>

  <p className="mb-3">
    <strong>{t('product_details.return_policy.delivery_issues')}</strong><br />
    {t('product_details.return_policy.delivery_issues_text')}
  </p>

  <p className="mb-3">
    <strong>{t('product_details.return_policy.refund_process')}</strong><br />
    {t('product_details.return_policy.refund_process_text')}
  </p>

  <p className="mb-3">
    <strong>{t('product_details.return_policy.care_instructions')}</strong><br />
    {t('product_details.return_policy.care_instructions_text')}
  </p>

  <p className="mb-0">
    <strong>{t('product_details.return_policy.contact_us')}</strong><br />
    {t('product_details.return_policy.contact_us_text')}
  </p>
</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
