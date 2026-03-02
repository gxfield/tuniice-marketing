# Stack Research

**Domain:** UI candy & subdomain infrastructure additions to existing Astro marketing site
**Researched:** 2026-03-01
**Confidence:** MEDIUM-HIGH (see per-area notes below)

---

## Context

This is a SUBSEQUENT MILESTONE stack document. The following are already validated and must NOT be re-evaluated:

- Astro 5.x (currently `^5.16.16`)
- CSS custom properties (design tokens)
- Intersection Observer (scroll animations)
- Formspree (email)
- Vercel (deployment)

All recommendations below are additions only.

---

## Recommended Stack

### Page Transitions

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@swup/astro` | 1.8.0 | Official Astro integration for Swup page transitions | First-party integration maintained by Swup team; handles Astro script re-execution automatically via `reloadScripts`; ships with sensible defaults (fade, preload, head plugin) |
| `swup` | 4.8.3 | Core page transition engine (peer dep of @swup/astro) | CSS-based transitions rather than requiring GSAP; built-in head update plugin (critical for Astro MPA); caching + smart preloading included; official Astro integration exists |

**Why Swup over Barba.js:** Swup has an official Astro integration (`@swup/astro`) that automatically handles the script re-execution problem inherent to Astro's MPA model. Barba.js does not have Astro-specific support and leaves head element management to the developer — a known pain point when navigating Astro pages. Swup's CSS-based animation model also fits the existing CSS-first design system better than Barba's GSAP-dependent model. Confidence: HIGH (verified via swup.js.org docs and multiple 2026 Astro portfolio case studies).

### Canvas/WebGL Animated Backgrounds

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Raw Canvas 2D API | — | Particle fields, generative art backgrounds | Zero dependency; Astro renders canvas elements as static HTML; animation loop runs entirely in an inline `<script>` tag; no bundle weight; full control over visual output |
| `ogl` | 1.0.11 | WebGL for more complex shader-based effects | 13kb gzipped, zero dependencies; ES module native; tree-shakeable; API similar to Three.js but tightly coupled to WebGL — better for targeted effects than a full scene graph |

**Why NOT tsParticles:** `tsparticles` (3.9.1) and `astro-particles` (2.10.0) exist but carry significant bundle weight for what is achievable with raw Canvas 2D in ~50 lines. The neo-brutalist aesthetic benefits from custom-coded, distinctive particle behavior rather than library-default effects that look generic. tsParticles is the right choice only if off-the-shelf presets are sufficient; for a brand-defining visual, raw canvas is better.

**Why NOT Three.js:** Three.js 0.183.2 is 600kb+ minified. For 2D particle fields or simple WebGL post-process effects, it is massively over-scoped. OGL provides the WebGL primitives needed (geometry, shaders, render loop) at a fraction of the size.

**Decision rule:** Start with raw Canvas 2D. Reach for OGL only if a specific effect requires WebGL (e.g., shader-based distortion, bloom, displacement maps).

### Interactive Elements (Cursor, Hover, Glitch Text)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vanilla JS + CSS | — | Custom cursor, hover distortion, glitch text | All three effects are achievable with ~30-80 lines of vanilla JS and CSS keyframes; no library needed; zero bundle cost; better control over performance budget |

**Custom cursor:** `mousemove` listener updates `transform: translate()` on a positioned `::before` pseudo-element or dedicated `<div>`. Mix-blend-mode `difference` or `exclusion` gives the visual pop without additional color work.

**Hover distortion:** CSS `filter: url(#svg-filter)` with an inline SVG `feTurbulence` filter achieves liquid/warp hover effects on text or images. Alternatively, `clip-path` animation on hover.

**Glitch text:** Pure CSS `@keyframes` with `clip-path` cuts and `text-shadow` color splits. No JS required. ~40 lines of CSS. Existing CSS custom properties (--color-accent, etc.) integrate directly.

**Why NOT a cursor library (cursor-effects, cursorly, etc.):** Library overhead (20-100kb) for a positioning loop + trail is unjustifiable. The existing codebase has zero JS dependencies — keeping cursor logic inline in a Layout component script tag maintains that standard.

**Why NOT GSAP:** GSAP 3.14.2 is excellent but overkill for this milestone. If complex timeline animations become necessary later, it can be added. Do not add it speculatively.

### Subdomain Infrastructure

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Separate Astro project (same monorepo) | — | `bluepriint.tuniice.com` mini-site | Separate `packages/bluepriint/` Astro project shares CSS design tokens via a symlinked or copied tokens file; each subdomain is a distinct Vercel project pointing at the same GitHub repo with a different root directory |
| Vercel multi-project from one repo | — | Subdomain routing | Vercel free tier supports up to 3 projects from the same GitHub repo; each project gets its own domain assignment (`bluepriint.tuniice.com`); DNS is a single CNAME record per subdomain pointing to `cname.vercel-dns.com` |
| Shared CSS design tokens file | — | Brand consistency across subdomains | Copy/symlink the existing `--color-bg`, `--color-text`, `--color-accent` token file into each subdomain project; each app can override `--color-accent` for its own identity color |

**Subdomain architecture decision:** Separate Vercel project per subdomain (not Next.js Multi Zones rewrites, not a proxy project). Rationale: the main site and subdomain sites are fully static Astro builds with no shared runtime. Rewrites add unnecessary complexity. Separate Vercel projects give independent deploys, separate preview URLs, and clean domain management. No monorepo tooling (Turborepo, pnpm workspaces) is required unless the number of subdomain sites grows beyond 3-4.

---

## Installation

```bash
# Page transitions (Swup + Astro integration)
npm install swup @swup/astro

# WebGL effects (only if raw canvas is insufficient for a specific effect)
npm install ogl

# No additional install needed for:
# - Canvas 2D (browser built-in)
# - Cursor effects (vanilla JS)
# - Glitch text (pure CSS)
# - Subdomain infrastructure (Vercel project config)
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Swup + @swup/astro | Barba.js + @barba/core | If you need complex GSAP timeline transitions with fine-grained lifecycle hooks and are willing to manage head updates manually |
| Raw Canvas 2D | tsParticles (astro-particles) | If you want a config-driven particle system without writing animation code and are comfortable with the bundle weight and generic visual output |
| OGL (for WebGL) | Three.js | If you need a full 3D scene, physics, complex lighting — not applicable to this project |
| Vanilla JS cursor | Cursorly.js / cursor-effects | If you need 10+ cursor variants with no custom code — not the case here |
| Separate Vercel projects | Next.js Multi Zones / proxy vercel.json | If subdomains share server-side routing or need runtime cross-domain communication |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Astro View Transitions API | Firefox lacks full support; project decision already made to use JS library for broad compatibility | Swup + @swup/astro |
| GSAP (this milestone) | 60kb+ for animation capabilities not yet needed; adds complexity to the Swup transition lifecycle | Raw CSS transitions via Swup themes; revisit if complex timelines are needed |
| Three.js | 600kb+ minified; massively over-scoped for 2D particle fields | Raw Canvas 2D or OGL |
| particles.js | Deprecated; unmaintained since 2016 | Raw Canvas 2D or tsParticles (if a library is required) |
| Turborepo / pnpm workspaces | Over-engineered for 2-3 static Astro sites; adds tooling complexity with limited benefit at this scale | Simple monorepo with separate `packages/` directories; standard npm workspaces if sharing code is needed |
| `@swup/js-plugin` | Couples transitions to a JS animation library; prefer CSS-driven animations that match the existing CSS-first system | Swup default themes (fade/slide) or custom CSS via `animationClass` |

---

## Stack Patterns by Variant

**If the animated background needs WebGL shaders (distortion, displacement):**
- Use OGL directly in a `<script>` tag within an Astro component
- Initialize the WebGL context on `DOMContentLoaded`, destroy on Swup `visit:start` if page transitions are active
- Because OGL is ES module native, import it via `import ... from 'ogl'` in the component script

**If the animated background is particle-only (no shader needed):**
- Use raw Canvas 2D in an inline script
- Wrap the animation loop in a `class ParticleSystem` and call `destroy()` during Swup page exit
- Because no import is needed, zero impact on bundle

**If subdomain count grows beyond 4:**
- Migrate to pnpm workspaces with a shared `packages/design-tokens` package
- Each subdomain imports tokens from the workspace package rather than file copying

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@swup/astro@1.8.0` | `astro@5.x`, `swup@4.x` | `reloadScripts: true` (default) re-runs Astro island scripts after navigation — required for any `client:*` components |
| `ogl@1.0.11` | Any modern bundler / Astro's Vite pipeline | Native ES modules; tree-shaking works correctly with Vite; no CommonJS issues |
| `swup@4.8.3` | All modern browsers including Firefox | Uses Fetch API + History API; no IE11 support (acceptable for this audience) |
| `tsparticles@3.9.1` (if used) | `astro-particles@2.10.0` | The `astro-particles` package bundles with tsparticles 3.x; verify Astro 5 compatibility before adopting |

---

## Sources

- [swup.js.org/integrations/astro](https://swup.js.org/integrations/astro/) — Astro integration docs; HIGH confidence
- [github.com/swup/astro](https://github.com/swup/astro) — Plugin options, reloadScripts behavior; HIGH confidence
- [swup.js.org/announcements/swup-4](https://swup.js.org/announcements/swup-4/) — Swup 4 feature summary; HIGH confidence
- [github.com/oframe/ogl](https://github.com/oframe/ogl) — OGL size and API; MEDIUM confidence (GitHub README)
- [github.com/tsparticles/astro](https://github.com/tsparticles/astro) — astro-particles package; MEDIUM confidence
- [vercel.com/guides/how-can-i-serve-multiple-projects-under-a-single-domain](https://vercel.com/guides/how-can-i-serve-multiple-projects-under-a-single-domain) — Vercel multi-project subdomain; HIGH confidence
- Codrops 2026/02/02: Three.js + Astro + Barba.js — shows Barba.js viable but unintegrated; MEDIUM confidence (single case study)
- Codrops 2026/02/18: Astro + GSAP portfolio — confirms Swup chosen for Astro transitions in 2026 production use; MEDIUM confidence
- npm registry versions verified 2026-03-01 for: swup@4.8.3, @swup/astro@1.8.0, ogl@1.0.11, tsparticles@3.9.1, astro-particles@2.10.0, gsap@3.14.2, three@0.183.2

---

*Stack research for: tuniice v1.1 UI Candy & Subdomains*
*Researched: 2026-03-01*
