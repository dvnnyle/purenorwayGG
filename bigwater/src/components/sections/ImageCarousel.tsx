"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MdPhotoLibrary } from "react-icons/md";
import { getActiveGallerySlides } from "@/lib/galleryService";
import "./ImageCarousel.css";

interface CarouselSlide {
  image: string;
  eyebrow: string;
  title: string;
}

const FALLBACK_SLIDES: CarouselSlide[] = [
  {
    image: "/assets/images/norgeFjords_extended.jpeg",
    eyebrow: "Ancient Norwegian Source",
    title: "Where nature does\nthe filtering.",
  },
  {
    image: "/assets/images/landscape.jpg",
    eyebrow: "The Fjords of Norway",
    title: "Carved by glaciers,\npreserved for you.",
  },
  {
    image: "/assets/images/hytte1.png",
    eyebrow: "I CARE",
    title: "Pure Norwegian.\nPure You.",
  },
  {
    image: "/assets/images/sandNorway.jpg",
    eyebrow: "Ocean Cleanup Mission",
    title: "1% of turnover to\nprotect our oceans.",
  },
];

const DELAY = 5000;

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<CarouselSlide[]>(FALLBACK_SLIDES);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadSlides = async () => {
      const dbSlides = await getActiveGallerySlides();
      if (dbSlides.length > 0) {
        setSlides(
          dbSlides.map((slide) => ({
            image: slide.imageUrl,
            eyebrow: slide.eyebrow,
            title: slide.title,
          }))
        );
      }
    };

    loadSlides();
  }, []);

  const resetProgress = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = `width ${DELAY}ms linear`;
        bar.style.width = "100%";
      });
    });
  }, []);

  const goTo = useCallback(
    (n: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCurrent((n + slides.length) % slides.length);
      resetProgress();
    },
    [resetProgress, slides.length]
  );

  useEffect(() => {
    if (slides.length === 0) return;
    if (current >= slides.length) {
      setCurrent(0);
      return;
    }
    resetProgress();
    timerRef.current = setTimeout(() => {
      goTo(current + 1);
    }, DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goTo, resetProgress, slides.length]);

  return (
    <div className="img-carousel-wrap">
      <div className="img-carousel">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`img-carousel-slide${i === current ? " active" : ""}`}
          >
            <img src={slide.image} alt={slide.eyebrow} />
            <div className="img-carousel-caption">
              <div className="img-carousel-caption-text">
                <span className="img-carousel-eyebrow">{slide.eyebrow}</span>
                <div className="img-carousel-title">
                  {slide.title.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < slide.title.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Gallery badge */}
        <div className="img-carousel-badge"><MdPhotoLibrary />Gallery</div>

        {/* Dots */}
        <div className="img-carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`img-carousel-dot${i === current ? " active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          className="img-carousel-arrow prev"
          onClick={() => goTo(current - 1)}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
        </button>
        <button
          className="img-carousel-arrow next"
          onClick={() => goTo(current + 1)}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
        </button>

        {/* Progress bar */}
        <div className="img-carousel-progress" ref={barRef} />
      </div>
    </div>
  );
}
