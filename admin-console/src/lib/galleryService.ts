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
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

export interface GallerySlide {
  id?: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = "gallerySlides";

export async function uploadGalleryImage(file: File, slideId: string): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const fileName = `${slideId}_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `gallery-images/${fileName}`);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    return null;
  }
}

export async function getAllGallerySlides(): Promise<GallerySlide[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GallerySlide[];
  } catch (error) {
    console.error("Error getting gallery slides:", error);
    return [];
  }
}

export async function createGallerySlide(slide: Omit<GallerySlide, "id" | "createdAt" | "updatedAt">) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...slide,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating gallery slide:", error);
    return { success: false, error };
  }
}

export async function updateGallerySlide(id: string, updates: Partial<GallerySlide>) {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating gallery slide:", error);
    return { success: false, error };
  }
}

export async function deleteGallerySlide(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting gallery slide:", error);
    return { success: false, error };
  }
}
