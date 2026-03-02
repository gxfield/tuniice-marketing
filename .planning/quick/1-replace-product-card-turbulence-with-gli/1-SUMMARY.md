---
phase: quick
plan: 1
subsystem: ui-effects
tags: [glitch, magnetic, hover, css-animation, accessibility]
dependency_graph:
  requires: []
  provides: [product-image-glitch, magnetic-secondary-button, magnetic-card]
  affects: [src/components/ui/ProductCard.astro, src/styles/effects.css, src/components/ui/Button.astro, src/components/ui/Card.astro]
tech_stack:
  added: []
  patterns: [css-clip-path-glitch, magnetic-cursor-follow, astro-page-load-listener]
key_files:
  created: []
  modified:
    - src/components/ui/ProductCard.astro
    - src/styles/effects.css
    - src/components/ui/Button.astro
    - src/components/ui/Card.astro
decisions:
  - "CSS clip-path keyframes (steps(1)) for product image glitch — matches brand glitch aesthetic vs SVG turbulence which was a different visual language"
  - "Glitch pseudo-element styles in effects.css global scope (not ProductCard scoped style) — Astro scoping blocks reduced-motion override from applying to pseudo-elements"
  - "Card magnetic factor 0.15 vs button 0.25 — larger surface area needs less movement to avoid jarring feel"
metrics:
  duration: "~10 minutes"
  completed: "2026-03-02"
  tasks_completed: 2
  files_modified: 4
---

# Quick Task 1: Replace Product Card Turbulence with CSS Glitch Summary

**One-liner:** CSS clip-path glitch burst on product images (green + orange layers, steps(1), 300ms) replacing SVG feTurbulence, plus magnetic cursor-follow extended to secondary buttons and cards.

## What Was Built

### Task 1: Product Image Glitch Effect

Removed the SVG `feTurbulence`/`feDisplacementMap` filter from `ProductCard.astro` and replaced with a CSS clip-path glitch effect in `effects.css`:

- Two keyframes (`glitch-image-before`, `glitch-image-after`) using `clip-path: inset()` to reveal horizontal colored slice overlays
- `::before` layer: green (`--color-accent`), opacity max 0.4, `mix-blend-mode: screen`
- `::after` layer: orange (`--color-accent-warm`), offset by 50ms delay, different clip values for variety
- Both layers: 300ms duration, `steps(1)` timing, `forwards` fill — one-shot burst on hover
- Hover trigger gated by `@media (pointer: fine) and (prefers-reduced-motion: no-preference)`
- Reduced-motion override sets `display: none` on both pseudo-elements
- `position: relative` on `.product-image` placed in `effects.css` (global), not scoped style — matches the brand glitch pattern decision

### Task 2: Magnetic Cursor-Follow on Secondary Buttons and Cards

**Button.astro:**
- Added `--mag-x: 0px; --mag-y: 0px;` and `will-change: transform` to `.btn-secondary`
- Added `calc(-2px + var(--mag-x)), calc(-2px + var(--mag-y))` transform to `.btn-secondary:hover`
- Updated JS selector from `.btn-primary` to `.btn-primary, .btn-secondary`

**Card.astro:**
- Added `--mag-x: 0px; --mag-y: 0px;` and `will-change: transform` to `.card`
- Updated `.card:hover` transform to use calc() with magnetic offsets
- Added `<script>` block with `astro:page-load` listener, pointer/reduced-motion gates, scoped mouseenter/mouseleave/mousemove pattern — magnetic factor 0.15 (vs 0.25 for buttons)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | a632c6b | feat(quick-1): replace SVG turbulence with CSS clip-path glitch on product images |
| 2 | b4c2a10 | feat(quick-1): extend magnetic cursor-follow to secondary buttons and cards |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `grep -c "feTurbulence" src/components/ui/ProductCard.astro` = 0
- `grep -c "glitch-image" src/styles/effects.css` = 4
- `grep -c "mag-x" src/components/ui/Card.astro` = 4
- `grep "btn-primary, .btn-secondary" src/components/ui/Button.astro` matches
- `npx astro build` completed successfully (5 pages built)
