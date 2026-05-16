"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import { useSearchParams } from "next/navigation";
import OrderDetailsView from "@/components/othersPages/dashboard/OrderDetailsView";
import { useTranslation } from "react-i18next";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { t } = useTranslation();

  return (
    <>
      <Header10 />
      {orderId && (
        <section className="flat-spacing-11">
          <div className="container">
            <h2 style={{ marginBottom: 24 }}>{t("order_details_title")}</h2>
            <OrderDetailsView orderId={orderId} requireAuth={false} />
          </div>
        </section>
      )}

      <Footer1 />
    </>
  );
}
