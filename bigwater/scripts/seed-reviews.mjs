import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { Timestamp, doc, getFirestore, setDoc } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

await loadEnvFile(path.join(projectRoot, ".env"));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const missingVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing Firebase env vars: ${missingVars.join(", ")}`);
}

const seedFile = path.join(projectRoot, "src", "data", "reviewsSeed.json");
const seedJson = await readFile(seedFile, "utf8");
const seedReviews = JSON.parse(seedJson);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

for (const entry of seedReviews) {
  const createdAt = Timestamp.fromDate(new Date(entry.createdAt));

  await setDoc(
    doc(db, "reviews", entry.id),
    {
      name: entry.name,
      location: entry.location,
      productTag: entry.productTag,
      text: entry.text,
      rating: entry.rating,
      status: entry.status,
      featured: entry.featured,
      verifiedPurchase: entry.verifiedPurchase,
      photos: [],
      createdAt,
      updatedAt: createdAt,
      reviewedAt: createdAt,
      reviewedBy: "Seed Script",
    },
    { merge: true }
  );
}

console.log(`Seeded ${seedReviews.length} reviews into project ${firebaseConfig.projectId}.`);

async function loadEnvFile(filePath) {
  const envContents = await readFile(filePath, "utf8");

  for (const rawLine of envContents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}