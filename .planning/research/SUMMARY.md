# Project Research Summary

**Project:** tuniice marketing site — v1.1 UI Candy & Subdomains
**Domain:** Astro static marketing site visual enhancement + subdomain infrastructure
**Researched:** 2026-03-01
**Confidence:** HIGH

## Executive Summary

This milestone adds visual effects (particle backgrounds, glitch text, page transitions, hover distortions) and subdomain infrastructure (bluepriint.tuniice.com) to an already-shipped Astro 5.x marketing site. The site is not being rebuilt — every change is an additive integration into an existing codebase with established patterns (CSS custom properties, Intersection Observer, ClientRouter already active). The research consensus is clear: keep additions minimal, CSS-first, and dependency-light. The recommended approach is: raw Canvas 2D for particles, pure CSS for glitch and hover distortion effects, native Astro ClientRouter for page transitions (already active), and a separate Vercel project pointing at a new `bluepriint/` directory for subdomain infrastructure.

The most important finding from ARCHITECTURE.md is that `<ClientRouter />` is already imported and active in `BaseLayout.astro`. This makes the Swup integration recommended in STACK.md a non-starter — running both simultaneously causes double-fetch and broken animations. All page transition work should extend the existing ClientRouter with `transition:animate` directives and CSS keyframes. This conflict between STACK.md (recommends Swup) and ARCHITECTURE.md (ClientRouter already active) is resolved clearly in favor of the native solution, especially now that Firefox 144+ supports the View Transitions API.

The key risk area is the animation lifecycle around Astro's ClientRouter. Every client-side JS effect (canvas RAF loops, cursor listeners, Intersection Observer reconnections) must register on `astro:page-load` and clean up on `astro:before-preparation`. Failure to do this causes effects to go blank after the first navigation, memory leaks from stacked RAF loops, and GPU memory accumulation from undisposed WebGL contexts. This pattern is well-documented and the existing codebase already implements it for the Intersection Observer — all new effects must extend rather than duplicate it.

## Key Findings

### Recommended Stack

The existing Astro 5.x site has zero JS dependencies beyond Astro itself. The minimal additions needed are: no new packages for glitch text, hover distortion, or cursor effects (all pure CSS + vanilla JS); native Astro ClientRouter for page transitions (already installed); raw Canvas 2D API for particle backgrounds (zero bundle cost); and `ogl` (13kb) only if a specific effect requires WebGL shaders. The Swup package recommended in STACK.md should not be installed because ClientRouter is already active and conflicts with Swup.

**Core technologies:**
- Raw Canvas 2D API: particle background animation — zero bundle, full control, browser native
- Astro ClientRouter (`transition:animate`): page transitions — already active, Firefox 144+ supported, no new dependency
- Vanilla JS + CSS `@keyframes`: glitch text, hover distortion, cursor effects — zero dependencies, matches existing CSS-first system
- Separate Vercel project (`bluepriint/` directory): subdomain infrastructure — no monorepo tooling needed at this scale
- `ogl` (optional): WebGL shaders only if raw canvas proves insufficient — 13kb, tree-shakeable

### Expected Features

**Must have (table stakes):**
- `prefers-reduced-motion` gating on all animated effects — WCAG 2.3.3 compliance; must accompany any animation added
- Mobile fallback for cursor effects — gate on `(pointer: fine)` media query; touch devices have no cursor
- Canvas background scoped to hero section — full-page canvas violates motion guidelines and kills mid-range mobile performance
- Bluepriint subdomain shares brand identity — shared `tokens.css` with `--color-accent` override

**Should have (v1.1 differentiators):**
- Canvas particle background (hero only) — "technical creative" brand signal, medium complexity
- Glitch text on hero headline — pure CSS, zero risk, immediate brand signal
- Astro ClientRouter page transitions (fade) — raises perceived quality of entire site, already 80% in place
- Bluepriint mini-site scaffold — Vercel project + DNS + base page content

**Defer (v2+):**
- Hover card 3D tilt — add after core is stable, test on Products page first
- Scroll-reactive section transforms — add after transition system is verified stable
- Additional app subdomains — each follows the Bluepriint pattern when products are ready
- Generative art backgrounds per-section — high complexity, needs dedicated research

### Architecture Approach

All new effects integrate into the existing `BaseLayout.astro` shell via two new UI components (`CanvasBackground.astro`, optionally `CustomCursor.astro`) and CSS additions to `animations.css` and `global.css`. The existing `astro:page-load` handler already re-initializes the Intersection Observer — all new JS effects must hook into this same pattern rather than using `DOMContentLoaded`. The subdomain infrastructure lives entirely outside the main site: a new `bluepriint/` Astro project at the repo root, deployed as a separate Vercel project pointed at the same GitHub repo with a different root directory.

**Major components:**
1. `CanvasBackground.astro` (new) — renders hero particle animation; starts on `astro:page-load`, stops on `astro:before-preparation`; sized via ResizeObserver + devicePixelRatio (capped at 2x)
2. `BaseLayout.astro` (modified) — adds `transition:animate="fade"` to `<main>`, imports CanvasBackground, optionally CustomCursor
3. `animations.css` (modified) — adds glitch `@keyframes`, page transition keyframes; existing `[data-animate]` pattern untouched
4. `global.css` (modified) — adds SVG `feTurbulence` filter definition for hover distortion
5. `bluepriint/` (new Astro project) — self-contained; imports a copy of `tokens.css`; `--color-accent` overridden for bluepriint amber; deployed as separate Vercel project

### Critical Pitfalls

1. **Using `DOMContentLoaded` instead of `astro:page-load`** — effects stop working after the first ClientRouter navigation; use `astro:page-load` exclusively; the existing codebase already does this correctly
2. **Stacking RAF loops on navigation** — each navigation without cleanup adds another loop; store `rafId` at module scope; always cancel on `astro:before-preparation` before starting a new loop on `astro:page-load`
3. **Canvas sized with `window.innerWidth`** — blurry on HiDPI, breaks inside non-fullscreen containers; always use `ResizeObserver` on the canvas element + `clientWidth * Math.min(devicePixelRatio, 2)`
4. **Running Swup alongside existing ClientRouter** — both systems intercept link clicks and replace content; running simultaneously causes double-fetch and broken animations; use ClientRouter exclusively
5. **Custom cursor without device/accessibility gating** — flickering on touch devices, OS cursor accommodations lost; gate on `(pointer: fine)` + `prefers-reduced-motion` check before initializing

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Page Transitions
**Rationale:** ClientRouter is already active; extending it is the lowest-risk entry point with the highest perceived-quality payoff. Building this first establishes and validates the `astro:page-load` / `astro:before-preparation` lifecycle pattern that all subsequent effects depend on. Any lifecycle bugs discovered here are far cheaper to fix before canvas and cursor effects are added.
**Delivers:** Smooth fade/slide transitions between all pages; transition timing defined as a CSS custom property for use by later phases
**Addresses:** Astro ClientRouter transitions (P1 in FEATURES.md)
**Avoids:** Swup + ClientRouter conflict (critical pitfall); JS setTimeout timing mismatch (define timing in CSS only)
**Modified files:** `BaseLayout.astro` (add `transition:animate`), `animations.css` (add keyframes)

### Phase 2: Canvas Animated Background
**Rationale:** Highest visual impact feature. Depends on Phase 1 lifecycle pattern being verified. Canvas lifecycle (start/stop on navigation) must be built correctly from the start before any other animated elements are added on top.
**Delivers:** Particle field in hero section; properly lifecycle-managed RAF loop; HiDPI-correct canvas sizing; `prefers-reduced-motion` fallback
**Addresses:** Canvas particle background (P1 in FEATURES.md); prefers-reduced-motion gating (required table stake)
**Avoids:** RAF loop stacking, canvas blurriness on HiDPI, battery drain when canvas out of viewport
**New files:** `src/components/ui/CanvasBackground.astro`
**Modified files:** `BaseLayout.astro`

### Phase 3: CSS Interactive Effects (Glitch Text + Hover Distortion)
**Rationale:** Pure CSS effects — no lifecycle concerns, no new dependencies. Can be built in any sub-order. Glitch text first (lower complexity, higher impact on hero); hover distortion second (applies to product cards). Both are safe to add once the canvas lifecycle pattern from Phase 2 is validated.
**Delivers:** Glitch animation on hero headline; SVG feTurbulence hover distortion on target elements
**Addresses:** Glitch text (P1), hover card distortion (P2)
**Avoids:** Canvas pixel manipulation for glitch (CSS is compositor-threaded, dramatically better performance)
**Modified files:** `animations.css`, `global.css`, `Hero.astro`, `StoryHero.astro`

### Phase 4: Subdomain Infrastructure (Bluepriint)
**Rationale:** Entirely separate from Phases 1-3 (different Vercel project, different Astro app). Build last so that design token decisions in the main site are finalized before they are copied to the subdomain. Content for the bluepriint page must exist before this can launch.
**Delivers:** `bluepriint.tuniice.com` live with shared design system, bluepriint accent color, base product page
**Addresses:** Bluepriint subdomain scaffold (P1 in FEATURES.md)
**Avoids:** Subdomain SSL wildcard trap (use per-subdomain CNAME, not wildcard); cross-project import coupling (copy `tokens.css`, do not reference via relative path into main site)
**New files:** Full `bluepriint/` Astro project subtree

### Phase Ordering Rationale

- Phase 1 before Phase 2: Page transitions establish the lifecycle pattern; catching `astro:page-load` bugs before canvas is added avoids compounding complexity
- Phase 3 after Phase 2: CSS effects are safe at any point, but adding them after canvas is validated means no lifecycle issues compound
- Phase 4 independent: Subdomain work does not touch the main site; sequencing it last ensures design tokens are stable before forking

### Research Flags

Phases with standard well-documented patterns (no additional research needed):
- **Phase 1:** Astro ClientRouter `transition:animate` is officially documented; Firefox 144+ support verified; straight implementation
- **Phase 2:** Canvas 2D particle fields are well-established; ResizeObserver + devicePixelRatio pattern is documented; lifecycle hooks are Astro-native
- **Phase 3:** Pure CSS; no external documentation needed beyond MDN
- **Phase 4:** Vercel multi-project-per-repo is documented and widely used; standard Astro project scaffold

No phases require deeper research before planning. All patterns are verified with high-confidence sources.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Swup vs ClientRouter conflict resolved definitively by architecture inspection; Canvas 2D and CSS effects verified; Vercel subdomain approach documented |
| Features | HIGH | Priority matrix is consistent across FEATURES.md and ARCHITECTURE.md; MVP scope is conservative and well-bounded |
| Architecture | HIGH | Existing codebase inspected directly; integration patterns verified against Astro docs and official library docs |
| Pitfalls | HIGH | Most findings verified against official docs (Astro, MDN, WebGL fundamentals); lifecycle pitfalls are the dominant risk category |

**Overall confidence:** HIGH

### Gaps to Address

- **Bluepriint content:** The subdomain scaffold can be built without content, but the page cannot launch without real product copy, screenshots, or feature list. This is a content dependency, not a technical one — flag for Greg to provide before Phase 4 can complete.
- **Custom cursor decision:** FEATURES.md marks cursor replacement as an anti-feature (use magnetic button effects instead). ARCHITECTURE.md documents `CustomCursor.astro` as a new component. The roadmap should clarify whether a custom cursor will be built at all, or whether the more conservative "hover effects only" approach is correct. Recommendation: skip cursor replacement; implement magnetic button pull / glow-on-hover effects instead.
- **Particle count tuning:** Research recommends 80-120 particles on mobile, 200-300 on desktop, DPR capped at 2x. Exact numbers require on-device testing during Phase 2 — treat these as starting values, not hard specs.

## Sources

### Primary (HIGH confidence)
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) — ClientRouter, transition directives, lifecycle events
- [Firefox 144 View Transitions support](https://events-3bg.pages.dev/jotter/in-all-major-browsers/) — cross-browser parity confirmed
- [swup.js.org/integrations/astro](https://swup.js.org/integrations/astro/) — Swup Astro integration (evaluated and ruled out)
- [Vercel multi-project subdomain guide](https://vercel.com/kb/guide/how-can-i-serve-multiple-projects-under-a-single-domain) — separate project per subdomain pattern
- [WebGL2Fundamentals Anti-Patterns](https://webgl2fundamentals.org/webgl/lessons/webgl-anti-patterns.html) — canvas sizing, clientWidth vs innerWidth
- [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) — reduced-motion legal basis

### Secondary (MEDIUM confidence)
- [github.com/oframe/ogl](https://github.com/oframe/ogl) — OGL size and API (README-based)
- [Vercel monorepo subdomain deployment](https://dev.to/jdtjenkins/how-to-deploy-a-monorepo-to-different-subdomains-on-vercel-2chn) — separate Vercel projects per subdomain
- [Custom Cursor Accessibility — dbushell](https://dbushell.com/2025/10/27/custom-cursor-accessibility/) — pointer media query gating
- [Optimize Battery Drain of WebGL Elements](https://blog.squareys.de/optimize-battery-drain-of-webgl-elements/) — visibility pausing
- [Codrops: Astro + GSAP + Barba.js](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — shows Barba.js complexity cost; confirms Swup preference in 2026

### Tertiary (LOW confidence)
- npm registry versions verified 2026-03-01 (swup@4.8.3, @swup/astro@1.8.0, ogl@1.0.11, gsap@3.14.2, three@0.183.2) — version snapshots only

---
*Research completed: 2026-03-01*
*Ready for roadmap: yes*
