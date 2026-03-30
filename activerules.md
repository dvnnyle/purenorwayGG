## Firestore

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

    // Newsletter subscribers collection used by API + admin
    match /newsletterSubscribers/{docId} {
      allow read, write: if true;
    }
  }
}


## Storage
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