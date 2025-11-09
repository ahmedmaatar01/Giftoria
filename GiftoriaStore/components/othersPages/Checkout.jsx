"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Checkout() {
  const { cartProducts, setCartProducts, totalPrice, user, authToken } = useContextElement();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // Gift card state
  const [giftCardTemplates, setGiftCardTemplates] = useState([]);
  const [giftCardSelection, setGiftCardSelection] = useState({
    enabled: false,
    templateId: null,
    customDescription: '',
    customSigning: '',
    productIds: []
  });
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

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

  // Check if cart has products with gift card support and load templates
  useEffect(() => {
    const productsWithGiftCards = cartProducts.filter(product => product.has_gift_card);
    
    // Temporarily always load for testing: if (productsWithGiftCards.length > 0) {
    if (true) {
      // Load gift card templates
      const loadGiftCardTemplates = async () => {
        setLoadingTemplates(true);
        try {
          const response = await axios.get('http://localhost:8000/api/gift-cards');
          
          if (response.data.success) {
            const activeTemplates = response.data.data.filter(template => template.is_active);
            setGiftCardTemplates(activeTemplates);
            
            // Set product IDs that have gift card support
            setGiftCardSelection(prev => ({
              ...prev,
              productIds: productsWithGiftCards.map(p => p.id)
            }));
          }
        } catch (err) {
          console.error('Error loading gift card templates:', err);
        } finally {
          setLoadingTemplates(false);
        }
      };
      
      loadGiftCardTemplates();
    } else {
      // No products with gift cards, reset selection
      setGiftCardSelection({
        enabled: false,
        templateId: null,
        customDescription: '',
        customSigning: '',
        productIds: []
      });
    }
  }, [cartProducts]);
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
  const getItemName = (elm) => {
    // Handle bilingual product names
    if (i18n.language === 'ar') {
      // Try different Arabic name fields
      const arabicName = elm?.name_ar || elm?.title_ar || elm?.arabic_name;
      if (arabicName) {
        return arabicName;
      }
    }
    return elm?.name || elm?.title || t("quick_view_modal.product");
  };

  // Helper function to get authentication headers
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && authToken);
  };

  console.log('Auth Debug:', {
    user: user,
    authToken: authToken ? 'Token exists' : 'No token',
    isAuthenticated: isAuthenticated(),
    userId: user?.id
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGiftCardChange = (field, value) => {
    setGiftCardSelection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasGiftCardProducts = cartProducts.some(product => product.has_gift_card);

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

      // Add gift card data if enabled
      if (giftCardSelection.enabled && giftCardSelection.templateId) {
        orderPayload.gift_card = {
          template_id: giftCardSelection.templateId === 'custom' ? null : giftCardSelection.templateId,
          custom_description: giftCardSelection.customDescription,
          custom_signing: giftCardSelection.customSigning,
          product_ids: giftCardSelection.productIds
        };
      }

      const response = await axios.post(
        'http://localhost:8000/api/commands', 
        orderPayload,
        {
          headers: getAuthHeaders()
        }
      );

      // Success! Clear cart and show message
      setCartProducts([]);
      localStorage.removeItem('cartList');
      setError(null);
      // Redirect after success
      const orderId = response.data?.data?.id; // adjust if your API returns another field
      setTimeout(() => {
        if (!user) {
          // check this authentification conditon 
          router.push(`/order-success?order_id=${orderId}`);
        } else {
          // Logged-in user → go to My Orders page
          router.push("my-account-orders");
        }
      }, 500);


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
            <h5 className="fw-5 mb_20 raleway-regular text-uppercase pfs-4">{t('checkout.title_billing_details')}</h5>

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

              {/* Gift Card Selection */}
              {/* Temporarily removed condition for testing: {hasGiftCardProducts && ( */}
              <div className="gift-card-section mb-4">
                <h6 className="fw-5 mb-3">{t('checkout.gift_card_options', 'Gift Card Options')}</h6>
                <p className="text-muted mb-3">
                  {hasGiftCardProducts 
                    ? t('checkout.gift_card_notice', 'Some products in your cart support gift cards. Add a personalized gift card to your order.')
                    : 'Testing: Gift card section (remove condition when ready)'
                  }
                </p>
                  
                  <div className="fieldset-radio mb-3">
                    <input
                      type="checkbox"
                      id="enable-gift-card"
                      checked={giftCardSelection.enabled}
                      onChange={(e) => handleGiftCardChange('enabled', e.target.checked)}
                    />
                    <label htmlFor="enable-gift-card" className="fw-5">
                      {t('checkout.add_gift_card', 'Add Gift Card to Order')}
                    </label>
                  </div>

                  {giftCardSelection.enabled && (
                    <div className="gift-card-options p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      {loadingTemplates ? (
                        <p>{t('checkout.loading_templates', 'Loading gift card templates...')}</p>
                      ) : (
                        <>
                          <h6 className="mb-3">{t('checkout.choose_design_type', 'Choose Gift Card Design')}</h6>
                          
                          {/* Design Type Selection */}
                          <div className="row mb-4">
                            {/* Custom Design Option */}
                            <div className="col-md-6 mb-3">
                              <div 
                                className={`design-type-option p-4 border rounded cursor-pointer text-center ${
                                  giftCardSelection.templateId === 'custom' ? 'border-primary bg-light' : 'border-secondary'
                                }`}
                                onClick={() => handleGiftCardChange('templateId', 'custom')}
                                style={{ cursor: 'pointer', minHeight: '120px' }}
                              >
                                <div className="d-flex flex-column justify-content-center h-100">
                                  <div className="mb-3">
                                    <i className="fas fa-paint-brush fa-3x text-primary"></i>
                                  </div>
                                  <input
                                    type="radio"
                                    name="designType"
                                    value="custom"
                                    checked={giftCardSelection.templateId === 'custom'}
                                    onChange={() => handleGiftCardChange('templateId', 'custom')}
                                    className="me-2"
                                  />
                                  <label className="fw-bold h6 mb-2">{t('checkout.custom_design', 'Custom Design')}</label>
                                  <small className="text-muted">
                                    {t('checkout.custom_design_desc', 'Create your own personalized gift card message')}
                                  </small>
                                </div>
                              </div>
                            </div>

                            {/* Prepared Templates Option */}
                            <div className="col-md-6 mb-3">
                              <div 
                                className={`design-type-option p-4 border rounded cursor-pointer text-center ${
                                  (giftCardSelection.templateId && giftCardSelection.templateId !== 'custom') ? 'border-primary bg-light' : 'border-secondary'
                                }`}
                                onClick={() => setShowTemplateModal(true)}
                                style={{ cursor: 'pointer', minHeight: '120px' }}
                              >
                                <div className="d-flex flex-column justify-content-center h-100">
                                  <div className="mb-3">
                                    <i className="fas fa-images fa-3x text-success"></i>
                                  </div>
                                  <button 
                                    type="button"
                                    className="btn btn-outline-success btn-sm mb-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowTemplateModal(true);
                                    }}
                                  >
                                    {giftCardSelection.templateId && giftCardSelection.templateId !== 'custom' 
                                      ? t('checkout.change_template', 'Change Template')
                                      : t('checkout.choose_template', 'Choose Template')
                                    }
                                  </button>
                                  <label className="fw-bold h6 mb-2">{t('checkout.prepared_templates', 'Prepared Templates')}</label>
                                  <small className="text-muted">
                                    {giftCardSelection.templateId && giftCardSelection.templateId !== 'custom'
                                      ? `Selected: ${giftCardTemplates.find(t => t.id == giftCardSelection.templateId)?.name || 'Template'}`
                                      : t('checkout.prepared_templates_desc', `Choose from ${giftCardTemplates.length} beautiful designs`)
                                    }
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Custom Message and Signing - Show for any selection */}
                          {giftCardSelection.templateId && (
                            <div className="gift-card-customization">
                              <h6 className="mb-3">{t('checkout.personalize_message', 'Personalize Your Gift Card')}</h6>
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label className="fw-5 mb-2">
                                    {t('checkout.gift_card_description', 'Gift Card Message')}
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder={t('checkout.gift_card_description_placeholder', 'Write your personalized message here...')}
                                    value={giftCardSelection.customDescription}
                                    onChange={(e) => handleGiftCardChange('customDescription', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6 mb-3">
                                  <label className="fw-5 mb-2">
                                    {t('checkout.gift_card_signature', 'Signature/From')}
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('checkout.gift_card_signature_placeholder', 'Your name or signature')}
                                    value={giftCardSelection.customSigning}
                                    onChange={(e) => handleGiftCardChange('customSigning', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              {/* )} Temporarily removed closing bracket for testing */}

            </form>
          </div>
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner raleway-regular">
              <h5 className="fw-5 mb_20  text-uppercase pfs-4">{t('checkout.your_order')}</h5>
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
                                  ? elm.custom_fields.find((f) => f.id === fid)
                                  : undefined;
                                const fieldName = label ? (
                                  i18n.language === 'ar' && label.name_ar ? label.name_ar : label.name
                                ) : '';
                                return (
                                  <div key={fieldId}>
                                    {fieldName ? `${fieldName}: ` : ""}{String(value)}
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
                  <h6 className="total fw-5 ">$<span className="raleway-medium">{totalPrice.toFixed(2)}</span></h6>
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

      {/* Gift Card Template Selection Modal */}
      {showTemplateModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowTemplateModal(false)}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {t('checkout.select_gift_card_template', 'Select Gift Card Template')}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTemplateModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {giftCardTemplates.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted">{t('checkout.no_templates', 'No gift card templates available')}</p>
                  </div>
                ) : (
                  <div className="row">
                    {giftCardTemplates.map((template) => (
                      <div key={template.id} className="col-md-4 col-sm-6 mb-3">
                        <div 
                          className={`template-card border rounded p-3 cursor-pointer ${
                            giftCardSelection.templateId === template.id ? 'border-primary bg-light' : 'border-light'
                          }`}
                          onClick={() => {
                            handleGiftCardChange('templateId', template.id);
                            setShowTemplateModal(false);
                          }}
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          {template.image && (
                            <div className="template-image mb-2 text-center">
                              <Image
                                src={`http://localhost:8000/storage/${template.image}`}
                                alt={template.name}
                                width={120}
                                height={90}
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                className="w-100"
                              />
                            </div>
                          )}
                          <div className="text-center">
                            <h6 className="mb-1 fw-bold">{template.name}</h6>
                            {giftCardSelection.templateId === template.id && (
                              <small className="text-primary fw-bold">
                                <i className="fas fa-check-circle me-1"></i>
                                {t('checkout.selected', 'Selected')}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowTemplateModal(false)}
                >
                  {t('checkout.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
