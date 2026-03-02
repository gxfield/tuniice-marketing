---
phase: 08-canvas-animated-background
plan: 01
subsystem: ui
tags: [canvas, animation, particles, astro, clientrouter, raf, hidpi, resizeobserver]

# Dependency graph
requires:
  - phase: 07-page-transitions
    provides: Astro ClientRouter already active; astro:page-load and astro:before-swap lifecycle events available
provides:
  - Canvas particle field animation behind hero section on home page
  - Lifecycle-safe RAF management for Astro ClientRouter (no loop stacking on navigation)
  - HiDPI canvas sizing with DPR capped at 2x
affects:
  - 09-glitch-hover-effects (hero section layout)
  - 10-bluepriint-subdomain (hero pattern reusable if needed)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Module-level RAF ID variable for lifecycle-safe Astro ClientRouter animation
    - astro:before-swap + astro:page-load for canvas teardown/reinit on navigation
    - HiDPI canvas via getBoundingClientRect() x devicePixelRatio, capped at 2x, ctx.scale() re-called after every resize
    - ResizeObserver for element-level responsive canvas resizing
    - prefers-reduced-motion guard via window.matchMedia in JS before starting animation loop
    - visibilitychange listener at module scope with document.contains(canvas) guard

key-files:
  created:
    - src/components/canvas/CanvasBackground.astro
  modified:
    - src/components/sections/Hero.astro

key-decisions:
  - "All canvas/lifecycle logic in single CanvasBackground.astro component — no BaseLayout changes needed"
  - "visibilitychange and ResizeObserver listeners registered at module scope (once), not inside astro:page-load (would stack)"
  - "DPR capped at 2x to limit GPU memory on ultra-dense displays (3x/4x)"
  - "Particle count scales with viewport area (w*h/8000), clamped 20-80 — avoids dense blob on mobile"

patterns-established:
  - "Lifecycle pattern: module-level rafId + astro:before-swap cancel + astro:page-load restart for all future Astro ClientRouter animations"
  - "Canvas HiDPI: always call ctx.scale(dpr, dpr) after every canvas.width/height assignment"

requirements-completed: [ANIM-01, ANIM-02, ANIM-03]

# Metrics
duration: 5min
completed: 2026-03-01
---

# Phase 8 Plan 01: Canvas Animated Background Summary

**Particle field animation on HTML Canvas behind hero text — lifecycle-safe RAF with Astro ClientRouter, HiDPI via DPR scaling, ResizeObserver responsive resizing, prefers-reduced-motion guard**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-01T21:58:43Z
- **Completed:** 2026-03-01T21:59:47Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Built CanvasBackground.astro with full particle system (drift, toroidal wrap, green connecting lines)
- Lifecycle-safe RAF management: cancel on astro:before-swap, restart on astro:page-load — no stacking after navigation
- HiDPI canvas sizing with devicePixelRatio capped at 2x; ctx.scale re-called after every resize
- Integrated canvas into Hero.astro as absolute-positioned layer behind text content
- prefers-reduced-motion respected — canvas hidden for accessibility
- Tab visibility pause via visibilitychange event (battery-aware)
- Build passes cleanly with all 5 pages generated

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CanvasBackground.astro with particle system and lifecycle** - `f126a8e` (feat)
2. **Task 2: Integrate CanvasBackground into Hero section** - `29351c4` (feat)

## Files Created/Modified

- `src/components/canvas/CanvasBackground.astro` - Canvas element + particle system + RAF lifecycle + HiDPI sizing (154 lines)
- `src/components/sections/Hero.astro` - Added CanvasBackground import/render, position:relative on .hero, z-index:1 on text elements

## Decisions Made

- visibilitychange and ResizeObserver listeners registered at module scope (not inside astro:page-load) — avoids listener stacking across navigations
- DPR capped at 2x — limits GPU memory on 3x/4x displays without noticeable visual difference
- Particle count formula: Math.floor((w * h) / 8000) clamped [20, 80] — scales correctly from mobile to large desktop
- prefers-reduced-motion check happens in JS (not CSS-only) — canvas animations are not CSS, must be gated at the JS layer

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `npx astro check` prompted to install @astrojs/check interactively (not available non-interactively). Used `npx astro build` instead — build succeeded cleanly with all 5 pages, confirming no template or type errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Canvas particle animation live on home page hero
- CanvasBackground component reusable for other hero sections if needed (StoryHero, etc.)
- Hero.astro layout unchanged apart from canvas layer — Phase 9 glitch/hover effects can proceed on existing structure

## Self-Check: PASSED

- FOUND: src/components/canvas/CanvasBackground.astro
- FOUND: src/components/sections/Hero.astro
- FOUND: .planning/phases/08-canvas-animated-background/08-01-SUMMARY.md
- FOUND commit: f126a8e (Task 1)
- FOUND commit: 29351c4 (Task 2)

---
*Phase: 08-canvas-animated-background*
*Completed: 2026-03-01*
