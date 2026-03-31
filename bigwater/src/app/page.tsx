import type { Metadata } from "next";
import HomePage from "./home";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore PURE Norway WATER: premium Norwegian still, sparkling, and flavored water in fully recyclable aluminum cans.",
  keywords: [
    "PURE Norway WATER",
    "water",
    "vann",
    "norwegian water",
    "kullsyre vann",
    "sparkling water",
    "resirkulerbar",
    "aluminum cans",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePage />;
}
