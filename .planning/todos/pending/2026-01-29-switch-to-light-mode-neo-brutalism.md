---
created: 2026-01-29T14:55
title: Switch to light-mode neo-brutalism styling
area: ui
files:
  - src/styles/tokens.css
  - src/styles/global.css
  - src/layouts/BaseLayout.astro
---

## Problem

The site currently uses a dark mode neo-brutalist aesthetic (dark backgrounds, neon green accent). The vision has shifted to a light-mode neo-brutalism style — bold colors on light/white backgrounds, thick borders, high contrast, playful shadows. This is a significant design system overhaul affecting color tokens, backgrounds, text colors, and component styling across the entire site.

Reference: https://www.behance.net/gallery/164728311/How-can-I-design-in-the-Neo-Brutalism-style

Key characteristics of light-mode neo-brutalism from the reference:
- Light/white backgrounds instead of dark
- Bold, saturated accent colors
- Thick black borders and hard drop shadows
- High contrast typography
- Playful, intentional use of color blocks

This reverses the "Dark mode only" decision from Phase 1. Will need to update color tokens, component styles, and potentially rethink the neon green accent for a light background context.

## Solution

TBD — needs a dedicated phase or plan to:
1. Redefine color tokens (background, text, accent colors for light mode)
2. Update global.css body/html background and text colors
3. Adjust component styles (Card, Button, Footer) for light backgrounds
4. Update hard shadow colors (currently likely light shadows on dark — need dark shadows on light)
5. Review typography contrast on light backgrounds
6. Reference the Behance guide for specific color palette inspiration
