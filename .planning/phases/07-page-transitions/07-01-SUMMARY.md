---
phase: 07-page-transitions
plan: 01
subsystem: ui
tags: [astro, view-transitions, css-animations, keyframes, design-tokens]

# Dependency graph
requires: []
provides:
  - Default sequential fade transition on all pages via ClientRouter + transition:animate
  - All 8 transition keyframes globally available (fade, slide, scale)
  - Transition timing CSS custom properties in design token system
  - Scroll-to-top reset on every navigation via astro:after-swap
  - data-animate elements replay entrance animation on every page visit
affects: [07-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Astro transition:animate with custom animation object (sequential delay pattern)
    - Global keyframe definitions in BaseLayout for phase-wide access
    - CSS custom properties for transition timing as design system tokens

key-files:
  created: []
  modified:
    - src/styles/tokens.css
    - src/layouts/BaseLayout.astro

key-decisions:
  - "CSS custom properties cannot be used as JS string values in animation duration fields — animation objects hardcode resolved values (e.g., '0.3s'); tokens.css documents canonical values"
  - "Sequential fade delay: new page enter delay matches old page exit duration (0.3s + 0.3s) to create exit-to-dark gap"
  - "observer.unobserve removed so data-animate elements replay on every page visit, not just first"
  - "All 8 keyframes (fade, slide, scale) pre-defined in Plan 01 so Plan 02 page files need no BaseLayout changes"
  - "No prefers-reduced-motion override added — Astro ClientRouter automatically disables transitions for users with that preference"

patterns-established:
  - "Transition animation objects: define in frontmatter with forwards/backwards + old/new + name/duration/easing/fillMode/delay"
  - "Global keyframes: defined once in BaseLayout style is:global, referenced by name in any page's transition object"
  - "Sequential exit-enter: delay on 'new' animation equals duration of 'old' animation"

requirements-completed: [TRANS-01, TRANS-03]

# Metrics
duration: 1min
completed: 2026-03-02
---

# Phase 7 Plan 01: Page Transitions Foundation Summary

**Sequential fade transition via Astro ClientRouter with 8 global keyframes, transition timing tokens, scroll reset, and animation replay enabled**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-02T05:31:50Z
- **Completed:** 2026-03-02T05:33:23Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added 4 transition timing CSS custom properties to design token system (both dark and light `:root` blocks)
- Implemented sequential fade transition on BaseLayout `<main>` — old page exits to dark (0.3s), new page enters from dark (0.3s delayed)
- Pre-defined all 8 keyframes globally: page-fade-out/in, slide-out/in-left/right, story-out/in — Plan 02 can reference them without touching BaseLayout
- Scroll position resets to top on every navigation via `astro:after-swap`
- Removed `observer.unobserve` so `data-animate` elements replay entrance animation on every page visit

## Task Commits

Each task was committed atomically:

1. **Task 1: Add transition timing tokens to tokens.css** - `05de2b6` (feat)
2. **Task 2: Add fade transition, global keyframes, scroll reset, animation replay to BaseLayout** - `18f1382` (feat)

## Files Created/Modified
- `src/styles/tokens.css` - Added --transition-duration, --transition-duration-story, --transition-easing-out, --transition-easing-in to both :root blocks
- `src/layouts/BaseLayout.astro` - fadeTransition object, transition:animate on main, astro:after-swap scroll reset, observer.unobserve removed, style is:global with 8 keyframes

## Decisions Made
- CSS custom properties cannot be used as JS string values in Astro animation objects — hardcoded resolved values in frontmatter, tokens.css serves as documentation of canonical values
- Sequential delay pattern: `delay: '0.3s'` on new page enter ensures the gap (exit to dark background) is clearly visible before new content appears
- All 8 keyframes defined in Plan 01 so Plan 02 can add per-page slide/scale transitions by referencing keyframe names only — no BaseLayout edits needed
- No `prefers-reduced-motion` override needed — Astro ClientRouter already handles this automatically

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Fade transition foundation is live on all pages
- All keyframes (slide, scale) globally available for Plan 02 per-page transitions
- Plan 02 can add slide transitions to `products/[slug].astro` and scale transition to `story.astro` by defining transition objects in those page frontmatters only

---
*Phase: 07-page-transitions*
*Completed: 2026-03-02*
