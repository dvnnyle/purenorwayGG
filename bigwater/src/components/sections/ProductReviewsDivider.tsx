"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatReviewDate,
  getReviewSummary,
  subscribeToApprovedReviews,
  type ReviewEntry,
} from "@/lib/reviewsService";
import "./ProductReviewsDivider.css";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (index < rating ? "\u2605" : "\u2606")).join(" ");
}

export default function ProductReviewsDivider() {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToApprovedReviews(setReviews);
    return unsubscribe;
  }, []);

  const summary = useMemo(() => getReviewSummary(reviews), [reviews]);
  const recentReviews = useMemo(() => reviews.slice(0, 12), [reviews]);
  const topRow = useMemo(() => recentReviews.filter((_, index) => index % 2 === 0), [recentReviews]);
  const bottomRow = useMemo(() => {
    const secondaryRow = recentReviews.filter((_, index) => index % 2 === 1);
    return secondaryRow.length > 0 ? secondaryRow : topRow;
  }, [recentReviews, topRow]);
  const marqueeReviews = [...topRow, ...topRow];
  const reverseMarqueeReviews = [...bottomRow, ...bottomRow];

  const renderReviewCard = (review: ReviewEntry, index: number) => (
    <article className="products-reviews-divider__card" key={`${review.id}-${index}`}>
      <div className="products-reviews-divider__card-top">
        <span className="products-reviews-divider__stars">{renderStars(review.rating)}</span>
        <span className="products-reviews-divider__tag">{review.productTag}</span>
      </div>
      <p className="products-reviews-divider__text">"{review.text}"</p>
      <div className="products-reviews-divider__card-bottom">
        <span>{review.name}</span>
        <span>{formatReviewDate(review.createdAt, "short")}</span>
      </div>
    </article>
  );

  return (
    <section className="products-reviews-divider" aria-label="Customer reviews">
      <div className="products-reviews-divider__header">
        <div>
          <p className="products-reviews-divider__eyebrow">Customer Reviews</p>
          <h2>
            People love <em>Pure Norway Water.</em>
          </h2>
        </div>
        <div className="products-reviews-divider__overall" aria-label={`Overall rating ${summary.averageRating.toFixed(1)} out of 5`}>
          <div className="products-reviews-divider__score">{summary.averageRating.toFixed(1)}</div>
          <div>
            <p className="products-reviews-divider__score-stars">{renderStars(Math.round(summary.averageRating || 0))}</p>
            <p className="products-reviews-divider__score-count">
              {summary.count} verified review{summary.count === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="products-reviews-divider__marquee-wrap">
            <div className="products-reviews-divider__marquee-track">
              {marqueeReviews.map((review, index) => renderReviewCard(review, index))}
            </div>
          </div>

          <div className="products-reviews-divider__marquee-wrap">
            <div className="products-reviews-divider__marquee-track products-reviews-divider__marquee-track--reverse">
              {reverseMarqueeReviews.map((review, index) => renderReviewCard(review, index))}
            </div>
          </div>
        </>
      ) : (
        <div className="products-reviews-divider__empty">No approved reviews are live yet.</div>
      )}

      <div className="products-reviews-divider__cta-row">
        <a href="/reviews" className="products-reviews-divider__cta-link">
          Read all reviews {"->"}
        </a>
      </div>
    </section>
  );
}
