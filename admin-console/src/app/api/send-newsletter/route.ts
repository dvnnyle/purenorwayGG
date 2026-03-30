import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { generateNewsletterTemplate } from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    const { subject, fromName, eyebrow, heading, body, imageUrl, imageAlt } = await request.json();

    if (!subject || !heading || !body) {
      return NextResponse.json(
        { error: 'Subject, heading, and body are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY_NEWSLETTER;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    // Fetch active subscribers
    const subscribersQuery = query(
      collection(db, "newsletterSubscribers"),
      where("status", "==", "active")
    );
    const snapshot = await getDocs(subscribersQuery);
    
    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'No active subscribers found.' },
        { status: 400 }
      );
    }

    const emails = snapshot.docs.map((doc) => doc.data().email as string);

    console.log('📧 Preparing to send to:', emails);
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key prefix:', apiKey?.substring(0, 8));

    const resend = new Resend(apiKey);

    // TESTING MODE: Resend free tier only allows sending to your account email
    // Replace this with your Resend account email for testing
    const testMode = true;
    const testEmail = 'dev.dvnny@gmail.com'; // Your Resend account email
    
    if (testMode) {
      // Generate test email with test email as unsubscribe param
      const htmlContent = generateNewsletterTemplate({
        subject,
        eyebrow,
        heading,
        body,
        imageUrl,
        imageAlt,
        subscriberEmail: testEmail,
        baseUrl: 'http://localhost:3000',
      });

      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: testEmail,
        subject: `[TEST] ${subject}`,
        html: htmlContent,
        replyTo: 'info@purenorwaywater.com',
      });

      console.log('✅ Test email sent:', result);

      return NextResponse.json({
        success: true,
        recipientCount: 1,
        messageId: result.data?.id,
        testMode: true,
      });
    }

    // PRODUCTION MODE: Send individual emails to each subscriber with personalized unsubscribe links
    const sendPromises = emails.map(async (email) => {
      const htmlContent = generateNewsletterTemplate({
        subject,
        eyebrow,
        heading,
        body,
        imageUrl,
        imageAlt,
        subscriberEmail: email,
      });

      return resend.emails.send({
        from: 'newsletter@purenorwaywater.com', // Must verify domain at resend.com first
        to: email,
        subject,
        html: htmlContent,
        replyTo: 'info@purenorwaywater.com',
      });
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.data).length;

    console.log(`✅ Sent ${successCount}/${emails.length} emails`);

    return NextResponse.json({
      success: true,
      recipientCount: successCount,
      testMode: false,
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to send newsletter: ${errorMessage}` },
      { status: 500 }
    );
  }
}
