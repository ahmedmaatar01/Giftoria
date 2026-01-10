import { useEffect, useState } from "react";

export default function PaymentProcessing() {
  const orderId = new URLSearchParams(window.location.search).get("order_id");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://api.giftoria.me/api/public/order-payment-status/${orderId}`
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
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  return <h2>Processing your payment... (status: {status})</h2>;
}
