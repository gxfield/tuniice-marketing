# Architecture Research

**Domain:** Astro static marketing site — UI candy additions and subdomain infrastructure
**Researched:** 2026-03-01
**Confidence:** HIGH (existing codebase inspected directly; integration patterns verified against Astro docs and official library docs)

---

## Existing Architecture (Baseline)

The site is already built. This research is about integration, not greenfield design.

```
tuniice-marketing/
├── src/
│   ├── components/
│   │   ├── common/       Footer.astro
│   │   ├── forms/        (email signup)
│   │   ├── sections/     Hero, ProductTeasers, SocialLinks, StoryHero,
│   │   │                 Connect, MusicEmbeds, Narrative
│   │   └── ui/           Avatar, Button, Card, ProductCard
│   ├── data/             (static JSON/TS data)
│   ├── layouts/          BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── products.astro
│   │   ├── story.astro
│   │   └── products/[slug].astro
│   └── styles/
│       ├── tokens.css    (CSS custom properties design system)
│       ├── global.css
│       └── animations.css (data-animate + is-visible pattern)
├── astro.config.mjs      (output: 'static', no integrations yet)
└── package.json          (astro ^5.16.16, zero other deps)
```

**Key existing contracts:**
- `BaseLayout.astro` is the single shell — all pages use it
- `astro:page-load` event drives scroll animation re-initialization (Intersection Observer)
- `<ClientRouter />` is already imported and active in `<head>` (Astro view transitions)
- `[data-animate]` → `.is-visible` is the animation primitive across all pages
- CSS custom properties in `tokens.css` are the design system — no utility classes

---

## Standard Architecture for Each Feature Area

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      BaseLayout.astro                            │
│  (shell, fonts, CSS imports, ClientRouter, global scripts)       │
├────────────┬──────────────────┬───────────────┬─────────────────┤
│            │                  │               │                  │
│  Canvas    │  Page Transition  │  Interactive  │  Subdomain       │
│  Background│  (ClientRouter   │  Effects      │  Architecture    │
│  Component │   enhancements)  │  (cursor, etc)│                  │
│            │                  │               │                  │
├────────────┴──────────────────┴───────────────┴─────────────────┤
│               Existing Section/UI Components                      │
│  Hero | ProductTeasers | SocialLinks | StoryHero | etc.          │
├─────────────────────────────────────────────────────────────────┤
│              tokens.css (CSS custom properties)                   │
│              global.css | animations.css                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature Integration Points

### 1. Canvas/WebGL Animated Backgrounds

**How it integrates:**
Canvas backgrounds are positioned elements behind page content — they do not replace or wrap existing components. They attach to a container element (typically `body` or a section wrapper) and render independently via `requestAnimationFrame`.

**Integration point:** `BaseLayout.astro` or per-page `<section>` wrappers.

**New component:** `src/components/ui/CanvasBackground.astro`
- Renders a `<canvas>` element with `position: fixed; z-index: 0; pointer-events: none`
- A companion `<script>` tag initializes the animation loop
- Must cancel `requestAnimationFrame` and remove resize listeners on `astro:before-preparation` (Astro's navigation-start lifecycle event) to prevent memory leaks across page transitions

**Key lifecycle events for canvas cleanup:**
```
astro:page-load       → initialize canvas, start RAF loop
astro:before-preparation → cancel RAF loop, remove event listeners
```

**Recommended approach:** Vanilla Canvas 2D API (no library) for a sparse particle field.
- Zero bundle cost
- Full control over visual style
- Respects `prefers-reduced-motion` via `window.matchMedia`
- If a richer effect is needed later, `@tsparticles/slim` (~40KB gzipped) is the lightest library option

**Modified files:** `BaseLayout.astro` (add component slot), new `CanvasBackground.astro`

**Confidence:** HIGH — pattern is well-established, Canvas 2D API is native, Astro lifecycle events are documented

---

### 2. Page Transitions

**Current state:** `<ClientRouter />` is already active in `BaseLayout.astro`. This is Astro's built-in view transitions system.

**Key finding:** As of Firefox 144 (released late 2025), the View Transitions API is now supported in all major browsers. Astro's `ClientRouter` works correctly in Firefox 144+ via the same-document View Transitions API. The original decision to use a JS library for "broader browser support" is no longer necessary — `ClientRouter` provides full browser parity.

**Recommendation:** Extend `ClientRouter` with Astro's built-in transition directives rather than adding Swup or Barba.js. Swup would conflict with `ClientRouter` (both intercept link clicks and replace page content — running both simultaneously is unsupported).

**Integration approach:**
- Add `transition:animate` directives to `BaseLayout.astro` elements (e.g., `<main>`)
- Define custom animation keyframes in `animations.css`
- Existing `astro:page-load` handler in `BaseLayout.astro` already handles re-initialization — no changes needed there

**Example addition to `BaseLayout.astro`:**
```astro
<main transition:animate="fade">
  <slot />
</main>
```

**Custom slide/fade transition in `animations.css`:**
```css
@keyframes tuniice-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Modified files:** `BaseLayout.astro` (add `transition:animate`), `animations.css` (add keyframes)
**New files:** None required

**Confidence:** HIGH — verified against Astro docs and Firefox 144 release notes

---

### 3. Interactive Elements (Cursor, Hover Distortions, Glitch Text)

These are three separate, independent effects. Each integrates differently.

#### Custom Cursor Effect

**Integration point:** `BaseLayout.astro` (global, applies to all pages)

**New component:** `src/components/ui/CustomCursor.astro`
- Renders a `<div class="cursor">` element
- Script attaches `mousemove` listener on `document`
- Must reinitialize on `astro:page-load` (ClientRouter replaces DOM)
- Must use `pointer-events: none` on the cursor element

**Implementation pattern:**
```typescript
// Inside <script> in CustomCursor.astro
document.addEventListener('astro:page-load', () => {
  const cursor = document.querySelector('.cursor') as HTMLElement;
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
});
```

**Modified files:** `BaseLayout.astro` (add `<CustomCursor />` import and usage)
**New files:** `src/components/ui/CustomCursor.astro`

#### Hover Distortions

**Integration point:** Per-component, applied to specific elements (e.g., product cards, hero heading)

**Approach:** SVG `<feTurbulence>` filter applied via CSS on hover. Pure CSS — zero JS required. The filter is defined once in `global.css` or inline in the component, referenced by `filter: url(#distort)` on hover.

**Modified files:** Individual section components (add filter reference), `global.css` (SVG filter definition)
**New files:** None

#### Glitch Text Effect

**Integration point:** Per-component, applied to specific headings (Hero, StoryHero likely)

**Approach:** Pure CSS `@keyframes` with `clip-path` and `text-shadow` layering. No JS required. Applied via a `.glitch` utility class or a `data-glitch` attribute.

**Example (add to `animations.css`):**
```css
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
}
.glitch::before { color: var(--color-accent); transform: translateX(-2px); animation: glitch-shift 3s infinite; }
.glitch::after  { color: var(--color-accent-warm); transform: translateX(2px); animation: glitch-shift 3s infinite reverse; }
```

**Key:** Use `data-text` attribute to duplicate text content (CSS `content: attr(data-text)`).

**Modified files:** `animations.css` (add glitch keyframes), `Hero.astro` / `StoryHero.astro` (add class + attribute)
**New files:** None

**Confidence:** MEDIUM — CSS glitch is pure CSS standard; cursor and distortion patterns are common vanilla JS, but exact behavior depends on how ClientRouter swaps DOM (always reinitialize on `astro:page-load`)

---

### 4. Subdomain Infrastructure (bluepriint.tuniice.com)

**Approach:** Separate Vercel project pointing at the same GitHub repository, with a different root directory.

**Recommended repo structure — monorepo, single repo:**
```
tuniice-marketing/           ← current root (main site)
bluepriint/                  ← new Astro app for bluepriint subdomain
  astro.config.mjs
  src/
    layouts/
      BpLayout.astro         ← extends shared tokens, uses bp accent color
    pages/
      index.astro
      ...
  package.json
packages/
  design-tokens/
    tokens.css               ← shared CSS custom properties (moved here)
```

**Alternatively (simpler for now):** Keep both sites in the same repo without a `packages/` folder — `bluepriint/` simply imports from `../src/styles/tokens.css` via a relative path or copies the tokens file. Monorepo tooling (Turborepo/pnpm workspaces) is optional at this scale.

**Vercel configuration:**
- Main site: existing Vercel project, root directory = `/` (or `tuniice-marketing/`)
- Bluepriint: new Vercel project connected to same GitHub repo, root directory = `bluepriint/`
- In Bluepriint's Vercel project Settings → Domains: add `bluepriint.tuniice.com`

**Shared design system integration:**
- `tokens.css` uses CSS custom properties — subdomains import it and override `--color-accent` for their brand color
- `--color-accent: #00ff41` (main site neon green) → `--color-accent: [bluepriint color]` (e.g., amber `#ffbf00` already in tokens)
- No build-time coupling; each Astro project builds independently

**Bluepriint layout pattern:**
```astro
---
// bluepriint/src/layouts/BpLayout.astro
import '../styles/tokens.css'; // extends shared tokens
---
<style>
  :root {
    --color-accent: #ffbf00; /* bluepriint amber override */
  }
</style>
```

**New files:**
- `bluepriint/` directory tree (new Astro project)
- `bluepriint/astro.config.mjs`
- `bluepriint/src/layouts/BpLayout.astro`
- `bluepriint/src/pages/index.astro`

**Modified files:** None in main site

**Confidence:** HIGH — Vercel multiple-project-per-repo is documented and widely used; Astro multi-project in monorepo is standard

---

## Recommended Project Structure (Post-v1.1)

```
tuniice-marketing/
├── src/
│   ├── components/
│   │   ├── common/       Footer.astro
│   │   ├── forms/
│   │   ├── sections/     (unchanged)
│   │   └── ui/
│   │       ├── Avatar.astro
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       ├── ProductCard.astro
│   │       ├── CanvasBackground.astro   ← NEW
│   │       └── CustomCursor.astro       ← NEW
│   ├── data/
│   ├── layouts/
│   │   └── BaseLayout.astro             ← MODIFIED (add cursor, canvas, transition:animate)
│   ├── pages/            (unchanged)
│   └── styles/
│       ├── tokens.css    (unchanged)
│       ├── global.css    ← MODIFIED (add SVG distortion filter)
│       └── animations.css ← MODIFIED (add glitch + page transition keyframes)
├── bluepriint/                          ← NEW Astro project
│   ├── astro.config.mjs
│   ├── package.json
│   └── src/
│       ├── layouts/BpLayout.astro
│       └── pages/index.astro
├── astro.config.mjs      (unchanged)
└── package.json          (unchanged)
```

---

## Architectural Patterns

### Pattern 1: astro:page-load Reinit

**What:** All client-side JS that touches the DOM must register via `astro:page-load` (not `DOMContentLoaded`), because `<ClientRouter />` replaces DOM nodes during navigation without a full page reload.

**When to use:** Any JS that queries `document` for elements — cursor tracker, Intersection Observer, canvas init.

**Trade-offs:** Slight overhead (listeners re-registered on every nav), but negligible. Forgetting this causes effects to stop working after the first navigation.

**Example:**
```typescript
document.addEventListener('astro:page-load', () => {
  // Safe to query DOM here — always runs after navigation completes
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
});
```

This pattern already exists in `BaseLayout.astro` for the Intersection Observer — extend it rather than duplicating.

---

### Pattern 2: CSS-First Effects, JS as Enhancement

**What:** Implement visual effects in CSS where possible (`glitch`, hover distortions via SVG filter, transition keyframes). Add JS only where CSS cannot reach (canvas rendering, cursor position tracking).

**When to use:** Always. CSS effects survive ClientRouter navigation without reinit. JS effects require `astro:page-load` handling.

**Trade-offs:** CSS is more declarative and simpler; JS is more flexible. Prefer CSS.

---

### Pattern 3: Canvas Lifecycle — Start/Stop on Navigation

**What:** Canvas animation loops (`requestAnimationFrame`) must be explicitly started on `astro:page-load` and cancelled on `astro:before-preparation`.

**When to use:** Any persistent animation loop.

**Trade-offs:** Requires careful cleanup; missing cleanup causes multiple loops to stack after each navigation, wasting CPU.

**Example:**
```typescript
let rafId: number;

document.addEventListener('astro:page-load', () => {
  function loop() {
    draw(); // canvas drawing logic
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
});

document.addEventListener('astro:before-preparation', () => {
  cancelAnimationFrame(rafId);
});
```

---

### Pattern 4: Design Token Override for Subdomains

**What:** Subdomain sites import the shared `tokens.css` then override `--color-accent` (and any other brand-specific tokens) at the `:root` level in their layout.

**When to use:** Each subdomain that shares the design system but has its own accent color.

**Trade-offs:** Simple and zero build-time coupling. Risk of token drift if `tokens.css` evolves — subdomains must import updated version.

---

## Data Flow

### Page Navigation Flow (with ClientRouter)

```
User clicks link
     ↓
ClientRouter intercepts (prevents full reload)
     ↓
astro:before-preparation fires → cancel canvas RAF, cleanup listeners
     ↓
Fetch new page HTML
     ↓
Run transition:animate (fade/slide)
     ↓
Swap <main> content
     ↓
astro:page-load fires → re-init Intersection Observer, cursor, canvas RAF
     ↓
Page visible to user
```

### Canvas Background Data Flow

```
astro:page-load
     ↓
CanvasBackground script initializes
     ↓
RAF loop starts → clears canvas → draws particles → updates positions → repeat
     ↓
window resize event → recalculate canvas dimensions
     ↓
astro:before-preparation → cancelAnimationFrame → removeEventListener
```

---

## Integration Points Summary

| Feature | Integration Point | New Files | Modified Files |
|---------|------------------|-----------|----------------|
| Canvas background | `BaseLayout.astro` (add component) | `CanvasBackground.astro` | `BaseLayout.astro` |
| Page transitions | `BaseLayout.astro` (extend existing `<ClientRouter />`) | None | `BaseLayout.astro`, `animations.css` |
| Custom cursor | `BaseLayout.astro` (add component) | `CustomCursor.astro` | `BaseLayout.astro` |
| Hover distortions | Per-component (section components) | None | `global.css`, target components |
| Glitch text | Per-component (Hero, StoryHero) | None | `animations.css`, `Hero.astro`, `StoryHero.astro` |
| Subdomain infrastructure | New Vercel project + new `bluepriint/` dir | Full `bluepriint/` subtree | None in main site |

---

## Recommended Build Order

Dependencies drive the order. Lower items depend on higher items being stable.

**Phase 1 — Page Transitions (foundation, no new dependencies)**
Extend the existing `<ClientRouter />` with `transition:animate` directives and custom keyframes. Build this first because all subsequent effects must co-exist with navigation; testing transitions early catches any `astro:page-load` reinit bugs before they compound.

**Phase 2 — Canvas Animated Background**
Adds the most visual impact. Self-contained component. Must implement start/stop lifecycle correctly (Pattern 3 above) to not interfere with transitions established in Phase 1.

**Phase 3 — Interactive Elements (cursor, glitch, hover distortions)**
These are independent of each other and can be built in any sub-order. CSS effects (glitch, hover distortion) first — they're simpler and have no lifecycle concerns. Custom cursor last — it requires `astro:page-load` reinit and should be tested after transitions and canvas are stable.

**Phase 4 — Subdomain Infrastructure**
Entirely separate from Phases 1-3. The Bluepriint mini-site is a new Astro project. The main site is not modified. Build this once the main site effects are finalized so design token decisions are stable before forking.

```
Phase 1: Page Transitions (extend ClientRouter)
   ↓ (verify astro:page-load lifecycle works)
Phase 2: Canvas Background
   ↓ (verify RAF cleanup on navigation)
Phase 3a: Glitch Text + Hover Distortions (CSS only)
Phase 3b: Custom Cursor (JS, reinit on page-load)
   ↓ (main site complete)
Phase 4: Bluepriint Subdomain (new Vercel project, new Astro app)
```

---

## Anti-Patterns

### Anti-Pattern 1: Using `DOMContentLoaded` for Effect Init

**What people do:** `document.addEventListener('DOMContentLoaded', () => { ... })` to init cursor, canvas, etc.

**Why it's wrong:** `DOMContentLoaded` only fires on hard page load. With `<ClientRouter />` active, soft navigations do not fire `DOMContentLoaded` — effects stop working after the first link click.

**Do this instead:** Use `astro:page-load`. It fires on hard load AND after every ClientRouter navigation.

---

### Anti-Pattern 2: Adding Swup or Barba.js Alongside ClientRouter

**What people do:** Install `@swup/astro` for "better" page transitions without removing `<ClientRouter />`.

**Why it's wrong:** Both systems intercept link clicks and manage content replacement. Running both simultaneously causes double-fetch, broken animations, and unpredictable DOM state.

**Do this instead:** Use `ClientRouter` exclusively. It now has full browser support (Firefox 144+). Extend it with `transition:animate` directives and custom CSS keyframes for any animation needed.

---

### Anti-Pattern 3: Stacking RAF Loops on Navigation

**What people do:** Register canvas animation loop inside `astro:page-load` without cancelling the previous loop.

**Why it's wrong:** Each navigation adds another RAF loop. After 5 page visits, 5 loops are running simultaneously. Performance degrades and visual artifacts appear.

**Do this instead:** Store the RAF ID at module scope. Cancel on `astro:before-preparation` before starting a new loop on `astro:page-load`.

---

### Anti-Pattern 4: Coupling Subdomain to Main Site Build

**What people do:** Reference main site components from the subdomain via relative paths deep into `../src/components/`.

**Why it's wrong:** Creates tight coupling — changes in the main site can break subdomain builds. Vercel builds each project separately; cross-project imports don't work in static builds.

**Do this instead:** Each subdomain project is self-contained. Shared tokens/styles are copied or extracted to a `packages/` shared directory. At this scale (one subdomain), copying `tokens.css` is the simplest approach.

---

## Scaling Considerations

| Scale | Architecture Adjustment |
|-------|------------------------|
| 1-2 subdomain sites | Copy `tokens.css` to each subdomain — simplest |
| 3-5 subdomain sites | Extract to `packages/design-tokens/` with pnpm workspaces, use Turborepo |
| 6+ subdomain sites | Formal component library package, Storybook, version-controlled tokens |

The current scale (one subdomain planned) does not justify Turborepo complexity. Copy the tokens file and reference it locally in the `bluepriint/` project.

---

## Sources

- Astro View Transitions docs: https://docs.astro.build/en/guides/view-transitions/
- Firefox 144 View Transitions support: https://events-3bg.pages.dev/jotter/in-all-major-browsers/
- Swup Astro integration: https://swup.js.org/integrations/astro/
- Vercel multi-project subdomain: https://vercel.com/kb/guide/how-can-i-serve-multiple-projects-under-a-single-domain
- Deploying monorepo to Vercel subdomains: https://dev.to/jdtjenkins/how-to-deploy-a-monorepo-to-different-subdomains-on-vercel-2chn
- Canvas performance: https://web.dev/canvas-performance/
- Glitch CSS effect: https://css-tricks.com/glitch-effect-text-images-svg/
- Scroll-revealed WebGL with Astro + Barba.js (Codrops): https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/

---
*Architecture research for: tuniice v1.1 UI Candy & Subdomains*
*Researched: 2026-03-01*
