---
phase: 08-canvas-animated-background
plan: 02
subsystem: ui
tags: [canvas, animation, intersection-observer, page-visibility-api, prefers-reduced-motion, astro]

# Dependency graph
requires:
  - phase: 08-01-canvas-animated-background
    provides: CanvasBackground.astro with module-level RAF loop, particle system, HiDPI scaling, lifecycle via astro:before-swap
provides:
  - Visibility-based pause/resume via Page Visibility API (tab switch)
  - Scroll-based pause/resume via IntersectionObserver (hero off-viewport)
  - prefers-reduced-motion gate that hides canvas and skips all setup
  - Static reduced-motion fallback gradient in Hero.astro
  - Double-start guard in startLoop() preventing RAF loop stacking
affects: [future-animation-phases, performance-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Page Visibility API visibilitychange listener at module scope for tab pause/resume
    - IntersectionObserver at page-load scope for viewport-based pause/resume
    - matchMedia prefers-reduced-motion check as early gate before any animation setup
    - Double-start guard (if rafId !== null return) preventing concurrent RAF loops

key-files:
  created: []
  modified:
    - src/components/canvas/CanvasBackground.astro
    - src/components/sections/Hero.astro

key-decisions:
  - "IntersectionObserver created inside astro:page-load (not module scope) so it can observe the freshly-found canvas element on each navigation"
  - "prefers-reduced-motion check placed first in page-load handler — hides canvas and returns before any observers or RAF are set up"
  - "visibilitychange listener at module scope (registered once) with document.contains(canvas) guard to prevent restart on non-hero pages"

patterns-established:
  - "Resource management: always pair pause/resume hooks (visibilitychange + IntersectionObserver) with startLoop/stopLoop pattern"
  - "Accessibility first: reduced-motion check as earliest gate in animation setup"

requirements-completed: [ANIM-04, ANIM-05]

# Metrics
duration: 20min
completed: 2026-03-02
---

# Phase 8 Plan 02: Canvas Background Visibility Pause and Reduced-Motion Gate Summary

**Visibility-based RAF pause via Page Visibility API and IntersectionObserver, plus prefers-reduced-motion static fallback, added to the canvas particle system**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-03-02
- **Completed:** 2026-03-02
- **Tasks:** 3 (2 auto, 1 human-verify checkpoint — approved)
- **Files modified:** 2

## Accomplishments

- Tab switching now pauses the RAF loop (visibilitychange at module scope) and resumes when returning to the tab
- Scrolling past the hero section pauses animation via IntersectionObserver; scrolling back resumes it
- prefers-reduced-motion: reduce hides the canvas entirely and skips all setup; Hero.astro shows a subtle static green glow fallback
- Double-start guard added to startLoop() prevents RAF loop stacking when both pause/resume sources fire together
- User visually verified all 8 checks: particles visible, navigation stability, tab pause/resume, scroll pause/resume, reduced-motion fallback, HiDPI sharpness

## Task Commits

Each task was committed atomically:

1. **Task 1: Add visibility pause and reduced-motion gate to CanvasBackground** - `e60407d` (feat)
2. **Task 2: Add reduced-motion fallback CSS to Hero section** - `f20c3f5` (feat)
3. **Task 3: Visual verification of particle animation** - checkpoint approved by user (no code commit)

## Files Created/Modified

- `src/components/canvas/CanvasBackground.astro` - Added visibilitychange listener, IntersectionObserver, prefers-reduced-motion gate, double-start guard
- `src/components/sections/Hero.astro` - Added @media (prefers-reduced-motion: reduce) fallback gradient

## Decisions Made

- IntersectionObserver is created inside astro:page-load so it can observe the freshly-queried canvas element on each SPA navigation, while the visibilitychange listener stays at module scope (registered once, guarded by document.contains check).
- prefers-reduced-motion check placed at the very top of the page-load handler so no ResizeObserver, IntersectionObserver, or RAF is created when motion is reduced.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Canvas particle system is fully complete: particle rendering, HiDPI scaling, lifecycle management (astro:before-swap/page-load), visibility pause/resume, accessibility fallback
- Ready for Phase 9 (per ROADMAP.md)
- No blockers from this phase

---
*Phase: 08-canvas-animated-background*
*Completed: 2026-03-02*
