import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

export interface GallerySlide {
  id?: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

const COLLECTION_NAME = "gallerySlides";

export async function getActiveGallerySlides(): Promise<GallerySlide[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("active", "==", true),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GallerySlide[];
  } catch (error) {
    console.error("Error loading gallery slides:", error);
    return [];
  }
}
