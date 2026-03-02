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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 6 | 11 | Initial project — established conventions |

### Top Lessons (Verified Across Milestones)

1. (Awaiting cross-milestone validation)
