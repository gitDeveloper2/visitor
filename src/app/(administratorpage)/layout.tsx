import { getServerSession } from "next-auth";
import  AuthProvider  from "../../context/authContexts";
import { redirect } from "next/navigation";  // For Next.js redirects

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();



    if (!session) {
      
        return redirect("/api/auth/signin");  // Use Next.js redirect here
    }

    return (
        <AuthProvider session={session}>
            {children}
        </AuthProvider>
    );
}
