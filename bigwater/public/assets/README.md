# Assets Directory Structure

This directory contains all static assets for the BigWater project.

## Folder Structure

```
assets/
├── images/     # General images (banners, backgrounds, photos)
├── videos/     # Video files
├── logo/       # Logo files (SVG, PNG variations)
└── icons/      # Icon files and icon sets
```

## Usage

To use assets in your components:

```jsx
// For images
<img src="/assets/images/hero-banner.jpg" alt="Hero Banner" />

// For logos
<img src="/assets/logo/bigwater-logo.svg" alt="BigWater Logo" />

// For videos
<video src="/assets/videos/intro.mp4" />
```

## Notes

- Keep file names lowercase with hyphens (e.g., `hero-banner.jpg`)
- Optimize images before uploading
- Use SVG for logos when possible
- Include multiple sizes for responsive images
