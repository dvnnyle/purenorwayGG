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

## After updating rules

1. Publish Firestore rules.
2. Publish Storage rules.
3. Restart both apps.
