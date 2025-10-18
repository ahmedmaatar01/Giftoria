"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const tabs = [
  { title: "Description", active: true },
  // { title: "Review", active: false },
  { title: "Shiping", active: false },
  { title: "Return Polocies", active: false },
];

export default function ShopDetailsTab({ productId }) {
  const [currentTab, setCurrentTab] = useState(1);
  const [product, setProduct] = useState(null);

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
      className="flat-spacing-17 pt_0"
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
                    {/* Render HTML description from product */}
                    {product && product.description ? (
                      <div 
                        className="product-description-html"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <p className="mb_30">
                        Button-up shirt sleeves and a relaxed silhouette. It's
                        tailored with drapey, crinkle-texture fabric that's made
                        from LENZING™ ECOVERO™ Viscose — responsibly sourced
                        wood-based fibres produced through a process that reduces
                        impact on forests, biodiversity and water supply.
                      </p>
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
                      The Company Private Limited Policy
                    </div>
                    <p>
                      The Company Private Limited and each of their respective
                      subsidiary, parent and affiliated companies is deemed to
                      operate this Website (“we” or “us”) recognizes that you
                      care how information about you is used and shared. We have
                      created this Privacy Policy to inform you what information
                      we collect on the Website, how we use your information and
                      the choices you have about the way your information is
                      collected and used. Please read this Privacy Policy
                      carefully. Your use of the Website indicates that you have
                      read and accepted our privacy practices, as outlined in
                      this Privacy Policy.
                    </p>
                    <p>
                      Please be advised that the practices described in this
                      Privacy Policy apply to information gathered by us or our
                      subsidiaries, affiliates or agents: (i) through this
                      Website, (ii) where applicable, through our Customer
                      Service Department in connection with this Website, (iii)
                      through information provided to us in our free standing
                      retail stores, and (iv) through information provided to us
                      in conjunction with marketing promotions and sweepstakes.
                    </p>
                    <p>
                      We are not responsible for the content or privacy
                      practices on any websites.
                    </p>
                    <p>
                      We reserve the right, in our sole discretion, to modify,
                      update, add to, discontinue, remove or otherwise change
                      any portion of this Privacy Policy, in whole or in part,
                      at any time. When we amend this Privacy Policy, we will
                      revise the “last updated” date located at the top of this
                      Privacy Policy.
                    </p>
                    <p>
                      If you provide information to us or access or use the
                      Website in any way after this Privacy Policy has been
                      changed, you will be deemed to have unconditionally
                      consented and agreed to such changes. The most current
                      version of this Privacy Policy will be available on the
                      Website and will supersede all previous versions of this
                      Privacy Policy.
                    </p>
                    <p>
                      If you have any questions regarding this Privacy Policy,
                      you should contact our Customer Service Department by
                      email at marketing@company.com
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
                      Flower Shop Return Policy
                    </div>
                    
                    <h5 className="fw-6 mb-2">Freshness Guarantee</h5>
                    <p className="mb-3">
                      We take pride in delivering only the freshest flowers. All our arrangements are 
                      carefully crafted using premium, hand-selected blooms. If your flowers arrive 
                      damaged or wilted, please contact us within 24 hours of delivery with photos, 
                      and we will provide a full refund or replacement at no additional cost.
                    </p>

                    <h5 className="fw-6 mb-2">Return Window</h5>
                    <p className="mb-3">
                      Due to the perishable nature of fresh flowers, returns are accepted within 
                      <strong> 24 hours of delivery</strong>. Please ensure you inspect your order 
                      immediately upon receipt and notify us of any issues.
                    </p>

                    <h5 className="fw-6 mb-2">Conditions for Returns</h5>
                    <ul className="mb-3">
                      <li>Flowers must be in their original condition</li>
                      <li>Photo evidence of damage or quality issues is required</li>
                      <li>Custom or personalized arrangements may have different terms</li>
                      <li>Seasonal flowers and special orders are final sale unless damaged</li>
                    </ul>

                    <h5 className="fw-6 mb-2">Delivery Issues</h5>
                    <p className="mb-3">
                      If your delivery was missed or left in an inappropriate location, please contact 
                      us immediately. We will work with you to arrange a redelivery or provide an 
                      appropriate solution based on the circumstances.
                    </p>

                    <h5 className="fw-6 mb-2">Refund Process</h5>
                    <p className="mb-3">
                      Approved refunds will be processed within 5-7 business days and credited back 
                      to your original payment method. In some cases, we may offer store credit or 
                      a replacement arrangement instead of a monetary refund.
                    </p>

                    <h5 className="fw-6 mb-2">Care Instructions</h5>
                    <p className="mb-3">
                      To ensure the longevity of your flowers, please follow the care instructions 
                      provided with your delivery. Proper care includes trimming stems, changing water 
                      daily, and keeping flowers away from direct sunlight and heat sources.
                    </p>

                    <h5 className="fw-6 mb-2">Contact Us</h5>
                    <p className="mb-0">
                      For any questions regarding returns or to report an issue with your order, 
                      please contact our customer service team at <strong>support@giftoria.com</strong> or 
                      call us at <strong>(555) 123-4567</strong>. We're here to ensure your complete 
                      satisfaction with every purchase.
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
