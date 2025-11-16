import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
	// This route was removed; redirect to My Account main page
	redirect("/my-account");
}
