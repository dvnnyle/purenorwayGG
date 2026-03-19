import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewEntry {
  id?: string;
  name: string;
  location: string;
  productTag: string;
  text: string;
  rating: number;
  status: ReviewStatus;
  featured: boolean;
  verifiedPurchase: boolean;
  photos?: string[];
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  reviewedAt?: Timestamp | null;
  reviewedBy?: string | null;
}

export interface ReviewSubmissionInput {
  name: string;
  location: string;
  productTag: string;
  text: string;
  rating: number;
}

export interface ReviewSummary {
  count: number;
  averageRating: number;
  percentages: Record<1 | 2 | 3 | 4 | 5, number>;
}

const COLLECTION_NAME = "reviews";
const AVATAR_COLORS = ["#00B4C8", "#1A2E42", "#F5A623", "#007A8C", "#EF3340", "#002868"];

export function subscribeToApprovedReviews(
  onUpdate: (reviews: ReviewEntry[]) => void,
  onError?: (error: Error) => void
) {
  const reviewsQuery = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const reviews = snapshot.docs
        .map((entry): ReviewEntry => {
          const data = entry.data() as Partial<ReviewEntry>;

          return {
            id: entry.id,
            name: data.name ?? "Anonymous",
            location: data.location ?? "",
            productTag: data.productTag ?? "Other",
            text: data.text ?? "",
            rating: typeof data.rating === "number" ? clampRating(data.rating) : 5,
            status: (data.status as ReviewStatus) ?? "pending",
            featured: Boolean(data.featured),
            verifiedPurchase: Boolean(data.verifiedPurchase),
            photos: Array.isArray(data.photos) ? data.photos : [],
            createdAt: data.createdAt ?? null,
            updatedAt: data.updatedAt ?? null,
            reviewedAt: data.reviewedAt ?? null,
            reviewedBy: data.reviewedBy ?? null,
          };
        });

      onUpdate(reviews);
    },
    (error) => {
      console.error("Error subscribing to public reviews:", error);
      onError?.(error);
    }
  );
}

export async function submitReview(review: ReviewSubmissionInput) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...review,
      status: "pending",
      featured: false,
      verifiedPurchase: false,
      photos: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false, error };
  }
}

export function getReviewSummary(reviews: ReviewEntry[]): ReviewSummary {
  const ratingCounts: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const review of reviews) {
    const ratingKey = clampRating(review.rating) as 1 | 2 | 3 | 4 | 5;
    ratingCounts[ratingKey] += 1;
  }

  const count = reviews.length;
  const total = reviews.reduce((sum, review) => sum + clampRating(review.rating), 0);
  const averageRating = count === 0 ? 0 : total / count;

  return {
    count,
    averageRating,
    percentages: {
      1: count === 0 ? 0 : Math.round((ratingCounts[1] / count) * 100),
      2: count === 0 ? 0 : Math.round((ratingCounts[2] / count) * 100),
      3: count === 0 ? 0 : Math.round((ratingCounts[3] / count) * 100),
      4: count === 0 ? 0 : Math.round((ratingCounts[4] / count) * 100),
      5: count === 0 ? 0 : Math.round((ratingCounts[5] / count) * 100),
    },
  };
}

export function formatReviewDate(timestamp?: Timestamp | null, variant: "short" | "long" = "long") {
  if (!timestamp) {
    return "Pending date";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    variant === "short"
      ? { month: "short", year: "numeric" }
      : { day: "numeric", month: "long", year: "numeric" }
  ).format(timestamp.toDate());
}

export function getReviewInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getReviewAvatarColor(name: string) {
  const hash = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function getReviewTimeOrder(timestamp?: Timestamp | null) {
  return timestamp?.toMillis() ?? 0;
}

function clampRating(rating: number) {
  return Math.max(1, Math.min(5, Math.round(rating)));
}