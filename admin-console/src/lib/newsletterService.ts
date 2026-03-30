import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
} from "firebase/firestore/lite";
import { db } from "./firebase";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

const COLLECTION_NAME = "newsletterSubscribers";

/**
 * Get all newsletter subscribers
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const subscribersQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy("subscribedAt", "desc")
    );
    const snapshot = await getDocs(subscribersQuery);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsletterSubscriber[];
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return [];
  }
}

/**
 * Delete a newsletter subscriber
 */
export async function deleteNewsletterSubscriber(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { success: false, error };
  }
}

/**
 * Get active subscriber count
 */
export async function getActiveSubscriberCount(): Promise<number> {
  try {
    const subscribersQuery = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", "active")
    );
    const snapshot = await getDocs(subscribersQuery);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting subscriber count:", error);
    return 0;
  }
}
