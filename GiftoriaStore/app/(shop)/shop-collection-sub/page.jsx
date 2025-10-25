"use client";
import Footer1 from "@/components/footers/Footer1";
import Header10 from "@/components/headers/Header10";
import Topbar1 from "@/components/headers/Topbar1";
import ShopByOccasion from "@/components/shop/ShopByOccasion";
import Subcollections from "@/components/shop/Subcollections";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Page() {
  const searchParams = useSearchParams();
  const occasionId = searchParams.get('occasion');
  const [occasion, setOccasion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchOccasion = async () => {
      if (!occasionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/occasions/${occasionId}`);
        const data = await response.json();
        setOccasion(data);
      } catch (error) {
        console.error('Error fetching occasion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccasion();
  }, [occasionId]);

  const displayName = occasion 
    ? (i18n.language === 'ar' && occasion.arabic_name ? occasion.arabic_name : occasion.name)
    : "New Arrival";

  const displayDescription = occasion?.description 
    ? occasion.description 
    : "Shop through our latest selection of Fashion";

  return (
    <>
      <Topbar1 />
      <Header10 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            {loading ? "Loading..." : displayName}
          </div>
          <p className="text-center text-2 text_black-2 mt_5">
            {loading ? "" : displayDescription}
          </p>
        </div>
      </div>
      <Subcollections />
      <ShopByOccasion />
      <Footer1 />
    </>
  );
}
