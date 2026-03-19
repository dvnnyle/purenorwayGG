import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore/lite";
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
}

const COLLECTION_NAME = "reviews";

export async function getAllReviews(): Promise<ReviewEntry[]> {
  try {
    const reviewsQuery = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(reviewsQuery);

    return snapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    })) as ReviewEntry[];
  } catch (error) {
    console.error("Error loading reviews:", error);
    return [];
  }
}

export async function createReviewEntry(
  review: Omit<ReviewEntry, "id" | "createdAt" | "updatedAt" | "reviewedAt">
) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...review,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      reviewedAt: review.status === "pending" ? null : serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error };
  }
}

export async function updateReviewEntry(id: string, updates: Partial<ReviewEntry>) {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, error };
  }
}

export async function updateReviewStatus(id: string, status: ReviewStatus, reviewedBy = "Admin") {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      status,
      reviewedBy,
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating review status:", error);
    return { success: false, error };
  }
}

export async function toggleReviewFeatured(id: string, featured: boolean) {
  return updateReviewEntry(id, { featured });
}

export async function deleteReviewEntry(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error };
  }
}