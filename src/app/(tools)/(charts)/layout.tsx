import { TokenProvider } from "@/features/shared/context/TokenContext";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    

    return (
        <TokenProvider>
            {children}
        </TokenProvider>
    );
}
