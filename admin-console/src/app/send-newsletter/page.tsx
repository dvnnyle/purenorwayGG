'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../_components/AdminSidebar';
import AdminFooter from '../_components/AdminFooter';
import { getActiveSubscriberCount } from '@/lib/newsletterService';
import { generateNewsletterTemplate } from '@/lib/emailTemplates';
import { listGalleryImages } from '@/lib/galleryService';

export default function SendNewsletterPage() {
  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787').replace(/\/$/, '');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [subject, setSubject] = useState('');
  const [fromName, setFromName] = useState('PURE Norway');
  const [eyebrow, setEyebrow] = useState('');
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const loadCount = async () => {
      const count = await getActiveSubscriberCount();
      setSubscriberCount(count);
    };
    loadCount();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadTemplate = () => {
    setSubject('Updates from PURE Norway');
    setEyebrow('Newsletter');
    setHeading('Welcome to the latest from PURE Norway.');
    setBody(`We have exciting updates to share with you this month.

Thank you for being part of the PURE Norway community. Your support helps us bring authentic Norwegian water to the world while protecting the environment.`);
    setImageUrl('');
    setImageAlt('');
  };
  const handleOpenImageBrowser = async () => {
    setShowImageBrowser(true);
    if (galleryImages.length === 0) {
      const images = await listGalleryImages();
      setGalleryImages(images);
    }
  };

  const handleSelectImage = (url: string, name: string) => {
    setImageUrl(url);
    setImageAlt(name.split('_').pop()?.replace(/\.(jpg|png|jpeg|webp)/i, '') || 'Gallery image');
    setShowImageBrowser(false);
    setToast({ type: 'success', message: 'Image selected!' });
  };
  const handleSend = async () => {
    if (!subject.trim() || !heading.trim() || !body.trim()) {
      setToast({ type: 'error', message: 'Subject, heading, and body are required.' });
      return;
    }

    if (subscriberCount === 0) {
      setToast({ type: 'error', message: 'No active subscribers to send to.' });
      return;
    }

    const confirmed = confirm(
      `Send this newsletter to ${subscriberCount} subscriber${subscriberCount === 1 ? '' : 's'}?`
    );

    if (!confirmed) return;

    setSending(true);
    setToast(null);

    try {
      const response = await fetch(`${backendUrl}/api/newsletter/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject, 
          fromName,
          eyebrow: eyebrow || undefined,
          heading,
          body,
          imageUrl: imageUrl || undefined,
          imageAlt: imageAlt || undefined,
        }),
      });

      const raw = await response.text();
      let data: { error?: string; recipientCount?: number } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        const fallbackMessage =
          response.status === 404
            ? 'Send API not available on backend deployment. Check NEXT_PUBLIC_BACKEND_URL.'
            : `Failed to send newsletter (HTTP ${response.status}).`;
        setToast({ type: 'error', message: data?.error ?? fallbackMessage });
        return;
      }

      setToast({
        type: 'success',
        message: `Newsletter sent to ${data.recipientCount} subscriber${data.recipientCount === 1 ? '' : 's'}!`,
      });
      setSubject('');
      setEyebrow('');
      setHeading('');
      setBody('');
      setImageUrl('');
      setImageAlt('');
    } catch {
      setToast({
        type: 'error',
        message: 'Network/API error. Check backend service URL and CORS settings.',
      });
    } finally {
      setSending(false);
    }
  };

  const fullPreviewHtml = heading ? generateNewsletterTemplate({
    subject,
    eyebrow: eyebrow || undefined,
    heading,
    body,
    imageUrl: imageUrl || undefined,
    imageAlt: imageAlt || undefined,
    subscriberEmail: 'preview@example.com',
    baseUrl: 'http://localhost:3000',
  }) : '';

  return (
    <>
      <AdminSidebar />

      <main className="main">
        <div className="view active">
          <div className="topbar">
            <h2>Send Newsletter</h2>
            <div className="topbar-actions">
              <a className="btn btn-ghost" href="/newsletter">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z" />
                </svg>
                Back to Subscribers
              </a>
            </div>
          </div>

          <div className="content">
            <div className="email-composer-grid">
              <div className="email-composer-main">
                <div className="panel">
                  <div className="panel-header">
                    <h3 className="panel-title">Quick Start</h3>
                  </div>
                  <div className="panel-body">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={loadTemplate}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                      Load Default Template
                    </button>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <h3 className="panel-title">Compose Email</h3>
                  </div>
                  <div className="panel-body">
                    <div>
                      <label htmlFor="subject">Subject Line *</label>
                      <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Your newsletter subject"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="eyebrow">Eyebrow Text (Optional)</label>
                      <input
                        id="eyebrow"
                        type="text"
                        value={eyebrow}
                        onChange={(e) => setEyebrow(e.target.value)}
                        placeholder="NEW FLAVOUR or IMPACT UPDATE"
                      />
                    </div>

                    <div>
                      <label htmlFor="heading">Main Heading *</label>
                      <input
                        id="heading"
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        placeholder="Your main headline"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="image">Hero Image (Optional)</label>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleOpenImageBrowser}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                        {imageUrl ? 'Image Selected' : 'Browse Gallery Images'}
                      </button>
                      {imageUrl && (
                        <div>
                          <img src={imageUrl} alt={imageAlt} style={{ width: '60px', height: '34px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontSize: '11px', color: 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{imageAlt}</span>
                          <button
                            type="button"
                            onClick={() => { setImageUrl(''); setImageAlt(''); }}
                            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px' }}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="body">Body Content *</label>
                      <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Your main message here...&#10;&#10;Use blank lines to separate paragraphs."
                        rows={8}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="email-composer-sidebar">
                <div className="panel">
                  <div className="panel-header">
                    <h3 className="panel-title">Recipients</h3>
                  </div>
                  <div className="panel-body">
                    <div className="email-stat-box">
                      <div className="email-stat-value">{subscriberCount}</div>
                      <div className="email-stat-label">Active Subscribers</div>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '12px', textAlign: 'center' }}>
                      ⚠️ Test mode: Emails only sent to your Resend account
                    </p>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <h3 className="panel-title">Actions</h3>
                  </div>
                  <div className="panel-body">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowPreview(!showPreview)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {showPreview ? 'Hide Preview' : 'Preview Email'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSend}
                      disabled={sending || !subject.trim() || !heading.trim() || !body.trim()}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {sending ? 'Sending...' : `Send Newsletter`}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showPreview && fullPreviewHtml ? (
              <div className="panel" style={{ marginTop: '16px' }}>
                <div className="panel-header">
                  <h3 className="panel-title">Email Preview</h3>
                </div>
                <div
                  className="email-preview"
                  dangerouslySetInnerHTML={{ __html: fullPreviewHtml }}
                />
              </div>
            ) : null}
          </div>
        </div>

        <AdminFooter />
      </main>

      {/* Image Browser Modal */}
      {showImageBrowser && (
        <div className="modal-backdrop" onClick={() => setShowImageBrowser(false)}>
          <div className="modal image-browser-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Gallery Images</h3>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setShowImageBrowser(false)}
              >
                ✕
              </button>
            </div>
            <div className="image-browser-body">
              {galleryImages.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Loading images...</p>
              ) : (
                <div className="image-grid">
                  {galleryImages.map((img) => (
                    <div 
                      key={img.url} 
                      className={`image-card ${img.url === imageUrl ? 'image-card-selected' : ''}`}
                    >
                      <div className="image-card-preview">
                        <img src={img.url} alt={img.name} />
                      </div>
                      <div className="image-card-info">
                        <p className="image-name" title={img.name}>{img.name}</p>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => handleSelectImage(img.url, img.name)}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.message}
          <div className="admin-toast-actions">
            <button
              type="button"
              className="admin-toast-btn"
              onClick={() => setToast(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
