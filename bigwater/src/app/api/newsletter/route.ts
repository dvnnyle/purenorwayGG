import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!clientEmail || !privateKey || clientEmail.includes('your-service-account')) {
    throw new Error('Firebase Admin credentials not configured. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env');
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { email, website } = await request.json();

    // Honeypot: bots often fill hidden fields.
    if (typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Initialize Firebase Admin
    try {
      initializeFirebaseAdmin();
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      return NextResponse.json(
        { error: 'Newsletter service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const db = getFirestore();
    const emailLowerCase = email.trim().toLowerCase();
    const newsletterRef = db.collection('newsletterSubscribers');

    // Check if email already exists
    const existingSnapshot = await newsletterRef.where('email', '==', emailLowerCase).limit(1).get();
    
    if (!existingSnapshot.empty) {
      // If the subscriber exists but is inactive/unsubscribed, reactivate them.
      const existingDoc = existingSnapshot.docs[0];
      const existingData = existingDoc.data() as { status?: string };

      if (existingData.status !== 'active') {
        await existingDoc.ref.update({
          status: 'active',
          subscribedAt: new Date().toISOString(),
          resubscribedAt: new Date().toISOString(),
        });
      }

      // Already active (or reactivated) - return success silently
      return NextResponse.json({ success: true });
    }

    // Add new subscriber
    await newsletterRef.add({
      email: emailLowerCase,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    // Keep the response generic to avoid leaking provider details.
    return NextResponse.json({ error: 'Unable to subscribe right now. Please try again.' }, { status: 500 });
  }
}
