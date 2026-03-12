'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getAllNewsArticles,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  uploadNewsImage,
  type NewsArticle,
} from '@/lib/newsService';
import {
  createGallerySlide,
  deleteGallerySlide,
  getAllGallerySlides,
  updateGallerySlide,
  uploadGalleryImage,
  type GallerySlide,
} from '@/lib/galleryService';

type View = 'blog' | 'editor' | 'gallery' | 'products';

interface EditorState {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
  published: boolean;
}

interface GalleryEditorState {
  id?: string;
  eyebrow: string;
  title: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

const initialEditorState: EditorState = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Sustainability',
  author: 'PURENorway Team',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  slug: '',
  published: false,
};

const initialGalleryState: GalleryEditorState = {
  eyebrow: '',
  title: '',
  imageUrl: '',
  order: 1,
  active: true,
};

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<View>('blog');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [gallerySlides, setGallerySlides] = useState<GallerySlide[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);
  const [galleryEditorState, setGalleryEditorState] = useState<GalleryEditorState>(initialGalleryState);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Load articles on mount
  useEffect(() => {
    loadArticles();
    loadGallerySlides();
  }, []);

  const loadArticles = async () => {
    const data = await getAllNewsArticles();
    setArticles(data);
  };

  const loadGallerySlides = async () => {
    const data = await getAllGallerySlides();
    setGallerySlides(data);
  };

  const handleInputChange = (field: keyof EditorState, value: string | boolean) => {
    setEditorState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGalleryInputChange = (field: keyof GalleryEditorState, value: string | number | boolean) => {
    setGalleryEditorState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditorState((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryEditorState((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    try {
      const slug = editorState.slug || generateSlug(editorState.title);
      let imageUrl = editorState.imageUrl;

      // Upload image if new file selected
      if (imageFile) {
        const tempId = editorState.id || `temp_${Date.now()}`;
        const uploadedUrl = await uploadNewsImage(imageFile, tempId);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const articleData = {
        ...editorState,
        slug,
        imageUrl,
        published: publish,
      };

      if (editorState.id) {
        // Update existing
        await updateNewsArticle(editorState.id, articleData);
      } else {
        // Create new
        await createNewsArticle(articleData);
      }

      // Reset and reload
      setEditorState(initialEditorState);
      setImageFile(null);
      await loadArticles();
      setCurrentView('blog');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditorState({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content || '',
      category: article.category,
      author: article.author,
      date: article.date,
      imageUrl: article.imageUrl,
      slug: article.slug,
      published: article.published,
    });
    setCurrentView('editor');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    setLoading(true);
    try {
      await deleteNewsArticle(id);
      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = () => {
    setEditorState(initialEditorState);
    setImageFile(null);
    setCurrentView('editor');
  };

  const handleNewGallerySlide = () => {
    const nextOrder = gallerySlides.length > 0
      ? Math.max(...gallerySlides.map((slide) => Number(slide.order) || 0)) + 1
      : 1;
    setGalleryEditorState({ ...initialGalleryState, order: nextOrder });
    setGalleryImageFile(null);
  };

  const handleEditGallerySlide = (slide: GallerySlide) => {
    setGalleryEditorState({
      id: slide.id,
      eyebrow: slide.eyebrow,
      title: slide.title,
      imageUrl: slide.imageUrl,
      order: Number(slide.order) || 1,
      active: slide.active,
    });
    setGalleryImageFile(null);
  };

  const handleSaveGallerySlide = async () => {
    setLoading(true);
    try {
      let imageUrl = galleryEditorState.imageUrl;

      if (galleryImageFile) {
        const tempId = galleryEditorState.id || `gallery_${Date.now()}`;
        const uploadedUrl = await uploadGalleryImage(galleryImageFile, tempId);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const payload = {
        eyebrow: galleryEditorState.eyebrow,
        title: galleryEditorState.title,
        imageUrl,
        order: Number(galleryEditorState.order) || 1,
        active: galleryEditorState.active,
      };

      if (galleryEditorState.id) {
        await updateGallerySlide(galleryEditorState.id, payload);
      } else {
        await createGallerySlide(payload);
      }

      await loadGallerySlides();
      handleNewGallerySlide();
      alert('Gallery slide saved');
    } catch (error) {
      console.error('Error saving gallery slide:', error);
      alert('Failed to save gallery slide');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery slide?')) return;
    setLoading(true);
    try {
      await deleteGallerySlide(id);
      await loadGallerySlides();
      if (galleryEditorState.id === id) {
        handleNewGallerySlide();
      }
    } catch (error) {
      console.error('Error deleting gallery slide:', error);
      alert('Failed to delete gallery slide');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveSlideUp = async (slideId: string, currentOrder: number) => {
    // Find the next highest order
    const higherSlides = gallerySlides.filter((s) => s.order > currentOrder);
    if (higherSlides.length === 0) return;

    const nextSlide = higherSlides.reduce((min, s) =>
      Number(s.order) < Number(min.order) ? s : min
    );

    setLoading(true);
    try {
      const newOrder = Number(nextSlide.order);
      const tempOrder = 99999;

      // Swap orders with temp value
      await updateGallerySlide(slideId, { order: tempOrder });
      await updateGallerySlide(nextSlide.id!, { order: currentOrder });
      await updateGallerySlide(slideId, { order: newOrder });

      await loadGallerySlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      alert('Failed to move slide');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveSlideDown = async (slideId: string, currentOrder: number) => {
    // Find the next lowest order
    const lowerSlides = gallerySlides.filter((s) => s.order < currentOrder);
    if (lowerSlides.length === 0) return;

    const nextSlide = lowerSlides.reduce((max, s) =>
      Number(s.order) > Number(max.order) ? s : max
    );

    setLoading(true);
    try {
      const newOrder = Number(nextSlide.order);
      const tempOrder = 99999;

      // Swap orders with temp value
      await updateGallerySlide(slideId, { order: tempOrder });
      await updateGallerySlide(nextSlide.id!, { order: currentOrder });
      await updateGallerySlide(slideId, { order: newOrder });

      await loadGallerySlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      alert('Failed to move slide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24">
              <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
            </svg>
          </div>
          <div className="logo-text">
            PURENorway<span>Admin Panel</span>
          </div>
        </div>

        <div className="nav-section">Content</div>
        <button
          className={`nav-item ${currentView === 'blog' || currentView === 'editor' ? 'active' : ''}`}
          onClick={() => setCurrentView('blog')}
        >
          <svg viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          Blog & Stories
        </button>

        <button
          className={`nav-item ${currentView === 'gallery' ? 'active' : ''}`}
          onClick={() => {
            setCurrentView('gallery');
            if (!galleryEditorState.id && !galleryEditorState.imageUrl) {
              handleNewGallerySlide();
            }
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M22 16V4c0-1.1-.9-2-2-2H8C6.9 2 6 2.9 6 4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zM11 12l2.03 2.71L16 11l4 5H8l3-4zm-7 4V8H2v10c0 1.1.9 2 2 2h10v-2H4z" />
          </svg>
          Gallery
        </button>

        <div className="nav-section">Store</div>
        <button
          className={`nav-item ${currentView === 'products' ? 'active' : ''}`}
          onClick={() => setCurrentView('products')}
        >
          <svg viewBox="0 0 24 24">
            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3z" />
          </svg>
          Products
        </button>

        <div className="sidebar-footer">
          <div className="user">
            <div className="avatar">DS</div>
            <div>
              <div className="user-name">David Severinsen</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* ── BLOG VIEW ── */}
        <div className={`view ${currentView === 'blog' ? 'active' : ''}`}>
          <div className="topbar">
            <h2>Blog & Stories</h2>
            <div className="topbar-actions">
              <button className="btn btn-primary" onClick={handleNewPost}>
                <svg viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                New Post
              </button>
            </div>
          </div>
          <div className="content">
            <div className="post-list">
              {articles.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B8090' }}>
                  No articles yet. Create your first post!
                </div>
              )}
              {articles.map((article) => (
                <div key={article.id} className="post-item">
                  <div className="post-thumb-placeholder">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    )}
                  </div>
                  <div className="post-info">
                    <div className="post-title">{article.title}</div>
                    <div className="post-meta">
                      <span className={`status-dot ${article.published ? 'pub' : 'draft'}`}></span>
                      {article.published ? 'Published' : 'Draft'} · {article.date} · {article.category}
                    </div>
                  </div>
                  <div className="post-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(article)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(article.id!)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EDITOR VIEW ── */}
        <div className={`view ${currentView === 'editor' ? 'active' : ''}`}>
          <div className="topbar">
            <h2>{editorState.id ? 'Edit Post' : 'New Post'}</h2>
            <div className="topbar-actions">
              <button className="btn btn-ghost" onClick={() => setCurrentView('blog')} disabled={loading}>
                ← Back
              </button>
              <button className="btn btn-ghost" onClick={() => handleSave(false)} disabled={loading}>
                Save Draft
              </button>
              <button className="btn btn-primary" onClick={() => handleSave(true)} disabled={loading}>
                {loading ? 'Saving...' : 'Publish'}
              </button>
            </div>
          </div>
          <div className="content">
            <div className="editor-grid">
              <div className="editor-main">
                <div className="panel">
                  <div className="panel-body">
                    <div>
                      <label>Post Title</label>
                      <input 
                        type="text" 
                        placeholder="Enter post title..." 
                        value={editorState.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Excerpt</label>
                      <textarea 
                        placeholder="Brief summary of the article..."
                        rows={3}
                        value={editorState.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Content</label>
                      <textarea 
                        placeholder="Write your full article content here..."
                        rows={12}
                        value={editorState.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        style={{ fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.6' }}
                      />
                    </div>
                    <div>
                      <label>Author</label>
                      <input 
                        type="text" 
                        placeholder="Author name..." 
                        value={editorState.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="editor-sidebar-col">
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Publish</div>
                  </div>
                  <div className="panel-body">
                    <div>
                      <label>Status</label>
                      <select 
                        value={editorState.published ? 'published' : 'draft'}
                        onChange={(e) => handleInputChange('published', e.target.value === 'published')}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label>Publish Date</label>
                      <input 
                        type="date" 
                        value={editorState.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Cover Image</div>
                  </div>
                  <div className="panel-body">
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
                          alt="Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                          </svg>
                          <p>Click to upload image</p>
                          <span>JPG, PNG up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Category</div>
                  </div>
                  <div className="panel-body">
                    <div>
                      <label>Category</label>
                      <select 
                        value={editorState.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        <option>Sustainability</option>
                        <option>Innovation</option>
                        <option>Product Launch</option>
                        <option>Foundation</option>
                        <option>News</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PRODUCTS VIEW ── */}
        <div className={`view ${currentView === 'gallery' ? 'active' : ''}`}>
          <div className="topbar">
            <h2>Gallery Carousel</h2>
            <div className="topbar-actions">
              <button className="btn btn-ghost" onClick={handleNewGallerySlide} disabled={loading}>
                New Slide
              </button>
              <button className="btn btn-primary" onClick={handleSaveGallerySlide} disabled={loading}>
                {loading ? 'Saving...' : 'Save Slide'}
              </button>
            </div>
          </div>
          <div className="content">
            <div className="gallery-grid">
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
                          {slide.imageUrl ? (
                            <img src={slide.imageUrl} alt={slide.eyebrow} />
                          ) : null}
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
                              onClick={() => handleMoveSlideDown(slide.id!, Number(slide.order))}
                              disabled={loading}
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                          {index < sorted.length - 1 && (
                            <button 
                              className="btn btn-ghost btn-sm" 
                              onClick={() => handleMoveSlideUp(slide.id!, Number(slide.order))}
                              disabled={loading}
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEditGallerySlide(slide)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteGallery(slide.id!)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Slide Editor</div>
                </div>
                <div className="panel-body">
                  <div>
                    <label>Eyebrow</label>
                    <input
                      type="text"
                      value={galleryEditorState.eyebrow}
                      onChange={(e) => handleGalleryInputChange('eyebrow', e.target.value)}
                      placeholder="e.g., Ancient Norwegian Source"
                    />
                  </div>

                  <div>
                    <label>Title</label>
                    <textarea
                      rows={3}
                      value={galleryEditorState.title}
                      onChange={(e) => handleGalleryInputChange('title', e.target.value)}
                      placeholder="Enter slide title (use line breaks for multiple lines)"
                    />
                  </div>

                  <div className="gallery-fields-row">
                    <div>
                      <label>Order</label>
                      <input
                        type="number"
                        min={1}
                        value={galleryEditorState.order}
                        onChange={(e) => handleGalleryInputChange('order', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label>Status</label>
                      <select
                        value={galleryEditorState.active ? 'active' : 'hidden'}
                        onChange={(e) => handleGalleryInputChange('active', e.target.value === 'active')}
                      >
                        <option value="active">Active</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Image</label>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImageSelect}
                      style={{ display: 'none' }}
                    />
                    <div className="img-upload" onClick={() => galleryFileInputRef.current?.click()}>
                      {galleryEditorState.imageUrl ? (
                        <img
                          src={galleryEditorState.imageUrl}
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

        {/* ── PRODUCTS VIEW ── */}
        <div className={`view ${currentView === 'products' ? 'active' : ''}`}>
          <div className="topbar">
            <h2>Products</h2>
            <div className="topbar-actions">
              <button className="btn btn-primary">
                <svg viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
          <div className="content">
            <div className="product-grid">
              <div className="product-card">
                <div
                  className="product-img"
                  style={{ background: 'linear-gradient(135deg,#2a1a2e,#3d1f35)' }}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Strawberry Raspberry</div>
                  <div className="product-card-meta">Sparkling · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status active">Active</span>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div
                  className="product-img"
                  style={{ background: 'linear-gradient(135deg,#1f2a1a,#2e3d1f)' }}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Ginger Lemon</div>
                  <div className="product-card-meta">Sparkling · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status active">Active</span>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div
                  className="product-img"
                  style={{ background: 'linear-gradient(135deg,#0d1f2a,#0d2a3d)' }}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Smurfene Still</div>
                  <div className="product-card-meta">Still · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status active">Active</span>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div
                  className="product-img"
                  style={{ background: 'linear-gradient(135deg,#1a2a1f,#1f3d2a)' }}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Apple Pear</div>
                  <div className="product-card-meta">Sparkling · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status draft">Draft</span>
                  </div>
                </div>
              </div>

              <div className="add-product-card">
                <svg viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                <span>Add New Product</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
