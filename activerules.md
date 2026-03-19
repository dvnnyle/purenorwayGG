# Firebase Rules (Development)

Use these in Firebase Console while developing.

## Firestore Rules

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // News collection used by admin + frontend
    match /newsArticles/{docId} {
      allow read, write: if true;
    }

    // Carousel gallery collection used by admin + frontend
    match /gallerySlides/{docId} {
      allow read, write: if true;
    }

    // Reviews collection used by admin moderation + frontend submissions/display
    match /reviews/{docId} {
      allow read, write: if true;
    }
  }
}
```

## Storage Rules

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // News images
    match /news-images/{allPaths=**} {
      allow read, write: if true;
    }

    // Gallery images
    match /gallery-images/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## Firestore Indexes

The current admin reviews query only uses `orderBy(createdAt, desc)`, so it should work once the Firestore rules above are published.

Create these `reviews` indexes only if Firestore prompts for them when you add filtered/sorted review queries:

```txt
Collection: reviews
Fields:
- status Asc
- createdAt Desc
Query scope: Collection

Collection: reviews
Fields:
- status Asc
- featured Asc
- createdAt Desc
Query scope: Collection

Collection: reviews
Fields:
- status Asc
- rating Desc
- createdAt Desc
Query scope: Collection
```

## After updating rules

1. Publish Firestore rules.
2. Create any required Firestore indexes.
3. Publish Storage rules.
4. Restart both apps.
