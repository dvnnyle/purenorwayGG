'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AdminSidebar from '../_components/AdminSidebar';
import AdminFooter from '../_components/AdminFooter';
import {
  createGallerySlide,
  deleteGallerySlide,
  getAllGallerySlides,
  updateGallerySlide,
  uploadGalleryImage,
  type GallerySlide,
} from '@/lib/galleryService';

interface GalleryEditorState {
  id?: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  order: number;
  active: boolean;
  showInCarousel: boolean;
  showInGallery: boolean;
}

const initialGalleryState: GalleryEditorState = {
  eyebrow: '',
  title: '',
  imageUrl: '',
  order: 1,
  active: true,
  showInCarousel: true,
  showInGallery: true,
};

type ToastTone = 'success' | 'error' | 'info';

interface ToastState {
  tone: ToastTone;
  message: string;
  actionLabel?: string;
  action?: () => void;
}

export default function GalleryAdminPage() {
  const [gallerySlides, setGallerySlides] = useState<GallerySlide[]>([]);
  const [editorState, setEditorState] = useState<GalleryEditorState>(initialGalleryState);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((nextToast: ToastState) => {
    setToast(nextToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toast.action) return;

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const sortSlides = useCallback((slides: GallerySlide[]) => {
    return [...slides].sort((a, b) => {
      const orderDiff = Number(a.order) - Number(b.order);
      if (orderDiff !== 0) return orderDiff;

      const titleA = `${a.eyebrow} ${a.title}`.trim().toLowerCase();
      const titleB = `${b.eyebrow} ${b.title}`.trim().toLowerCase();
      const titleDiff = titleA.localeCompare(titleB);
      if (titleDiff !== 0) return titleDiff;

      return (a.id ?? '').localeCompare(b.id ?? '');
    });
  }, []);

  const normalizeSlideOrders = useCallback(
    async (slides: GallerySlide[], prioritySlideId?: string, requestedOrder?: number) => {
      const ordered = sortSlides(slides);

      if (prioritySlideId) {
        const currentIndex = ordered.findIndex((slide) => slide.id === prioritySlideId);
        if (currentIndex !== -1) {
          const [prioritySlide] = ordered.splice(currentIndex, 1);
          const targetIndex = Math.min(
            Math.max((Number(requestedOrder) || 1) - 1, 0),
            ordered.length
          );
          ordered.splice(targetIndex, 0, prioritySlide);
        }
      }

      const normalized = ordered.map((slide, index) => ({
        ...slide,
        order: index + 1,
      }));

      const changedSlides = normalized.filter((slide) => {
        const original = slides.find((entry) => entry.id === slide.id);
        return original && Number(original.order) !== slide.order;
      });

      if (changedSlides.length > 0) {
        await Promise.all(
          changedSlides.map((slide) => updateGallerySlide(slide.id!, { order: slide.order }))
        );
      }

      setGallerySlides(normalized);
      return normalized;
    },
    [sortSlides]
  );

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    const data = await getAllGallerySlides();
    const normalized = await normalizeSlideOrders(data);
    if (normalized.some((slide, index) => Number(data.find((entry) => entry.id === slide.id)?.order) !== index + 1)) {
      showToast({
        tone: 'info',
        message: 'Gallery order was normalized to remove duplicates.',
      });
    }
    return normalized;
  };

  const handleInputChange = (field: keyof GalleryEditorState, value: string | number | boolean) => {
    setEditorState((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () =>
        setEditorState((prev) => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const resetEditor = (slides?: GallerySlide[]) => {
    const list = slides ?? gallerySlides;
    const nextOrder =
      list.length > 0 ? Math.max(...list.map((s) => Number(s.order) || 0)) + 1 : 1;
    setEditorState({ ...initialGalleryState, order: nextOrder });
    setImageFile(null);
  };

  const handleEditSlide = (slide: GallerySlide) => {
    setEditorState({
      id: slide.id,
      eyebrow: slide.eyebrow,
      title: slide.title,
      imageUrl: slide.imageUrl,
      order: Number(slide.order) || 1,
      active: slide.active,
      showInCarousel: slide.showInCarousel ?? true,
      showInGallery: slide.showInGallery ?? true,
    });
    setImageFile(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = editorState.imageUrl;
      if (imageFile) {
        const tempId = editorState.id || `gallery_${Date.now()}`;
        const uploaded = await uploadGalleryImage(imageFile, tempId);
        if (uploaded) imageUrl = uploaded;
      }
      const payload = {
        eyebrow: editorState.eyebrow,
        title: editorState.title,
        imageUrl,
        order: Number(editorState.order) || 1,
        active: editorState.active,
        // Keep this true for backward compatibility with older documents.
        showInCarousel: true,
        showInGallery: editorState.showInGallery,
      };

      let savedSlideId = editorState.id;
      if (editorState.id) {
        await updateGallerySlide(editorState.id, payload);
      } else {
        const created = await createGallerySlide(payload);
        if (created.success) savedSlideId = created.id;
      }

      const refreshedSlides = await getAllGallerySlides();
      const normalized = await normalizeSlideOrders(refreshedSlides, savedSlideId, payload.order);
      resetEditor(normalized);
      showToast({ tone: 'success', message: 'Gallery slide saved.' });
    } catch (error) {
      console.error('Error saving gallery slide:', error);
      showToast({ tone: 'error', message: 'Failed to save gallery slide.' });
    } finally {
      setLoading(false);
    }
  };

  const deleteSlide = async (id: string) => {
    setLoading(true);
    try {
      await deleteGallerySlide(id);
      const refreshedSlides = await getAllGallerySlides();
      const normalized = await normalizeSlideOrders(refreshedSlides);
      if (editorState.id === id) resetEditor(normalized);
      showToast({ tone: 'success', message: 'Gallery slide deleted.' });
    } catch (error) {
      console.error('Error deleting gallery slide:', error);
      showToast({ tone: 'error', message: 'Failed to delete gallery slide.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    showToast({
      tone: 'info',
      message: 'Delete this gallery slide?',
      actionLabel: 'Delete',
      action: () => {
        setToast(null);
        void deleteSlide(id);
      },
    });
  };

  const swapOrder = async (slideId: string, _currentOrder: number, direction: 'up' | 'down') => {
    const orderedDescending = [...gallerySlides].sort((a, b) => Number(b.order) - Number(a.order));
    const currentIndex = orderedDescending.findIndex((slide) => slide.id === slideId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= orderedDescending.length) return;

    const reordered = [...orderedDescending];
    const [currentSlide] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, currentSlide);

    const ascending = [...reordered].reverse().map((slide, index) => ({
      ...slide,
      order: index + 1,
    }));

    setLoading(true);
    try {
      await Promise.all(
        ascending.map((slide) => updateGallerySlide(slide.id!, { order: slide.order }))
      );
      setGallerySlides(ascending);
      showToast({ tone: 'success', message: 'Slide order updated.' });
    } catch (error) {
      console.error('Error moving slide:', error);
      showToast({ tone: 'error', message: 'Failed to move slide.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminSidebar />

      {toast && (
        <div className={`admin-toast admin-toast-${toast.tone}`} role="status" aria-live="polite">
          <span>{toast.message}</span>
          <div className="admin-toast-actions">
            {toast.action && toast.actionLabel && (
              <button
                className="admin-toast-btn admin-toast-btn-primary"
                onClick={() => toast.action?.()}
              >
                {toast.actionLabel}
              </button>
            )}
            <button className="admin-toast-btn" onClick={() => setToast(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="main">
        <div className="view active">
          <div className="topbar">
            <h2>Gallery Media</h2>
            <div className="topbar-actions">
              <button className="btn btn-ghost" onClick={() => resetEditor()} disabled={loading}>
                New Slide
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Slide'}
              </button>
            </div>
          </div>

          <div className="content">
            <div style={{ marginBottom: '18px', color: '#6B8090', fontSize: '13px' }}>
              Set image order and visibility for the gallery. Active images are shown by order.
            </div>
            <div className="gallery-grid">
              {/* Slide list */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Slides</div>
                </div>
                <div className="panel-body">
                  <div className="gallery-list">
                    {gallerySlides.length === 0 && (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#6B8090' }}>
                        No images yet. Add your first gallery image.
                      </div>
                    )}
                    {[...gallerySlides]
                      .sort((a, b) => Number(b.order) - Number(a.order))
                      .map((slide, index, sorted) => (
                        <div key={slide.id} className="gallery-item">
                          <div className="gallery-thumb">
                            {slide.imageUrl ? <img src={slide.imageUrl} alt={slide.eyebrow} /> : null}
                          </div>
                          <div className="gallery-item-info">
                            <div className="gallery-item-title">{slide.eyebrow}</div>
                            <div className="gallery-item-meta">
                              Order {slide.order} · {slide.active ? 'Active' : 'Hidden'} · Gallery {slide.showInGallery ? 'On' : 'Off'}
                            </div>
                          </div>
                          <div className="post-actions">
                            {index > 0 && (
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => swapOrder(slide.id!, Number(slide.order), 'down')}
                                disabled={loading}
                                title="Move down"
                              >↓</button>
                            )}
                            {index < sorted.length - 1 && (
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => swapOrder(slide.id!, Number(slide.order), 'up')}
                                disabled={loading}
                                title="Move up"
                              >↑</button>
                            )}
                            <button className="btn btn-ghost btn-sm" onClick={() => handleEditSlide(slide)}>
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(slide.id!)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Slide editor */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    {editorState.id ? 'Edit Slide' : 'New Slide'}
                  </div>
                </div>
                <div className="panel-body">
                  <div>
                    <label>Eyebrow</label>
                    <input
                      type="text"
                      value={editorState.eyebrow}
                      onChange={(e) => handleInputChange('eyebrow', e.target.value)}
                      placeholder="e.g., Ancient Norwegian Source"
                    />
                  </div>
                  <div>
                    <label>Title</label>
                    <textarea
                      rows={3}
                      value={editorState.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter slide title"
                    />
                  </div>
                  <div className="gallery-fields-row">
                    <div>
                      <label>Order</label>
                      <input
                        type="number"
                        min={1}
                        value={editorState.order}
                        onChange={(e) => handleInputChange('order', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label>Status</label>
                      <select
                        value={editorState.active ? 'active' : 'hidden'}
                        onChange={(e) => handleInputChange('active', e.target.value === 'active')}
                      >
                        <option value="active">Active</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>
                  <div className="gallery-fields-row">
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editorState.showInGallery}
                          onChange={(e) => handleInputChange('showInGallery', e.target.checked)}
                        />
                        Show on gallery page
                      </label>
                    </div>
                  </div>
                  <div>
                    <label>Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                    <div className="img-upload" onClick={() => fileInputRef.current?.click()}>
                      {editorState.imageUrl ? (
                        <img
                          src={editorState.imageUrl}
                          alt="Gallery preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                          </svg>
                          <p>Click to upload slide image</p>
                          <span>JPG, PNG up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminFooter />
      </main>
    </>
  );
}
