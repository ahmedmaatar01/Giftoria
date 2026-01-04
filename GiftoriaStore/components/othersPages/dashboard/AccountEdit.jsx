<<<<<<< HEAD
"use client";
import React, { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";

export default function AccountEdit() {
  const { t, i18n } = useTranslation();
  const { user, authToken, setUser } = useContextElement();
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    country: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        country: user.country || 'Qatar',
        address: user.address || '',
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate passwords match if changing password
    if (formData.password && formData.password !== formData.password_confirmation) {
      setError(t("account_edit.password_mismatch"));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        country: formData.country,
        address: formData.address,
      };

      // Only include password fields if user is changing password
      if (formData.password) {
        payload.current_password = formData.current_password;
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      const response = await fetch('http://localhost:8000/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("account_edit.update_failed"));
      }

      // Update user in context
      setUser(data.user);
      
      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setMessage(t("account_edit.update_success"));
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: '',
      }));

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || t("account_edit.update_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-account-content account-edit" style={{direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
      <div className="">
        <form
            onSubmit={handleSubmit}
          className=""
          id="form-password-change"
          action="#"
        >
            {message && (
              <div className="alert alert-success mb-3" role="alert">
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}
            
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="property1"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property1"
            >
              {t("account_edit.first_name")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="property2"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property2"
            >
              {t("account_edit.last_name")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="email"
              autoComplete="email"
              required
              id="property3"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property3"
            >
              {t("account_edit.email")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <select
              className="tf-field-input tf-input"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">{t("account_edit.select_country")}</option>
              <option value="Qatar">{t("account_edit.countries.qatar")}</option>
              <option value="Algeria">{t("account_edit.countries.algeria")}</option>
              <option value="Morocco">{t("account_edit.countries.morocco")}</option>
              <option value="Tunisia">{t("account_edit.countries.tunisia")}</option>
              <option value="Egypt">{t("account_edit.countries.egypt")}</option>
              <option value="France">{t("account_edit.countries.france")}</option>
              <option value="United States">{t("account_edit.countries.united_states")}</option>
              <option value="United Kingdom">{t("account_edit.countries.united_kingdom")}</option>
              <option value="Germany">{t("account_edit.countries.germany")}</option>
              <option value="Italy">{t("account_edit.countries.italy")}</option>
              <option value="Spain">{t("account_edit.countries.spain")}</option>
              <option value="Turkey">{t("account_edit.countries.turkey")}</option>
              <option value="Saudi Arabia">{t("account_edit.countries.saudi_arabia")}</option>
              <option value="UAE">{t("account_edit.countries.uae")}</option>
              <option value="Other">{t("account_edit.countries.other")}</option>
            </select>
            <label className="tf-field-label fw-4 text_black-2" htmlFor="country">
              {t("account_edit.country")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="address">
              {t("account_edit.address")}
            </label>
          </div>
          <h6 className="mb_20">{t("account_edit.password_change")}</h6>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              autoComplete="current-password"
              id="property4"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property4"
            >
              {t("account_edit.current_password")}
            </label>
          </div>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="property5"
              autoComplete="new-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property5"
            >
              {t("account_edit.new_password")}
            </label>
          </div>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="property6"
              autoComplete="new-password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property6"
            >
              {t("account_edit.confirm_password")}
            </label>
          </div>
          <div className="mb_20">
            <button
              type="submit"
              className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
              disabled={loading}
            >
              {loading ? t("account_edit.saving") : t("account_edit.save_changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
=======
"use client";
import React, { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";
import { API_BASE_URL_WITH_API } from '../../../utils/config';

export default function AccountEdit() {
  const { t, i18n } = useTranslation();
  const { user, authToken, setUser } = useContextElement();
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    country: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        country: user.country || 'Qatar',
        address: user.address || '',
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate passwords match if changing password
    if (formData.password && formData.password !== formData.password_confirmation) {
      setError(t("account_edit.password_mismatch"));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        country: formData.country,
        address: formData.address,
      };

      // Only include password fields if user is changing password
      if (formData.password) {
        payload.current_password = formData.current_password;
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      const response = await fetch(`${API_BASE_URL_WITH_API}/user/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("account_edit.update_failed"));
      }

      // Update user in context
      setUser(data.user);

      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setMessage(t("account_edit.update_success"));

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: '',
      }));

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || t("account_edit.update_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-account-content account-edit" style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="">
        <form
          onSubmit={handleSubmit}
          className=""
          id="form-password-change"
          action="#"
        >
          {message && (
            <div className="alert alert-success mb-3" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}

          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="property1"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property1"
            >
              {t("account_edit.first_name")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="property2"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property2"
            >
              {t("account_edit.last_name")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="email"
              autoComplete="email"
              required
              id="property3"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property3"
            >
              {t("account_edit.email")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <select
              className="tf-field-input tf-input"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">{t("account_edit.select_country")}</option>
              <option value="Qatar">{t("account_edit.countries.qatar")}</option>
              <option value="Algeria">{t("account_edit.countries.algeria")}</option>
              <option value="Morocco">{t("account_edit.countries.morocco")}</option>
              <option value="Tunisia">{t("account_edit.countries.tunisia")}</option>
              <option value="Egypt">{t("account_edit.countries.egypt")}</option>
              <option value="France">{t("account_edit.countries.france")}</option>
              <option value="United States">{t("account_edit.countries.united_states")}</option>
              <option value="United Kingdom">{t("account_edit.countries.united_kingdom")}</option>
              <option value="Germany">{t("account_edit.countries.germany")}</option>
              <option value="Italy">{t("account_edit.countries.italy")}</option>
              <option value="Spain">{t("account_edit.countries.spain")}</option>
              <option value="Turkey">{t("account_edit.countries.turkey")}</option>
              <option value="Saudi Arabia">{t("account_edit.countries.saudi_arabia")}</option>
              <option value="UAE">{t("account_edit.countries.uae")}</option>
              <option value="Other">{t("account_edit.countries.other")}</option>
            </select>
            <label className="tf-field-label fw-4 text_black-2" htmlFor="country">
              {t("account_edit.country")}
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="address">
              {t("account_edit.address")}
            </label>
          </div>
          <h6 className="mb_20">{t("account_edit.password_change")}</h6>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              autoComplete="current-password"
              id="property4"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property4"
            >
              {t("account_edit.current_password")}
            </label>
          </div>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="property5"
              autoComplete="new-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property5"
            >
              {t("account_edit.new_password")}
            </label>
          </div>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="property6"
              autoComplete="new-password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property6"
            >
              {t("account_edit.confirm_password")}
            </label>
          </div>
          <div className="mb_20">
            <button
              type="submit"
              className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
              disabled={loading}
              style={{ backgroundColor: '#E8DBC8', color: 'black', border: 'none' }}
            >
              {loading ? t("account_edit.saving") : t("account_edit.save_changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
>>>>>>> origin/main
