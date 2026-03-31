import type { Metadata } from "next";
import seoMeta from "@/data/seo-meta.json";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop PURE Norway WATER products online, including still and sparkling options in sustainable aluminum cans.",
  keywords: seoMeta.pages.shop.keywords,
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return (
    <main style={{ padding: "48px 20px", maxWidth: 900, margin: "0 auto" }}>
      <h1>Shop PURE Norway WATER</h1>
      <p>
        Visit our online store to order PURE Norway WATER products.
      </p>
      <p>
        <a href="https://www.purenorwaystore.com" target="_blank" rel="noopener noreferrer">
          Go to purenorwaystore.com
        </a>
      </p>
    </main>
  );
}
