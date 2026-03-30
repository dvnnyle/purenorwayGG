import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import LayoutChrome from "@/components/layout/LayoutChrome";
import WebOnlineLog from "@/components/system/WebOnlineLog";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PURENorway Water",
  description: "Experience innovation and excellence with BigWater. Building the future, one wave at a time.",
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
        <WebOnlineLog />
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
