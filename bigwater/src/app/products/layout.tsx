import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse PURE Norway WATER products including still, sparkling, and flavored options in sustainable aluminum cans.",
  keywords: [
    "products",
    "water products",
    "vann produkter",
    "kullsyre vann",
    "sparkling water",
    "still water",
    "resirkulerbar emballasje",
    "aluminum can water",
  ],
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
