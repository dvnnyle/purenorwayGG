"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import NavbarV2 from "@/components/navigation/NavbarV2";
import ClickSplash from "@/components/ui/ClickSplash";
import Chatbot from "@/components/layout/Chatbot";

type LayoutChromeProps = {
  children: React.ReactNode;
};

export default function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname();

  const isHome2 = useMemo(() => pathname?.startsWith("/home2"), [pathname]);

  return (
    <>
      {!isHome2 && (
        <NavbarV2
          logoSrc="/assets/logo/logoWhite.png"
          logoText="PureNorway"
          links={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            {
              label: "Shop",
              href: "https://www.purenorwaystore.com/butikk/water",
            },
            {
              label: "About",
              href: "/about",
              submenu: [
                { label: "News", href: "/news" },
                { label: "MiniGame", href: "/minigame" },
              ],
            },
            { label: "Contact", href: "/contact" },
          ]}
          showLanguageSwitch={true}
        />
      )}

      {children}

      {!isHome2 && <ClickSplash />}
      {!isHome2 && <Chatbot />}
    </>
  );
}
