# NavMenu Component

A beautiful island-style floating navigation menu with glassmorphism effects.

## Features

- 🏝️ Island-style floating design
- 🎨 Glassmorphism with backdrop blur
- 📱 Fully responsive with mobile menu
- 🌐 Optional language switcher
- ⚡ Smooth animations and transitions
- 🎯 Customizable links and CTA button

## Usage

```tsx
import NavMenu from '@/components/navmenu';

<NavMenu 
  logoText="BigWater"
  logoSrc="/assets/logo/logo.svg"  // optional
  links={[
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]}
  ctaText="Get Started"
  ctaHref="#cta"
  showLanguageSwitch={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoSrc` | string | undefined | Path to logo image (optional) |
| `logoText` | string | 'BigWater' | Text to display if no logo image |
| `links` | NavLink[] | Default links | Array of navigation links |
| `ctaText` | string | 'Get Started' | Text for the CTA button |
| `ctaHref` | string | '#cta' | Link for the CTA button |
| `showLanguageSwitch` | boolean | false | Show/hide language switcher |

## NavLink Type

```typescript
interface NavLink {
  label: string;
  href: string;
}
```

## Customization

Edit `navmenu.css` to customize:
- Colors and opacity
- Border radius
- Spacing and padding
- Hover effects
- Responsive breakpoints
