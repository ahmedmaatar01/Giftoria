"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Header6 from "@/components/headers/Header6";
import Footer1 from "@/components/footers/Footer1";
import { useContextElement } from "@/context/Context";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { resetPassword, authLoading } = useContextElement();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token || !email) {
      setError(t("login_modal.invalid_reset_link"));
      return;
    }

    const result = await resetPassword(
      token,
      email,
      formData.password,
      formData.password_confirmation
    );

    if (result.success) {
      setSuccess(result.message);
      setFormData({
        password: "",
        password_confirmation: "",
      });
      return;
    }

    setError(result.error || t("login_modal.reset_password_failed"));
  };

  return (
    <>
      <Header6 />
      <section className="flat-spacing-25">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="tf-login-form" style={{ marginTop: "80px", marginBottom: "80px" }}>
                <div className="wrap-login-content">
                  <div className="heading text-center mb-4">
                    <h3>{t("login_modal.set_new_password_title")}</h3>
                    <p style={{ marginTop: "12px" }}>
                      {t("login_modal.set_new_password_description", {
                        email: email || t("login_modal.set_new_password_fallback_email"),
                      })}
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="tf-field style-1">
                      <input
                        className="tf-field-input tf-input"
                        placeholder=" "
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <label className="tf-field-label" htmlFor="password">
                        {t("login_modal.new_password")} *
                      </label>
                    </div>
                    <div className="tf-field style-1">
                      <input
                        className="tf-field-input tf-input"
                        placeholder=" "
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={formData.password_confirmation}
                        onChange={handleChange}
                      />
                      <label className="tf-field-label" htmlFor="password_confirmation">
                        {t("login_modal.confirm_password")} *
                      </label>
                    </div>
                    {error && <div className="alert alert-danger py-2 my-2">{error}</div>}
                    {success && <div className="alert alert-success py-2 my-2">{success}</div>}
                    <div className="bottom">
                      <div className="w-100">
                        <button
                          type="submit"
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          disabled={authLoading || !token || !email}
                        >
                          <span>
                            {authLoading ? t("login_modal.resetting_password") : t("login_modal.reset_password_button")}
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}