'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../_components/AdminSidebar';
import AdminFooter from '../_components/AdminFooter';
import {
  deleteNewsletterSubscriber,
  getNewsletterSubscribers,
  type NewsletterSubscriber,
} from '@/lib/newsletterService';

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return 'Invalid date';
  }
}

export default function NewsletterUsersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSubscribers = async () => {
    const data = await getNewsletterSubscribers();
    setSubscribers(data);
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteNewsletterSubscriber(id);
      await loadSubscribers();
    } finally {
      setLoading(false);
      setDeleteTargetId(null);
    }
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = subscribers.filter((sub) => sub.status === 'active').length;

  return (
    <>
      <AdminSidebar />

      <main className="main">
        <div className="view active">
          <div className="topbar">
            <h2>Newsletter Users</h2>
            <div className="topbar-actions">
              <a href="/send-newsletter" className="btn btn-primary">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                Send Newsletter
              </a>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const emails = subscribers
                    .filter((s) => s.status === 'active')
                    .map((s) => s.email)
                    .join(',');
                  navigator.clipboard.writeText(emails);
                  alert(`Copied ${activeCount} email addresses to clipboard`);
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
                Copy All Emails
              </button>
            </div>
          </div>

          <div className="content">
            <div className="content-header">
              <div className="stats-bar">
                <div className="stat-card">
                  <div className="stat-value">{subscribers.length}</div>
                  <div className="stat-label">Total Subscribers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{activeCount}</div>
                  <div className="stat-label">Active</div>
                </div>
              </div>

              <div className="filter-bar">
                <div className="search-box">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {filteredSubscribers.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <p>{searchTerm ? 'No matching subscribers found' : 'No subscribers yet'}</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Subscribed</th>
                      <th>Status</th>
                      <th className="actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id}>
                        <td className="email-col">{subscriber.email}</td>
                        <td>{formatDate(subscriber.subscribedAt)}</td>
                        <td>
                          <span className={`badge badge-${subscriber.status === 'active' ? 'success' : 'secondary'}`}>
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="actions-col">
                          <button
                            type="button"
                            className="btn-icon btn-danger"
                            onClick={() => setDeleteTargetId(subscriber.id)}
                            disabled={loading}
                            aria-label="Delete subscriber"
                          >
                            <svg viewBox="0 0 24 24">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <AdminFooter />
      </main>

      {deleteTargetId && (
        <div className="modal-backdrop" onClick={() => !loading && setDeleteTargetId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Subscriber</h3>
            <p>Are you sure you want to remove this subscriber from your list?</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteTargetId(null)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(deleteTargetId)}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
