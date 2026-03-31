import type { Metadata } from "next";
import seoMeta from "@/data/seo-meta.json";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse PURE Norway WATER products including still, sparkling, and flavored options in sustainable aluminum cans.",
  keywords: seoMeta.pages.products.keywords,
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
