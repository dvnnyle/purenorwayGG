# Newsletter System Setup Guide

## What's Implemented

✅ **Frontend (bigwater)**: Newsletter signup form saves emails to Firebase Firestore
✅ **Backend (admin-console)**: Full admin panel to view and manage newsletter subscribers

## How It Works

1. Users sign up via the newsletter form on your website
2. Emails are saved to Firebase Firestore (`newsletterSubscribers` collection)
3. Admins can view, search, and manage subscribers in the admin console
4. Admins can copy all email addresses for sending newsletters via Resend or other services

## Setup Steps

### 1. Get Firebase Admin Credentials

To allow the newsletter API to write to Firestore, you need Firebase Admin credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **bigwaterh2o**
3. Click the **gear icon** (⚙️) > **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. A JSON file will download with your credentials

### 2. Update .env File

Open `bigwater/.env` and add the values from your downloaded JSON file:

```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@bigwaterh2o.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important**: Keep the quotes around the private key and ensure `\n` characters are preserved.

### 3. Test the Newsletter Signup

1. Restart your dev servers (both bigwater and admin-console)
2. Go to your website and submit the newsletter form
3. Open the admin console at `/newsletter` to see the new subscriber

## Admin Console Features

- **View all subscribers** with email, subscription date, and status
- **Search** by email address
- **Delete** subscribers individually
- **Copy all emails** to clipboard for sending newsletters
- **Stats** showing total and active subscriber counts

## Sending Newsletters

You can use **Resend** or any email service:

1. Go to admin console `/newsletter`
2. Click **Copy All Emails** to get comma-separated list
3. Use Resend's API or dashboard to send emails to the list

## File Changes Summary

### Frontend (bigwater)
- `src/app/api/newsletter/route.ts` - Updated to save to Firestore instead of Resend Contacts
- `.env` - Added Firebase Admin credentials

### Admin Console
- `src/lib/newsletterService.ts` - New service for managing subscribers
- `src/app/newsletter/page.tsx` - New admin page for newsletter users
- `src/app/_components/AdminSidebar.tsx` - Added "Newsletter Users" link
- `src/app/page.tsx` - Added newsletter quick link to dashboard

## Next Steps

1. Add Firebase Admin credentials to `.env`
2. Restart your dev servers
3. Test the newsletter signup
4. Start collecting subscribers!

Need help? Check the Firebase Admin SDK docs or ask for assistance.
