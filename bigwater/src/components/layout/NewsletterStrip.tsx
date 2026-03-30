"use client";

import { FormEvent, useState, useEffect } from 'react';
import { MdWaterDrop, MdCheckCircle, MdError } from 'react-icons/md';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import './newsletterStrip.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    setMessage('');

    const emailLower = email.trim().toLowerCase();

    if (!EMAIL_RE.test(emailLower)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const subscribersRef = collection(db, 'newsletterSubscribers');
      const existingQuery = query(subscribersRef, where('email', '==', emailLower));
      const existingSnapshot = await getDocs(existingQuery);

      setStatus('success');
      if (!existingSnapshot.empty) {
        const existingDoc = existingSnapshot.docs[0];
        const existingData = existingDoc.data() as { status?: string };

        if (existingData.status !== 'active') {
          await updateDoc(existingDoc.ref, {
            status: 'active',
            subscribedAt: new Date().toISOString(),
            resubscribedAt: new Date().toISOString(),
          });
          setMessage('Subscription reactivated successfully.');
        } else {
          setMessage('You are already subscribed.');
        }
      } else {
        await addDoc(subscribersRef, {
          email: emailLower,
          subscribedAt: new Date().toISOString(),
          status: 'active',
        });
        setMessage('Subscription created. Welcome to the flow.');
      }

      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Unable to subscribe right now. Check Firestore rules and try again.');
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