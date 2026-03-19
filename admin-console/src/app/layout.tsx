import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AdminAuthShell from "./_components/AdminAuthShell";
import "./globals.css";
import "./admin.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PURENorway Admin Console",
  description: "Admin dashboard for PURENorway operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <AdminAuthShell>{children}</AdminAuthShell>
      </body>
    </html>
  );
}
