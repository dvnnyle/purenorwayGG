'use client';

import { useState, useEffect } from 'react';

export default function MerchReviews() {
  const [currentMerchIndex, setCurrentMerchIndex] = useState(0);
  
  const merchImages = [
    '/assets/merch/backpack16_9.jpeg',
    '/assets/merch/bottle16_9.jpeg',
    '/assets/merch/foodBox16_9.jpeg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMerchIndex((prev) => (prev + 1) % merchImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="merch-reviews-section">
      <div className="merch-reviews-inner">
        <div className="merch-reviews-header">
          <div className="merch-reviews-eyebrow">From PURENorway</div>
          <h2>More to explore.</h2>
        </div>
        <div className="merch-reviews-grid">
          {/* MERCH CARD */}
          <div className="merch-card">
            <div className="merch-overlay"></div>
            <div className="merch-carousel">
              {merchImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`PURENorway Merch ${index + 1}`}
                  className={`merch-image ${index === currentMerchIndex ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="merch-content">
              <div className="merch-eyebrow">PURENorway Store</div>
              <h3>Wear the <em>mission.</em></h3>
              <p>Every piece of merch sold supports our ocean cleanup pledge. Look good, do good.</p>
              <button className="btn-merch">Shop merch →</button>
            </div>
          </div>

          {/* REVIEWS CARD change to dynamically based on actual data */}
          <div className="reviews-card">
            <div className="reviews-content">
              <div className="reviews-eyebrow">What people say</div>
              <h3>Loved across <em>Norway.</em></h3>
              <div className="rating-row">
                <div className="big-score">4.9</div>
                <div className="stars-col">
                  <div className="stars">★★★★★</div>
                  <div className="count">Based on 240+ reviews</div>
                </div>
              </div>
              <div className="review-list">
                <div className="review">
                  <div className="review-top">
                    <span className="reviewer">Naruto, Konoha</span>
                    <span className="rev-stars">★★★★★</span>
                  </div>
                  <p>"Best sparkling water I've had. Crisp, clean — and I love knowing the can is endlessly recyclable. - Naruto, Hokage"</p>
                </div>
                <div className="review">
                  <div className="review-top">
                    <span className="reviewer">Itadori Yuji, Japan</span>
                    <span className="rev-stars">★★★★★</span>
                  </div>
                  <p>"The Ginger Lemon flavour is incredible. Switched from plastic bottles and never looking back."</p>
                </div>
              </div>
              <button className="btn-reviews">Read all reviews →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
