'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import './navbarV2.css';

interface NavLink {
  label: string;
  href: string;
  submenu?: NavLink[];
}

interface NavbarV2Props {
  logoSrc?: string;
  logoText?: string;
  links?: NavLink[];
  ctaText?: string;
  ctaHref?: string;
  showLanguageSwitch?: boolean;
}

export default function NavbarV2({
  logoSrc,
  logoText = 'PureNorway',
  links = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    {
      label: 'About',
      href: '/about',
      submenu: [
        { label: 'News', href: '/news' },
        { label: 'MiniGame', href: '/minigame' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ],
  ctaText = 'Shop',
  ctaHref = 'https://www.purenorwaystore.com/butikk/water',
  showLanguageSwitch = false,
}: NavbarV2Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'FR' : 'EN');
  };

  return (
    <nav className="navbar-v2">
      {/* Left Logo */}
      <img 
        src="/assets/logo/logoLong.png" 
        alt="PureNorway Logo" 
        className="navbar-v2-left-logo"
      />

      {/* Navigation Links */}
      <div className={`navbar-v2-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {links.map((link, index) => {
          const isInternal = !link.href.startsWith('#') && !link.href.startsWith('http');
          const hasSubmenu = link.submenu && link.submenu.length > 0;
          return (
            <div
              key={index}
              className={`navbar-v2-link-wrapper ${hasSubmenu ? 'has-submenu' : ''}`}
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                hasSubmenu && setOpenDropdown(link.label);
              }}
              onMouseLeave={() => {
                if (hasSubmenu) {
                  dropdownTimeoutRef.current = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 300);
                }
              }}
            >
              {isInternal ? (
                <Link
                  href={link.href}
                  className="navbar-v2-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="navbar-v2-link"
                  onClick={() => setMobileMenuOpen(false)}
                  target={(link.href.startsWith('http') || link.href.startsWith('https')) ? '_blank' : undefined}
                  rel={(link.href.startsWith('http') || link.href.startsWith('https')) ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              )}
              {hasSubmenu && (
                <div className={`navbar-v2-submenu ${openDropdown === link.label ? 'open' : ''}`}>
                  {link.submenu!.map((sublink, subindex) => {
                    const isSubInternal = !sublink.href.startsWith('#') && !sublink.href.startsWith('http');
                    return isSubInternal ? (
                      <Link
                        key={subindex}
                        href={sublink.href}
                        className="navbar-v2-submenu-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sublink.label}
                      </Link>
                    ) : (
                      <a
                        key={subindex}
                        href={sublink.href}
                        className="navbar-v2-submenu-link"
                        onClick={() => setMobileMenuOpen(false)}
                        target={sublink.href.startsWith('http') || sublink.href.startsWith('https') ? '_blank' : undefined}
                        rel={sublink.href.startsWith('http') || sublink.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                      >
                        {sublink.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right side controls */}
      <div className="navbar-v2-controls">
        {/* Language Switcher (optional) */}
        {showLanguageSwitch && (
          <button
            className="navbar-v2-lang"
            onClick={toggleLanguage}
            title="Toggle language"
          >
            {language}
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-v2-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
