import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface NewsArticle {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  imageUrl: string;
  slug: string;
  content?: string;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = "newsArticles";

export function slugifyNewsTitle(title?: string): string {
  return (title ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveNewsArticleSlug(article: Pick<NewsArticle, "slug" | "id" | "title">): string {
  return article.slug || article.id || slugifyNewsTitle(article.title);
}

/**
 * Create a new news article
 */
export async function createNewsArticle(article: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...article,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating news article:", error);
    return { success: false, error };
  }
}

/**
 * Update an existing news article
 */
export async function updateNewsArticle(id: string, updates: Partial<NewsArticle>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating news article:", error);
    return { success: false, error };
  }
}

/**
 * Delete a news article
 */
export async function deleteNewsArticle(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting news article:", error);
    return { success: false, error };
  }
}

/**
 * Get a single news article by ID
 */
export async function getNewsArticle(id: string): Promise<NewsArticle | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as NewsArticle;
    }
    return null;
  } catch (error) {
    console.error("Error getting news article:", error);
    return null;
  }
}

/**
 * Get all published news articles (for frontend)
 */
export async function getPublishedNewsArticles(): Promise<NewsArticle[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsArticle[];
  } catch (error) {
    console.error("Error getting published news articles:", error);
    return [];
  }
}

/**
 * Get all news articles (for admin console)
 */
export async function getAllNewsArticles(): Promise<NewsArticle[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsArticle[];
  } catch (error) {
    console.error("Error getting all news articles:", error);
    return [];
  }
}

/**
 * Get featured article (most recent published)
 */
export async function getFeaturedArticle(): Promise<NewsArticle | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as NewsArticle;
  } catch (error) {
    console.error("Error getting featured article:", error);
    return null;
  }
}
