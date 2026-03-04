---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: UI Candy & Subdomains
status: completed
stopped_at: Completed 10-01-PLAN.md (bluepriint scaffold + landing page)
last_updated: "2026-03-04T02:33:02.686Z"
last_activity: "2026-03-02 - Completed quick task 1: Replace product card turbulence with glitch effect and extend magnetic cursor-follow to secondary buttons and product cards"
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 8
  completed_plans: 7
  percent: 40
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-01)

**Core value:** The site must establish tuniice as a credible, distinctive brand that makes visitors want to follow what's coming next.
**Current focus:** Phase 9 — CSS Interactive Effects

## Current Position

Phase: 9 of 10 ([Phase 9: CSS Interactive Effects])
Plan: 2 of 2 in current phase
Status: Phase complete
Last activity: 2026-03-02 - Completed quick task 1: Replace product card turbulence with glitch effect and extend magnetic cursor-follow to secondary buttons and product cards

Progress: [████░░░░░░] 40% (v1.1)

## Accumulated Context

### Decisions

See PROJECT.md Key Decisions table for full log.

Recent decisions affecting v1.1:
- Use Astro ClientRouter (already active) for transitions — Swup ruled out (conflicts with existing ClientRouter)
- Raw Canvas 2D for particle backgrounds — no new dependencies
- Pure CSS + vanilla JS for glitch and hover effects — zero dependencies
- Separate Vercel project for bluepriint subdomain — no monorepo tooling needed
- Skip custom cursor replacement — magnetic hover effects achieve same brand energy without accessibility cost
- Transition animation objects hardcode resolved values (e.g., '0.3s') — CSS custom properties cannot be used as JS string values; tokens.css serves as canonical documentation
- Sequential fade delay: new page enter delay (0.3s) matches old page exit duration for clean exit-to-dark gap
- All 8 keyframes (fade, slide, scale) pre-defined in Plan 01 BaseLayout so Plan 02 page files need no BaseLayout changes
- observer.unobserve removed — data-animate elements replay on every page visit, aligning with intent
- Product detail slide uses directional reversal: forwards=slide-in-right, backwards=slide-in-left (spatial drill-down metaphor)
- Story scale/zoom uses same animation forwards and backwards — no directional axis on scale
- Story transition 800ms total (400ms+400ms) vs default 600ms — contemplative feel for that page
- Canvas lifecycle: module-level rafId + astro:before-swap cancel + astro:page-load restart — prevents RAF stacking across navigations
- visibilitychange and ResizeObserver listeners at module scope (not inside astro:page-load) — avoids listener stacking
- DPR capped at 2x for GPU memory control on ultra-dense displays
- IntersectionObserver created inside astro:page-load (not module scope) so it observes the freshly-found canvas on each navigation
- prefers-reduced-motion check placed first in page-load handler — hides canvas and returns before any observers or RAF set up
- Double-start guard (if rafId !== null return) in startLoop() prevents RAF loop stacking when visibility and intersection events fire together
- Glitch pseudo-elements in effects.css (global) not Hero scoped style — ensures reduced-motion override applies without Astro scoping interference
- overflow: hidden on .brand prevents ±2px pseudo-element offsets from causing horizontal scrollbar
- SVG feTurbulence filter applied to .product-image (not .card) to avoid conflict with Card.astro's card-muted filter property
- Hover trigger on .product-image:hover directly — simpler than cross-component .card:hover .product-image
- Magnetic CSS custom property composition on .btn-primary (not .btn) — secondary buttons retain unmodified translate(-2px,-2px) hover lift
- --mag-x/--mag-y default to 0px — calc() produces standard hover offset if JS doesn't run; no CSS-level gating needed for magnetic
- Scoped mousemove: attach listener on mouseenter, remove on mouseleave — no global listener, no stacking across navigations
- [Phase 10-subdomain-infrastructure]: bluepriint/ is fully standalone Astro project with own package.json — no monorepo tooling needed
- [Phase 10-subdomain-infrastructure]: tokens.css forked with amber accent only — all spacing/typography/border tokens remain shared with main site
- [Phase 10-subdomain-infrastructure]: No effects.css for bluepriint v1 — no interactive effects per user decision

### Pending Todos

None.

### Blockers/Concerns

- [Phase 10]: Bluepriint content dependency — product copy, tagline, and feature list needed before subdomain can launch; placeholder content sufficient to unblock build but real content needed before promoting

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 1 | Replace product card turbulence with glitch effect and extend magnetic cursor-follow to secondary buttons and product cards | 2026-03-02 | 2c167bb | [1-replace-product-card-turbulence-with-gli](./quick/1-replace-product-card-turbulence-with-gli/) |

## Session Continuity

Last session: 2026-03-04T02:33:02.684Z
Stopped at: Completed 10-01-PLAN.md (bluepriint scaffold + landing page)
Resume file: None
