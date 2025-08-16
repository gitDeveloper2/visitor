import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - BasicUtils",
  description: "Simple, transparent pricing for BasicUtils. Choose from Free, Pro, and Enterprise plans. Start with our free tier or unlock premium features.",
  keywords: ["pricing", "plans", "subscription", "premium", "enterprise", "basicutils", "developer tools"],
  openGraph: {
    title: "Pricing - BasicUtils",
    description: "Simple, transparent pricing for BasicUtils. Choose from Free, Pro, and Enterprise plans.",
    type: "website",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 