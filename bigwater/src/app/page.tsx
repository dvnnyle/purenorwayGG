import type { Metadata } from "next";
import seoMeta from "@/data/seo-meta.json";
import HomePage from "./home";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore PURE Norway WATER: premium Norwegian still, sparkling, and flavored water in fully recyclable aluminum cans.",
  keywords: seoMeta.pages.home.keywords,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePage />;
}
