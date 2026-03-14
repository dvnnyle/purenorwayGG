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
  mainContentTitle: string;
  content: string;
  articleImageUrl: string;
  articleImageText: string;
  paragraphAfterImageTitle: string;
  paragraphAfterImage: string;
  quoteText: string;
  thirdParagraphTitle: string;
  thirdParagraph: string;
  quoteCite: string;
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
  mainContentTitle: '',
  content: '',
  articleImageUrl: '',
  articleImageText: '',
  paragraphAfterImageTitle: '',
  paragraphAfterImage: '',
  quoteText: '',
  thirdParagraphTitle: '',
  thirdParagraph: '',
  quoteCite: '',
  category: 'Sustainability',
  author: 'PURENorway Team',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  slug: '',
  published: false,
};

const articleContentTemplate = `When we set out to build PURENorway, the question of packaging was one of the first decisions we made.

We looked at plastic. We looked at glass. We considered cartons. Then we landed on aluminium, and the answer became obvious.

## Infinitely recyclable, infinitely responsible.

Aluminium is one of the only materials that can be recycled endlessly without losing quality.

## Zero carbon in production.

We do not just say we care about the environment. Our production is designed around a zero carbon footprint.

We are proud of the can, and we are committed to improving every part of our process.`;

export default function BlogPage() {
  const [view, setView] = useState<View>('list');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [articleImageFile, setArticleImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const articleImageInputRef = useRef<HTMLInputElement>(null);

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

  const handleArticleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArticleImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () =>
        setEditorState((prev) => ({ ...prev, articleImageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const composeStructuredContent = (state: EditorState): string => {
    const parts: string[] = [];

    if (state.mainContentTitle.trim()) {
      parts.push(`## ${state.mainContentTitle.trim()}`);
    }

    if (state.content.trim()) {
      parts.push(state.content.trim());
    }

    if (state.articleImageUrl.trim()) {
      parts.push(`![${state.articleImageText.trim()}](${state.articleImageUrl.trim()})`);
    }

    if (state.paragraphAfterImageTitle.trim()) {
      parts.push(`## ${state.paragraphAfterImageTitle.trim()}`);
    }

    if (state.paragraphAfterImage.trim()) {
      parts.push(state.paragraphAfterImage.trim());
    }

    if (state.quoteText.trim()) {
      parts.push(`>>> ${state.quoteText.trim()}`);
    }

    if (state.thirdParagraphTitle.trim()) {
      parts.push(`## ${state.thirdParagraphTitle.trim()}`);
    }

    if (state.thirdParagraph.trim()) {
      parts.push(state.thirdParagraph.trim());
    }

    return parts.join('\n\n');
  };

  const splitStructuredContent = (rawContent: string) => {
    const blocks = rawContent
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    const mainBlocks: string[] = [];
    let mainContentTitle = '';
    let articleImageUrl = '';
    let articleImageText = '';
    let paragraphAfterImageTitle = '';
    let paragraphAfterImage = '';
    let quoteText = '';
    let thirdParagraphTitle = '';
    let thirdParagraph = '';
    let quoteCite = '';
    let seenInlineImage = false;
    let seenPullQuote = false;

    for (const block of blocks) {
      if (!seenInlineImage && !mainContentTitle && block.startsWith('## ')) {
        mainContentTitle = block.replace(/^##\s+/, '').trim();
        continue;
      }

      const imageMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch && !articleImageUrl) {
        articleImageText = imageMatch[1].trim();
        articleImageUrl = imageMatch[2].trim();
        seenInlineImage = true;
        continue;
      }

      if (block.startsWith('>>> ') && !quoteText) {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        quoteText = lines[0].replace(/^>>>\s+/, '').trim();
        seenPullQuote = true;
        const citeLine = lines.find((line, index) => index > 0 && /^--\s+/.test(line));
        if (citeLine) {
          quoteCite = citeLine.replace(/^--\s+/, '').trim();
        }
        continue;
      }

      if (seenPullQuote && !thirdParagraphTitle && block.startsWith('## ')) {
        thirdParagraphTitle = block.replace(/^##\s+/, '').trim();
        continue;
      }

      if (seenPullQuote && !thirdParagraph && !block.startsWith('> ')) {
        thirdParagraph = block;
        continue;
      }

      if (seenInlineImage && !paragraphAfterImageTitle && block.startsWith('## ')) {
        paragraphAfterImageTitle = block.replace(/^##\s+/, '').trim();
        continue;
      }

      if (seenInlineImage && !paragraphAfterImage && !block.startsWith('> ')) {
        paragraphAfterImage = block;
        continue;
      }

      mainBlocks.push(block);
    }

    return {
      mainContentTitle,
      content: mainBlocks.join('\n\n'),
      articleImageUrl,
      articleImageText,
      paragraphAfterImageTitle,
      paragraphAfterImage,
      quoteText,
      thirdParagraphTitle,
      thirdParagraph,
      quoteCite,
    };
  };

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    try {
      const slug = editorState.slug || generateSlug(editorState.title);
      let imageUrl = editorState.imageUrl;
      let articleImageUrl = editorState.articleImageUrl;
      if (imageFile) {
        const tempId = editorState.id || `temp_${Date.now()}`;
        const uploaded = await uploadNewsImage(imageFile, tempId);
        if (uploaded) imageUrl = uploaded;
      }
      if (articleImageFile) {
        const tempId = editorState.id || `temp_${Date.now()}`;
        const uploadedInline = await uploadNewsImage(articleImageFile, `${tempId}_inline`);
        if (uploadedInline) articleImageUrl = uploadedInline;
      }

      const compiledContent = composeStructuredContent({
        ...editorState,
        articleImageUrl,
      });

      const data = {
        title: editorState.title,
        excerpt: editorState.excerpt,
        content: compiledContent,
        category: editorState.category,
        date: editorState.date,
        author: editorState.author.trim() || 'PURENorway Team',
        imageUrl,
        slug,
        published: publish,
      };
      if (editorState.id) await updateNewsArticle(editorState.id, data);
      else await createNewsArticle(data);
      setEditorState(initialEditorState);
      setImageFile(null);
      setArticleImageFile(null);
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
    const structured = splitStructuredContent(article.content || '');

    setEditorState({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      mainContentTitle: structured.mainContentTitle,
      content: structured.content,
      articleImageUrl: structured.articleImageUrl,
      articleImageText: structured.articleImageText,
      paragraphAfterImageTitle: structured.paragraphAfterImageTitle,
      paragraphAfterImage: structured.paragraphAfterImage,
      quoteText: structured.quoteText,
      thirdParagraphTitle: structured.thirdParagraphTitle,
      thirdParagraph: structured.thirdParagraph,
      quoteCite: structured.quoteCite,
      category: article.category,
      author: article.author || 'PURENorway Team',
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
    setArticleImageFile(null);
    setView('editor');
  };

  const handleInsertTemplate = () => {
    setEditorState((prev) => ({
      ...prev,
      mainContentTitle: prev.mainContentTitle || 'Infinitely recyclable, infinitely responsible.',
      content: prev.content.trim()
        ? `${prev.content.trim()}\n\n${articleContentTemplate}`
        : articleContentTemplate,
      articleImageUrl: prev.articleImageUrl || 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200&q=80',
      articleImageText: prev.articleImageText || 'Our cans in production',
      paragraphAfterImageTitle: prev.paragraphAfterImageTitle || 'Zero carbon in production.',
      paragraphAfterImage:
        prev.paragraphAfterImage ||
        'Our cans leave zero carbon footprint in production and are built to be recycled again and again.',
      quoteText:
        prev.quoteText ||
        'The can you hold is the lightest possible version of itself and the most responsible one we could make.',
      thirdParagraphTitle: prev.thirdParagraphTitle || 'Beyond the can.',
      thirdParagraph:
        prev.thirdParagraph ||
        'We continue improving every step of the process so each release is cleaner, smarter, and more responsible.',
      quoteCite: prev.quoteCite,
    }));
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
                      <label>Main Title</label>
                      <input
                        type="text"
                        placeholder="Infinitely recyclable, infinitely responsible."
                        value={editorState.mainContentTitle}
                        onChange={(e) => handleInputChange('mainContentTitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <label>Main Paragraph (Content)</label>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={handleInsertTemplate}>
                          Insert Article Template
                        </button>
                      </div>
                      <textarea
                        placeholder={`Write your full article content here...\n\nFormat tips:\n- Paragraph: plain text with blank line between blocks\n- Heading: ## Your heading\n- Image: ![Caption](https://your-image-url)\n- Pull quote: >>> Your quote then next line: -- Name`}
                        rows={12}
                        value={editorState.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        style={{ fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.6' }}
                      />
                    </div>

                    <div>
                      <label>Inline Article Image URL</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={editorState.articleImageUrl}
                          onChange={(e) => handleInputChange('articleImageUrl', e.target.value)}
                        />
                        <input
                          ref={articleImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleArticleImageSelect}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => articleImageInputRef.current?.click()}
                        >
                          Upload
                        </button>
                      </div>
                    </div>

                    <div>
                      <label>Article Image Text</label>
                      <input
                        type="text"
                        placeholder="Caption text under the image..."
                        value={editorState.articleImageText}
                        onChange={(e) => handleInputChange('articleImageText', e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Secondary Paragraph Title</label>
                      <input
                        type="text"
                        placeholder="Zero carbon in production."
                        value={editorState.paragraphAfterImageTitle}
                        onChange={(e) => handleInputChange('paragraphAfterImageTitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Secondary Paragraph (Under Image)</label>
                      <textarea
                        placeholder="Write the paragraph that appears under the inline image..."
                        rows={3}
                        value={editorState.paragraphAfterImage}
                        onChange={(e) => handleInputChange('paragraphAfterImage', e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Pull Quote</label>
                      <textarea
                        placeholder="Write your highlighted quote..."
                        rows={3}
                        value={editorState.quoteText}
                        onChange={(e) => handleInputChange('quoteText', e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Third Title (After Quote)</label>
                      <input
                        type="text"
                        placeholder="Beyond the can."
                        value={editorState.thirdParagraphTitle}
                        onChange={(e) => handleInputChange('thirdParagraphTitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Third Paragraph (After Quote)</label>
                      <textarea
                        placeholder="Write the paragraph that appears after the quote..."
                        rows={3}
                        value={editorState.thirdParagraph}
                        onChange={(e) => handleInputChange('thirdParagraph', e.target.value)}
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

                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Author</div>
                  </div>
                  <div className="panel-body">
                    <div>
                      <label>Author Name</label>
                      <input
                        type="text"
                        placeholder="PURENorway Team"
                        value={editorState.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                      />
                      <small style={{ color: '#6B8090', display: 'block', marginTop: '6px' }}>
                        Leave empty to use default author: PURENorway Team.
                      </small>
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
