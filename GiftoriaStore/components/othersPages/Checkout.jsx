"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { cartProducts, setCartProducts, totalPrice, user } = useContextElement();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
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
      setError("Your cart is empty");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
        products,
      };

      const response = await axios.post('http://localhost:8000/api/commands', orderPayload);

      // Success! Clear cart and show message
      setCartProducts([]);
      localStorage.removeItem('cartList');
      setError(null);
      setSuccessMsg('Command sent successfully!');

    } catch (err) {
      console.error('Order submission error:', err);
      console.error('Error response:', err.response?.data);
      
      // Show detailed validation errors if available
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
        setError(`Validation error: ${validationErrors}`);
      } else {
        setError(err.response?.data?.message || 'Failed to place order. Please try again.');
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
            <h5 className="fw-5 mb_20">Billing details</h5>
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
                  <label htmlFor="first-name">First Name</label>
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
                  <label htmlFor="last-name">Last Name</label>
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
                <label htmlFor="country">Country/Region</label>
                <div className="select-custom">
                  <select
                    required
                    className="tf-select w-100"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="">Select country</option>
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
                <label htmlFor="city">Town/City</label>
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
                <label htmlFor="address">Address</label>
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
                <label htmlFor="phone">Phone Number</label>
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
                <label htmlFor="email">Email</label>
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
                <label htmlFor="note">Order notes (optional)</label>
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
              <h5 className="fw-5 mb_20">Your order</h5>
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
                        Your shop cart is empty
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          href={`/shop-default`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content" }}
                        >
                          Explore Products!
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
                  <h6 className="fw-5">Total</h6>
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
                    <label htmlFor="bank">Online payment</label>
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
                    <label htmlFor="delivery">Cash on delivery</label>
                  </div>
                  <p className="text_black-2 mb_20">
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our
                    <Link
                      href={`/privacy-policy`}
                      className="text-decoration-underline"
                    >
                      privacy policy
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
                      I have read and agree to the website
                      <Link
                        href={`/terms-conditions`}
                        className="text-decoration-underline"
                      >
                        terms and conditions
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
                  {loading ? 'Processing...' : 'Place order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
