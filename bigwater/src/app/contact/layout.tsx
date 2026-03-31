import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact PURE Norway WATER for customer support, partnerships, business inquiries, and product questions.",
  keywords: [
    "contact pure norway water",
    "customer support",
    "business inquiry",
    "stockist",
    "Kristiansand",
    "Norway water company",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
