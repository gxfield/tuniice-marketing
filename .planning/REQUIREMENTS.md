# Requirements: tuniice

**Defined:** 2026-03-01
**Core Value:** The site must establish tuniice as a credible, distinctive brand that makes visitors want to follow what's coming next.

## v1.1 Requirements

Requirements for v1.1 UI Candy & Subdomains. Each maps to roadmap phases.

### Page Transitions

- [x] **TRANS-01**: User sees smooth fade transition when navigating between any pages
- [x] **TRANS-02**: User sees distinct transition styles per page type (e.g., slide for products, morph for story)
- [x] **TRANS-03**: Transition timing is defined as CSS custom property for consistent feel across site

### Animated Backgrounds

- [x] **ANIM-01**: User sees animated particle field in hero section on pages that have one
- [x] **ANIM-02**: Canvas animation starts/stops cleanly on page navigation (no stacking RAF loops)
- [x] **ANIM-03**: Canvas renders crisply on HiDPI displays (ResizeObserver + DPR capped at 2x)
- [x] **ANIM-04**: Canvas animation pauses when tab is backgrounded or canvas is off-viewport
- [x] **ANIM-05**: User with `prefers-reduced-motion` sees static fallback instead of animation

### Interactive Effects

- [x] **FX-01**: User sees glitch text animation on hero headline
- [x] **FX-02**: User sees SVG feTurbulence hover distortion effect on product cards
- [x] **FX-03**: User sees magnetic pull/glow hover effect on interactive buttons
- [x] **FX-04**: All effects respect `prefers-reduced-motion` and `(pointer: fine)` where applicable

### Subdomain Infrastructure

- [ ] **SUB-01**: bluepriint.tuniice.com resolves to a separate Vercel project from the same repo
- [x] **SUB-02**: Bluepriint site shares the neo-brutalist design system via copied design tokens
- [x] **SUB-03**: Bluepriint site uses its own accent color override
- [x] **SUB-04**: Bluepriint landing page exists with placeholder content and base layout

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Interactive Effects

- **FX-05**: User sees 3D tilt effect on product cards on hover
- **FX-06**: User sees scroll-reactive section transforms (parallax, scale, rotation)

### Animated Backgrounds

- **ANIM-06**: User sees generative art backgrounds per-section (beyond particles)

### Subdomain Infrastructure

- **SUB-05**: Additional app subdomains follow the Bluepriint pattern
- **SUB-06**: Bluepriint site has multiple pages (features, docs, etc.) with real content

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom cursor replacement | Flagged as accessibility anti-feature; magnetic hover effects achieve same brand energy |
| GSAP/Three.js | Overkill for current effects; 60kb+ for capabilities not yet needed |
| Swup page transition library | Conflicts with existing Astro ClientRouter already active in codebase |
| Wildcard subdomain SSL | Only one subdomain needed; per-subdomain CNAME is simpler |
| Light mode | Dark mode confirmed as brand identity for v1.1 |
| Monorepo tooling (Turborepo/pnpm workspaces) | Not needed at current scale (1 subdomain) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRANS-01 | Phase 7 | Complete |
| TRANS-02 | Phase 7 | Complete |
| TRANS-03 | Phase 7 | Complete |
| ANIM-01 | Phase 8 | Complete |
| ANIM-02 | Phase 8 | Complete |
| ANIM-03 | Phase 8 | Complete |
| ANIM-04 | Phase 8 | Complete |
| ANIM-05 | Phase 8 | Complete |
| FX-01 | Phase 9 | Complete |
| FX-02 | Phase 9 | Complete |
| FX-03 | Phase 9 | Complete |
| FX-04 | Phase 9 | Complete |
| SUB-01 | Phase 10 | Pending |
| SUB-02 | Phase 10 | Complete |
| SUB-03 | Phase 10 | Complete |
| SUB-04 | Phase 10 | Complete |

**Coverage:**
- v1.1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-01*
*Last updated: 2026-03-01 after roadmap creation*
