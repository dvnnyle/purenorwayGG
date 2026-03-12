'use client';

import { useState, useCallback, useEffect } from 'react';
import Footer from '@/components/layout/footer';
import './gallery.css';

type Category = 'all' | 'marketing' | 'products' | 'merch' | 'foundation';

interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<Category, 'all'>;
  wide?: boolean;
}

const IMAGES: GalleryImage[] = [
  // Marketing
  { src: '/assets/marketingImages/480355058_645489551399318_5956170283212886069_n.jpg', alt: 'PureNorway campaign', category: 'marketing' },
  { src: '/assets/marketingImages/480684199_645499148065025_783341880443364320_n.jpg', alt: 'PureNorway in the wild', category: 'marketing' },
  { src: '/assets/marketingImages/481076577_655304993751107_943639513295113178_n.jpg', alt: 'PureNorway lifestyle', category: 'marketing', wide: true },
  { src: '/assets/marketingImages/482252396_661215976493342_7185203534355696016_n.jpg', alt: 'PureNorway outdoor', category: 'marketing' },
  { src: '/assets/marketingImages/483891154_661067723174834_4915885403000392341_n.jpg', alt: 'PureNorway event', category: 'marketing' },
  { src: '/assets/marketingImages/628093292_18041090354725352_5108711518455682625_n.jpg', alt: 'PureNorway feature', category: 'marketing' },
  { src: '/assets/marketingImages/marketingProd/case.webp', alt: 'Product case', category: 'marketing', wide: true },
  { src: '/assets/marketingImages/marketingProd/foodDrink.webp', alt: 'Food and drink pairing', category: 'marketing' },
  { src: '/assets/marketingImages/marketingProd/peopleFour.jpeg', alt: 'People enjoying PureNorway', category: 'marketing', wide: true },
  { src: '/assets/marketingImages/marketingProd/smurfLineup.webp', alt: 'Smurf can lineup', category: 'marketing' },
  // Products – Water Range
  { src: '/assets/waterCans/Sparkling.jpeg', alt: 'Sparkling Water', category: 'products' },
  { src: '/assets/waterCans/Still.jpeg', alt: 'Still Water', category: 'products' },
  { src: '/assets/waterCans/Sparkling_Ginger_Lemon.jpeg', alt: 'Sparkling Ginger Lemon', category: 'products' },
  { src: '/assets/waterCans/Sparkling_Watermelon.jpeg', alt: 'Sparkling Watermelon', category: 'products' },
  { src: '/assets/waterCans/Sparkling_Green_Tea_Peach.jpeg', alt: 'Sparkling Green Tea Peach', category: 'products', wide: true },
  { src: '/assets/waterCans/Smurfene_Still.jpeg', alt: 'Smurfene Still', category: 'products' },
  { src: '/assets/waterCans/Smurfene_Sparkling_Apple_Pear.jpeg', alt: 'Smurfene Apple Pear', category: 'products' },
  { src: '/assets/waterCans/Smurfene_Sparkling_Ginger_Lemon.jpeg', alt: 'Smurfene Ginger Lemon', category: 'products' },
  { src: '/assets/waterCans/Smurfene_Sparkling_Strawberry_Raspberry.jpeg', alt: 'Smurfene Strawberry Raspberry', category: 'products', wide: true },
  // Merch
  { src: '/assets/merch/backpack16_9.jpeg', alt: 'PureNorway backpack', category: 'merch', wide: true },
  { src: '/assets/merch/bottle16_9.jpeg', alt: 'PureNorway bottle', category: 'merch', wide: true },
  { src: '/assets/merch/foodBox16_9.jpeg', alt: 'PureNorway food box', category: 'merch', wide: true },
  { src: '/assets/merch/backpack.jpeg', alt: 'Backpack close-up', category: 'merch' },
  { src: '/assets/merch/bottle.jpeg', alt: 'Bottle close-up', category: 'merch' },
  { src: '/assets/merch/foodBox.jpeg', alt: 'Food box close-up', category: 'merch' },
  // Foundation
  { src: '/assets/empower/empower1.png', alt: 'Foundation impact', category: 'foundation', wide: true },
  { src: '/assets/empower/empower2.png', alt: 'Foundation mission', category: 'foundation', wide: true },
  { src: '/assets/empower/empower3.png', alt: 'Foundation projects', category: 'foundation', wide: true },
];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'marketing', label: 'Campaign' },
  { key: 'products', label: 'Water Range' },
  { key: 'merch', label: 'Merch' },
  { key: 'foundation', label: 'Foundation' },
];

export default function GalleryPage() {
  const [active, setActive] = useState<Category>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === 'all' ? IMAGES : IMAGES.filter(img => img.category === active);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    setLightbox(i => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightbox(i => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, closeLightbox, prev, next]);

  return (
    <div className="gallery-page">
      {/* Hero */}
      <section className="gallery-hero">
        <div className="gallery-hero-bg" aria-hidden="true" />
        <div className="gallery-hero-content">
          <p className="gallery-hero-kicker">Visual stories</p>
          <h1>Gallery</h1>
          <p className="gallery-hero-sub">
            Campaigns, product shots, merch and foundation moments — everything PureNorway.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="gallery-filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`gallery-filter-btn${active === cat.key ? ' active' : ''}`}
            onClick={() => setActive(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="gallery-grid-wrap">
        <div className="gallery-grid">
          {filtered.map((img, idx) => (
            <button
              key={img.src}
              className={`gallery-item${img.wide ? ' wide' : ''}`}
              onClick={() => setLightbox(idx)}
              aria-label={`View — ${img.alt}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="gallery-item-overlay">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-zoom-icon">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <span className="gallery-item-label">{img.alt}</span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="gallery-empty">No images in this category yet.</p>
        )}
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
          <button className="gallery-lb-backdrop" onClick={closeLightbox} aria-label="Close" />

          <div className="gallery-lb-inner">
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              className="gallery-lb-img"
            />
            <p className="gallery-lb-caption">{filtered[lightbox].alt}</p>

            <button className="gallery-lb-close" onClick={closeLightbox} aria-label="Close">
              ✕
            </button>

            <button className="gallery-lb-nav prev" onClick={prev} aria-label="Previous image">
              ‹
            </button>
            <button className="gallery-lb-nav next" onClick={next} aria-label="Next image">
              ›
            </button>

            <span className="gallery-lb-counter">
              {lightbox + 1} / {filtered.length}
            </span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
