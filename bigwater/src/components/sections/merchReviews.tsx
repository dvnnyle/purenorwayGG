'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getReviewSummary,
  subscribeToApprovedReviews,
  type ReviewEntry,
} from '@/lib/reviewsService';

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (index < rating ? '★' : '☆')).join('');
}

export default function MerchReviews() {
  const [currentMerchIndex, setCurrentMerchIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);

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
  }, [merchImages.length]);

  useEffect(() => {
    const unsubscribe = subscribeToApprovedReviews(setReviews);
    return unsubscribe;
  }, []);

  const summary = useMemo(() => getReviewSummary(reviews), [reviews]);
  const featuredReviews = useMemo(() => reviews.slice(0, 2), [reviews]);

  return (
    <section className="merch-reviews-section">
      <div className="merch-reviews-inner">
        <div className="merch-reviews-header">
          <div className="merch-reviews-eyebrow">From PURENorway</div>
          <h2>More to explore.</h2>
        </div>
        <div className="merch-reviews-grid">
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

          <div className="reviews-card">
            <div className="reviews-content">
              <div className="reviews-eyebrow">What people say</div>
              <h3>Loved across <em>Norway.</em></h3>
              <div className="rating-row">
                <div className="big-score">{summary.averageRating.toFixed(1)}</div>
                <div className="stars-col">
                  <div className="stars">{renderStars(Math.round(summary.averageRating || 0))}</div>
                  <div className="count">Based on {summary.count} live reviews</div>
                </div>
              </div>
              <div className="review-list">
                {featuredReviews.length > 0 ? (
                  featuredReviews.map((review) => (
                    <div className="review" key={review.id}>
                      <div className="review-top">
                        <span className="reviewer">{review.location ? `${review.name}, ${review.location}` : review.name}</span>
                        <span className="rev-stars">{renderStars(review.rating)}</span>
                      </div>
                      <p>"{review.text}"</p>
                    </div>
                  ))
                ) : (
                  <div className="review">
                    <div className="review-top">
                      <span className="reviewer">No live reviews yet</span>
                      <span className="rev-stars">☆☆☆☆☆</span>
                    </div>
                    <p>Approve or add a few reviews in Firestore to populate this card.</p>
                  </div>
                )}
              </div>
              <a href="/reviews" className="btn-reviews">Read all reviews →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
