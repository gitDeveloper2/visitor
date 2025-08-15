
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";  // For Next.js redirects

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();

    if (!session) {
        return redirect("/auth/signin");  // Use Next.js redirect here
    }

    // Check if user has admin role
    if (session.user?.role !== 'admin') {
        return redirect("/dashboard");  // Redirect non-admin users to dashboard
    }

    return <>{children}</>;
}
