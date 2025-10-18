"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { cartProducts, setCartProducts, totalPrice } = useContextElement();
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
        user_id: null, // Set to null for guest orders, or actual user ID when logged in
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
                    data-default=""
                  >
                    <option value="---" data-provinces="[]">
                      ---
                    </option>
                    <option
                      value="Australia"
                      data-provinces="[['Australian Capital Territory','Australian Capital Territory'],['New South Wales','New South Wales'],['Northern Territory','Northern Territory'],['Queensland','Queensland'],['South Australia','South Australia'],['Tasmania','Tasmania'],['Victoria','Victoria'],['Western Australia','Western Australia']]"
                    >
                      Australia
                    </option>
                    <option value="Austria" data-provinces="[]">
                      Austria
                    </option>
                    <option value="Belgium" data-provinces="[]">
                      Belgium
                    </option>
                    <option
                      value="Canada"
                      data-provinces="[['Alberta','Alberta'],['British Columbia','British Columbia'],['Manitoba','Manitoba'],['New Brunswick','New Brunswick'],['Newfoundland and Labrador','Newfoundland and Labrador'],['Northwest Territories','Northwest Territories'],['Nova Scotia','Nova Scotia'],['Nunavut','Nunavut'],['Ontario','Ontario'],['Prince Edward Island','Prince Edward Island'],['Quebec','Quebec'],['Saskatchewan','Saskatchewan'],['Yukon','Yukon']]"
                    >
                      Canada
                    </option>
                    <option value="Czech Republic" data-provinces="[]">
                      Czechia
                    </option>
                    <option value="Denmark" data-provinces="[]">
                      Denmark
                    </option>
                    <option value="Finland" data-provinces="[]">
                      Finland
                    </option>
                    <option value="France" data-provinces="[]">
                      France
                    </option>
                    <option value="Germany" data-provinces="[]">
                      Germany
                    </option>
                    <option
                      value="Hong Kong"
                      data-provinces="[['Hong Kong Island','Hong Kong Island'],['Kowloon','Kowloon'],['New Territories','New Territories']]"
                    >
                      Hong Kong SAR
                    </option>
                    <option
                      value="Ireland"
                      data-provinces="[['Carlow','Carlow'],['Cavan','Cavan'],['Clare','Clare'],['Cork','Cork'],['Donegal','Donegal'],['Dublin','Dublin'],['Galway','Galway'],['Kerry','Kerry'],['Kildare','Kildare'],['Kilkenny','Kilkenny'],['Laois','Laois'],['Leitrim','Leitrim'],['Limerick','Limerick'],['Longford','Longford'],['Louth','Louth'],['Mayo','Mayo'],['Meath','Meath'],['Monaghan','Monaghan'],['Offaly','Offaly'],['Roscommon','Roscommon'],['Sligo','Sligo'],['Tipperary','Tipperary'],['Waterford','Waterford'],['Westmeath','Westmeath'],['Wexford','Wexford'],['Wicklow','Wicklow']]"
                    >
                      Ireland
                    </option>
                    <option value="Israel" data-provinces="[]">
                      Israel
                    </option>
                    <option
                      value="Italy"
                      data-provinces="[['Agrigento','Agrigento'],['Alessandria','Alessandria'],['Ancona','Ancona'],['Aosta','Aosta Valley'],['Arezzo','Arezzo'],['Ascoli Piceno','Ascoli Piceno'],['Asti','Asti'],['Avellino','Avellino'],['Bari','Bari'],['Barletta-Andria-Trani','Barletta-Andria-Trani'],['Belluno','Belluno'],['Benevento','Benevento'],['Bergamo','Bergamo'],['Biella','Biella'],['Bologna','Bologna'],['Bolzano','South Tyrol'],['Brescia','Brescia'],['Brindisi','Brindisi'],['Cagliari','Cagliari'],['Caltanissetta','Caltanissetta'],['Campobasso','Campobasso'],['Carbonia-Iglesias','Carbonia-Iglesias'],['Caserta','Caserta'],['Catania','Catania'],['Catanzaro','Catanzaro'],['Chieti','Chieti'],['Como','Como'],['Cosenza','Cosenza'],['Cremona','Cremona'],['Crotone','Crotone'],['Cuneo','Cuneo'],['Enna','Enna'],['Fermo','Fermo'],['Ferrara','Ferrara'],['Firenze','Florence'],['Foggia','Foggia'],['Forlì-Cesena','Forlì-Cesena'],['Frosinone','Frosinone'],['Genova','Genoa'],['Gorizia','Gorizia'],['Grosseto','Grosseto'],['Imperia','Imperia'],['Isernia','Isernia'],['L'Aquila','L’Aquila'],['La Spezia','La Spezia'],['Latina','Latina'],['Lecce','Lecce'],['Lecco','Lecco'],['Livorno','Livorno'],['Lodi','Lodi'],['Lucca','Lucca'],['Macerata','Macerata'],['Mantova','Mantua'],['Massa-Carrara','Massa and Carrara'],['Matera','Matera'],['Medio Campidano','Medio Campidano'],['Messina','Messina'],['Milano','Milan'],['Modena','Modena'],['Monza e Brianza','Monza and Brianza'],['Napoli','Naples'],['Novara','Novara'],['Nuoro','Nuoro'],['Ogliastra','Ogliastra'],['Olbia-Tempio','Olbia-Tempio'],['Oristano','Oristano'],['Padova','Padua'],['Palermo','Palermo'],['Parma','Parma'],['Pavia','Pavia'],['Perugia','Perugia'],['Pesaro e Urbino','Pesaro and Urbino'],['Pescara','Pescara'],['Piacenza','Piacenza'],['Pisa','Pisa'],['Pistoia','Pistoia'],['Pordenone','Pordenone'],['Potenza','Potenza'],['Prato','Prato'],['Ragusa','Ragusa'],['Ravenna','Ravenna'],['Reggio Calabria','Reggio Calabria'],['Reggio Emilia','Reggio Emilia'],['Rieti','Rieti'],['Rimini','Rimini'],['Roma','Rome'],['Rovigo','Rovigo'],['Salerno','Salerno'],['Sassari','Sassari'],['Savona','Savona'],['Siena','Siena'],['Siracusa','Syracuse'],['Sondrio','Sondrio'],['Taranto','Taranto'],['Teramo','Teramo'],['Terni','Terni'],['Torino','Turin'],['Trapani','Trapani'],['Trento','Trentino'],['Treviso','Treviso'],['Trieste','Trieste'],['Udine','Udine'],['Varese','Varese'],['Venezia','Venice'],['Verbano-Cusio-Ossola','Verbano-Cusio-Ossola'],['Vercelli','Vercelli'],['Verona','Verona'],['Vibo Valentia','Vibo Valentia'],['Vicenza','Vicenza'],['Viterbo','Viterbo']]"
                    >
                      Italy
                    </option>
                    <option
                      value="Japan"
                      data-provinces="[['Aichi','Aichi'],['Akita','Akita'],['Aomori','Aomori'],['Chiba','Chiba'],['Ehime','Ehime'],['Fukui','Fukui'],['Fukuoka','Fukuoka'],['Fukushima','Fukushima'],['Gifu','Gifu'],['Gunma','Gunma'],['Hiroshima','Hiroshima'],['Hokkaidō','Hokkaido'],['Hyōgo','Hyogo'],['Ibaraki','Ibaraki'],['Ishikawa','Ishikawa'],['Iwate','Iwate'],['Kagawa','Kagawa'],['Kagoshima','Kagoshima'],['Kanagawa','Kanagawa'],['Kumamoto','Kumamoto'],['Kyōto','Kyoto'],['Kōchi','Kochi'],['Mie','Mie'],['Miyagi','Miyagi'],['Miyazaki','Miyazaki'],['Nagano','Nagano'],['Nagasaki','Nagasaki'],['Nara','Nara'],['Niigata','Niigata'],['Okayama','Okayama'],['Okinawa','Okinawa'],['Saga','Saga'],['Saitama','Saitama'],['Shiga','Shiga'],['Shimane','Shimane'],['Shizuoka','Shizuoka'],['Tochigi','Tochigi'],['Tokushima','Tokushima'],['Tottori','Tottori'],['Toyama','Toyama'],['Tōkyō','Tokyo'],['Wakayama','Wakayama'],['Yamagata','Yamagata'],['Yamaguchi','Yamaguchi'],['Yamanashi','Yamanashi'],['Ōita','Oita'],['Ōsaka','Osaka']]"
                    >
                      Japan
                    </option>
                    <option
                      value="Malaysia"
                      data-provinces="[['Johor','Johor'],['Kedah','Kedah'],['Kelantan','Kelantan'],['Kuala Lumpur','Kuala Lumpur'],['Labuan','Labuan'],['Melaka','Malacca'],['Negeri Sembilan','Negeri Sembilan'],['Pahang','Pahang'],['Penang','Penang'],['Perak','Perak'],['Perlis','Perlis'],['Putrajaya','Putrajaya'],['Sabah','Sabah'],['Sarawak','Sarawak'],['Selangor','Selangor'],['Terengganu','Terengganu']]"
                    >
                      Malaysia
                    </option>
                    <option value="Netherlands" data-provinces="[]">
                      Netherlands
                    </option>
                    <option
                      value="New Zealand"
                      data-provinces="[['Auckland','Auckland'],['Bay of Plenty','Bay of Plenty'],['Canterbury','Canterbury'],['Chatham Islands','Chatham Islands'],['Gisborne','Gisborne'],['Hawke's Bay','Hawke’s Bay'],['Manawatu-Wanganui','Manawatū-Whanganui'],['Marlborough','Marlborough'],['Nelson','Nelson'],['Northland','Northland'],['Otago','Otago'],['Southland','Southland'],['Taranaki','Taranaki'],['Tasman','Tasman'],['Waikato','Waikato'],['Wellington','Wellington'],['West Coast','West Coast']]"
                    >
                      New Zealand
                    </option>
                    <option value="Norway" data-provinces="[]">
                      Norway
                    </option>
                    <option value="Poland" data-provinces="[]">
                      Poland
                    </option>
                    <option
                      value="Portugal"
                      data-provinces="[['Aveiro','Aveiro'],['Açores','Azores'],['Beja','Beja'],['Braga','Braga'],['Bragança','Bragança'],['Castelo Branco','Castelo Branco'],['Coimbra','Coimbra'],['Faro','Faro'],['Guarda','Guarda'],['Leiria','Leiria'],['Lisboa','Lisbon'],['Madeira','Madeira'],['Portalegre','Portalegre'],['Porto','Porto'],['Santarém','Santarém'],['Setúbal','Setúbal'],['Viana do Castelo','Viana do Castelo'],['Vila Real','Vila Real'],['Viseu','Viseu'],['Évora','Évora']]"
                    >
                      Portugal
                    </option>
                    <option value="Singapore" data-provinces="[]">
                      Singapore
                    </option>
                    <option
                      value="South Korea"
                      data-provinces="[['Busan','Busan'],['Chungbuk','North Chungcheong'],['Chungnam','South Chungcheong'],['Daegu','Daegu'],['Daejeon','Daejeon'],['Gangwon','Gangwon'],['Gwangju','Gwangju City'],['Gyeongbuk','North Gyeongsang'],['Gyeonggi','Gyeonggi'],['Gyeongnam','South Gyeongsang'],['Incheon','Incheon'],['Jeju','Jeju'],['Jeonbuk','North Jeolla'],['Jeonnam','South Jeolla'],['Sejong','Sejong'],['Seoul','Seoul'],['Ulsan','Ulsan']]"
                    >
                      South Korea
                    </option>
                    <option
                      value="Spain"
                      data-provinces="[['A Coruña','A Coruña'],['Albacete','Albacete'],['Alicante','Alicante'],['Almería','Almería'],['Asturias','Asturias Province'],['Badajoz','Badajoz'],['Balears','Balears Province'],['Barcelona','Barcelona'],['Burgos','Burgos'],['Cantabria','Cantabria Province'],['Castellón','Castellón'],['Ceuta','Ceuta'],['Ciudad Real','Ciudad Real'],['Cuenca','Cuenca'],['Cáceres','Cáceres'],['Cádiz','Cádiz'],['Córdoba','Córdoba'],['Girona','Girona'],['Granada','Granada'],['Guadalajara','Guadalajara'],['Guipúzcoa','Gipuzkoa'],['Huelva','Huelva'],['Huesca','Huesca'],['Jaén','Jaén'],['La Rioja','La Rioja Province'],['Las Palmas','Las Palmas'],['León','León'],['Lleida','Lleida'],['Lugo','Lugo'],['Madrid','Madrid Province'],['Melilla','Melilla'],['Murcia','Murcia'],['Málaga','Málaga'],['Navarra','Navarra'],['Ourense','Ourense'],['Palencia','Palencia'],['Pontevedra','Pontevedra'],['Salamanca','Salamanca'],['Santa Cruz de Tenerife','Santa Cruz de Tenerife'],['Segovia','Segovia'],['Sevilla','Seville'],['Soria','Soria'],['Tarragona','Tarragona'],['Teruel','Teruel'],['Toledo','Toledo'],['Valencia','Valencia'],['Valladolid','Valladolid'],['Vizcaya','Biscay'],['Zamora','Zamora'],['Zaragoza','Zaragoza'],['Álava','Álava'],['Ávila','Ávila']]"
                    >
                      Spain
                    </option>
                    <option value="Sweden" data-provinces="[]">
                      Sweden
                    </option>
                    <option value="Switzerland" data-provinces="[]">
                      Switzerland
                    </option>
                    <option
                      value="United Arab Emirates"
                      data-provinces="[['Abu Dhabi','Abu Dhabi'],['Ajman','Ajman'],['Dubai','Dubai'],['Fujairah','Fujairah'],['Ras al-Khaimah','Ras al-Khaimah'],['Sharjah','Sharjah'],['Umm al-Quwain','Umm al-Quwain']]"
                    >
                      United Arab Emirates
                    </option>
                    <option
                      value="United Kingdom"
                      data-provinces="[['British Forces','British Forces'],['England','England'],['Northern Ireland','Northern Ireland'],['Scotland','Scotland'],['Wales','Wales']]"
                    >
                      United Kingdom
                    </option>
                    <option
                      value="United States"
                      data-provinces="[['Alabama','Alabama'],['Alaska','Alaska'],['American Samoa','American Samoa'],['Arizona','Arizona'],['Arkansas','Arkansas'],['Armed Forces Americas','Armed Forces Americas'],['Armed Forces Europe','Armed Forces Europe'],['Armed Forces Pacific','Armed Forces Pacific'],['California','California'],['Colorado','Colorado'],['Connecticut','Connecticut'],['Delaware','Delaware'],['District of Columbia','Washington DC'],['Federated States of Micronesia','Micronesia'],['Florida','Florida'],['Georgia','Georgia'],['Guam','Guam'],['Hawaii','Hawaii'],['Idaho','Idaho'],['Illinois','Illinois'],['Indiana','Indiana'],['Iowa','Iowa'],['Kansas','Kansas'],['Kentucky','Kentucky'],['Louisiana','Louisiana'],['Maine','Maine'],['Marshall Islands','Marshall Islands'],['Maryland','Maryland'],['Massachusetts','Massachusetts'],['Michigan','Michigan'],['Minnesota','Minnesota'],['Mississippi','Mississippi'],['Missouri','Missouri'],['Montana','Montana'],['Nebraska','Nebraska'],['Nevada','Nevada'],['New Hampshire','New Hampshire'],['New Jersey','New Jersey'],['New Mexico','New Mexico'],['New York','New York'],['North Carolina','North Carolina'],['North Dakota','North Dakota'],['Northern Mariana Islands','Northern Mariana Islands'],['Ohio','Ohio'],['Oklahoma','Oklahoma'],['Oregon','Oregon'],['Palau','Palau'],['Pennsylvania','Pennsylvania'],['Puerto Rico','Puerto Rico'],['Rhode Island','Rhode Island'],['South Carolina','South Carolina'],['South Dakota','South Dakota'],['Tennessee','Tennessee'],['Texas','Texas'],['Utah','Utah'],['Vermont','Vermont'],['Virgin Islands','U.S. Virgin Islands'],['Virginia','Virginia'],['Washington','Washington'],['West Virginia','West Virginia'],['Wisconsin','Wisconsin'],['Wyoming','Wyoming']]"
                    >
                      United States
                    </option>
                    <option value="Vietnam" data-provinces="[]">
                      Vietnam
                    </option>
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
