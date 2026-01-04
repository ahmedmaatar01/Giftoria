<<<<<<< HEAD
"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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

  // Signature type: 'text' or 'draw'
  const [signatureType, setSignatureType] = useState('text');

  // Signature drawing refs
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dprRef = useRef(1);
  const isDrawingRef = useRef(false);
  const hasDrawnRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const [signaturePadReady, setSignaturePadReady] = useState(false);

  // Gift card state
  const [giftCardTemplates, setGiftCardTemplates] = useState([]);
  const [giftCardSelection, setGiftCardSelection] = useState({
    enabled: true,
    templateId: 'custom',
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

  // Initialize custom canvas drawing when in draw mode (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined' || signatureType !== 'draw') return;
    
    const initSignaturePad = async () => {
      // Small delay to ensure canvas is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas ref is null');
        return;
      }

      console.log('📐 Canvas offsetWidth:', canvas.offsetWidth, 'offsetHeight:', canvas.offsetHeight);
      // Setup canvas DPR scaling for crisp lines
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      dprRef.current = ratio;
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); // equivalent to scale(ratio, ratio) but resets
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#222';
      ctxRef.current = ctx;

      console.log('📐 Canvas dimensions set - width:', canvas.width, 'height:', canvas.height, 'ratio:', ratio);
      setSignaturePadReady(true);
      console.log('✅ Canvas drawing initialized in Checkout');

      // Test if canvas is receiving events
      const onMouseDown = (e) => {
        console.log('🖱️ Canvas mousedown detected at:', e.clientX, e.clientY);
      };
      const onPointerDown = (e) => {
        console.log('🖱️ Canvas pointerdown detected type:', e.pointerType, 'at:', e.clientX, e.clientY);
      };
      const onTouchStart = () => { console.log('👆 Canvas touchstart detected'); };
      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (e.clientX - rect.left),
          y: (e.clientY - rect.top)
        };
      };
      const onPointerDownDraw = (e) => {
        if (e.button !== undefined && e.button !== 0) return; // left button only
        canvas.setPointerCapture?.(e.pointerId);
        isDrawingRef.current = true;
        hasDrawnRef.current = false;
        const { x, y } = getPos(e);
        lastPointRef.current = { x, y };
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
        console.log('🎯 Drawing started');
      };
      const onPointerMoveDraw = (e) => {
        if (!isDrawingRef.current) return;
        const { x, y } = getPos(e);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
        lastPointRef.current = { x, y };
        hasDrawnRef.current = true;
      };
      const onPointerUpDraw = (e) => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        try { canvas.releasePointerCapture?.(e.pointerId); } catch {}
        console.log('🎯 Drawing ended');
        // Export image if something was drawn
        const dataURL = hasDrawnRef.current ? canvas.toDataURL('image/png') : '';
        console.log('�️ Signature captured, length:', dataURL.length);
        handleGiftCardChange('customSigning', dataURL);
      };
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  // Drawing listeners
  canvas.addEventListener('pointerdown', onPointerDownDraw);
  canvas.addEventListener('pointermove', onPointerMoveDraw);
  canvas.addEventListener('pointerup', onPointerUpDraw);
  canvas.addEventListener('pointerleave', onPointerUpDraw);

      // Restore existing signature if any
      const existingSignature = giftCardSelection.customSigning;
      if (existingSignature && existingSignature.startsWith("data:image")) {
        const img = new window.Image();
        img.onload = () => {
          // Clear and draw scaled to visible size (CSS pixels)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        };
        img.src = existingSignature;
      }
    };

    initSignaturePad();

    return () => {
      // Remove debug listeners and drawing listeners
      const c = canvasRef.current;
      if (c) {
        c.removeEventListener('mousedown', onMouseDown);
        c.removeEventListener('pointerdown', onPointerDown);
        c.removeEventListener('touchstart', onTouchStart);
        c.removeEventListener('pointerdown', onPointerDownDraw);
        c.removeEventListener('pointermove', onPointerMoveDraw);
        c.removeEventListener('pointerup', onPointerUpDraw);
        c.removeEventListener('pointerleave', onPointerUpDraw);
      }
      setSignaturePadReady(false);
    };
  }, [signatureType]);

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleGiftCardChange('customSigning', '');
  };

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


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGiftCardChange = (field, value) => {
    console.log('🎁 handleGiftCardChange called:', { field, valueLength: value?.length || 0, valuePreview: typeof value === 'string' ? value.substring(0, 50) : value });
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
        let giftCardMessage = '';

        if (giftCardSelection.templateId === 'custom') {
          // Use custom message for custom design
          giftCardMessage = giftCardSelection.customDescription;
        } else {
          // Use template message for prepared templates
          const selectedTemplate = giftCardTemplates.find(t => t.id == giftCardSelection.templateId);
          giftCardMessage = selectedTemplate?.message || 'Template message';
        }

        orderPayload.gift_card = {
          template_id: giftCardSelection.templateId === 'custom' ? null : giftCardSelection.templateId,
          custom_description: giftCardMessage,
          custom_signing: giftCardSelection.customSigning,
          product_ids: giftCardSelection.productIds
        };

        // Debug logging
        console.log('=== GIFT CARD DEBUG ===');
        console.log('Gift Card Selection State:', giftCardSelection);
        console.log('Signature Type:', signatureType);
        console.log('Gift Card Payload:', {
          template_id: orderPayload.gift_card.template_id,
          custom_description: orderPayload.gift_card.custom_description,
          custom_signing_length: orderPayload.gift_card.custom_signing?.length || 0,
          custom_signing_value: orderPayload.gift_card.custom_signing,
          custom_signing_preview: orderPayload.gift_card.custom_signing?.substring(0, 50) || 'EMPTY',
          is_base64: orderPayload.gift_card.custom_signing?.startsWith('data:image') || false
        });
        console.log('=== END DEBUG ===');
      }

      console.log('Full Order Payload:', orderPayload);
      

      const response = await axios.post(
        'http://localhost:8000/api/commands',
        
        orderPayload,
        {
          headers: getAuthHeaders()
        }
        
      );
      console.log('Order API full response:', response.data);
      const orderId = response.data?.id;
      if (!orderId) {
        throw new Error('Order ID not returned');
      }
      
      // ✅ IF ONLINE PAYMENT → redirect to SADAD
      if (formData.paymentMethod === 'online') {
      
        const sadadResponse = await axios.post(
          'http://localhost:8000/api/payments/sadad/init',
          { order_id: orderId },
          {
            headers: getAuthHeaders(),
            responseType: 'text' // VERY IMPORTANT
          }
        );
      
        // Redirect browser to SADAD
        document.open();
        document.write(sadadResponse.data);
        document.close();
      
        return; // STOP HERE
      }
      
      // ✅ IF CASH ON DELIVERY → old behavior
      setCartProducts([]);
      localStorage.removeItem('cartList');
      
      setTimeout(() => {
        if (!user) {
          router.push(`/order-success?order_id=${orderId}`);
        } else {
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

                <div className="box-checkbox fieldset-radio mb-3 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="enable-gift-card"
                    className="tf-check"
                    checked={giftCardSelection.enabled}
                    onChange={(e) => handleGiftCardChange('enabled', e.target.checked)}
                  />
                  <label htmlFor="enable-gift-card" className="text_black-2 fw-6 p-0" style={{ margin: "0 5px" }}>
                    {t('checkout.add_gift_card', 'Add Gift Card to Order')}
                  </label>

                </div>

                {giftCardSelection.enabled && (
                  <div className="gift-card-options">
                    {loadingTemplates ? (
                      <p>{t('checkout.loading_templates', 'Loading gift card templates...')}</p>
                    ) : (
                      <>
                        <h6 className="mb-3">{t('checkout.choose_design_type', 'Choose Gift Card Design')}</h6>

                        {/* Design Type Selection - Template Style */}
                        <div className="mb-4">
                          <div className="d-flex gap-3 flex-wrap">
                            {/* Custom Design Button */}
                            <button
                              type="button"
                              className="btn flex-fill radius-3"
                              onClick={() => handleGiftCardChange('templateId', 'custom')}
                              style={{
                                minHeight: '50px',
                                backgroundColor: giftCardSelection.templateId === 'custom' ? '#967740' : 'transparent',
                                borderColor: '#967740',
                                borderWidth: '2px',
                                color: giftCardSelection.templateId === 'custom' ? 'white' : '#967740',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <i className="fas fa-edit me-2"></i>
                                <div className="text-start">
                                  <div className="fw-bold">{t('checkout.custom_design', 'Custom Design')}</div>
                                  <small style={{
                                    color: giftCardSelection.templateId === 'custom' ? 'rgba(255,255,255,0.8)' : '#6c757d'
                                  }}>
                                    {t('checkout.custom_design_desc', 'Write your own message')}
                                  </small>
                                </div>
                              </div>
                            </button>

                            {/* Prepared Templates Button */}
                            <button
                              type="button"
                              className="btn flex-fill radius-3"
                              onClick={() => setShowTemplateModal(true)}
                              style={{
                                minHeight: '50px',
                                backgroundColor: (giftCardSelection.templateId && giftCardSelection.templateId !== 'custom') ? '#967740' : 'transparent',
                                borderColor: '#967740',
                                borderWidth: '2px',
                                color: (giftCardSelection.templateId && giftCardSelection.templateId !== 'custom') ? 'white' : '#967740',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <i className="fas fa-images me-2"></i>
                                <div className="text-start">
                                  <div className="fw-bold">{t('checkout.prepared_templates', 'Prepared Templates')}</div>
                                  <small style={{
                                    color: (giftCardSelection.templateId && giftCardSelection.templateId !== 'custom') ? 'rgba(255,255,255,0.8)' : '#6c757d'
                                  }}>
                                    {giftCardSelection.templateId && giftCardSelection.templateId !== 'custom'
                                      ? `${t('checkout.selected_template', 'Selected')}: ${(() => {
                                        const selected = giftCardTemplates.find(t => t.id == giftCardSelection.templateId);
                                        if (!selected) return t('checkout.template_name', 'Template');
                                        if (i18n.language === 'ar' && selected.name_ar) return selected.name_ar;
                                        return selected.name;
                                      })()}`
                                      : t('checkout.prepared_templates_desc', 'Choose from designs') + ` (${giftCardTemplates.length})`
                                    }
                                  </small>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Custom Message and Signing - Show for any selection */}
                        {giftCardSelection.templateId && (
                          <div className="gift-card-customization">
                            <h6 className="mb-3">{t('checkout.personalize_message', 'Personalize Your Gift Card')}</h6>
                            <div className="row">
                              <div className={`col-md-12 mb-3`}>
                                <label className="fw-5 mb-2">
                                  {t('checkout.gift_card_signature', 'Signature/From')}
                                  {!giftCardSelection.customSigning && (
                                    <small className="text-danger ms-2">
                                      ({t('checkout.signature_optional', 'Optional - Add your signature')})
                                    </small>
                                  )}
                                  {giftCardSelection.customSigning && (
                                    <small className="text-success ms-2">
                                      ✓ {signatureType === 'text' ? t('checkout.text_added', 'Text added') : t('checkout.signature_drawn', 'Signature drawn')}
                                    </small>
                                  )}
                                </label>
                                <div className="d-flex gap-3 mb-2">
                                  <button
                                    type="button"
                                    className="btn  radius-3"
                                    onClick={() => setSignatureType('text')}
                                    style={{
                                      backgroundColor: signatureType === 'text' ? '#967740' : 'transparent',
                                      borderColor: '#967740',
                                      borderWidth: '2px',
                                      color: signatureType === 'text' ? 'white' : '#967740',
                                      transition: 'all 0.2s ease',
                                      height: 'min-content',
                                      padding: '2px 16px',
                                    }}
                                  >
                                    {t('checkout.signature_text', 'Text')}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn radius-3"
                                    onClick={() => setSignatureType('draw')}
                                    style={{
                                      backgroundColor: signatureType === 'draw' ? '#967740' : 'transparent',
                                      borderColor: '#967740',
                                      borderWidth: '2px',
                                      color: signatureType === 'draw' ? 'white' : '#967740',
                                      transition: 'all 0.2s ease',
                                      height: 'min-content',
                                      padding: '2px 16px',
                                    }}
                                  >
                                    {t('checkout.signature_draw', 'Draw')}
                                  </button>
                                </div>
                                {signatureType === 'text' ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('checkout.gift_card_signature_placeholder', 'Your name or signature')}
                                    value={giftCardSelection.customSigning && !giftCardSelection.customSigning.startsWith('data:image') ? giftCardSelection.customSigning : ''}
                                    onChange={(e) => handleGiftCardChange('customSigning', e.target.value)}
                                  />
                                ) : (
                                  <div style={{ width: "100%" }}>
                                    <div style={{ border: "1px solid #ccc", borderRadius: 8, width: "100%", height: 120, background: "#fff" }}>
                                      <canvas
                                        ref={canvasRef}
                                        style={{ width: "100%", height: 120, display: "block", touchAction: "none", userSelect: "none", pointerEvents: "auto", cursor: "crosshair", position: "relative", zIndex: 1 }}
                                      />
                                    </div>
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-secondary mt-2" 
                                      onClick={handleClearSignature}
                                    >
                                      Clear Signature
                                    </button>
                                  </div>
                                )}
                              </div>
                              {/* Only show custom message field for custom design */}
                              {giftCardSelection.templateId === 'custom' && (
                                <div className="col-md-12 mb-3">
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
                              )}


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
                          className={`template-card border rounded p-3 cursor-pointer ${giftCardSelection.templateId === template.id ? 'border-primary bg-light' : 'border-light'}`}
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
                                alt={i18n.language === 'ar' && template.name_ar ? template.name_ar : template.name}
                                width={120}
                                height={90}
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                className="w-100"
                              />
                            </div>
                          )}
                          <div className="text-center">
                            <h6 className="mb-1 fw-bold">
                              {i18n.language === 'ar' && template.name_ar ? template.name_ar : template.name}
                            </h6>
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
=======
"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { API_BASE_URL_WITH_API, API_BASE_URL } from '../../utils/config';

export default function Checkout() {
  const { cartProducts, setCartProducts, totalPrice, user, authToken } = useContextElement();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [occasions, setOccasions] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/occasions`)
      .then(res => setOccasions(res.data))
      .catch(err => console.error(err));
  }, []);
  // Signature type: 'text' or 'draw'
  const [signatureType, setSignatureType] = useState('text');

  // Signature drawing refs
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dprRef = useRef(1);
  const isDrawingRef = useRef(false);
  const hasDrawnRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const [signaturePadReady, setSignaturePadReady] = useState(false);

  // Gift card state
  const [giftCardTemplates, setGiftCardTemplates] = useState([]);
  const [giftCardSelection, setGiftCardSelection] = useState({
    enabled: true,
    templateId: 'custom',
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
          const response = await axios.get(`${API_BASE_URL_WITH_API}/gift-cards`);

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

  // Initialize custom canvas drawing when in draw mode (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined' || signatureType !== 'draw') return;

    const initSignaturePad = async () => {
      // Small delay to ensure canvas is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas ref is null');
        return;
      }

      console.log('📐 Canvas offsetWidth:', canvas.offsetWidth, 'offsetHeight:', canvas.offsetHeight);
      // Setup canvas DPR scaling for crisp lines
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      dprRef.current = ratio;
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); // equivalent to scale(ratio, ratio) but resets
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#222';
      ctxRef.current = ctx;

      console.log('📐 Canvas dimensions set - width:', canvas.width, 'height:', canvas.height, 'ratio:', ratio);
      setSignaturePadReady(true);
      console.log('✅ Canvas drawing initialized in Checkout');

      // Test if canvas is receiving events
      const onMouseDown = (e) => {
        console.log('🖱️ Canvas mousedown detected at:', e.clientX, e.clientY);
      };
      const onPointerDown = (e) => {
        console.log('🖱️ Canvas pointerdown detected type:', e.pointerType, 'at:', e.clientX, e.clientY);
      };
      const onTouchStart = () => { console.log('👆 Canvas touchstart detected'); };
      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (e.clientX - rect.left),
          y: (e.clientY - rect.top)
        };
      };
      const onPointerDownDraw = (e) => {
        if (e.button !== undefined && e.button !== 0) return; // left button only
        canvas.setPointerCapture?.(e.pointerId);
        isDrawingRef.current = true;
        hasDrawnRef.current = false;
        const { x, y } = getPos(e);
        lastPointRef.current = { x, y };
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
        console.log('🎯 Drawing started');
      };
      const onPointerMoveDraw = (e) => {
        if (!isDrawingRef.current) return;
        const { x, y } = getPos(e);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
        lastPointRef.current = { x, y };
        hasDrawnRef.current = true;
      };
      const onPointerUpDraw = (e) => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        try { canvas.releasePointerCapture?.(e.pointerId); } catch { }
        console.log('🎯 Drawing ended');
        // Export image if something was drawn
        const dataURL = hasDrawnRef.current ? canvas.toDataURL('image/png') : '';
        console.log('�️ Signature captured, length:', dataURL.length);
        handleGiftCardChange('customSigning', dataURL);
      };
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
      canvas.addEventListener('touchstart', onTouchStart, { passive: true });
      // Drawing listeners
      canvas.addEventListener('pointerdown', onPointerDownDraw);
      canvas.addEventListener('pointermove', onPointerMoveDraw);
      canvas.addEventListener('pointerup', onPointerUpDraw);
      canvas.addEventListener('pointerleave', onPointerUpDraw);

      // Restore existing signature if any
      const existingSignature = giftCardSelection.customSigning;
      if (existingSignature && existingSignature.startsWith("data:image")) {
        const img = new window.Image();
        img.onload = () => {
          // Clear and draw scaled to visible size (CSS pixels)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        };
        img.src = existingSignature;
      }
    };

    initSignaturePad();

    return () => {
      // Remove debug listeners and drawing listeners
      const c = canvasRef.current;
      if (c) {
        c.removeEventListener('mousedown', onMouseDown);
        c.removeEventListener('pointerdown', onPointerDown);
        c.removeEventListener('touchstart', onTouchStart);
        c.removeEventListener('pointerdown', onPointerDownDraw);
        c.removeEventListener('pointermove', onPointerMoveDraw);
        c.removeEventListener('pointerup', onPointerUpDraw);
        c.removeEventListener('pointerleave', onPointerUpDraw);
      }
      setSignaturePadReady(false);
    };
  }, [signatureType]);

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleGiftCardChange('customSigning', '');
  };

  const getItemImage = (elm) => {
    if (elm?.images && elm.images.length > 0) {
      const featured = elm.images.find((img) => img.is_featured);
      const src = featured ? featured.image_path : elm.images[0].image_path;
      return src ? `${API_BASE_URL}${src}` : "/images/no-image.png";
    }
    if (elm?.featured_image) return `${API_BASE_URL}${elm.featured_image}`;
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


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGiftCardChange = (field, value) => {
    console.log('🎁 handleGiftCardChange called:', { field, valueLength: value?.length || 0, valuePreview: typeof value === 'string' ? value.substring(0, 50) : value });
    setGiftCardSelection(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasGiftCardProducts = cartProducts.some(product => product.has_gift_card);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
  
    // 1️⃣ Check required fields
    const requiredFields = ['firstName', 'lastName', 'address', 'email', 'phone'];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );
    if (emptyFields.length > 0) {
      setError(t("checkout.error_fill_required_fields")); // e.g., "Please fill all required fields"
      return; // stop submission
    }
  
    // 2️⃣ Existing cart check
    if (cartProducts.length === 0) {
      setError(t("checkout.error_cart_empty"));
      return;
    }
  
    // 3️⃣ Terms agreement check
    if (!formData.agreeTerms) {
      setError(t("checkout.error_agree_terms"));
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      // 4️⃣ Validate desired delivery date-time
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
  
      // 5️⃣ Build shipping and billing addresses
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.country}`;
      const billingAddress = shippingAddress;
  
      // 6️⃣ Map cart products
      const products = cartProducts.map(item => {
        const productPayload = {
          product_id: item.id,
          quantity: item.quantity,
        };
  
        if (item.customFieldValues && Object.keys(item.customFieldValues).length > 0) {
          productPayload.custom_fields = Object.entries(item.customFieldValues).map(([fieldId, value]) => ({
            field_id: Number(fieldId),
            value: String(value),
          }));
        }
  
        return productPayload;
      });
  
      // 7️⃣ Build order payload
      const orderPayload = {
        user_id: user?.id ?? -1,
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
  
      // 8️⃣ Add gift card if enabled
      if (giftCardSelection.enabled && giftCardSelection.templateId) {
        let giftCardMessage = '';
        if (giftCardSelection.templateId === 'custom') {
          giftCardMessage = giftCardSelection.customDescription;
        } else {
          const selectedTemplate = giftCardTemplates.find(t => t.id == giftCardSelection.templateId);
          giftCardMessage = selectedTemplate?.message || 'Template message';
        }
  
        orderPayload.gift_card = {
          template_id: giftCardSelection.templateId === 'custom' ? null : giftCardSelection.templateId,
          custom_description: giftCardMessage,
          custom_signing: giftCardSelection.customSigning,
          product_ids: giftCardSelection.productIds
        };
      }
  
      console.log('Full Order Payload:', orderPayload);
  
      // 9️⃣ Send order
      const response = await axios.post(
        `${API_BASE_URL_WITH_API}/commands`,
        orderPayload,
        user ? { headers: getAuthHeaders() } : {}
      );
  
      // 10️⃣ Success
      setCartProducts([]);
      localStorage.removeItem('cartList');
      setError(null);
  
      const orderId = response.data?.data?.id;
      setTimeout(() => {
        if (!user) {
          router.push(`/`);
        } else {
          // Logged-in user → go to My Orders page
          router.push("my-account-orders");
        }
      }, 500);
  
    } catch (err) {
      console.error('Order submission error:', err);
      console.error('Error response:', err.response?.data);
  
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
                <div style={{position: 'relative'}}>
                  <input
                    required
                    type="datetime-local"
                    id="desired-delivery"
                    name="desiredDelivery"
                    min={minDesiredDeliveryLocal}
                    value={formData.desiredDelivery}
                    onChange={handleInputChange}
                    style={i18n.language === 'ar' ? {paddingRight: '120px'} : {}}
                  />
                  {i18n.language === 'ar' && (
                    <span
                      className="arabic_div"
                      style={{position: 'absolute', right: 0, top: 0, height: '100%', display: 'flex', alignItems: 'center', background: 'white', padding: '0 8px', pointerEvents: 'none', fontSize: '90%'}}
                      dangerouslySetInnerHTML={{__html: formData.desiredDelivery.replace(/(\d+)/g, '<span class="arabic_div">$1</span>')}}
                    />
                  )}
                </div>
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

                <div className="box-checkbox fieldset-radio mb-3 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="enable-gift-card"
                    className="tf-check"
                    checked={giftCardSelection.enabled}
                    onChange={(e) => handleGiftCardChange('enabled', e.target.checked)}
                  />
                  <label htmlFor="enable-gift-card" className="text_black-2 fw-6 p-0" style={{ margin: "0 5px" }}>
                    {t('checkout.add_gift_card', 'Add Gift Card to Order')}
                  </label>

                </div>

                {giftCardSelection.enabled && (
                  <div className="gift-card-options">
                    {loadingTemplates ? (
                      <p>{t('checkout.loading_templates', 'Loading gift card templates...')}</p>
                    ) : (
                      <>
                        <h6 className="mb-3">{t('checkout.choose_design_type', 'Choose Gift Card Design')}</h6>

                        {/* Design Type Selection - Template Style */}
                        <div className="mb-4">
                          <div className="d-flex gap-3 flex-wrap">
                            {/* Custom Design Button */}
                            <button
                              type="button"
                              className="btn flex-fill radius-3"
                              onClick={() => handleGiftCardChange('templateId', 'custom')}
                              style={{
                                minHeight: '50px',
                                backgroundColor: giftCardSelection.templateId === 'custom' ? '#967740' : 'transparent',
                                borderColor: '#967740',
                                borderWidth: '2px',
                                color: giftCardSelection.templateId === 'custom' ? 'white' : '#967740',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <i className="fas fa-edit me-2"></i>
                                <div className="text-start">
                                  <div className="fw-bold">{t('checkout.custom_design', 'Custom Design')}</div>
                                  <small style={{
                                    color: giftCardSelection.templateId === 'custom' ? 'rgba(255,255,255,0.8)' : '#6c757d'
                                  }}>
                                    {t('checkout.custom_design_desc', 'Write your own message')}
                                  </small>
                                </div>
                              </div>
                            </button>

                            {/* Prepared Templates Button */}
                            <button
                              type="button"
                              className="btn flex-fill radius-3"
                              onClick={() => setShowTemplateModal(true)}
                              style={{
                                minHeight: '50px',
                                backgroundColor: (giftCardSelection.templateId && giftCardSelection.templateId !== 'custom') ? '#967740' : 'transparent',
                                borderColor: '#967740',
                                borderWidth: '2px',
                                color: (giftCardSelection.templateId && giftCardSelection.templateId !== 'custom') ? 'white' : '#967740',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-center">
                                <i className="fas fa-images me-2"></i>
                                <div className="text-start">
                                  <div className="fw-bold">{t('checkout.prepared_templates', 'Prepared Templates')}</div>
                                  <small
                                    style={{
                                      color: (giftCardSelection.templateId && giftCardSelection.templateId !== 'custom') ? 'rgba(255,255,255,0.8)' : '#6c757d'
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: giftCardSelection.templateId && giftCardSelection.templateId !== 'custom'
                                        ? `${t('checkout.selected_template', 'Selected')}: ${(() => {
                                            const selected = giftCardTemplates.find(t => t.id == giftCardSelection.templateId);
                                            if (!selected) return t('checkout.template_name', 'Template');
                                            if (i18n.language === 'ar' && selected.name_ar) return selected.name_ar;
                                            return selected.name;
                                          })()}`
                                        : (t('checkout.prepared_templates_desc', 'Choose from designs') + ` (${giftCardTemplates.length})`).replace(/(\d+)/g, '<span class="arabic_div">$1</span>')
                                    }}
                                  />
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Custom Message and Signing - Show for any selection */}
                        {giftCardSelection.templateId && (
                          <div className="gift-card-customization">
                            <h6 className="mb-3">{t('checkout.personalize_message', 'Personalize Your Gift Card')}</h6>
                            <div className="row">
                              <div className={`col-md-12 mb-3`}>
                                <label className="fw-5 mb-2">
                                  {t('checkout.gift_card_signature', 'Signature/From')}
                                  {!giftCardSelection.customSigning && (
                                    <small className="text-danger ms-2">
                                      ({t('checkout.signature_optional', 'Optional - Add your signature')})
                                    </small>
                                  )}
                                  {giftCardSelection.customSigning && (
                                    <small className="text-success ms-2">
                                      ✓ {signatureType === 'text' ? t('checkout.text_added', 'Text added') : t('checkout.signature_drawn', 'Signature drawn')}
                                    </small>
                                  )}
                                </label>
                                <div className="d-flex gap-3 mb-2">
                                  <button
                                    type="button"
                                    className="btn  radius-3"
                                    onClick={() => setSignatureType('text')}
                                    style={{
                                      backgroundColor: signatureType === 'text' ? '#967740' : 'transparent',
                                      borderColor: '#967740',
                                      borderWidth: '2px',
                                      color: signatureType === 'text' ? 'white' : '#967740',
                                      transition: 'all 0.2s ease',
                                      height: 'min-content',
                                      padding: '2px 16px',
                                    }}
                                  >
                                    {t('checkout.signature_text')}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn radius-3"
                                    onClick={() => setSignatureType('draw')}
                                    style={{
                                      backgroundColor: signatureType === 'draw' ? '#967740' : 'transparent',
                                      borderColor: '#967740',
                                      borderWidth: '2px',
                                      color: signatureType === 'draw' ? 'white' : '#967740',
                                      transition: 'all 0.2s ease',
                                      height: 'min-content',
                                      padding: '2px 16px',
                                    }}
                                  >
                                    {t('checkout.signature_draw')}
                                  </button>
                                </div>
                                {signatureType === 'text' ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('checkout.gift_card_signature_placeholder', 'Your name or signature')}
                                    value={giftCardSelection.customSigning && !giftCardSelection.customSigning.startsWith('data:image') ? giftCardSelection.customSigning : ''}
                                    onChange={(e) => handleGiftCardChange('customSigning', e.target.value)}
                                  />
                                ) : (
                                  <div style={{ width: "100%" }}>
                                    <div style={{ border: "1px solid #ccc", borderRadius: 8, width: "100%", height: 120, background: "#fff" }}>
                                      <canvas
                                        ref={canvasRef}
                                        style={{ width: "100%", height: 120, display: "block", touchAction: "none", userSelect: "none", pointerEvents: "auto", cursor: "crosshair", position: "relative", zIndex: 1 }}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-secondary mt-2"
                                      onClick={handleClearSignature}
                                    >
                                      {i18n.language === 'ar' ? 'مسح التوقيع' : 'Clear Signature'}
                                    </button>
                                  </div>
                                )}
                              </div>
                              {/* Only show custom message field for custom design */}
                              {giftCardSelection.templateId === 'custom' && (
                                <div className="col-md-12 mb-3">
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
                              )}


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
                        <span className="quantity" dangerouslySetInnerHTML={{__html: String(elm.quantity).replace(/(\d+)/g, '<span class="arabic_div">$1</span>')}} />
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
                        <span className="arabic_vip" dangerouslySetInnerHTML={{__html: (`$${(elm.price * elm.quantity).toFixed(2)}`).replace(/(\d+[.,]?\d*)/, '<span class="arabic_div">$1</span>')}} />
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
                          style={{ width: "fit-content", backgroundColor: '#492e11', borderColor: '#492e11', color: '#ffffff' }}
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
                  <h6 className="total fw-5 ">$<span className="raleway-medium" dangerouslySetInnerHTML={{__html: totalPrice.toFixed(2).replace(/(\d+[.,]?\d*)/, '<span class=\"arabic_div\">$1</span>')}} /></h6>
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
                  style={{ backgroundColor: '#492e11', borderColor: '#492e11', color: '#ffffff' }}
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
          {/* 🔹 Occasion Select */}
          <select
            className="form-select mb-3"
            value={giftCardSelection.occasionId || ""}
            onChange={(e) =>
              handleGiftCardChange("occasionId", Number(e.target.value))
            }
          >
            <option value="">All Occasions</option>
            {occasions.map((occ) => (
              <option key={occ.id} value={occ.id}>
                {i18n.language === "ar" && occ.name_ar ? occ.name_ar : occ.name}
              </option>
            ))}
          </select>

          {/* 🔹 Template List */}
          {(() => {
            const filteredTemplates =
              giftCardSelection.occasionId && giftCardSelection.occasionId !== ""
                ? giftCardTemplates.filter(
                    (t) => t.occasion_id === giftCardSelection.occasionId
                  )
                : giftCardTemplates;

            return filteredTemplates.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-muted">No gift card templates available</p>
              </div>
            ) : (
              <div className="row">
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="col-md-4 col-sm-6 mb-3">
                    <div
                      className={`template-card border rounded p-3 cursor-pointer ${
                        giftCardSelection.templateId === template.id
                          ? "border-primary bg-light"
                          : "border-light"
                      }`}
                      onClick={() => {
                        handleGiftCardChange("templateId", template.id);
                        setShowTemplateModal(false);
                      }}
                    >
                      <div className="template-image mb-2 text-center">
                        <Image
                          src={`${API_BASE_URL}/storage/${template.image}`}
                          width={120}
                          height={90}
                          className="w-100"
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                      </div>
                      <div className="text-center">
                        <h6 className="mb-1 fw-bold">
                          {i18n.language === "ar" && template.name_ar
                            ? template.name_ar
                            : template.name}
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
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
>>>>>>> origin/main
