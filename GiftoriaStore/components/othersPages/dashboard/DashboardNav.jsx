"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContextElement } from "@/context/Context";
import { useTranslation } from "react-i18next";

export default function DashboardNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useContextElement();

  const accountLinks = [
    { href: "/my-account", label: t("dashboard_nav.dashboard") },
    { href: "/my-account-orders", label: t("dashboard_nav.orders") },
    { href: "/my-account-edit", label: t("dashboard_nav.account_details") },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    router.push("/");
  };
  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={`my-account-nav-item raleway-medium ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <a href="#logout" className="my-account-nav-item raleway-medium" onClick={handleLogout}>
          {t("dashboard_nav.logout")}
        </a>
      </li>
    </ul>
  );
}
