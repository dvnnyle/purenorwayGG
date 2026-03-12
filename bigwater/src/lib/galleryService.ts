import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

export interface GallerySlide {
  id?: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  order: number;
  active: boolean;
  showInCarousel: boolean;
  showInGallery: boolean;
  createdAt?: { toMillis?: () => number } | null;
}

const COLLECTION_NAME = "gallerySlides";

function normalizeGallerySlide(slide: Partial<GallerySlide> & { id?: string }): GallerySlide {
  return {
    id: slide.id,
    eyebrow: slide.eyebrow ?? "",
    title: slide.title ?? "",
    imageUrl: slide.imageUrl ?? "",
    order: Number(slide.order) || 1,
    active: slide.active ?? true,
    showInCarousel: slide.showInCarousel ?? true,
    showInGallery: slide.showInGallery ?? true,
    createdAt: slide.createdAt ?? null,
  };
}

function getCreatedAtMillis(slide: GallerySlide): number {
  if (slide.createdAt && typeof slide.createdAt.toMillis === "function") {
    return slide.createdAt.toMillis();
  }

  return 0;
}

export async function getActiveGallerySlides(): Promise<GallerySlide[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("active", "==", true),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeGallerySlide({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error loading gallery slides:", error);
    return [];
  }
}

export async function getHomepageGallerySlides(limit = 6): Promise<GallerySlide[]> {
  const slides = await getActiveGallerySlides();
  return slides.filter((slide) => slide.showInCarousel).slice(0, limit);
}

export async function getGalleryPageSlides(): Promise<GallerySlide[]> {
  const slides = await getActiveGallerySlides();
  return slides
    .filter((slide) => slide.showInGallery)
    .sort((a, b) => {
      const createdAtDiff = getCreatedAtMillis(b) - getCreatedAtMillis(a);
      if (createdAtDiff !== 0) return createdAtDiff;
      return Number(b.order) - Number(a.order);
    });
}
