'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error');
      setMessage('Invalid unsubscribe link.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('You have been unsubscribed from our newsletter.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to unsubscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  if (!email) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#0d1b2a' }}>Invalid Link</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>This unsubscribe link is invalid or expired.</p>
          <a href="/" style={{ display: 'inline-block', padding: '12px 24px', background: '#12a0ec', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
            Back to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
          <div style={{ width: '64px', height: '64px', background: '#4ade80', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px', fill: 'white' }}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#0d1b2a' }}>Successfully Unsubscribed</h1>
          <p style={{ color: '#666', marginBottom: '8px' }}>{message}</p>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '24px' }}>{email}</p>
          <a href="/" style={{ display: 'inline-block', padding: '12px 24px', background: '#12a0ec', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
            Back to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#ef3340' }}>Oops!</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{message}</p>
          <button
            onClick={() => setStatus('idle')}
            style={{ padding: '12px 24px', background: '#12a0ec', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#0d1b2a' }}>Unsubscribe from Newsletter</h1>
        <p style={{ color: '#666', marginBottom: '8px' }}>Are you sure you want to unsubscribe from PURE Norway updates?</p>
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '24px' }}>{email}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a href="/" style={{ padding: '12px 24px', background: '#e5e7eb', color: '#374151', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>
            Cancel
          </a>
          <button
            onClick={handleUnsubscribe}
            disabled={status === 'loading'}
            style={{ padding: '12px 24px', background: '#ef3340', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
          >
            {status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </div>
      </div>
    </div>
  );
}
