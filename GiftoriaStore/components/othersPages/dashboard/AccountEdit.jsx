"use client";
import React, { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";

export default function AccountEdit() {
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
      setError('New passwords do not match');
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
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user in context
      setUser(data.user);
      
      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setMessage('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: '',
      }));

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-account-content account-edit">
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
              First name
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
              Last name
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
              Email
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
            <label className="tf-field-label fw-4 text_black-2" htmlFor="country">
              Country
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
              Address
            </label>
          </div>
          <h6 className="mb_20">Password Change</h6>
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
              Current password
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
              New password
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
              Confirm password
            </label>
          </div>
          <div className="mb_20">
            <button
              type="submit"
              className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
