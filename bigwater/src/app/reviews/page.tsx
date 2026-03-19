"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { MdCheckCircle, MdError, MdInfo, MdSend } from "react-icons/md";
import {
  formatReviewDate,
  getReviewAvatarColor,
  getReviewInitials,
  getReviewSummary,
  getReviewTimeOrder,
  submitReview,
  subscribeToApprovedReviews,
  type ReviewEntry,
} from "@/lib/reviewsService";
import ReviewsHero from "@/components/sections/ReviewsHero";
import Footer from "@/components/layout/footer";
import "./reviews.css";

type FilterType = "all" | "5" | "4" | "arctic-lime" | "sparkling";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? "" : "is-empty"}>
      {"\u2605"}
    </span>
  ));
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortMode, setSortMode] = useState("recent");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    productTag: "Still",
    text: "",
  });
  const [submitState, setSubmitState] = useState<{
    type: "idle" | "info" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToApprovedReviews(
      (nextReviews) => {
        setReviews(nextReviews);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (submitState.type === "idle") return;
    const timer = window.setTimeout(() => {
      setSubmitState({ type: "idle", message: "" });
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [submitState]);

  const summary = useMemo(() => getReviewSummary(reviews), [reviews]);
  const marqueeSource = useMemo(() => reviews.slice(0, 12), [reviews]);
  const marqueeRowA = useMemo(() => marqueeSource.filter((_, index) => index % 2 === 0), [marqueeSource]);
  const marqueeRowB = useMemo(() => {
    const secondaryRow = marqueeSource.filter((_, index) => index % 2 === 1);
    return secondaryRow.length > 0 ? secondaryRow : marqueeRowA;
  }, [marqueeRowA, marqueeSource]);

  const filteredReviews = useMemo(() => {
    let nextReviews = [...reviews];

    if (activeFilter === "5") nextReviews = nextReviews.filter((review) => review.rating === 5);
    if (activeFilter === "4") nextReviews = nextReviews.filter((review) => review.rating === 4);
    if (activeFilter === "arctic-lime") nextReviews = nextReviews.filter((review) => review.productTag === "Arctic Lime");
    if (activeFilter === "sparkling") nextReviews = nextReviews.filter((review) => review.productTag === "Sparkling");

    if (sortMode === "high") {
      nextReviews.sort((a, b) => b.rating - a.rating || getReviewTimeOrder(b.createdAt) - getReviewTimeOrder(a.createdAt));
    }
    if (sortMode === "low") {
      nextReviews.sort((a, b) => a.rating - b.rating || getReviewTimeOrder(b.createdAt) - getReviewTimeOrder(a.createdAt));
    }
    if (sortMode === "recent") {
      nextReviews.sort((a, b) => getReviewTimeOrder(b.createdAt) - getReviewTimeOrder(a.createdAt));
    }

    return nextReviews;
  }, [activeFilter, reviews, sortMode]);

  const marqueeA = [...marqueeRowA, ...marqueeRowA];
  const marqueeB = [...marqueeRowB, ...marqueeRowB];

  const handleFieldChange = (field: "name" | "location" | "productTag" | "text", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating || !formData.name.trim() || !formData.text.trim()) {
      setSubmitState({
        type: "error",
        message: "Add your name, rating, and review before submitting.",
      });
      return;
    }

    setSubmitting(true);
    setSubmitState({ type: "info", message: "Submitting your review..." });

    const result = await submitReview({
      name: formData.name.trim(),
      location: formData.location.trim(),
      productTag: formData.productTag,
      text: formData.text.trim(),
      rating,
    });

    if (result.success) {
      setFormData({
        name: "",
        location: "",
        productTag: "Still",
        text: "",
      });
      setRating(0);
      setSubmitState({
        type: "success",
        message: "Review submitted. It will appear after approval in the admin dashboard.",
      });
    } else {
      setSubmitState({
        type: "error",
        message: "Review submission failed. Check Firestore rules and try again.",
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="rvw-page">
      {submitState.type !== "idle" ? (
        <div className={`rvw-toast rvw-toast--${submitState.type}`} role="status" aria-live="polite">
          <span className="rvw-toast-icon" aria-hidden="true">
            {submitState.type === "success" ? <MdCheckCircle /> : null}
            {submitState.type === "error" ? <MdError /> : null}
            {submitState.type === "info" ? <MdInfo /> : null}
          </span>
          <p>{submitState.message}</p>
        </div>
      ) : null}

      <ReviewsHero reviews={reviews} />

      <section className="rvw-marquee-section">
        {marqueeSource.length > 0 ? (
          <>
            <div className="rvw-marquee-track">
              {marqueeA.map((review, index) => (
                <article className="rvw-marquee-card" key={`${review.id}-a-${index}`}>
                  <div className="rvw-marquee-card-top">
                    <div className="rvw-mini-stars">{renderStars(review.rating)}</div>
                    <span className="rvw-tag">{review.productTag}</span>
                  </div>
                  <p className="rvw-marquee-text">"{review.text}"</p>
                  <div className="rvw-marquee-bottom">
                    <span>{review.name}</span>
                    <span>{formatReviewDate(review.createdAt, "short")}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="rvw-marquee-track is-reverse">
              {marqueeB.map((review, index) => (
                <article className="rvw-marquee-card" key={`${review.id}-b-${index}`}>
                  <div className="rvw-marquee-card-top">
                    <div className="rvw-mini-stars">{renderStars(review.rating)}</div>
                    <span className="rvw-tag">{review.productTag}</span>
                  </div>
                  <p className="rvw-marquee-text">"{review.text}"</p>
                  <div className="rvw-marquee-bottom">
                    <span>{review.name}</span>
                    <span>{formatReviewDate(review.createdAt, "short")}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="rvw-empty-state">{loading ? "Loading live reviews..." : "No approved reviews are live yet."}</div>
        )}
      </section>

      <main className="rvw-main">
        <div className="rvw-divider">
          <span />
          <p>Leave a review</p>
          <span />
        </div>

        <form className="rvw-write-wrap" onSubmit={handleSubmit}>
          <h2>Share your experience</h2>
          <p className="rvw-write-sub">Your review helps others find the right flavor.</p>

          <div className="rvw-field-block">
            <p className="rvw-label">Your rating</p>
            <div className="rvw-rating-picker">
              {Array.from({ length: 5 }, (_, index) => {
                const selected = index < rating;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`rvw-rating-star${selected ? " is-on" : ""}`}
                    onClick={() => setRating(index + 1)}
                    aria-label={`Set rating to ${index + 1}`}
                  >
                    {"\u2605"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rvw-form-grid">
            <label className="rvw-field">
              <span>Your name</span>
              <input
                type="text"
                placeholder="Ola Nordmann"
                value={formData.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
              />
            </label>
            <label className="rvw-field">
              <span>Location</span>
              <input
                type="text"
                placeholder="Oslo, Norway"
                value={formData.location}
                onChange={(event) => handleFieldChange("location", event.target.value)}
              />
            </label>
            <label className="rvw-field">
              <span>Product</span>
              <select value={formData.productTag} onChange={(event) => handleFieldChange("productTag", event.target.value)}>
                <option>Still</option>
                <option>Sparkling</option>
                <option>Sparkling Ginger Lemon</option>
                <option>Sparkling Green Tea Peach</option>
                <option>Sparkling Watermelon</option>
                <option>Smurfene Sparkling Strawberry Raspberry</option>
                <option>Smurfene Sparkling Apple Pear</option>
                <option>Merch</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label className="rvw-field">
            <span>Your review</span>
            <textarea
              placeholder="What did you think? Taste, packaging, experience, anything."
              value={formData.text}
              onChange={(event) => handleFieldChange("text", event.target.value)}
            />
          </label>

          <div className="rvw-submit-row">
            <div>
              <p>Reviews appear after a quick check.</p>
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : <><MdSend /> Submit Review</>}
            </button>
          </div>
        </form>

        <section>
          <div className="rvw-controls">
            <div className="rvw-pills">
              <button className={activeFilter === "all" ? "is-active" : ""} onClick={() => setActiveFilter("all")}>All</button>
              <button className={activeFilter === "5" ? "is-active" : ""} onClick={() => setActiveFilter("5")}>5 star</button>
              <button className={activeFilter === "4" ? "is-active" : ""} onClick={() => setActiveFilter("4")}>4 star</button>
              <button className={activeFilter === "arctic-lime" ? "is-active" : ""} onClick={() => setActiveFilter("arctic-lime")}>Arctic Lime</button>
              <button className={activeFilter === "sparkling" ? "is-active" : ""} onClick={() => setActiveFilter("sparkling")}>Sparkling</button>
            </div>

            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
              <option value="recent">Most recent</option>
              <option value="high">Highest rated</option>
              <option value="low">Lowest rated</option>
            </select>
          </div>

          <div className="rvw-grid">
            {filteredReviews.map((review) => (
              <article key={review.id} className="rvw-grid-card">
                <div className="rvw-grid-top">
                  <div className="rvw-reviewer">
                    <span className="rvw-avatar" style={{ backgroundColor: getReviewAvatarColor(review.name) }}>
                      {getReviewInitials(review.name)}
                    </span>
                    <div>
                      <p className="rvw-name">{review.name}</p>
                      <p className="rvw-location">{review.location || "Location not shared"}</p>
                    </div>
                  </div>
                  <div className="rvw-mini-stars">{renderStars(review.rating)}</div>
                </div>

                <span className="rvw-tag">{review.productTag}</span>
                <p className="rvw-grid-text">{review.text}</p>

                <div className="rvw-grid-foot">
                  <span>{formatReviewDate(review.createdAt)}</span>
                  {review.verifiedPurchase ? <span className="rvw-verified">Verified</span> : <span />}
                </div>
              </article>
            ))}
          </div>

          {!loading && filteredReviews.length === 0 ? <p className="rvw-empty-state rvw-empty-state--grid">No reviews match this filter yet.</p> : null}
        </section>
      </main>

      <Footer />
    </div>
  );
}
