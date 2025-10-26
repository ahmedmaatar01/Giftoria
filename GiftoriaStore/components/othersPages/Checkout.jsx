"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Checkout() {
  const { cartProducts, setCartProducts, totalPrice, user } = useContextElement();
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Helper to format a Date to input[type="datetime-local"] value (YYYY-MM-DDTHH:mm)
  const toLocalDateTimeInputValue = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Minimum desired delivery date-time is current time + 6 hours
  const initialMinDelivery = new Date(Date.now() + 6 * 60 * 60 * 1000);
  const [minDesiredDeliveryLocal, setMinDesiredDeliveryLocal] = useState(toLocalDateTimeInputValue(initialMinDelivery));

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    note: '',
    paymentMethod: 'cod', // default to cash on delivery
    agreeTerms: false,
    desiredDelivery: toLocalDateTimeInputValue(initialMinDelivery),
  });

  // Prefill form with user info if authenticated
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name || '',
        lastName: user.last_name || '',
        country: user.country || 'Qatar',
        address: user.address || '',
        email: user.email || '',
      }));
    }
  }, [user]);
  console.log(cartProducts)
  const getItemImage = (elm) => {
    if (elm?.images && elm.images.length > 0) {
      const featured = elm.images.find((img) => img.is_featured);
      const src = featured ? featured.image_path : elm.images[0].image_path;
      return src ? `http://localhost:8000${src}` : "/images/no-image.png";
    }
    if (elm?.featured_image) return `http://localhost:8000${elm.featured_image}`;
    return elm?.imgSrc || "/images/no-image.png";
  };
  const getItemName = (elm) => elm?.name || elm?.title || "Product";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cartProducts.length === 0) {
      setError(t("checkout.error_cart_empty"));
      return;
    }

    if (!formData.agreeTerms) {
      setError(t("checkout.error_agree_terms"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate desired delivery date-time (must be >= now + 6h)
      const minDt = new Date(minDesiredDeliveryLocal);
      const chosenDt = new Date(formData.desiredDelivery);
      if (!(chosenDt instanceof Date) || isNaN(chosenDt.getTime())) {
        setError(t("checkout.error_invalid_desired_delivery"));
        setLoading(false);
        return;
      }
      if (chosenDt.getTime() < minDt.getTime()) {
        setError(t("checkout.error_too_soon_desired_delivery"));
        setLoading(false);
        return;
      }

      // Build shipping and billing address
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.country}`;
      const billingAddress = shippingAddress;

      // Map cart products to API format
      const products = cartProducts.map(item => {
        const productPayload = {
          product_id: item.id,
          quantity: item.quantity,
        };

        // Add custom fields if present
        if (item.customFieldValues && Object.keys(item.customFieldValues).length > 0) {
          productPayload.custom_fields = Object.entries(item.customFieldValues).map(([fieldId, value]) => ({
            field_id: Number(fieldId),
            value: String(value),
          }));
        }

        return productPayload;
      });

      const orderPayload = {
        user_id: user && user.id ? user.id : null, // Set to user.id if logged in, else null
        customer_first_name: formData.firstName,
        customer_last_name: formData.lastName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        status: 'pending',
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: formData.paymentMethod,
        source: 'website',
        description: formData.note,
        desired_delivery_at: new Date(formData.desiredDelivery).toISOString(),
        products,
      };

      const response = await axios.post('http://localhost:8000/api/commands', orderPayload);

      // Success! Clear cart and show message
      setCartProducts([]);
      localStorage.removeItem('cartList');
      setError(null);
      setSuccessMsg(t('checkout.success_order_placed'));

    } catch (err) {
      console.error('Order submission error:', err);
      console.error('Error response:', err.response?.data);

      // Show detailed validation errors if available
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(`${t('checkout.validation_error_prefix')}: ${validationErrors}`);
      } else {
        setError(err.response?.data?.message || t('checkout.failure_order'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <h5 className="fw-5 mb_20">{t('checkout.title_billing_details')}</h5>
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success mb-3" role="alert">
                {successMsg}
              </div>
            )}
            <form
              onSubmit={handleSubmitOrder}
              className="form-checkout"
            >
              <div className="box grid-2">
                <fieldset className="fieldset">
                  <label htmlFor="first-name">{t('checkout.first_name')}</label>
                  <input
                    required
                    type="text"
                    id="first-name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <label htmlFor="last-name">{t('checkout.last_name')}</label>
                  <input
                    required
                    type="text"
                    id="last-name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </fieldset>
              </div>
              <fieldset className="box fieldset">
                <label htmlFor="country">{t('checkout.country_region')}</label>
                <div className="select-custom">
                  <select
                    required
                    className="tf-select w-100"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="">{t('checkout.select_country')}</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Egypt">Egypt</option>
                    <option value="France">France</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="UAE">UAE</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="city">{t('checkout.city')}</label>
                <input
                  required
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="address">{t('checkout.address')}</label>
                <input
                  required
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="phone">{t('checkout.phone_number')}</label>
                <input
                  required
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="email">{t('checkout.email')}</label>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="desired-delivery">{t('checkout.desired_delivery')}</label>
                <input
                  required
                  type="datetime-local"
                  id="desired-delivery"
                  name="desiredDelivery"
                  min={minDesiredDeliveryLocal}
                  value={formData.desiredDelivery}
                  onChange={handleInputChange}
                />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="note">{t('checkout.order_notes_optional')}</label>
                <textarea
                  name="note"
                  id="note"
                  value={formData.note}
                  onChange={handleInputChange}
                />
              </fieldset>

            </form>
          </div>
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <h5 className="fw-5 mb_20">{t('checkout.your_order')}</h5>
              <form
                onSubmit={handleSubmitOrder}
                className="tf-page-cart-checkout widget-wrap-checkout"
              >
                <ul className="wrap-checkout-product">
                  {cartProducts.map((elm, i) => (
                    <li key={i} className="checkout-product-item">
                      <figure className="img-product">
                        <Image
                          alt="product"
                          src={getItemImage(elm)}
                          width={720}
                          height={1005}
                        />
                        <span className="quantity">{elm.quantity}</span>
                      </figure>
                      <div className="content">
                        <div className="info">
                          <p className="name">{getItemName(elm)}</p>
                          {elm.customFieldValues && Object.keys(elm.customFieldValues).length > 0 && (
                            <div className="small text-muted mt-1">
                              {Object.entries(elm.customFieldValues).map(([fieldId, value]) => {
                                const fid = Number(fieldId);
                                const label = Array.isArray(elm.custom_fields)
                                  ? elm.custom_fields.find((f) => f.id === fid)?.name
                                  : undefined;
                                return (
                                  <div key={fieldId}>
                                    {label ? `${label}: ` : ""}{String(value)}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <span className="price">
                          ${(elm.price * elm.quantity).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {!cartProducts.length && (
                  <div className="container">
                    <div className="row align-items-center mt-5 mb-5">
                      <div className="col-12 fs-18">
                        {t('cart.empty_message')}
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          href={`/shop-default`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content" }}
                        >
                          {t('cart.explore_products')}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                {/* <div className="coupon-box">
                  <input required type="text" placeholder="Discount code" />
                  <a
                    href="#"
                    className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                  >
                    Apply
                  </a>
                </div> */}
                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">{t('checkout.total')}</h6>
                  <h6 className="total fw-5">${totalPrice.toFixed(2)}</h6>
                </div>
                <div className="wd-check-payment">
                  <div className="fieldset-radio mb_20">
                    <input
                      required
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      id="bank"
                      className="tf-check"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="bank">{t('checkout.payment_online')}</label>
                  </div>
                  <div className="fieldset-radio mb_20">
                    <input
                      required
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      id="delivery"
                      className="tf-check"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="delivery">{t('checkout.payment_cod')}</label>
                  </div>
                  <p className="text_black-2 mb_20">
                    {t('checkout.privacy_notice')}
                    <Link
                      href={`/privacy-policy`}
                      className="text-decoration-underline"
                    >
                      {t('checkout.privacy_policy')}
                    </Link>
                    .
                  </p>
                  <div className="box-checkbox fieldset-radio mb_20">
                    <input
                      required
                      type="checkbox"
                      id="check-agree"
                      name="agreeTerms"
                      className="tf-check"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="check-agree" className="text_black-2">
                      {t('checkout.agree_terms_prefix')}
                      <Link
                        href={`/terms-conditions`}
                        className="text-decoration-underline"
                      >
                        {t('checkout.terms_and_conditions')}
                      </Link>
                      .
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || cartProducts.length === 0}
                  className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                >
                  {loading ? t('checkout.processing') : t('checkout.place_order')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
