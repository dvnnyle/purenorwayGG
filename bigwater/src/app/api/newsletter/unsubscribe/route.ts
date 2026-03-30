import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Firebase Admin credentials not configured');
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
    initializeFirebaseAdmin();
    const db = getFirestore();
    
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Find the subscriber document
    const subscribersRef = db.collection('newsletterSubscribers');
    const snapshot = await subscribersRef.where('email', '==', emailLower).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Email not found in our subscriber list' },
        { status: 404 }
      );
    }

    // Update status to inactive
    const doc = snapshot.docs[0];
    await doc.ref.update({
      status: 'inactive',
      unsubscribedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    );
  }
}
