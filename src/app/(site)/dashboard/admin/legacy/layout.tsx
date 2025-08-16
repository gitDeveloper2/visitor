
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LegacyAdminLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession();
	if (!session) {
		return redirect("/auth/signin");
	}
	if (session.user?.role !== 'admin') {
		return redirect("/dashboard");
	}
	return <>{children}</>;
}
