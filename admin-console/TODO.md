# Admin Console TODO

## Priority

- [ ] Add Google sign-in option for admin accounts
- [ ] Decide whether Google login should replace Email/Password or exist as a backup option
- [ ] Move admin allowlist from hardcoded Firebase rules emails to a cleaner role-based approach
- [ ] Add a proper unauthorized screen for signed-in users who are not approved admins
- [ ] Test login, logout, refresh, and expired-session flows on both admin domains

## Auth

- [ ] Add Google Auth provider support in the login screen
- [ ] Optionally support linking Google login and Email/Password to the same Firebase user
- [ ] Improve admin session persistence handling so refreshes feel instant
- [ ] Add friendlier Firebase auth error messages for wrong password, missing user, and disabled account
- [ ] Add password reset flow for admin accounts
- [ ] Add rate-limit or abuse protection plan for repeated failed logins

## Security

- [ ] Replace single-email checks in `firestore.rules` and `storage.rules` with custom claims or admin role documents
- [ ] Review Firestore rules for least-privilege access per collection
- [ ] Review Storage rules for any future upload folders before adding them
- [ ] Add an audit trail for content edits, review approvals, and image uploads
- [ ] Define a recovery process if the main admin account is locked out

## UX

- [ ] Polish the login page design to match the main brand more closely
- [ ] Add a proper loading state for dashboard data after login
- [ ] Add toast notifications for save, publish, delete, upload, and logout actions
- [ ] Add unsaved-changes warnings on edit forms
- [ ] Improve mobile layout for the sidebar and dashboard pages
- [ ] Add empty states for news, gallery, reviews, and products sections

## Content Workflow

- [ ] Add draft/published scheduling support for blog posts
- [ ] Add image preview and drag-and-drop upload for gallery and news assets
- [ ] Add bulk actions for reviews and gallery items
- [ ] Add search and filtering across posts, reviews, and products
- [ ] Add pagination or infinite loading where collections get large
- [ ] Add product management if the store section is going to be actively used

## Reliability

- [ ] Add reusable error boundaries around major admin sections
- [ ] Add retry states for Firebase reads and writes
- [ ] Add form validation rules shared across all admin forms
- [ ] Add basic smoke tests for auth flow and protected routes
- [ ] Add a pre-deploy checklist for env vars, Firebase rules, and static export

## Nice To Have

- [ ] Add admin profile settings
- [ ] Add theme polish for the session, login, and dashboard transitions
- [ ] Add analytics for admin usage and content activity
- [ ] Add a small activity feed on the dashboard
- [ ] Add markdown preview for blog/article editing