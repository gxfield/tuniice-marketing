---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: UI Candy & Subdomains
status: unknown
last_updated: "2026-03-02T22:07:29.240Z"
progress:
  total_phases: 2
  completed_phases: 2
  total_plans: 4
  completed_plans: 4
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-01)

**Core value:** The site must establish tuniice as a credible, distinctive brand that makes visitors want to follow what's coming next.
**Current focus:** Phase 8 — Canvas Animated Background

## Current Position

Phase: 8 of 10 ([Phase 8: Canvas Animated Background])
Plan: 2 of 2 in current phase
Status: Phase complete
Last activity: 2026-03-02 — Completed 08-02 (visibility pause/resume via Page Visibility API + IntersectionObserver, prefers-reduced-motion fallback)

Progress: [███░░░░░░░] 30% (v1.1)

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

### Pending Todos

None.

### Blockers/Concerns

- [Phase 10]: Bluepriint content dependency — product copy, tagline, and feature list needed before subdomain can launch; placeholder content sufficient to unblock build but real content needed before promoting

## Session Continuity

Last session: 2026-03-02
Stopped at: Completed 08-02-PLAN.md (Phase 08 fully complete — both plans done)
Resume file: None
