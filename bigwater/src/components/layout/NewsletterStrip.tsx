"use client";

import { FormEvent, useState, useEffect } from 'react';
import { MdWaterDrop, MdCheckCircle, MdError } from 'react-icons/md';
import './newsletterStrip.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_TIMEOUT_MS = 12000;
const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787').replace(/\/$/, '');

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export default function NewsletterStrip() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('Submitting...');

    const emailLower = email.trim().toLowerCase();

    if (!EMAIL_RE.test(emailLower)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await withTimeout(
        fetch(`${BACKEND_URL}/api/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailLower }),
        }),
        REQUEST_TIMEOUT_MS
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setMessage(data?.error || 'Unable to subscribe right now.');
        return;
      }

      setStatus('success');
      if (data?.state === 'created') {
        setMessage('Subscription created. Welcome to the flow.');
      } else if (data?.state === 'reactivated') {
        setMessage('Subscription reactivated successfully.');
      } else if (data?.state === 'already_active') {
        setMessage('You are already subscribed.');
      } else {
        setMessage('You are subscribed. Welcome to the flow.');
      }

      setEmail('');
    } catch (error) {
      const debugMessage =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message?: string }).message)
          : 'unknown error';
      setStatus('error');
      setMessage(`Unable to subscribe right now: ${debugMessage}`);
    }
  };

  return (
    <>
      {status !== 'idle' && message ? (
        <div className={`newsletter-toast newsletter-toast--${status}`} role="status" aria-live="polite">
          <span className="newsletter-toast-icon" aria-hidden="true">
            {status === 'success' ? <MdCheckCircle /> : null}
            {status === 'error' ? <MdError /> : null}
          </span>
          <p>{message}</p>
        </div>
      ) : null}

      <section className="newsletter-strip" aria-label="Newsletter signup">
        <div className="newsletter-strip-inner">
          <div className="newsletter-strip-eyebrow">Newsletter</div>
          <h2>
            Stay in the <em>flow.</em>
          </h2>
          <div className="newsletter-strip-subheading">with PURE Norway WATER</div>
          <form className="newsletter-strip-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              aria-label="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              disabled={status === 'loading'}
            >
              <span className="newsletter-btn-text">Subscribe</span>
              <MdWaterDrop className="newsletter-btn-icon" />
            </button>
          </form>
          <span className="newsletter-strip-note">No spam. Unsubscribe anytime.</span>
        </div>
      </section>
    </>
  );
}