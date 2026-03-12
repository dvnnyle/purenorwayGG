"use client";

import { useEffect, useRef, useState } from 'react';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';
import { MdEco, MdRecycling, MdWaterDrop } from 'react-icons/md';
import { MdFullscreen, MdFullscreenExit, MdPause, MdPlayArrow } from 'react-icons/md';
import SectionFourCarousel from '@/components/sections/sectionFourCarousel';
import BlogCarousel from '@/components/sections/blogCarousel';
import ImpactCounter from '@/components/sections/impactCounter';
import Footer from '@/components/layout/footer';
import SectionIndicator from '@/components/ui/SectionIndicator';
import Home2SectionQuote from '@/app/home2/pages/Home2SectionQuote';
import Home2SectionQuoteTwo from '@/app/home2/pages/Home2SectionQuoteTwo';
import Home2SectionNewsletter from '@/app/home2/pages/Home2SectionNewsletter';
import './home.css';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === heroRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      await videoRef.current.play();
      setIsPlaying(true);
      return;
    }

    videoRef.current.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = async () => {
    if (!heroRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await heroRef.current.requestFullscreen();
  };

  return (
    <div className="homepage">
      <div className="content-wrapper">
        {/* Hero Section with Video */}
        <section className="hero-section" id="hero-section" ref={heroRef}>
          <video 
            ref={videoRef}
            className="hero-video"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/assets/videos/brandVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="hero-logo-wrap">
            <img
              src="/assets/logo/logoWhite.png"
              alt="BigWater logo"
              className="hero-logo"
            />
          </div>
          
          <div className="hero-overlay" />

          <div className="hero-controls">
            <button
              type="button"
              className="hero-control-btn"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <MdPause /> : <MdPlayArrow />}
            </button>
            <button
              type="button"
              className="hero-control-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <HiMiniSpeakerXMark /> : <HiMiniSpeakerWave />}
            </button>
            <button
              type="button"
              className="hero-control-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </button>
          </div>
        </section>

        <section className="home-section-four" id="home-section-four">
          <SectionFourCarousel />
        </section>

        <section className="home-section-two" id="home-section-two">
          <div className="home-section-two-inner">
            <h2 className="section-two-title">For Norway. For The Planet.</h2>
            <p className="section-two-copy">
              <strong>PURENorwayFoundation:</strong> Our commitment to sustainability goes beyond pure water.
              We are dedicated to protecting the environment through sustainable practices and meaningful action.
            </p>

            <div className="section-two-cards">
              <article className="section-two-card">
                <div className="section-two-icon icon-recycle">
                  <MdRecycling />
                </div>
                <h3>Aluminium Forever</h3>
                <p>
                  Our water is captured in light aluminium cans that are recyclable and built for repeated circular use.
                </p>
              </article>

              <article className="section-two-card">
                <div className="section-two-icon icon-eco">
                  <MdEco />
                </div>
                <h3>Lower Carbon Focus</h3>
                <p>
                  We continuously optimize operations and logistics to reduce emissions across production and distribution.
                </p>
              </article>

              <article className="section-two-card">
                <div className="section-two-icon icon-water">
                  <MdWaterDrop />
                </div>
                <h3>Ocean Cleanup</h3>
                <p>
                  A portion of turnover supports projects that remove plastic waste from oceans and protect marine ecosystems.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="home-section-three" id="home-section-three">
          <div className="home-section-three-inner">
            <div className="section-three-right">
              <article className="section-three-card">
                <div className="section-three-card-image">
                  <img src="/assets/images/recycle.webp" alt="Metal recycles forever" />
                </div>
                <div className="section-three-card-content">
                  <h3>Metal recycles forever</h3>
                  <p>
                    Aluminium can be recycled infinitely without losing quality. Our cans become new cans.
                  </p>
                </div>
              </article>

              <article className="section-three-card">
                <div className="section-three-card-image">
                  <img src="/assets/images/pledge.webp" alt="1% Pledge" />
                </div>
                <div className="section-three-card-content">
                  <h3>1% Pledge</h3>
                  <p>
                    We pledge 1% of our revenue to environmental initiatives and ocean conservation.
                  </p>
                </div>
              </article>
            </div>

            <div className="section-three-left">
              <div className="section-three-can-wrap">
                <img src="/assets/products/canCrop.png" alt="BigWater Products" className="section-three-can-image" />
              </div>
              <div className="section-three-cta-content">
                <h2>Find Your Perfect Drink</h2>
                <p>Browse our complete selection of refreshing BigWater varieties.</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="/products" className="cta-button">See More</a>
                  <a href="/shop" className="cta-button">Shop Now</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Home2SectionQuote />

        <section className="home-section-impact" id="home-section-impact">
          <ImpactCounter />
        </section>

        <Home2SectionQuoteTwo />

        <section className="home-section-blog" id="home-section-blog">
          <BlogCarousel />
        </section>

        <Home2SectionNewsletter />
      </div>

      <SectionIndicator
        sections={[
          { id: 'hero-section', label: 'Home' },
          { id: 'home-section-four', label: 'Products' },
          { id: 'home-section-two', label: 'Features' },
          { id: 'home-section-three', label: 'Why Choose Us' },
          { id: 'home-section-impact', label: 'Impact' },
          { id: 'home-section-blog', label: 'Blog' },
        ]}
      />

      <Footer />
    </div>
  );
}
