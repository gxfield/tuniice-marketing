# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — tuniice Marketing Site

**Shipped:** 2026-01-29
**Phases:** 6 | **Plans:** 11

### What Was Built
- Neo-brutalist design system with dark mode, neon green accents, and design tokens
- Home page with hero, product teasers, About teaser, social links, and scroll animations
- Products showcase with coming-soon cards, detail pages, and email signup via Formspree
- Story page with founder bio, technical background grid, and Bandcamp music embeds
- Footer navigation and responsive layout across all pages
- Fully static Astro site deployed to Vercel (6 pages, ~1,800 LOC)

### What Worked
- Astro's simplicity kept the stack lean — no framework overhead, fast builds
- CSS custom properties for design tokens gave consistent styling without a CSS framework
- Intersection Observer for scroll animations — zero dependencies, works with view transitions
- Small plans (avg 1m 29s execution) kept iteration tight and failures contained
- Two inserted phases (1.1, 1.2) handled mid-course structural changes cleanly

### What Was Inefficient
- Initially scaffolded multi-page structure that was immediately refactored to single-page in Phase 1.1
- Header component was built in Phase 1 then removed in Phase 1.2 — wasted effort
- Could have discussed site structure more thoroughly before Phase 1 to avoid insertions

### Patterns Established
- Section components own their own styles for encapsulation
- data-animate attributes for declarative scroll animation
- Geometric SVG placeholders for images not yet available
- Client-side form submission with fetch API for static site forms

### Key Lessons
1. Discuss site structure and page count before building navigation — avoids rework
2. Neo-brutalism is well-suited for "coming soon" sites where content is sparse
3. Formspree is a clean solution for forms on static sites but needs env var setup

### Cost Observations
- Model mix: primarily sonnet for execution, balanced profile
- Total execution: ~16 minutes of plan execution across 11 plans
- Notable: Very fast milestone — 2 days from init to complete

---

## Milestone: v1.1 — UI Candy & Subdomains

**Shipped:** 2026-03-04
**Phases:** 4 | **Plans:** 8

### What Was Built
- Smooth page transitions with per-page overrides (fade default, slide for products, scale for story)
- Canvas particle field animation with lifecycle-safe RAF management and HiDPI support
- Visibility-based animation pause (tab switch + scroll) and prefers-reduced-motion fallback
- Glitch text on hero headline + CSS clip-path glitch on product card images
- Magnetic cursor-follow on primary buttons with dual-gated accessibility
- bluepriint.tuniice.com live subdomain with amber accent tokens and landing page

### What Worked
- Zero-dependency approach (pure CSS + vanilla JS + Canvas 2D) kept bundle size unchanged
- Astro ClientRouter lifecycle events (astro:page-load, astro:before-swap) made SPA-safe animations straightforward
- Module-level state pattern for RAF lifecycle prevented stacking bugs across navigations
- Quick task workflow handled mid-milestone pivot (turbulence to clip-path glitch) cleanly
- Forked tokens.css for subdomains — minimal divergence, only accent color changed

### What Was Inefficient
- SVG feTurbulence hover effect was built in 09-01 then replaced via quick task with clip-path glitch — could have validated the visual during discuss phase
- Phase 8 plans listed as "TBD" in initial roadmap and phases 8-10 had unchecked plan checkboxes in ROADMAP.md — minor but creates noise in status tracking

### Patterns Established
- effects.css as canonical file for all interactive CSS effects
- Dual gating pattern: pointer:fine + prefers-reduced-motion for all JS-driven effects
- Module-level state + astro:before-swap cleanup for SPA-safe animations
- Separate Vercel project per subdomain with Root Directory config
- Forked tokens.css with accent-only override for subdomain branding

### Key Lessons
1. Validate visual effects during discuss/research phase — abstract descriptions don't convey "feel"
2. Canvas lifecycle in SPA contexts needs explicit cleanup on route change — Astro events make this easy
3. One subdomain working end-to-end is more valuable than designing a framework — patterns emerge naturally
4. Accessibility gating (reduced-motion, pointer:fine) is simpler when built in from the start

### Cost Observations
- Model mix: balanced profile (sonnet execution, opus planning)
- Sessions: ~5 across the milestone
- Notable: 34-day calendar time but concentrated work bursts

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 6 | 11 | Initial project — established conventions |
| v1.1 | 4 | 8 | Zero-dependency effects, subdomain pattern |

### Top Lessons (Verified Across Milestones)

1. Discuss structure/scope thoroughly before building — avoids rework (v1.0 header removal, v1.1 turbulence replacement)
2. Zero-dependency approach scales well for this project size — CSS + vanilla JS covers all current needs
3. Astro's simplicity continues to pay off — lifecycle events, static builds, easy deployment
