# Width Style Rules (BigWater)

This file defines the default width and horizontal spacing rules for all major sections.

## Core Container Rules

- Content max width: `1400px`
- Desktop side padding: `40px`
- Laptop side padding (`<= 1400px`): `28px`
- Mobile side padding (`<= 768px`): `20px` (or `0` only for intentional full-bleed sections)

## Standard Section Wrapper Pattern

Use this for section wrappers that contain centered content.

```css
.section-wrap {
	width: 100%;
	padding: 0 40px;
	box-sizing: border-box;
}

.section-inner {
	max-width: 1400px;
	margin: 0 auto;
}

@media (max-width: 1400px) {
	.section-wrap {
		padding: 0 28px;
	}
}

@media (max-width: 768px) {
	.section-wrap {
		padding: 0 20px;
	}
}
```

## Home Page Alignment Rules

For consistency, these sections should follow the same horizontal rhythm:

- `SectionFourCarousel`
- `SloganDivider`
- `ImageCarousel`
- `ImpactCounter`
- `MerchReviews`
- `Footer`

If one section looks wider/narrower than another at the same viewport, check:

- Wrapper side padding mismatch (`40` vs `20` or missing `28` breakpoint)
- Missing `box-sizing: border-box`
- Different `max-width` values

## Special Cases

- Full-bleed intentional sections can use `padding: 0` at mobile.
- If a section uses a fixed visual width element (for example, divider lines), keep the outer wrapper on the standard spacing system.

## Quick QA Checklist

- At `1440px`: section content lines up visually across the page.
- At `1366px`: side gutters are consistent.
- At `1280px`: no section appears wider than neighboring sections.
- At `768px` and below: no horizontal overflow.

