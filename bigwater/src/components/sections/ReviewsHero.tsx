import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import {
  getReviewSummary,
  type ReviewEntry,
} from "@/lib/reviewsService";

interface ReviewsHeroProps {
  reviews: ReviewEntry[];
}

export default function ReviewsHero({ reviews }: ReviewsHeroProps) {
  const summary = getReviewSummary(reviews);

  return (
    <>
      <Link href="/" className="rvw-back-button">
        <MdArrowBack /> Back
      </Link>

      <section className="rvw-hero">
      <div className="rvw-hero-inner">
        <div>
          <p className="rvw-eyebrow">Reviews</p>
          <h1>
            People love
            <br />
            <em>PURE Norway WATER.</em>
          </h1>
        </div>

        <div className="rvw-rating-panel">
          <p className="rvw-rating-big">{summary.averageRating.toFixed(1)}</p>
          <div>
            <p className="rvw-stars-row">
              {Array.from({ length: 5 }, (_, index) => (index < Math.round(summary.averageRating) ? "★" : "☆")).join("")}
            </p>
            <p className="rvw-rating-count">
              {summary.count} verified review{summary.count === 1 ? "" : "s"}
            </p>
            <div className="rvw-bars">
              <div className="rvw-bar-row"><span>5</span><div><i style={{ width: `${summary.percentages[5]}%` }} /></div><span>{summary.percentages[5]}%</span></div>
              <div className="rvw-bar-row"><span>4</span><div><i style={{ width: `${summary.percentages[4]}%` }} /></div><span>{summary.percentages[4]}%</span></div>
              <div className="rvw-bar-row"><span>3</span><div><i style={{ width: `${summary.percentages[3]}%` }} /></div><span>{summary.percentages[3]}%</span></div>
              <div className="rvw-bar-row"><span>2</span><div><i style={{ width: `${summary.percentages[2]}%` }} /></div><span>{summary.percentages[2]}%</span></div>
              <div className="rvw-bar-row"><span>1</span><div><i style={{ width: `${summary.percentages[1]}%` }} /></div><span>{summary.percentages[1]}%</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
