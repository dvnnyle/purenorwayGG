import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

const PORT = Number(process.env.PORT || 8787);
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:3001';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: [WEB_URL, ADMIN_URL, 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

function ensureFirebaseAdmin() {
  if (getApps().length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin environment variables.');
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

function buildHtml({ subject, eyebrow, heading, body, imageUrl, imageAlt, unsubscribeUrl }) {
  const safeSubject = subject || heading || 'Newsletter';
  const eyebrowHtml = eyebrow
    ? `<p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#12a0ec;">${eyebrow}</p>`
    : '';
  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" alt="${imageAlt || ''}" style="display:block;width:100%;max-width:640px;border-radius:8px;margin:0 0 24px;"/>`
    : '';
  const bodyHtml = String(body || '')
    .split('\n\n')
    .filter((p) => p.trim())
    .map((p) => `<p style="margin:0 0 16px;line-height:1.7;color:#4a5a68;font-size:15px;">${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${safeSubject}</title></head>
<body style="margin:0;padding:0;background:#f4f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;background:#f4f8fa;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:760px;background:#fff;overflow:hidden;">
        <tr><td style="background:#0d1b2a;padding:24px 28px;text-align:center;color:#fff;font-weight:700;">PURE NORWAY WATER</td></tr>
        <tr><td style="height:3px;background:#12a0ec;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:40px 28px;">
          ${eyebrowHtml}
          <h1 style="margin:0 0 16px;font-size:34px;line-height:1.08;color:#0d1b2a;">${heading || ''}</h1>
          ${imageHtml}
          ${bodyHtml}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
            <td style="background:#12a0ec;border-radius:8px;">
              <a href="https://purenorwaywater.com" target="_blank" style="display:inline-block;padding:12px 22px;color:#fff;text-decoration:none;font-weight:700;">Visit Our Website</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="height:3px;background:#12a0ec;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="background:#0d1b2a;padding:22px 28px;text-align:center;color:rgba(255,255,255,.55);font-size:12px;">
          <div style="margin-bottom:10px;">You're receiving this because you subscribed to Pure Norway updates.</div>
          <a href="${unsubscribeUrl}" style="color:#9fdcff;text-decoration:underline;">Unsubscribe</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'backend-service' });
});

app.get('/api/newsletter/subscribers', async (_req, res) => {
  try {
    ensureFirebaseAdmin();
    const db = getFirestore();

    const snapshot = await db.collection('newsletterSubscribers').orderBy('subscribedAt', 'desc').get();
    const subscribers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return res.json({ success: true, subscribers });
  } catch (error) {
    console.error('subscribers error', error);
    return res.status(500).json({ error: 'Failed to fetch subscribers.' });
  }
});

app.get('/api/newsletter/active-count', async (_req, res) => {
  try {
    ensureFirebaseAdmin();
    const db = getFirestore();

    const snapshot = await db
      .collection('newsletterSubscribers')
      .where('status', '==', 'active')
      .get();

    return res.json({ success: true, count: snapshot.size });
  } catch (error) {
    console.error('active-count error', error);
    return res.status(500).json({ error: 'Failed to fetch active count.' });
  }
});

app.post('/api/newsletter/delete', async (req, res) => {
  try {
    ensureFirebaseAdmin();
    const db = getFirestore();

    const id = String(req.body?.id || '').trim();
    if (!id) {
      return res.status(400).json({ error: 'Subscriber id is required.' });
    }

    await db.collection('newsletterSubscribers').doc(id).delete();
    return res.json({ success: true });
  } catch (error) {
    console.error('delete subscriber error', error);
    return res.status(500).json({ error: 'Failed to delete subscriber.' });
  }
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    ensureFirebaseAdmin();
    const db = getFirestore();

    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const ref = db.collection('newsletterSubscribers');
    const existing = await ref.where('email', '==', email).limit(1).get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      const status = doc.data()?.status;
      if (status !== 'active') {
        await doc.ref.update({
          status: 'active',
          subscribedAt: new Date().toISOString(),
          resubscribedAt: new Date().toISOString(),
        });
        return res.json({ success: true, state: 'reactivated' });
      }
      return res.json({ success: true, state: 'already_active' });
    }

    await ref.add({
      email,
      status: 'active',
      subscribedAt: new Date().toISOString(),
    });

    return res.json({ success: true, state: 'created' });
  } catch (error) {
    console.error('subscribe error', error);
    return res.status(500).json({ error: 'Unable to subscribe right now.' });
  }
});

app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    ensureFirebaseAdmin();
    const db = getFirestore();

    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Valid email is required.' });

    const ref = db.collection('newsletterSubscribers');
    const existing = await ref.where('email', '==', email).limit(1).get();

    if (existing.empty) {
      return res.status(404).json({ error: 'Email not found in subscriber list.' });
    }

    await existing.docs[0].ref.update({
      status: 'inactive',
      unsubscribedAt: FieldValue.serverTimestamp(),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('unsubscribe error', error);
    return res.status(500).json({ error: 'Failed to unsubscribe.' });
  }
});

app.post('/api/newsletter/send', async (req, res) => {
  try {
    ensureFirebaseAdmin();
    const db = getFirestore();

    const apiKey = process.env.RESEND_API_KEY_NEWSLETTER;
    if (!apiKey) {
      return res.status(500).json({ error: 'Email service is not configured.' });
    }

    const { subject, eyebrow, heading, body, imageUrl, imageAlt } = req.body || {};
    if (!subject || !heading || !body) {
      return res.status(400).json({ error: 'Subject, heading, and body are required.' });
    }

    const snapshot = await db
      .collection('newsletterSubscribers')
      .where('status', '==', 'active')
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ error: 'No active subscribers found.' });
    }

    const resend = new Resend(apiKey);
    const testMode = String(process.env.NEWSLETTER_TEST_MODE || 'true') === 'true';
    const testEmail = process.env.NEWSLETTER_TEST_EMAIL || 'dev.dvnny@gmail.com';
    const from = process.env.NEWSLETTER_FROM || 'onboarding@resend.dev';
    const replyTo = process.env.NEWSLETTER_REPLY_TO || 'info@purenorwaywater.com';

    if (testMode) {
      const html = buildHtml({
        subject,
        eyebrow,
        heading,
        body,
        imageUrl,
        imageAlt,
        unsubscribeUrl: `${WEB_URL}/unsubscribe?email=${encodeURIComponent(testEmail)}`,
      });

      const result = await resend.emails.send({
        from,
        to: testEmail,
        subject: `[TEST] ${subject}`,
        html,
        replyTo,
      });

      return res.json({ success: true, recipientCount: 1, testMode: true, messageId: result?.data?.id });
    }

    const activeEmails = snapshot.docs.map((d) => String(d.data().email || '').toLowerCase()).filter(Boolean);

    const sendJobs = activeEmails.map(async (email) => {
      const html = buildHtml({
        subject,
        eyebrow,
        heading,
        body,
        imageUrl,
        imageAlt,
        unsubscribeUrl: `${WEB_URL}/unsubscribe?email=${encodeURIComponent(email)}`,
      });

      return resend.emails.send({
        from,
        to: email,
        subject,
        html,
        replyTo,
      });
    });

    const results = await Promise.all(sendJobs);
    const successCount = results.filter((r) => !!r?.data?.id).length;

    return res.json({ success: true, recipientCount: successCount, testMode: false });
  } catch (error) {
    console.error('send error', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `Failed to send newsletter: ${message}` });
  }
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('PURENorway backend online');
  console.log(`Backend URL: http://localhost:${PORT}`);
  console.log(`Web allowed: ${WEB_URL}`);
  console.log(`Admin allowed: ${ADMIN_URL}`);
  console.log('Health check ready at /health');
  console.log('========================================');
});
