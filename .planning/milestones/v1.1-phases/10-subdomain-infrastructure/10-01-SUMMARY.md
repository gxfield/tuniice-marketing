---
phase: 10-subdomain-infrastructure
plan: "01"
subsystem: ui
tags: [astro, static-site, subdomain, neo-brutalist, formspree]

# Dependency graph
requires:
  - phase: 09-css-interactive-effects
    provides: "Design tokens (tokens.css, global.css, animations.css) and neo-brutalist CSS patterns"
provides:
  - "bluepriint/ standalone Astro 5 static project buildable independently"
  - "bluepriint/src/pages/index.astro landing page with hero, features, CTA, footer"
  - "Amber accent token override (#ffbf00 dark, #b98300 light) in bluepriint/src/styles/tokens.css"
affects: [10-subdomain-infrastructure, vercel-deployment, bluepriint-subdomain]

# Tech tracking
tech-stack:
  added: ["astro ^5.16.16 (bluepriint/ isolated dependency)"]
  patterns:
    - "Standalone subdirectory Astro project with own package.json, independent of root"
    - "Design token fork: copy tokens.css then override accent only — all other values shared"
    - "Single-page static site: no ClientRouter, no transitions, no effects.css"
    - "DOMContentLoaded for DOM-ready scripts (not astro:page-load — no ClientRouter present)"

key-files:
  created:
    - bluepriint/package.json
    - bluepriint/astro.config.mjs
    - bluepriint/tsconfig.json
    - bluepriint/public/favicon.svg
    - bluepriint/src/styles/tokens.css
    - bluepriint/src/styles/global.css
    - bluepriint/src/styles/animations.css
    - bluepriint/src/pages/index.astro
  modified: []

key-decisions:
  - "bluepriint/ is a fully standalone Astro project — own package.json, own node_modules, built independently with `cd bluepriint && npm run build`"
  - "tokens.css forked from main site with only --color-accent overridden (#ffbf00 amber replaces #00ff41 green); all spacing/typography/border tokens remain shared"
  - "No ClientRouter in bluepriint — single-page static site uses DOMContentLoaded instead of astro:page-load"
  - "No effects.css imported — no interactive effects for bluepriint v1 per user decision"
  - "Formspree form ID read from PUBLIC_FORMSPREE_ID env var, falls back to placeholder string for build"

patterns-established:
  - "Token fork pattern: copy tokens.css verbatim, override accent vars only — ensures brand coherence with product distinction"
  - "Subdomain Astro project: standalone package.json at repo root subdirectory, separate Vercel project"

requirements-completed: [SUB-02, SUB-03, SUB-04]

# Metrics
duration: 3min
completed: 2026-03-03
---

# Phase 10 Plan 01: bluepriint Subdomain Scaffold Summary

**Standalone Astro 5 static site in bluepriint/ with amber design token fork (#ffbf00) and complete landing page — hero, 4-feature grid, Formspree email CTA, footer**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-03T18:29:05Z
- **Completed:** 2026-03-03T18:32:10Z
- **Tasks:** 2
- **Files modified:** 8 created

## Accomplishments

- Scaffolded bluepriint/ as an isolated Astro 5 project (own package.json, node_modules, build pipeline)
- Forked design tokens with amber accent (#ffbf00 dark / #b98300 light) replacing tuniice green, all other tokens unchanged
- Built full landing page: oversized amber product name, tagline, 4 neo-brutalist feature cards with amber box-shadow, async Formspree email signup, footer linking back to tuniice.com

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold bluepriint Astro project with amber design tokens** - `d58022a` (feat)
2. **Task 2: Build bluepriint landing page with hero, features, CTA, and footer** - `2b9ff46` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `bluepriint/package.json` - Standalone project, astro ^5.16.16 dependency
- `bluepriint/astro.config.mjs` - Minimal static output config
- `bluepriint/tsconfig.json` - Extends astro/tsconfigs/strict
- `bluepriint/public/favicon.svg` - Geometric amber square favicon
- `bluepriint/src/styles/tokens.css` - Design tokens with amber accent override
- `bluepriint/src/styles/global.css` - CSS reset and body styles, copied from main site
- `bluepriint/src/styles/animations.css` - data-animate scroll fade-in, copied from main site
- `bluepriint/src/pages/index.astro` - Complete single-page landing (406 lines)

## Decisions Made

- bluepriint/ is fully standalone — own package.json and node_modules at repo root level. No monorepo tooling needed.
- tokens.css forked with amber accent only; all spacing, typography, and border tokens remain identical to main site for visual coherence.
- No ClientRouter in bluepriint — DOMContentLoaded used for scroll observer and form submission handler since there are no page transitions.
- No effects.css imported — no glitch or magnetic effects for bluepriint v1 per user decision made during phase planning.
- Formspree form uses PUBLIC_FORMSPREE_ID env var with graceful placeholder fallback so the build succeeds before the form ID is configured.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

The plan's automated verification command (`grep -q "ffbf00" dist/index.html`) failed because Astro bundles CSS into `dist/_astro/index.*.css` rather than inlining it into index.html. The build itself succeeded and the amber color was confirmed present in the CSS bundle. Verification adapted to check `dist/_astro/*.css` directly.

## User Setup Required

**External service requires manual configuration before email signup works.**

Service: **Formspree**

Steps:
1. Go to formspree.io and log in
2. Create a new form titled "bluepriint launch notifications"
3. Copy the form ID from the dashboard URL (e.g., `xabc1234`)
4. Add `PUBLIC_FORMSPREE_ID=xabc1234` to the Vercel environment variables for the bluepriint project

The site builds and deploys without this variable — email submissions will silently fail until the form ID is set.

## Next Phase Readiness

- bluepriint/ builds independently: `cd bluepriint && npm run build` produces dist/ with no errors
- Ready for Vercel deployment configuration (Phase 10 Plan 02)
- Formspree form ID needed before email signups are live (user setup item above)
- Placeholder product copy is sufficient for launch; real bluepriint content can be swapped in later

---
*Phase: 10-subdomain-infrastructure*
*Completed: 2026-03-03*
