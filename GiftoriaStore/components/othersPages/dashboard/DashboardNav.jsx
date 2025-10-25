"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContextElement } from "@/context/Context";
const accountLinks = [
  { href: "/my-account", label: "Dashboard" },
  { href: "/my-account-orders", label: "Orders" },
  { href: "/my-account-address", label: "Addresses" },
  { href: "/my-account-edit", label: "Account Details" },
  { href: "/my-account-wishlist", label: "Wishlist" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useContextElement();

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
            className={`my-account-nav-item ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <a href="#logout" className="my-account-nav-item" onClick={handleLogout}>
          Logout
        </a>
      </li>
    </ul>
  );
}
