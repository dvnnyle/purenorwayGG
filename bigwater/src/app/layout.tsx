import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import LayoutChrome from "@/components/layout/LayoutChrome";
import WebOnlineLog from "@/components/system/WebOnlineLog";
import seoMeta from "@/data/seo-meta.json";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.purenorwaywater.com";
const brandName = seoMeta.brand.name;
const legalName = seoMeta.brand.legalName;
const description = seoMeta.global.description.en;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: legalName,
  alternateName: brandName,
  url: siteUrl,
  description,
  areaServed: ["NO", "Nordics", "Europe"],
  knowsAbout: seoMeta.global.schemaKnowsAbout,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Skibaasen 28",
    postalCode: "4636",
    addressLocality: "Kristiansand",
    addressCountry: "NO",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brandName,
    template: `%s | ${brandName}`,
  },
  description,
  keywords: seoMeta.global.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: brandName,
    description,
    url: "/",
    siteName: brandName,
    locale: seoMeta.site.defaultLocale,
    alternateLocale: [seoMeta.site.alternateLocale],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: brandName,
    description,
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <WebOnlineLog />
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
