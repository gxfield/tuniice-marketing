# Roadmap: tuniice

## Overview

A marketing site that establishes tuniice as a credible, distinctive brand through neo-brutalist design and minimal but intentional content.

## Milestones

- **v1.0 tuniice Marketing Site** — Phases 1-4 (shipped 2026-01-29)
- **v1.1 UI Candy & Subdomains** — Phases 7-10 (in progress)

## Phases

<details>
<summary>v1.0 tuniice Marketing Site (Phases 1-4) — SHIPPED 2026-01-29</summary>

- [x] Phase 1: Foundation (3/3 plans) — completed 2026-01-28
- [x] Phase 1.1: Update Page Structure (1/1 plan) — completed 2026-01-29
- [x] Phase 1.2: Remove Header & Update Styling (1/1 plan) — completed 2026-01-29
- [x] Phase 2: Home & Core Content (2/2 plans) — completed 2026-01-29
- [x] Phase 3: Products Showcase (2/2 plans) — completed 2026-01-29
- [x] Phase 4: About & Music (2/2 plans) — completed 2026-01-29

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### v1.1 UI Candy & Subdomains (In Progress)

**Milestone Goal:** Add bold visual effects and subdomain infrastructure to make the site feel alive and establish the pattern for per-app mini-sites.

- [x] **Phase 7: Page Transitions** - Smooth ClientRouter transitions between all pages with per-page styles
- [x] **Phase 8: Canvas Animated Background** - Particle field hero animation with lifecycle-safe RAF management (completed 2026-03-02)
- [x] **Phase 9: CSS Interactive Effects** - Glitch text, hover distortion, and magnetic button effects (completed 2026-03-02)
- [ ] **Phase 10: Subdomain Infrastructure** - bluepriint.tuniice.com live with shared design system

## Phase Details

### Phase 7: Page Transitions
**Goal**: Users see fluid, styled transitions when navigating between pages
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: TRANS-01, TRANS-02, TRANS-03
**Success Criteria** (what must be TRUE):
  1. Navigating between any two pages produces a visible fade transition with no flash or flicker
  2. Product detail pages use a distinct transition style (e.g., slide) that differs from the default fade
  3. Story page uses a distinct transition style (e.g., morph/scale) that differs from the default fade
  4. Transition duration is controlled by a single CSS custom property (e.g., `--transition-duration`) referenced by all keyframes
**Plans**: 2 plans

Plans:
- [x] 07-01: Default sequential fade transition, global keyframes, timing tokens, scroll reset, animation replay
- [x] 07-02: Per-page transition overrides (slide for product detail, scale for story) and visual verification

### Phase 8: Canvas Animated Background
**Goal**: Users see a live particle field in the hero section that starts and stops cleanly with navigation
**Depends on**: Phase 7 (lifecycle pattern validated)
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05
**Success Criteria** (what must be TRUE):
  1. An animated particle field is visible in the hero section on pages that have a hero
  2. After multiple navigations, exactly one RAF loop is running (no stacking or blank canvas)
  3. Particles render sharply on a Retina/HiDPI display (no blur)
  4. Switching to another browser tab pauses the animation; returning resumes it
  5. With `prefers-reduced-motion: reduce` set, the hero shows a static fallback instead of animation
**Plans**: TBD

Plans:
- [ ] 08-01: CanvasBackground.astro particle system with RAF lifecycle, HiDPI sizing, and Hero integration
- [ ] 08-02: Visibility pause (tab + scroll), prefers-reduced-motion fallback, and visual verification

### Phase 9: CSS Interactive Effects
**Goal**: Users see glitch text on the hero headline and hover distortion on product cards and buttons
**Depends on**: Phase 8 (canvas lifecycle validated; design tokens stable)
**Requirements**: FX-01, FX-02, FX-03, FX-04
**Success Criteria** (what must be TRUE):
  1. The hero headline cycles through a glitch animation (scrambled characters or offset layers)
  2. Hovering a product card triggers a visible turbulence/distortion effect on the card
  3. Hovering a primary button produces a magnetic pull or glow effect
  4. With `prefers-reduced-motion: reduce` set, all three effects are absent or replaced with a simple opacity change; effects are absent on touch devices (`pointer: coarse`)
**Plans**: 2 plans

Plans:
- [ ] 09-01-PLAN.md — Glitch text CSS keyframes on hero headline and SVG feTurbulence hover filter for product card images
- [ ] 09-02-PLAN.md — Magnetic cursor-follow on primary buttons and reduced-motion/pointer gating for all effects

### Phase 10: Subdomain Infrastructure
**Goal**: bluepriint.tuniice.com resolves to a live Astro site with the shared design system and its own accent color
**Depends on**: Phase 9 (design tokens finalized in main site)
**Requirements**: SUB-01, SUB-02, SUB-03, SUB-04
**Success Criteria** (what must be TRUE):
  1. Visiting bluepriint.tuniice.com loads a page (not a 404 or Vercel default)
  2. The page uses the same neo-brutalist dark design tokens as the main site
  3. The accent color on the bluepriint page is visibly different from the main site's neon green (bluepriint amber)
  4. The page contains a base landing layout with placeholder product name, tagline, and description
**Plans**: TBD

Plans:
- [ ] 10-01: Scaffold bluepriint/ Astro project, copy tokens.css, override accent color, create base landing page
- [ ] 10-02: Configure separate Vercel project pointing at bluepriint/ directory and wire DNS CNAME

## Progress

**Execution Order:** 7 → 8 → 9 → 10

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 3/3 | Complete | 2026-01-28 |
| 1.1. Update Page Structure | v1.0 | 1/1 | Complete | 2026-01-29 |
| 1.2. Remove Header & Update Styling | v1.0 | 1/1 | Complete | 2026-01-29 |
| 2. Home & Core Content | v1.0 | 2/2 | Complete | 2026-01-29 |
| 3. Products Showcase | v1.0 | 2/2 | Complete | 2026-01-29 |
| 4. About & Music | v1.0 | 2/2 | Complete | 2026-01-29 |
| 7. Page Transitions | v1.1 | 2/2 | Complete | 2026-03-02 |
| 8. Canvas Animated Background | 2/2 | Complete   | 2026-03-02 | - |
| 9. CSS Interactive Effects | 2/2 | Complete   | 2026-03-02 | - |
| 10. Subdomain Infrastructure | v1.1 | 0/2 | Not started | - |
