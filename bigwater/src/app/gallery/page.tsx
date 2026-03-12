'use client';

import { useState, useCallback, useEffect } from 'react';
import Footer from '@/components/layout/footer';
import { getGalleryPageSlides } from '@/lib/galleryService';
import { FaInstagram, FaTiktok, FaFacebookF, FaXTwitter, FaLinkedinIn, FaSnapchat } from 'react-icons/fa6';
import { MdWaterDrop } from 'react-icons/md';
import './gallery.css';

interface GalleryImage {
  src: string;
  alt: string;
}

const INITIAL_VISIBLE = 20;
const LOAD_STEP = 12;

function preloadImages(urls: string[]) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  );
}

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const dbSlides = await getGalleryPageSlides();
        const mappedImages = dbSlides.map((slide) => ({
          src: slide.imageUrl,
          alt: slide.title || slide.eyebrow,
        }));

        if (cancelled) return;

        setImages(mappedImages);

        const firstBatch = mappedImages.slice(0, INITIAL_VISIBLE).map((img) => img.src);
        if (firstBatch.length > 0) {
          await preloadImages(firstBatch);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [images.length]);

  const visibleImages = images.slice(0, visibleCount);
  const hasMoreImages = images.length > visibleCount;

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    setLightbox(i => (i === null ? null : (i - 1 + visibleImages.length) % visibleImages.length));
  }, [visibleImages.length]);

  const next = useCallback(() => {
    setLightbox(i => (i === null ? null : (i + 1) % visibleImages.length));
  }, [visibleImages.length]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + LOAD_STEP, images.length));
  };

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
        <div className="gallery-grid-header">
          <div className="gallery-grid-header-text">
            <div className="gallery-grid-kicker">PURENORWAY GALLERY</div>
            <h2>
              Through <span className="gallery-grid-highlight">our lens.</span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="gallery-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`gallery-skeleton${i % 3 === 0 ? ' wide' : ''}`} />
            ))}
          </div>
        ) : (
          <div className="gallery-grid">
            {visibleImages.map((img, idx) => (
              <button
                key={img.src}
                className="gallery-item"
                onClick={() => setLightbox(idx)}
                aria-label={`View — ${img.alt}`}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-item-overlay">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="gallery-zoom-icon">
                    <path d="M14 3h7v7h-2V6.41l-5.29 5.3-1.42-1.42L17.59 5H14V3zm-4 18H3v-7h2v3.59l5.29-5.3 1.42 1.42L6.41 19H10v2z" />
                  </svg>
                  <span className="gallery-item-label">{img.alt}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && hasMoreImages && (
          <div className="gallery-load-more">
            <button type="button" className="gallery-load-btn" onClick={handleLoadMore}>
              Load more
            </button>
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
              src={visibleImages[lightbox].src}
              alt={visibleImages[lightbox].alt}
              className="gallery-lb-img"
            />
            <p className="gallery-lb-caption">{visibleImages[lightbox].alt}</p>

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
              {lightbox + 1} / {visibleImages.length}
            </span>
          </div>
        </div>
      )}

      <section className="social-banner-v2">
        <div className="social-banner-inner">
          <div className="social-banner-top">
            <div>
              <div className="social-banner-eyebrow">FOLLOW ALONG</div>
              <h2>
                We&apos;re on all<br />
                <em>the good ones.</em>
              </h2>
            </div>
            <a
              href="https://www.instagram.com/purenorwaywaterno/"
              target="_blank"
              rel="noreferrer"
              className="social-handle-pill"
            >
              <div className="social-handle-avatar" aria-hidden="true">
                <MdWaterDrop />
              </div>
              <div className="social-handle-text">
                <span className="social-handle-label">Our handle</span>
                <span className="social-handle-name">
                  <span>@</span>PURENorwayWaterNO
                </span>
              </div>
            </a>
          </div>

          <div className="social-platforms-grid">
            <a
              href="https://www.instagram.com/purenorwaywaterno/"
              target="_blank"
              rel="noreferrer"
              className="platform-card instagram"
            >
              <div className="platform-icon">
                <FaInstagram />
              </div>
              <div className="platform-info">
                <div className="platform-name">Instagram</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>

            <a
              href="https://www.tiktok.com/@purenorwaywaterno"
              target="_blank"
              rel="noreferrer"
              className="platform-card tiktok"
            >
              <div className="platform-icon">
                <FaTiktok />
              </div>
              <div className="platform-info">
                <div className="platform-name">TikTok</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>

            <a
              href="https://www.facebook.com/PureNorwayWaterNO/"
              target="_blank"
              rel="noreferrer"
              className="platform-card facebook"
            >
              <div className="platform-icon">
                <FaFacebookF />
              </div>
              <div className="platform-info">
                <div className="platform-name">Facebook</div>
                <div className="platform-action">Like</div>
              </div>
            </a>

            <a
              href="https://x.com/PureNorwayNO"
              target="_blank"
              rel="noreferrer"
              className="platform-card x"
            >
              <div className="platform-icon">
                <FaXTwitter />
              </div>
              <div className="platform-info">
                <div className="platform-name">X</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>

            <a
              href="https://www.snapchat.com/add/Purenorwaywater"
              target="_blank"
              rel="noreferrer"
              className="platform-card snapchat"
            >
              <div className="platform-icon">
                <FaSnapchat />
              </div>
              <div className="platform-info">
                <div className="platform-name">Snapchat</div>
                <div className="platform-action">Add us</div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/company/purenorwayno"
              target="_blank"
              rel="noreferrer"
              className="platform-card linkedin"
            >
              <div className="platform-icon">
                <FaLinkedinIn />
              </div>
              <div className="platform-info">
                <div className="platform-name">LinkedIn</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>
          </div>

          <div className="social-banner-bottom">
            <p>
              Tag us in your posts - <strong>#PureNorwayWater</strong> &amp; <strong>#PureNorway</strong>
            </p>
            <div className="social-hashtags">
              <span className="hashtag-tag">#PureNorwayWater</span>
              <span className="hashtag-tag">#PureNorway</span>
              <span className="hashtag-tag">#PureWater</span>
              <span className="hashtag-tag">#PureNorwayWaterNO</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
