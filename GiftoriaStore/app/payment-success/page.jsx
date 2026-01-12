import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <>
      <Header10 />

      <div style={{ textAlign: "center", padding: 80 }}>
        <h1>Payment successful 🎉</h1>
        <p>Thank you for your order.</p>
        {orderId && (
          <p style={{ marginTop: 12 }}>Order #: {orderId}</p>
        )}
      </div>
      <Footer1 />
    </>
  );
}
