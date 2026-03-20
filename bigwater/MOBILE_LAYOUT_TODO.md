# Mobile Layout TODO (20px Wrapper Rule)

## Goal
Use one consistent horizontal gutter on mobile: the page wrapper provides 20px side spacing, and inner sections should not add extra side padding.

## Core Rule
- Wrapper owns horizontal spacing on mobile (20px left/right).
- Section containers on mobile should use horizontal padding of 0 when they are already inside the wrapper.
- Avoid double gutters like 20 + 20.

## What We Already Fixed (Home)
- Home wrapper uses 20px side spacing.
- Mobile section dots are hidden.
- Hero keeps 16:9 ratio on mobile.
- Double-padding issues were removed in key home sections.

## Apply Later To Other Pages
For each page below:
1. Confirm the main wrapper has 20px side spacing on mobile.
2. Find sections inside that wrapper.
3. Remove section-level horizontal mobile padding when it duplicates wrapper spacing.
4. Keep vertical spacing as needed.
5. Check for horizontal scroll.
6. Verify at 768px and 480px breakpoints.

### Priority Pages
- Products
- Gallery
- Blog
- Reviews
- About
- Contact
- News
- Any Home2 pages still using custom section paddings

## Quick Audit Checklist
- Search for mobile rules with padding values like 20px, 24px, 28px on section roots.
- Confirm whether each section is already inside a wrapper with side gutters.
- If yes, set horizontal padding to 0 for that mobile rule.
- Re-test cards/carousels for clipping after gutter changes.

## Notes
- This rule is about horizontal spacing consistency only.
- Keep component-specific internal spacing when it affects readability.
- If a section intentionally breaks out full-bleed, document that exception in this file.
