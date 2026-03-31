import type { Metadata } from "next";
import seoMeta from "@/data/seo-meta.json";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact PURE Norway WATER for customer support, partnerships, business inquiries, and product questions.",
  keywords: seoMeta.pages.contact.keywords,
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
