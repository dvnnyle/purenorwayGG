import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about PURE Norway WATER, our sustainability mission, and our commitment to reducing plastic pollution.",
  keywords: [
    "about pure norway water",
    "sustainability",
    "bærekraft",
    "resirkulerbar",
    "aluminum packaging",
    "plastic free",
    "norwegian water company",
  ],
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
