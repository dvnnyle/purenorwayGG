import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore/lite";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

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

/**
 * Upload image to Firebase Storage
 */
export async function uploadNewsImage(file: File, articleId: string): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const fileName = `${articleId}_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `news-images/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

/**
 * Delete image from Firebase Storage
 */
export async function deleteNewsImage(imageUrl: string) {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error };
  }
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
