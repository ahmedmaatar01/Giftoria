"use client";
import React from "react";
import Link from "next/link";
import { useContextElement } from "@/context/Context";

export default function MyAccount() {
  const { user } = useContextElement();
  
  // Get user's first name from the full name
  const getFirstName = (fullName) => {
    if (!fullName) return "Guest";
    return fullName.split(" ")[0];
  };

  return (
    <div className="my-account-content account-dashboard">
      <div className="mb_60">
        <h5 className="fw-5 mb_20">Hello {user ? getFirstName(user.name) : "Guest"}</h5>
        <p>
          From your account dashboard you can view your{' '}
          <Link className="text_primary raleway-regular" href={`/my-account-orders`}>
            recent orders
          </Link>
          {' '}and{' '}
          <Link className="text_primary raleway-regular" href={`/my-account-edit`}>
            edit your password and account details
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
