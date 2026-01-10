"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL_WITH_API } from "@/utils/config";

export default function PaymentProcessingPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("order_id");

  useEffect(() => {
    if (!orderId) {
      router.replace("/payment-failed");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL_WITH_API}/commands/${orderId}`
        );

        const status = res.data.status;

        if (status === "paid") {
          router.replace(`/payment-success?order_id=${orderId}`);
        } else if (status === "failed") {
          router.replace(`/payment-failed?order_id=${orderId}`);
        } else {
          // still pending → check again
          setTimeout(checkStatus, 2000);
        }
      } catch (err) {
        console.error(err);
        setTimeout(checkStatus, 2000);
      }
    };

    checkStatus();
  }, [orderId, router]);

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h2>Processing your payment…</h2>
      <p>Please wait, do not refresh the page.</p>
    </div>
  );
}
