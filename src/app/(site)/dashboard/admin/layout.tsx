import { ServerAuthGuard } from "@/components/auth/ServerAuthGuard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<ServerAuthGuard requiredRole="admin" redirectTo="/auth/signin">
			{children}
		</ServerAuthGuard>
	);
}