import type { Metadata } from "next";
import seoMeta from "@/data/seo-meta.json";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about PURE Norway WATER, our sustainability mission, and our commitment to reducing plastic pollution.",
  keywords: seoMeta.pages.about.keywords,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
