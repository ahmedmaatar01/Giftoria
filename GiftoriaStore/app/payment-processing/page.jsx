import { useEffect } from "react";

export default function PaymentProcessing() {
  const orderId = new URLSearchParams(window.location.search).get("order_id");

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(
        `https://api.giftoria.me/api/public/order-status/${orderId}`
      );

      const data = await response.json();

      if (data.status === "paid") {
        window.location.href = "/payment-success";
      }

      if (data.status === "failed") {
        window.location.href = "/payment-failed";
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return <h2>Processing your payment...</h2>;
}
