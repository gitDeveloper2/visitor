
import { ServerAuthGuard } from "@/components/auth/ServerAuthGuard";

export default async function LegacyAdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<ServerAuthGuard requiredRole="admin" redirectTo="/auth/signin">
			{children}
		</ServerAuthGuard>
	);
}
