'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { getFeaturedArticle, getPublishedNewsArticles, type NewsArticle } from '@/lib/newsService';
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

function isInternalLink(href: string) {
  return !href.startsWith('#') && !href.startsWith('http');
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
  const FEATURED_SLIDE_INTERVAL_MS = 10000;
  const FEATURED_TRANSITION_MS = 650;

  const [language, setLanguage] = useState('EN');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [featuredStory, setFeaturedStory] = useState<NewsArticle | null>(null);
  const [featuredStories, setFeaturedStories] = useState<NewsArticle[]>([]);
  const [featuredStoryIndex, setFeaturedStoryIndex] = useState(0);
  const [isFeaturedStoryTransitioning, setIsFeaturedStoryTransitioning] = useState(false);

  const toggleLanguage = () => {
    setLanguage((current) => (current === 'EN' ? 'FR' : 'EN'));
  };

  const closeMenus = () => {
    setMegaMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = megaMenuOpen ? 'hidden' : '';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [megaMenuOpen]);

  useEffect(() => {
    const loadFeaturedStories = async () => {
      const publishedArticles = await getPublishedNewsArticles();

      if (publishedArticles.length > 0) {
        const storiesForSlider = publishedArticles.slice(0, 6);
        setFeaturedStories(storiesForSlider);
        setFeaturedStory(storiesForSlider[0]);
        return;
      }

      const article = await getFeaturedArticle();
      setFeaturedStory(article);
    };

    loadFeaturedStories();
  }, []);

  useEffect(() => {
    if (!megaMenuOpen || featuredStories.length <= 1) return;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const intervalId = setInterval(() => {
      setIsFeaturedStoryTransitioning(true);

      const swapTimeoutId = setTimeout(() => {
        setFeaturedStoryIndex((current) => (current + 1) % featuredStories.length);
        setIsFeaturedStoryTransitioning(false);
      }, FEATURED_TRANSITION_MS);
      timeoutIds.push(swapTimeoutId);
    }, FEATURED_SLIDE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [FEATURED_SLIDE_INTERVAL_MS, FEATURED_TRANSITION_MS, megaMenuOpen, featuredStories.length]);

  const findLink = (label: string, fallback: NavLink): NavLink => {
    return links.find((link) => link.label === label) ?? fallback;
  };

  const aboutLink = links.find((link) => link.label === 'About');
  const shopLink = links.find((link) => link.label === 'Shop') ?? { label: ctaText, href: ctaHref };
  const galleryLink = links.find((link) => link.label === 'Gallery') ?? { label: 'Gallery', href: '/gallery' };
  const activeFeaturedStory = featuredStories[featuredStoryIndex] ?? featuredStory;
  const featuredStoryImage =
    activeFeaturedStory?.imageUrl ||
    '/assets/marketingImages/480355058_645489551399318_5956170283212886069_n.jpg';
  const featuredStoryCategory = activeFeaturedStory?.category || 'Latest story';
  const featuredStoryTitle = activeFeaturedStory?.title || 'Breakthrough in Aluminium Recycling';

  const exploreLinks = [
    findLink('Home', { label: 'Home', href: '/' }),
    findLink('Products', { label: 'Products', href: '/products' }),
    shopLink,
  ];

  const companyLinks = [
    findLink('About', { label: 'About', href: '/about' }),
    findLink('Contact', { label: 'Contact', href: '/contact' }),
  ];

  const contentLinks = [
    findLink('News', { label: 'News', href: '/news' }),
    galleryLink,
    ...(aboutLink?.submenu?.filter((item) => item.label !== 'News') ?? []),
  ];

  const missionLinks = [
    { label: 'Sustainability', href: '/about' },
    { label: 'Distributors', href: '/contact' },
  ];

  const socialCards = [
    { label: 'Instagram', action: 'Follow', href: 'https://www.instagram.com' },
    { label: 'TikTok', action: 'Follow', href: 'https://www.tiktok.com' },
    { label: 'Facebook', action: 'Like', href: 'https://www.facebook.com' },
    { label: 'X', action: 'Follow', href: 'https://x.com' },
    { label: 'Snapchat', action: 'Add us', href: 'https://www.snapchat.com' },
    { label: 'LinkedIn', action: 'Follow', href: 'https://www.linkedin.com' },
  ];

  const renderSocialCardIcon = (label: string) => {
    switch (label) {
      case 'Instagram':
        return (
          <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
        );
      case 'TikTok':
        return (
          <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" /></svg>
        );
      case 'Facebook':
        return (
          <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
        );
      case 'X':
        return (
          <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        );
      case 'Snapchat':
        return (
          <svg viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.6-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.031-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" /></svg>
        );
      case 'LinkedIn':
        return (
          <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
        );
      default:
        return <span>{label.charAt(0)}</span>;
    }
  };

  const getDescription = (label: string) => {
    const descriptions: Record<string, string> = {
      Home: 'Back to start',
      Products: 'All flavours and packs',
      Shop: 'Order online',
      About: 'Our story and values',
      Contact: 'Get in touch',
      News: 'Blog and updates',
      MiniGame: 'Ocean cleanup challenge',
      Gallery: 'Photos and moments',
      Sustainability: 'Our impact and pledges',
      Distributors: 'Find us worldwide',
    };

    return descriptions[label] ?? 'Explore more';
  };

  const renderNavLink = (link: NavLink, className: string, onClick?: () => void) => {
    if (isInternalLink(link.href)) {
      return (
        <Link href={link.href} className={className} onClick={onClick}>
          {link.label}
        </Link>
      );
    }

    return (
      <a
        href={link.href}
        className={className}
        onClick={onClick}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {link.label}
      </a>
    );
  };

  const renderMegaMenuLink = (link: NavLink) => {
    return (
      <div key={`${link.label}-${link.href}`} className="navbar-v2-menu-link-row">
        {renderNavLink(link, 'navbar-v2-menu-link', closeMenus)}
        <div className="navbar-v2-menu-link-sub">{getDescription(link.label)}</div>
      </div>
    );
  };

  return (
    <>
      <nav className={`navbar-v2 ${megaMenuOpen ? 'mega-open' : ''} ${isScrolled ? 'navbar-v2-scrolled' : ''}`}>
        <Link href="/" className="navbar-v2-logo-link" onClick={closeMenus}>
          <img
            src="/assets/logo/logoLong.png"
            alt={logoText}
            className="navbar-v2-left-logo"
          />
        </Link>

        <div className="navbar-v2-links">
          {links.filter((link) => link.label !== 'Gallery').map((link, index) => (
            <div key={`${link.label}-${index}`} className="navbar-v2-link-wrapper">
              {renderNavLink(link, 'navbar-v2-link', closeMenus)}
            </div>
          ))}
        </div>

        <div className="navbar-v2-controls">
          {showLanguageSwitch && (
            <button
              className="navbar-v2-control-btn navbar-v2-lang-btn"
              onClick={toggleLanguage}
              title={`Language: ${language}`}
              aria-label={`Toggle language, current ${language}`}
            >
              <FiGlobe className="navbar-v2-control-icon" aria-hidden="true" />
            </button>
          )}

          <button
            className={`navbar-v2-control-btn navbar-v2-menu-trigger ${megaMenuOpen ? 'open' : ''}`}
            onClick={() => setMegaMenuOpen((current) => !current)}
            aria-label="Toggle mega menu"
            aria-expanded={megaMenuOpen}
          >
            {megaMenuOpen ? (
              <FiX className="navbar-v2-control-icon" aria-hidden="true" />
            ) : (
              <FiMenu className="navbar-v2-control-icon" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <div className={`navbar-v2-mega-menu ${megaMenuOpen ? 'open' : ''}`}>
        <div className="navbar-v2-mega-top">
          <button
            className="navbar-v2-mega-close"
            onClick={() => setMegaMenuOpen(false)}
            aria-label="Close mega menu"
          >
            <span className="navbar-v2-menu-trigger-line" />
            <span className="navbar-v2-menu-trigger-line" />
            <span className="navbar-v2-menu-trigger-line" />
          </button>
        </div>

        <div className="navbar-v2-mega-body">
          <div className="navbar-v2-mega-left">
            <div>
              <div className="navbar-v2-mega-brand">
                Pure<em>Norway</em>
                <br />
                Water
              </div>
              <p className="navbar-v2-mega-tagline">
                Glacier-born Norwegian water. Crafted clean. Carried with care.
              </p>
              <div className="navbar-v2-social-row">
                <a className="navbar-v2-social-btn" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a className="navbar-v2-social-btn" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a className="navbar-v2-social-btn" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24"><path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003zM7.119 20.452H3.555V9h3.564v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm15.115 13.019h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" /></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="navbar-v2-mega-center">
            <div className="navbar-v2-mega-cols">
              <div>
                <div className="navbar-v2-mega-group">
                  <div className="navbar-v2-mega-group-label">Explore</div>
                  {exploreLinks.map(renderMegaMenuLink)}
                </div>

                <div className="navbar-v2-mega-group">
                  <div className="navbar-v2-mega-group-label">Company</div>
                  {companyLinks.map(renderMegaMenuLink)}
                </div>
              </div>

              <div>
                <div className="navbar-v2-mega-group">
                  <div className="navbar-v2-mega-group-label">Content</div>
                  {contentLinks.map(renderMegaMenuLink)}
                </div>

                <div className="navbar-v2-mega-group">
                  <div className="navbar-v2-mega-group-label">Mission</div>
                  {missionLinks.map(renderMegaMenuLink)}
                </div>
              </div>
            </div>

            <div className="navbar-v2-menu-social-strip">
              <div className="navbar-v2-mss-label">
                <span>Follow Along</span>
                <span className="navbar-v2-mss-handle">@PURENorwayWaterNO</span>
              </div>

              <div className="navbar-v2-soc-cards">
                {socialCards.map((card) => (
                  <a
                    key={card.label}
                    className="navbar-v2-soc-card"
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={card.label}
                  >
                    <div className="navbar-v2-soc-card-icon">{renderSocialCardIcon(card.label)}</div>
                    <div className="navbar-v2-soc-card-name">{card.label}</div>
                    <div className="navbar-v2-soc-card-action">{card.action}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="navbar-v2-mega-right">
            <div className={`navbar-v2-featured-card ${isFeaturedStoryTransitioning ? 'is-transitioning' : ''}`}>
              <img
                src={featuredStoryImage}
                alt={featuredStoryTitle}
                className="navbar-v2-featured-image"
              />
              <div className="navbar-v2-featured-body">
                <div className="navbar-v2-featured-tag">{featuredStoryCategory}</div>
                <div className="navbar-v2-featured-title">{featuredStoryTitle}</div>
                <Link href="/news" className="navbar-v2-featured-link" onClick={closeMenus}>
                  Read story →
                </Link>
              </div>
            </div>

            {renderNavLink(shopLink, 'navbar-v2-menu-cta', closeMenus)}
          </div>
        </div>

        <div className="navbar-v2-mega-above-bottom-logo">
          <img
            src="/assets/logo/logoWhite.png"
            alt="PureNorway"
            className="navbar-v2-mega-above-bottom-logo-img"
          />
        </div>

        <div className="navbar-v2-mega-bottom">
          <div className="navbar-v2-flag-strip">
            <div className="flag-r" />
            <div className="flag-w" />
            <div className="flag-b" />
            <div className="flag-w" />
            <div className="flag-r" />
          </div>

          <div className="navbar-v2-bottom-links">
            {renderNavLink({ label: 'Privacy Policy', href: '/contact' }, 'navbar-v2-bottom-link', closeMenus)}
            {renderNavLink({ label: 'Terms', href: '/contact' }, 'navbar-v2-bottom-link', closeMenus)}
            {renderNavLink({ label: 'Sustainability', href: '/about' }, 'navbar-v2-bottom-link', closeMenus)}
          </div>

          <span className="navbar-v2-bottom-copy">© 2026 BigWater AS</span>
        </div>
      </div>
    </>
  );
}
