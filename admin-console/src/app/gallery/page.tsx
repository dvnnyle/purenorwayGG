'use client';

import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../_components/AdminSidebar';
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
}

const initialGalleryState: GalleryEditorState = {
  eyebrow: '',
  title: '',
  imageUrl: '',
  order: 1,
  active: true,
};

export default function GalleryAdminPage() {
  const [gallerySlides, setGallerySlides] = useState<GallerySlide[]>([]);
  const [editorState, setEditorState] = useState<GalleryEditorState>(initialGalleryState);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    const data = await getAllGallerySlides();
    setGallerySlides(data);
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
      };
      if (editorState.id) await updateGallerySlide(editorState.id, payload);
      else await createGallerySlide(payload);
      await loadSlides();
      resetEditor();
      alert('Gallery slide saved');
    } catch (error) {
      console.error('Error saving gallery slide:', error);
      alert('Failed to save gallery slide');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery slide?')) return;
    setLoading(true);
    try {
      await deleteGallerySlide(id);
      await loadSlides();
      if (editorState.id === id) resetEditor();
    } catch (error) {
      console.error('Error deleting gallery slide:', error);
      alert('Failed to delete gallery slide');
    } finally {
      setLoading(false);
    }
  };

  const swapOrder = async (slideId: string, currentOrder: number, direction: 'up' | 'down') => {
    const candidates =
      direction === 'up'
        ? gallerySlides.filter((s) => s.order > currentOrder)
        : gallerySlides.filter((s) => s.order < currentOrder);

    if (candidates.length === 0) return;

    const target =
      direction === 'up'
        ? candidates.reduce((min, s) => (Number(s.order) < Number(min.order) ? s : min))
        : candidates.reduce((max, s) => (Number(s.order) > Number(max.order) ? s : max));

    setLoading(true);
    try {
      await updateGallerySlide(slideId, { order: 99999 });
      await updateGallerySlide(target.id!, { order: currentOrder });
      await updateGallerySlide(slideId, { order: Number(target.order) });
      await loadSlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      alert('Failed to move slide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminSidebar />

      <main className="main">
        <div className="view active">
          <div className="topbar">
            <h2>Gallery Carousel</h2>
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
                        No slides yet. Add your first carousel image.
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
                              Order {slide.order} · {slide.active ? 'Active' : 'Hidden'}
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
      </main>
    </>
  );
}
