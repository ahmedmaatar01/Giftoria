"use client";

import React, { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";

export default function ResetPass() {
  const { t } = useTranslation();
  const { forgotPassword, authLoading } = useContextElement();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const modalEl = document.getElementById("forgotPassword");
    if (!modalEl) return;

    const resetState = () => {
      setEmail("");
      setError(null);
      setSuccess(null);
    };

    modalEl.addEventListener("hidden.bs.modal", resetState);
    modalEl.addEventListener("show.bs.modal", resetState);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", resetState);
      modalEl.removeEventListener("show.bs.modal", resetState);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(result.message);
      return;
    }

    setError(result.error || t("login_modal.reset_link_failed"));
  };

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="forgotPassword"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">{t("login_modal.reset_title")}</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form onSubmit={handleSubmit}>
              <div>
                <p>{t("login_modal.reset_description")}</p>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  autoComplete="email"
                  required
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <label className="tf-field-label" htmlFor="email">
                  {t("login_modal.reset_email_label")} *
                </label>
              </div>
              {error && <div className="alert alert-danger py-2 my-2">{error}</div>}
              {success && <div className="alert alert-success py-2 my-2">{success}</div>}
              <div>
                <a
                  href="#login"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  {t("login_modal.back_to_login")}
                </a>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    disabled={authLoading}
                  >
                    <span>
                      {authLoading ? t("login_modal.sending_reset_link") : t("login_modal.send_reset_link")}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
