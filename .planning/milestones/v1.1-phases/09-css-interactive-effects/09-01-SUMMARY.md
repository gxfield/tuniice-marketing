---
phase: 09-css-interactive-effects
plan: 01
subsystem: ui
tags: [css, animations, svg-filter, glitch, turbulence, astro]

requires:
  - phase: 08-canvas-animated-background
    provides: Canvas background rendering on hero — glitch layers sit above it via z-index

provides:
  - Glitch text animation on hero headline using CSS keyframes and pseudo-elements
  - SVG feTurbulence heat-shimmer hover distortion on product card images
  - effects.css as canonical file for interactive CSS effects

affects:
  - 09-css-interactive-effects (any future plans in this phase)
  - 10-bluepriint-subdomain (product cards visible on subdomain if used)

tech-stack:
  added: []
  patterns:
    - CSS keyframe burst+gap pattern — idle most of the cycle, burst at 86-92%, steps(1) for digital feel
    - SVG filter inline in component template — no external file, avoids cross-origin issues
    - Combined media query gate: pointer:fine + prefers-reduced-motion:no-preference for touch/motion safety
    - pseudo-element glitch via attr(data-text) — content mirrors parent text, no JS needed

key-files:
  created:
    - src/styles/effects.css
  modified:
    - src/components/sections/Hero.astro
    - src/components/ui/ProductCard.astro
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Glitch pseudo-elements placed in effects.css (not Hero scoped style) so reduced-motion override is global and consistent"
  - "overflow: hidden on .brand prevents horizontal scroll from ±2px pseudo-element offsets"
  - "SVG feTurbulence filter applied to .product-image (not .card) to avoid conflict with Card.astro's card-muted filter property"
  - "Hover trigger on .product-image directly rather than .card:hover — simpler without cross-component scoping"
  - "Reduced-motion for glitch: display:none on ::before/::after — cleaner than zeroing animation-duration"

patterns-established:
  - "Glitch pattern: two offset keyframe layers (::before green, ::after orange) with different burst timing"
  - "Combined media query gate for hover effects: @media (pointer: fine) and (prefers-reduced-motion: no-preference)"
  - "Inline SVG filter defs in Astro component — multiple identical defs harmless, browser uses first matching ID"

requirements-completed: [FX-01, FX-02]

duration: 2min
completed: 2026-03-02
---

# Phase 9 Plan 01: CSS Interactive Effects Summary

**Pure CSS glitch burst animation on hero headline and SVG feTurbulence heat-shimmer hover on product card images — zero JS, zero new dependencies**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-02T22:31:37Z
- **Completed:** 2026-03-02T22:32:46Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Hero headline "tuniice" shows periodic glitch bursts with green (#00ff41) and orange (#ff6b35) chromatic offset layers via CSS keyframes, idle 85% of the time
- Product card images get a subtle heat-shimmer warp on hover (mouse/trackpad only) via inline SVG feTurbulence filter, gated by pointer:fine + prefers-reduced-motion:no-preference
- All effects have proper reduced-motion overrides — glitch hides pseudo-elements entirely, turbulence filter never activates on reduced-motion

## Task Commits

Each task was committed atomically:

1. **Task 1: Glitch keyframes and hero headline** - `ae8d574` (feat)
2. **Task 2: SVG feTurbulence hover distortion on product cards** - `5bfd971` (feat)

## Files Created/Modified

- `src/styles/effects.css` - Created: glitch-before/glitch-after keyframes, .brand pseudo-element styles, reduced-motion override
- `src/components/sections/Hero.astro` - Added data-text="tuniice" attribute to .brand h1
- `src/components/ui/ProductCard.astro` - Added hidden inline SVG filter def, hover CSS with pointer+motion gate
- `src/layouts/BaseLayout.astro` - Added import for effects.css

## Decisions Made

- Glitch pseudo-elements live in `effects.css` (global) not Hero's scoped style block — ensures the reduced-motion override applies consistently without Astro scoping interference
- `overflow: hidden` added to `.brand` in effects.css to prevent the ±2px pseudo-element horizontal offset from causing a scrollbar
- SVG feTurbulence filter applied to `.product-image` div, not `.card` article — Card.astro already uses `filter` on `.card-muted` and `.card-muted:hover`, so applying another filter at the card level would override it
- Hover trigger on `.product-image:hover` directly — simpler than attempting cross-component `.card:hover .product-image` which would require breaking Astro scoped styles
- Reduced-motion for glitch uses `display: none` on the pseudo-elements (not `animation: none`) — prevents any layout shift from the positioned layers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both CSS effects (FX-01 glitch, FX-02 turbulence) are complete
- Phase 09 plan 01 is the only plan in this phase — phase is fully complete
- No blockers for Phase 10 (Bluepriint subdomain)

---
*Phase: 09-css-interactive-effects*
*Completed: 2026-03-02*
