This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy as Static Site (Render)

This admin app can be deployed as a static site because authentication is handled in the browser with Firebase Auth.

Use these Render settings:

- Service type: Static Site
- Root Directory: `admin-console`
- Build Command: `npm install; npm run build`
- Publish Directory: `out`

Required environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_ADMIN_EMAILS`

Security requirements:

- Enable Firebase Authentication Email/Password provider.
- Create the admin user in Firebase Auth.
- Publish the rules in [admin-console/firestore.rules](admin-console/firestore.rules) and [admin-console/storage.rules](admin-console/storage.rules).
- Replace the placeholder admin email in those rule files with your real admin email before publishing.

The included Firestore rules are set up to keep the public website working:

- published news remains publicly readable
- active gallery slides remain publicly readable
- approved reviews remain publicly readable
- public visitors can still submit new reviews as pending
- admin writes remain restricted to the Firebase admin account

Rule publishing from this folder:

```bash
npm install
npm run firebase:login
npm run deploy:firebase
```

If you only changed Firestore rules or indexes:

```bash
npm run deploy:firestore
```

If you only changed Storage rules:

```bash
npm run deploy:storage
```

This folder is already configured for Firebase project `bigwaterh2o` through [.firebaserc](.firebaserc) and [firebase.json](firebase.json).

Without Firebase rules, a static login screen is only cosmetic. The rules are what actually protect your admin data.
