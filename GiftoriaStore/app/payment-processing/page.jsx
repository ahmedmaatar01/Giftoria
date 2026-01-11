"use client";
import { useEffect, useState } from "react";

export default function PaymentProcessing() {
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("order_id");
      setOrderId(id);
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;

    let interval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://api.giftoria.me/api/public/order-payment-status/${orderId}`,
          { credentials: 'omit' }
        );

        if (!response.ok) {
          console.error("Failed to fetch payment status");
          return;
        }

        const data = await response.json();

        setStatus(data.status);

        if (data.status === "paid") {
          clearInterval(interval);
          window.location.href = "/payment-success";
        }

        if (data.status === "failed") {
          clearInterval(interval);
          window.location.href = "/payment-failed";
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (orderId === null) return <h2>Processing your payment...</h2>;
  if (!orderId) return <h2>Invalid payment request. No order specified.</h2>;

  return <h2>Processing your payment... (status: {status})</h2>;
}
