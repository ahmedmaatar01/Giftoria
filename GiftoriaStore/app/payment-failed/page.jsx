"use client";
import { useSearchParams } from "next/navigation";

export default function PaymentFailed() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <h1>Payment failed ❌</h1>
      <p>Please try again.</p>

      {orderId && (
        <p style={{ marginTop: 16, color: "#666" }}>
          Order ID: <strong>#{orderId}</strong>
        </p>
      )}
    </div>
  );
}
