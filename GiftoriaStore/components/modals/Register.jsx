"use client";
import React, { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import { useRouter } from "next/navigation";
export default function Register() {
  const { register, authLoading } = useContextElement();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Clear error and password when modal closes or opens
  useEffect(() => {
    if (typeof window === "undefined") return;
    const modalEl = document.getElementById("register");
    if (!modalEl) return;

    const handleHidden = () => {
      setError(null);
      setPassword("");
    };
    const handleShow = () => {
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
    const res = await register(firstName, lastName, email, password);
    if (res.success) {
      // Close modal
      if (typeof window !== "undefined" && window.bootstrap) {
        const modal = document.getElementById("register");
        if (modal) {
          const bsModal = window.bootstrap.Modal.getOrCreateInstance(modal);
          bsModal.hide();
        }
      }
      router.push("/my-account");
    } else {
      setError(res.error || "Registration failed");
    }
  };
  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Register</div>
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
            <form onSubmit={handleSubmit} className="">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
                <label className="tf-field-label" htmlFor="firstName">
                  First name
                </label>
              </div>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
                <label className="tf-field-label" htmlFor="lastName">
                  Last name
                </label>
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
                  required
                  name="password"
                  autoComplete="new-password"
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
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    disabled={authLoading}
                  >
                    <span>{authLoading ? "Registering..." : "Register"}</span>
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    Already have an account? Log in here
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
