"use client";

import { useEffect, useRef, useState } from 'react';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';
import { MdCo2, MdFullscreen, MdFullscreenExit, MdPause, MdPlayArrow, MdRecycling, MdWaterDrop } from 'react-icons/md';
import SectionFourCarousel from '@/components/sections/sectionFourCarousel';
import BlogCarousel from '@/components/sections/blogCarousel';
import MerchReviews from '@/components/sections/merchReviews';
import SloganDivider from '@/components/sections/SloganDivider';
import Footer from '@/components/layout/footer';
import SectionIndicator from '@/components/ui/SectionIndicator';
import Home2SectionQuoteTwo from '@/app/home2/pages/Home2SectionQuoteTwo';
import Home2SectionNewsletter from '@/app/home2/pages/Home2SectionNewsletter';
import ImpactCounter from '@/components/sections/impactCounter';
import ImageCarousel from '@/components/sections/ImageCarousel';
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

        <section className="home-section-two impact-combined-section" id="home-section-two">
          <div className="impact-combined-inner">
            <div className="impact-combined-divider" aria-hidden="true">
              <span className="seg red" style={{ flex: 3 }} />
              <span className="seg white" />
              <span className="seg blue" style={{ flex: 1 }} />
              <span className="seg white" />
              <span className="seg red" style={{ flex: 3 }} />
            </div>

            <div className="impact-combined-header">
              <h2>For Norway. For The Planet.</h2>
              <p>
                <strong>PURENorwayFoundation:</strong> Our commitment to sustainability goes beyond pure water. We are dedicated to protecting the environment through sustainable practices and meaningful action.
              </p>
            </div>

            <div className="combined-cards">
              <div className="combined-card">
                <div className="combined-card-icon" aria-hidden="true">
                  <MdRecycling />
                </div>
                <h3>Aluminium Forever</h3>
                <p>Our water is captured in light aluminium cans that are recyclable and built for repeated circular use.</p>
              </div>

              <div className="combined-card">
                <div className="combined-card-icon" aria-hidden="true">
                  <MdCo2 />
                </div>
                <h3>Lower Carbon Focus</h3>
                <p>We continuously optimize operations and logistics to reduce emissions across production and distribution.</p>
              </div>

              <div className="combined-card">
                <div className="combined-card-icon" aria-hidden="true">
                  <MdWaterDrop />
                </div>
                <h3>Ocean Cleanup</h3>
                <p>A portion of turnover supports projects that remove plastic waste from oceans and protect marine ecosystems.</p>
              </div>
            </div>

            <div className="combined-cta-row">
              <div className="combined-cta-card combined-cta-card-left">
                <div className="combined-b-row">
                  <div className="combined-row-icon" aria-hidden="true">
                    <img src="/assets/images/recycle.webp" alt="" />
                  </div>
                  <div className="combined-row-body">
                    <h4>Metal recycles forever</h4>
                    <p>Aluminium can be recycled infinitely without losing quality. Our cans become new cans.</p>
                  </div>
                </div>

                <div className="combined-b-row">
                  <div className="combined-row-icon" aria-hidden="true">
                    <img src="/assets/images/pledge.webp" alt="" />
                  </div>
                  <div className="combined-row-body">
                    <h4>1% Pledge</h4>
                    <p>We pledge 1% of our revenue to environmental initiatives and ocean conservation.</p>
                  </div>
                </div>
              </div>

              <div className="combined-cta-card combined-cta-card-right">
                <div className="combined-can-img">
                  <img src="/assets/products/canCrop.png" alt="BigWater can" />
                </div>
                <div className="combined-cta-text">
                  <h3>Find Your Perfect Drink</h3>
                  <p>Browse our complete selection of refreshing BigWater varieties.</p>
                  <div className="combined-btns">
                    <a href="/products" className="combined-btn combined-btn-outline">See More</a>
                    <a href="/shop" className="combined-btn combined-btn-fill">Shop Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SloganDivider />

        <div style={{ height: "48px" }} />

        <ImageCarousel />

        <section className="home-section-impact" id="home-section-impact">
          <ImpactCounter />
        </section>

        <section className="merch-reviews-section" id="home-section-merch">
          <MerchReviews />
        </section>

        <div id="home-section-quote">
          <Home2SectionQuoteTwo />
        </div>

        <section className="home-section-blog" id="home-section-blog">
          <BlogCarousel />
        </section>

        <div id="home-section-newsletter">
          <Home2SectionNewsletter />
        </div>
      </div>

      <SectionIndicator
        sections={[
          { id: 'hero-section', label: 'Home' },
          { id: 'home-section-four', label: 'Products' },
          { id: 'home-section-two', label: 'Mission' },
          { id: 'home-section-impact', label: 'Stats' },
          { id: 'home-section-merch', label: 'Merch' },
          { id: 'home-section-quote', label: 'Quote' },
          { id: 'home-section-blog', label: 'Blog' },
          { id: 'home-section-newsletter', label: 'News' },
        ]}
      />

      <Footer />
    </div>
  );
}
