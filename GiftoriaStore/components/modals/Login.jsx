"use client";

import React, { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login, authLoading } = useContextElement();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Clear error and password when modal closes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const modalEl = document.getElementById("login");
    if (!modalEl) return;

    const handleHidden = () => {
      setError(null);
      setPassword("");
    };
    const handleShow = () => {
      // reset error on open too
      setError(null);
    };

    modalEl.addEventListener("hidden.bs.modal", handleHidden);
    modalEl.addEventListener("show.bs.modal", handleShow);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHidden);
      modalEl.removeEventListener("show.bs.modal", handleShow);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success) {
      // Close modal
      if (typeof window !== "undefined" && window.bootstrap) {
        const modal = document.getElementById("login");
        if (modal) {
          const bsModal = window.bootstrap.Modal.getOrCreateInstance(modal);
          bsModal.hide();
        }
      }
      router.push("/my-account");
    } else {
      setError(res.error || "Login failed");
    }
  };
  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="login"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Log in</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              onClick={() => {
                setError(null);
                setPassword("");
              }}
            />
          </div>
          <div className="tf-login-form">
            <form onSubmit={handleSubmit} className="" acceptCharset="utf-8">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <label className="tf-field-label" htmlFor="email">
                  Email *
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <label className="tf-field-label" htmlFor="password">
                  Password *
                </label>
              </div>
              {error && (
                <div className="alert alert-danger py-2 my-2">{error}</div>
              )}
              <div>
                <a
                  href="#forgotPassword"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    disabled={authLoading}
                  >
                    <span>{authLoading ? "Logging in..." : "Log in"}</span>
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#register"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    New customer? Create your account
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
