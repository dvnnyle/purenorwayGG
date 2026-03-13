'use client';

import React, { useState } from 'react';
import { MdRecycling, MdAcUnit, MdWaterDrop, MdBolt, MdEco } from 'react-icons/md';
import Footer from '@/components/layout/footer';
import Home2SectionNewsletter from '@/app/home2/pages/Home2SectionNewsletter';
import './about.css';

export default function About() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const foundationImages = [
    { src: "/assets/empower/empower1.png", alt: "Foundation Impact" },
    { src: "/assets/empower/empower2.png", alt: "Foundation Mission" },
    { src: "/assets/empower/empower3.png", alt: "Foundation Projects" }
  ];


  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + foundationImages.length) % foundationImages.length);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % foundationImages.length);
    }
  };

  return (
    <div className="about-page">
      <section className="about-hero-top">
        <div className="about-hero-content">
          <div className="about-hero-kicker">ABOUT PURENORWAY</div>
          <h1>
            Built on care, <span className="about-hero-highlight">from source to sip.</span>
          </h1>
          <p className="about-hero-tagline">We combine Norwegian purity with responsible packaging and ocean-positive action.</p>
        </div>
      </section>

      <section className="about-hero">
        <div className="about-hero-inner">
          {/* IMAGE SIDE */}
          <div className="about-hero-visual">
            <div className="about-hero-img">
              <div className="about-hero-photo-credit" aria-label="Photo credit: Cabin in the woods by Lachlan Gowen">
                <span className="about-hero-photo-credit-label">Photo: Lachlan Gowen</span>
                <div className="about-hero-photo-credit-card">
                  <img
                    src="/assets/images/sandNorway.jpg"
                    alt="Cabin in the woods by Lachlan Gowen"
                    className="about-hero-photo-credit-image"
                  />
                  <div className="about-hero-photo-credit-copy">
                    <strong>Cabin in the woods</strong>
                    <span>Lachlan Gowen</span>
                  </div>
                </div>
              </div>
              <img
                src="/assets/images/sandNorway.jpg"
                alt="Norwegian nature"
              />
            </div>
            <div className="stat-card">
              <div className="stat-item">
                <div className="val">1%</div>
                <div className="lbl">Turnover to<br />ocean cleanup</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="val">0%</div>
                <div className="lbl">Plastic in<br />our packaging</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="val">∞</div>
                <div className="lbl">Recyclable<br />aluminum</div>
              </div>
            </div>
          </div>

          {/* TEXT SIDE */}
          <div className="about-hero-text">
            <div className="eyebrow">About Us</div>
            <h1>Living in harmony<br />with <em>nature.</em></h1>

            <p>The Norwegians have a strong tradition of taking care and living in harmony with nature. The resources that were given to the nation are carefully being preserved for future generations.</p>

            <div className="icare-block">
              <div className="icare-badge">
                <MdWaterDrop />
              </div>
              <div className="icare-text">
                <div className="label">Our Slogan</div>
                <div className="slogan">Sustainability matters - <em> I CARE</em></div>
              </div>
            </div>

            <p>Join our movement towards a sustainable future, and help us save the sea from plastic pollution. 1% of the turnover is donated to clean the ocean from plastic pollution, because we care. By interacting with our brand, you will be part of this movement. Come join us…</p>
          </div>
        </div>
      </section>

        {/* Sustainability Section */}
        <section className="about-sustainability-section">
          <div className="sustainability-inner">
            <div className="sustainability-header">
              <div className="sustainability-header-text">
                <div className="sustainability-kicker">Sustainability</div>
                <h2>Good for you.<br /><em>Better for the planet.</em></h2>
              </div>
              <p>1% of every sale goes directly to cleaning plastic from the world's oceans. Zero carbon footprint. Zero plastic packaging.</p>
            </div>

            <div className="sustainability-cards">
              <div className="sustainability-card">
                <div className="sustainability-card-icon">
                  <MdRecycling />
                </div>
                <h3 className="sustainability-card-title">Infinitely recyclable</h3>
                <p className="sustainability-card-text">
                  Aluminum can be recycled endlessly without losing quality. Every can you recycle becomes a new one.
                </p>
              </div>

              <div className="sustainability-card">
                <div className="sustainability-card-icon">
                  <MdBolt />
                </div>
                <h3 className="sustainability-card-title">Zero carbon footprint</h3>
                <p className="sustainability-card-text">
                  Our entire production and distribution chain runs on renewable Norwegian hydroelectric energy.
                </p>
              </div>

              <div className="sustainability-card">
                <div className="sustainability-card-icon">
                  <MdWaterDrop />
                </div>
                <h3 className="sustainability-card-title">0% plastic packaging</h3>
                <p className="sustainability-card-text">
                  No plastic. No leeching. Pure Norwegian water sealed in aluminum — just as nature intended.
                </p>
              </div>

              <div className="sustainability-card">
                <div className="sustainability-card-icon">
                  <MdEco />
                </div>
                <h3 className="sustainability-card-title">1% to ocean cleanup</h3>
                <p className="sustainability-card-text">
                  Through the Pure Norway Foundation, 1% of all turnover funds projects removing plastic from the world's oceans.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="our-cans-section">
          <div className="our-cans-inner">
            <div className="our-cans-kicker">Our Packaging</div>
            <h2 className="our-cans-title">
              We care.<br />Our water, <em>our cans.</em>
            </h2>
            <p className="our-cans-intro">
              PURENorway is a Nordic and innovative brand inspired by Norwegian nature and made for people with an active lifestyle. We care about nature and we care about people. Because of this, we have defined criteria that are important to us.
            </p>

            <div className="our-cans-content">
              <div className="our-cans-perks">
                <div className="our-cans-perk">
                  <div className="our-cans-perk-icon">
                    <MdRecycling />
                  </div>
                  <div className="our-cans-perk-body">
                    <h3>Infinitely Recyclable</h3>
                    <p>Aluminum is infinitely recyclable without losing quality or purity.</p>
                  </div>
                </div>

                <div className="our-cans-perk">
                  <div className="our-cans-perk-icon">
                    <MdAcUnit />
                  </div>
                  <div className="our-cans-perk-body">
                    <h3>Keeps Water Cool</h3>
                    <p>Keeps water cool for a longer period, perfect for any adventure.</p>
                  </div>
                </div>

                <div className="our-cans-perk">
                  <div className="our-cans-perk-icon">
                    <MdWaterDrop />
                  </div>
                  <div className="our-cans-perk-body">
                    <h3>Pure and Clean</h3>
                    <p>No plastic leeching, as though you are drinking straight from the source.</p>
                  </div>
                </div>
              </div>

              <div className="our-cans-image-wrap">
                <img className="our-cans-image" src="/assets/images/wateflow.jpeg" alt="PURENorway can" />
              </div>
            </div>
          </div>
        </section>

        <section className="about-section-aluminum">
          <div className="about-content-aluminum">
            <div className="eyebrow">Is Aluminum Better Than Plastic?</div>
            <h2>The responsible <em>choice.</em></h2>

            <p>
              At Pure Norway Water, we believe the future of water should be as clean as the source it comes from. That's why we offer both still and carbonated water in aluminum canned bottles — a conscious choice designed to protect both quality and the environment.
            </p>

            <p>
              Aluminum is infinitely recyclable. It can be reused again and again without losing strength or purity. Unlike plastic, which degrades each time it's recycled, aluminum retains its integrity forever. In fact, the majority of aluminum ever produced is still in circulation today. That's the kind of material the planet deserves.
            </p>

            <div className="bold-line">But sustainability is only part of the story.</div>

            <p>
              Aluminum naturally keeps water cooler for longer, preserving the crisp, refreshing taste. And with no plastic involved, there's no risk of leeching — just clean, untouched water, as if you're drinking straight from the source.
            </p>

            <p>
              For our carbonated water, aluminum is the perfect protector. It holds pressure efficiently, keeping every bubble intact without requiring heavy plastic packaging. The result is pure refreshment with a lighter environmental footprint.
            </p>

            <p>
              We didn't choose the easiest route. We chose the responsible one. Pure water. Protected properly. Still or sparkling.
            </p>

            <div className="sig">— <em>PURENorway</em> Water</div>
          </div>
        </section>

        <section className="about-section-foundation">
          <div className="about-content">
            <div className="contribution-eyebrow">Supporting Our Mission</div>
            <h2 className="contribution-heading">PURENorway Foundation</h2>
            <div className="foundation-content">
              <div className="foundation-text">
                <p>
                  By donating 1% of the turnover, PURENorwayFoundation will donate funds directly to projects and organisations that are following our mission of protecting the planet and preserving it for future generations.
                </p>
              </div>
              <div className="foundation-images">
                <img 
                  src="/assets/empower/empower1.png" 
                  alt="Foundation Impact" 
                  onClick={() => setSelectedImageIndex(0)}
                  style={{ cursor: 'pointer' }}
                />
                <img 
                  src="/assets/empower/empower2.png" 
                  alt="Foundation Mission" 
                  onClick={() => setSelectedImageIndex(1)}
                  style={{ cursor: 'pointer' }}
                />
                <img 
                  src="/assets/empower/empower3.png" 
                  alt="Foundation Projects" 
                  onClick={() => setSelectedImageIndex(2)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="about-section-sustainability-goals">
          <div className="about-content contribution-content">
            <div className="contribution-eyebrow">UN Sustainable Development Goals</div>
            <h2 className="contribution-heading">Our contribution to<br />a better world.</h2>
            <p className="contribution-intro">
              We believe we all have the responsibility to protect the planet for the next generation. Pure Norway wants to do our part by continuously working towards the Sustainable Development Goals (SDGs) defined by the United Nations in order to achieve a better and more sustainable planet within 2030. As a producer of consumer goods, Pure Norway impacts the SDGs that are related to business practices and production. We are committed to contributing to the change of a better world.
            </p>

            <div className="sdg-goals-grid">
              <div className="sdg-card">
                <div className="sdg-image">
                  <img src="/assets/weCare/12responsible.png" alt="SDG 12" />
                </div>
                <div className="sdg-content">
                  <h3>12 Responsible Consumption and Production</h3>
                  <p>
                    Our focus is to make sure of responsible production and consumption of our products. Our factories are carefully selected to ensure a sustainable production process. Ongoing communication together with audits and status reports make it possible to adjust procedures and materials used in production to achieve less harmful commissions and more environment friendly materials.
                  </p>
                  <p>
                    We also focus on using environment friendly and recycled materials in our products in order to prevent unnecessary waste and nature harm. By replacing plastic with more environment friendly materials such as bamboo, organic cotton and leather, the products will live longer and lead to less plastic waste.
                  </p>
                </div>
              </div>

              <div className="sdg-card">
                <div className="sdg-image">
                  <img src="/assets/weCare/14life.png" alt="SDG 14" />
                </div>
                <div className="sdg-content">
                  <h3>14 Life Below Water</h3>
                  <p>
                    Pure Norway care about nature, especially pure and clean waters and for the life in it. The world's oceans are the source of life and make all organisms develop. Pollutions and plastic waste are vital threats to the oceans marine life and its drive to global systems, and need to be protected.
                  </p>
                  <p>
                    We will try to reach this goal by funding Pure Norway Foundation. A percentage of the income of Pure Norway products goes to Pure Norway Foundation that works to clean the coastline of Norway.
                  </p>
                </div>
              </div>

              <div className="sdg-card">
                <div className="sdg-image">
                  <img src="/assets/weCare/16peace.png" alt="SDG 16" />
                </div>
                <div className="sdg-content">
                  <h3>16 Peace, Justice and Strong Institutions</h3>
                  <p>
                    It is important for us that everyone that are connected to our products are treated with respect and dignity, including fabric workers as well as administrative staff. Pure Norway have standards to ensure ethical working conditions such as health and safety, deviation from child labor, involuntary labor, coercion, harassment and discrimination.
                  </p>
                  <p>
                    We also focus on using environment friendly and recycled materials in our products in order to prevent unnecessary waste and nature harm. By replacing plastic with more environment friendly materials such as bamboo, organic cotton and leather, the products will live longer and lead to less plastic waste.
                  </p>
                </div>
              </div>
            </div>
          </div>
      </section>

      <Home2SectionNewsletter />

      {selectedImageIndex !== null && (
        <div className="image-modal" onClick={() => setSelectedImageIndex(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={foundationImages[selectedImageIndex].src} alt={foundationImages[selectedImageIndex].alt} />
            <div className="modal-controls">
              <button className="modal-nav modal-prev" onClick={handlePrevious}>‹</button>
              <div className="modal-counter">
                {selectedImageIndex + 1} / {foundationImages.length}
              </div>
              <button className="modal-nav modal-next" onClick={handleNext}>›</button>
              <button className="modal-close" onClick={() => setSelectedImageIndex(null)}>×</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
