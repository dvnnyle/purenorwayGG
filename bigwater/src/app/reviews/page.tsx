import "./reviews.css";

export default function ReviewsPage() {
  return (
    <main className="reviews-page">
      <section className="reviews-hero" aria-labelledby="reviews-hero-title">
        <p className="reviews-hero-kicker">Customer Stories</p>
        <h1 id="reviews-hero-title">Real Reviews. Real Hydration.</h1>
        <p className="reviews-hero-copy">
          See what people across Norway, Europe, and APAC say about the taste,
          quality, and impact of PURE Norway Water.
        </p>
        <div className="reviews-hero-actions">
          <button type="button" className="reviews-btn reviews-btn-primary">
            Read Reviews
          </button>
          <button type="button" className="reviews-btn reviews-btn-ghost">
            Share Your Review
          </button>
        </div>
      </section>
    </main>
  );
}
