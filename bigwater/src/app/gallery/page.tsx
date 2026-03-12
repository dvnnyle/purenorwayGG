'use client';

import { useState, useCallback, useEffect } from 'react';
import Footer from '@/components/layout/footer';
import { getActiveGallerySlides } from '@/lib/galleryService';
import './gallery.css';

interface GalleryImage {
  src: string;
  alt: string;
  wide?: boolean;
}

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const dbSlides = await getActiveGallerySlides();
        setImages(dbSlides.map((slide, i) => ({
          src: slide.imageUrl,
          alt: slide.title || slide.eyebrow,
          wide: i % 3 === 0,
        })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    setLightbox(i => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightbox(i => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

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

      {/* Grid */}
      <main className="gallery-grid-wrap">
        {loading ? (
          <div className="gallery-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`gallery-skeleton${i % 3 === 0 ? ' wide' : ''}`} />
            ))}
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((img, idx) => (
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
        )}

        {!loading && images.length === 0 && (
          <p className="gallery-empty">No images yet — check back soon.</p>
        )}
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
          <button className="gallery-lb-backdrop" onClick={closeLightbox} aria-label="Close" />

          <div className="gallery-lb-inner">
            <img
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              className="gallery-lb-img"
            />
            <p className="gallery-lb-caption">{images[lightbox].alt}</p>

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
              {lightbox + 1} / {images.length}
            </span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
