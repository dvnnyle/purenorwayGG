'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../_components/AdminSidebar';
import AdminFooter from '../_components/AdminFooter';
import {
  deleteReviewEntry,
  getAllReviews,
  toggleReviewFeatured,
  type ReviewEntry,
  type ReviewStatus,
  updateReviewStatus,
} from '@/lib/reviewsService';

const filterOptions: Array<{ label: string; value: ReviewStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

function formatReviewDate(review: ReviewEntry) {
  const timestamp = review.createdAt;
  if (!timestamp) return 'No date';

  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(timestamp.toDate());
  } catch {
    return 'No date';
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'RV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<ReviewStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadReviews = async () => {
    const data: ReviewEntry[] = await getAllReviews();
    setReviews(data);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filteredReviews = useMemo<ReviewEntry[]>(() => {
    if (activeFilter === 'all') return reviews;
    return reviews.filter((review: ReviewEntry) => review.status === activeFilter);
  }, [activeFilter, reviews]);

  const handleStatusChange = async (id: string, status: ReviewStatus) => {
    setLoading(true);
    try {
      await updateReviewStatus(id, status);
      await loadReviews();
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (id: string, featured: boolean) => {
    setLoading(true);
    try {
      await toggleReviewFeatured(id, featured);
      await loadReviews();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteReviewEntry(id);
      await loadReviews();
    } finally {
      setLoading(false);
      setDeleteTargetId(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteTargetId(null);
  };

  return (
    <>
      <AdminSidebar />

      <main className="main">
        <div className="view active">
          <div className="topbar">
            <h2>Reviews Moderation</h2>
            <div className="topbar-actions">
              <button className="btn btn-ghost" onClick={loadReviews} disabled={loading}>
                Refresh
              </button>
            </div>
          </div>

          <div className="content">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className="btn btn-sm"
                  onClick={() => setActiveFilter(option.value)}
                  style={{
                    background: activeFilter === option.value ? 'rgba(0, 180, 200, .1)' : 'rgba(255, 255, 255, .06)',
                    color: activeFilter === option.value ? '#00B4C8' : 'rgba(255,255,255,.72)',
                    border: activeFilter === option.value ? '1px solid rgba(0,180,200,.2)' : '1px solid rgba(255,255,255,.07)',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="post-list">
              {filteredReviews.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,.38)' }}>
                  No reviews found for this filter.
                </div>
              ) : null}

              {filteredReviews.map((review) => (
                <div key={review.id} className="post-item" style={{ alignItems: 'flex-start' }}>
                  <div
                    className="post-thumb-placeholder"
                    style={{
                      borderRadius: '999px',
                      width: '46px',
                      height: '46px',
                      background: 'rgba(0,180,200,.14)',
                      color: '#00B4C8',
                      fontWeight: 800,
                      fontSize: '12px',
                    }}
                  >
                    {getInitials(review.name)}
                  </div>

                  <div className="post-info">
                    <div className="post-title" style={{ whiteSpace: 'normal' }}>
                      {review.name} · {review.productTag}
                    </div>
                    <div className="post-meta" style={{ marginBottom: '8px' }}>
                      <span className={`status-dot ${review.status === 'approved' ? 'pub' : 'draft'}`}></span>
                      {review.status} · {review.location || 'No location'} · {formatReviewDate(review)} · {review.rating}/5
                      {review.featured ? ' · Featured' : ''}
                      {review.verifiedPurchase ? ' · Verified purchase' : ''}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,.78)', fontSize: '13px', lineHeight: '1.6' }}>
                      {review.text}
                    </div>
                  </div>

                  <div className="post-actions" style={{ flexDirection: 'column', minWidth: '120px' }}>
                    {review.status !== 'approved' ? (
                      <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(review.id!, 'approved')} disabled={loading}>
                        Approve
                      </button>
                    ) : null}
                    {review.status !== 'rejected' ? (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange(review.id!, 'rejected')} disabled={loading}>
                        Reject
                      </button>
                    ) : null}
                    <button className="btn btn-ghost btn-sm" onClick={() => handleFeatureToggle(review.id!, !review.featured)} disabled={loading}>
                      {review.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => openDeleteModal(review.id!)} disabled={loading}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {deleteTargetId ? (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-review-title"
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 1500,
                  background: 'rgba(5, 9, 14, .72)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '440px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,.08)',
                    background: '#111827',
                    boxShadow: '0 24px 64px rgba(0,0,0,.48)',
                    padding: '20px',
                  }}
                >
                  <h3 id="delete-review-title" style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 800 }}>
                    Delete review?
                  </h3>
                  <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,.72)', fontSize: '14px', lineHeight: 1.6 }}>
                    This action is permanent and cannot be undone.
                  </p>

                  <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={closeDeleteModal} disabled={loading}>
                      Cancel
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deleteTargetId)} disabled={loading}>
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <AdminFooter />
      </main>
    </>
  );
}