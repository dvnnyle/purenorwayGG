'use client';

import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../_components/AdminSidebar';
import {
  getAllNewsArticles,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  uploadNewsImage,
  type NewsArticle,
} from '@/lib/newsService';

type View = 'list' | 'editor';

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

export default function BlogPage() {
  const [view, setView] = useState<View>('list');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await getAllNewsArticles();
    setArticles(data);
  };

  const handleInputChange = (field: keyof EditorState, value: string | boolean) => {
    setEditorState((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    try {
      const slug = editorState.slug || generateSlug(editorState.title);
      let imageUrl = editorState.imageUrl;
      if (imageFile) {
        const tempId = editorState.id || `temp_${Date.now()}`;
        const uploaded = await uploadNewsImage(imageFile, tempId);
        if (uploaded) imageUrl = uploaded;
      }
      const data = { ...editorState, slug, imageUrl, published: publish };
      if (editorState.id) await updateNewsArticle(editorState.id, data);
      else await createNewsArticle(data);
      setEditorState(initialEditorState);
      setImageFile(null);
      await loadArticles();
      setView('list');
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
    setView('editor');
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
    setView('editor');
  };

  return (
    <>
      <AdminSidebar />

      <main className="main">
        {/* ── LIST VIEW ── */}
        <div className={`view ${view === 'list' ? 'active' : ''}`}>
          <div className="topbar">
            <h2>Blog &amp; Stories</h2>
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
        <div className={`view ${view === 'editor' ? 'active' : ''}`}>
          <div className="topbar">
            <h2>{editorState.id ? 'Edit Post' : 'New Post'}</h2>
            <div className="topbar-actions">
              <button className="btn btn-ghost" onClick={() => setView('list')} disabled={loading}>
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
      </main>
    </>
  );
}
