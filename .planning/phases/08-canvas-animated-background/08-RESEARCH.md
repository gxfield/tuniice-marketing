# Phase 8: Canvas Animated Background - Research

**Researched:** 2026-03-01
**Domain:** Canvas 2D API / RAF lifecycle / Astro ClientRouter cleanup
**Confidence:** HIGH

## Summary

Phase 8 implements a particle field animation on HTML Canvas in the hero section, managing the full lifecycle of the animation within Astro's ClientRouter page-transition system. No new npm packages are needed — the project's existing rule of "Raw Canvas 2D, no new dependencies" is locked in STATE.md. The Canvas 2D API with `requestAnimationFrame` is the correct primitive.

The central challenge is lifecycle safety: with Astro's ClientRouter doing soft navigations (no full page reload), a naive implementation that starts a RAF loop on `astro:page-load` without cleanup will stack a new loop on every navigation. After three navigations, three loops run simultaneously, draining CPU and producing undefined rendering behavior. The fix is a module-level variable holding the RAF ID, cancelled on `astro:before-swap` (fires before the DOM is swapped) and restarted on `astro:page-load`. This pattern is directly analogous to how React cleans up `useEffect` return functions.

Three additional concerns are well-understood with browser-native solutions: (1) HiDPI/Retina sharpness is achieved by reading `window.devicePixelRatio`, scaling canvas pixel dimensions, calling `ctx.scale(dpr, dpr)`, then capping DPR at 2 to control GPU memory on ultra-dense displays; (2) tab backgrounding is handled by `document.visibilitychange` which pauses/resumes the RAF loop; (3) `prefers-reduced-motion` is checked via `window.matchMedia('(prefers-reduced-motion: reduce)')` in JS — when it matches, skip the animation entirely and show the hero section with a static CSS gradient or subtle texture instead.

**Primary recommendation:** Build a single `CanvasBackground.astro` component that owns the canvas element, all particle logic, and its own lifecycle hooks (`astro:before-swap` for teardown, `astro:page-load` for initialization). Integrate it into the hero section on pages that have one. Do not touch BaseLayout.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANIM-01 | User sees animated particle field in hero section on pages that have one | Canvas 2D particle loop started on `astro:page-load`, positioned as hero background |
| ANIM-02 | Canvas animation starts/stops cleanly on page navigation (no stacking RAF loops) | Module-level `rafId` variable, cancelled via `cancelAnimationFrame` on `astro:before-swap` |
| ANIM-03 | Canvas renders crisply on HiDPI displays (ResizeObserver + DPR capped at 2x) | `window.devicePixelRatio` + `ctx.scale(dpr, dpr)` + ResizeObserver for responsive resizing |
| ANIM-04 | Canvas animation pauses when tab is backgrounded or canvas is off-viewport | `document.visibilitychange` event for tab-background; IntersectionObserver for off-viewport |
| ANIM-05 | User with `prefers-reduced-motion` sees static fallback instead of animation | `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check before starting loop |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Canvas 2D API | Browser-native | Particle rendering and animation | Zero-dependency; project decision locked in STATE.md |
| `requestAnimationFrame` | Browser-native | Smooth 60fps animation loop | The only correct primitive for canvas animation |
| `cancelAnimationFrame` | Browser-native | Stop loop on navigation | Paired with RAF for cleanup |
| `window.devicePixelRatio` | Browser-native | HiDPI canvas scaling | Direct MDN-recommended approach |
| `ResizeObserver` | Browser-native | Resize canvas without scroll-event throttling | More efficient than window resize events |
| `document.visibilitychange` | Browser-native | Pause when tab is hidden | Page Visibility API, MDN HIGH confidence |
| `window.matchMedia` | Browser-native | Detect prefers-reduced-motion | Standard JS API for media query checks |
| `IntersectionObserver` | Browser-native | Pause when hero is scrolled off-screen | Reuse same observer pattern already in BaseLayout |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Astro `<script>` tag | Astro 5.x built-in | Module script bundled once, runs on first load | All canvas/lifecycle logic lives here |
| `astro:page-load` event | Astro ClientRouter | Reinitialize canvas loop after every navigation | Required — soft navigation does not re-run module scripts |
| `astro:before-swap` event | Astro ClientRouter | Tear down RAF loop before DOM swap | Cancel before canvas element is removed from DOM |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw Canvas 2D | tsParticles or particles.js | Project rule: no new dependencies; these add 50-200KB |
| Raw Canvas 2D | WebGL | Overkill for 2D particles; harder lifecycle management |
| `astro:before-swap` for cleanup | `astro:after-swap` | Too late — canvas element already replaced; cancelAnimationFrame would try to cancel a dead frame |
| `window.devicePixelRatio` direct | `ResizeObserver.devicePixelContentBoxSize` | More precise but Chrome 84+ only; `getBoundingClientRect * DPR` is sufficient and universal |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── sections/
│   │   └── Hero.astro             # Add CanvasBackground as positioned child
│   └── canvas/
│       └── CanvasBackground.astro # New: canvas element + particle lifecycle + all event hooks
├── layouts/
│   └── BaseLayout.astro           # No changes needed
└── styles/
    └── tokens.css                 # No changes needed
```

### Pattern 1: Module-Level RAF ID for Lifecycle Safety

**What:** Store the RAF handle in a module-level variable (outside any function) so it survives across `astro:page-load` calls. Cancel it on `astro:before-swap`.

**Why this works:** Astro's ClientRouter does a "soft load" — module scripts only execute once. Module-level state (variables declared at module scope in a `<script>`) persists across navigations. This is the correct slot for `rafId`.

**When to use:** Every time you start a RAF loop in an Astro component that is part of a ClientRouter-enabled site.

```js
// Source: Derived from Astro docs + MDN cancelAnimationFrame pattern
// In CanvasBackground.astro <script>

let rafId = null;
let particles = [];
let canvas, ctx;

function startLoop() {
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
    drawParticles();
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

// Teardown: before DOM swap removes our canvas
document.addEventListener('astro:before-swap', stopLoop);

// Init: after new page is visible
document.addEventListener('astro:page-load', () => {
  canvas = document.querySelector('#hero-canvas');
  if (!canvas) return; // Not on a hero page — exit silently
  ctx = canvas.getContext('2d');
  initParticles();
  startLoop();
});
```

### Pattern 2: HiDPI Canvas Setup (DPR + ResizeObserver)

**What:** Scale canvas pixel buffer by `devicePixelRatio` so 1 CSS pixel maps to the correct number of physical pixels. Cap at 2 to limit GPU memory on 3x/4x displays.

**When to use:** Once, in the canvas initialization function. Re-run on ResizeObserver callback.

```js
// Source: https://web.dev/articles/canvas-hidipi (verified HIGH confidence)
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  // After resize: reinitialize particles to match new dimensions
  initParticles();
}

const resizeObserver = new ResizeObserver(() => {
  stopLoop();
  resizeCanvas();
  startLoop();
});
resizeObserver.observe(canvas);
```

**Critical:** `ctx.scale(dpr, dpr)` must be called after every canvas resize because `canvas.width = ...` resets the context transform matrix.

### Pattern 3: Tab Pause via Page Visibility API

**What:** Listen for `visibilitychange` on `document`. Stop RAF loop when tab is backgrounded, restart when foregrounded.

**When to use:** Once, registered alongside the RAF setup. Use `document.hidden` for the check.

```js
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API (HIGH confidence)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopLoop();
  } else {
    // Only restart if canvas is still in DOM (still on a hero page)
    if (canvas && document.contains(canvas)) {
      startLoop();
    }
  }
});
```

**Caution:** The visibilitychange listener is added to `document` — it persists across navigations (module-level). Guard the restart with `document.contains(canvas)` to avoid restarting on a page that has no hero canvas.

### Pattern 4: Off-Viewport Pause via IntersectionObserver

**What:** Pause the loop when the canvas scrolls entirely out of view. Resume when it re-enters.

**When to use:** Applies to pages where the hero is above-the-fold but user may scroll far down. The hero section is 70vh — after scrolling past it the canvas can be paused.

```js
// Source: MDN IntersectionObserver API (HIGH confidence)
const visibilityObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    startLoop();
  } else {
    stopLoop();
  }
}, { threshold: 0 });

visibilityObserver.observe(canvas);
```

**Note:** This is the secondary pause mechanism. Tab-backgrounding (Pattern 3) is more important — address that first.

### Pattern 5: Prefers-Reduced-Motion Check

**What:** Check `prefers-reduced-motion` before initializing the canvas. If set, skip canvas entirely and show a static fallback (e.g., a CSS gradient or the existing dark grid body background).

**When to use:** At the start of the `astro:page-load` initialization function.

```js
// Source: https://web.dev/articles/prefers-reduced-motion (HIGH confidence)
function initCanvas() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Show static fallback — canvas element stays hidden, CSS handles styling
    canvas.style.display = 'none';
    return;
  }
  // Proceed with animation setup...
  resizeCanvas();
  initParticles();
  startLoop();
}
```

**Static fallback strategy:** The hero section already has the dark body background (`#0a0a0a`) and the subtle CSS grid pattern from `global.css`. These remain visible when the canvas is hidden — no extra CSS is needed for a minimal fallback. Optionally, a class on the `.hero` element (`hero--no-animation`) can apply a subtle gradient.

### Pattern 6: Particle System Internals

**What:** Minimal particle structure that matches the brand aesthetic (sparse, fast-moving dots with connecting lines).

```js
// Source: adapted from techhub.iodigital.com particle canvas pattern (MEDIUM)
function createParticle(canvasWidth, canvasHeight) {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.5,  // slow drift
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 1.5 + 0.5, // 0.5–2px
  };
}

function updateParticle(p, canvasWidth, canvasHeight) {
  p.x += p.vx;
  p.y += p.vy;
  // Wrap edges (toroidal) — cleaner than bounce for sparse fields
  if (p.x < 0) p.x = canvasWidth;
  if (p.x > canvasWidth) p.x = 0;
  if (p.y < 0) p.y = canvasHeight;
  if (p.y > canvasHeight) p.y = 0;
}
```

**Particle count:** Target 60–80 particles for desktop, scale down to 30–40 for mobile (use `canvas.width / canvas.height` ratio). Above 100 particles the distance-based line check (`O(n²)`) becomes expensive; cap at 100.

**Connection lines:** Draw lines between particles within a threshold distance (~150px), with opacity proportional to `1 - (distance / threshold)`. Use the project's `--color-accent` (`#00ff41`) at low opacity for the neon green aesthetic.

### Anti-Patterns to Avoid

- **Starting RAF loop in a `<script>` without `astro:page-load` wrapper:** The script runs once on first load. After navigation, `astro:page-load` re-fires but the script block is not re-executed. Code not wrapped in the event listener only runs on initial page load.
- **Not cancelling RAF on `astro:before-swap`:** Each navigation adds a new loop. After N navigations, N loops run simultaneously. This is the most common bug in this pattern.
- **Calling `ctx.scale(dpr, dpr)` only once:** Canvas `width`/`height` assignment resets the transform. Every resize must re-call `ctx.scale`.
- **Storing canvas reference without null-check on other pages:** The canvas only exists on hero pages. If `astro:page-load` fires on a non-hero page, `document.querySelector('#hero-canvas')` returns null. Always guard with early return.
- **Registering visibilitychange and ResizeObserver listeners inside `astro:page-load`:** These would stack on every navigation. Register them once at module scope, guard restarts with `document.contains(canvas)`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Particle animation framework | Custom particle engine | Raw Canvas 2D loop | Project rule; particles are simple enough; no library needed |
| DPR detection | Custom screen density check | `window.devicePixelRatio` | Browser-native, always current |
| Tab visibility detection | Timer-based polling | Page Visibility API (`document.hidden`) | Native, battery-aware, zero-cost |
| Resize handling | `window.resize` debounce | `ResizeObserver` | Fires per-element, not globally; no throttling needed |
| Reduced-motion gate | CSS-only approach | `window.matchMedia` JS check | Canvas animations are not CSS; must be gated in JS |

**Key insight:** All five requirements are covered by browser-native APIs. The implementation is purely vanilla JS + Canvas 2D.

---

## Common Pitfalls

### Pitfall 1: RAF Loop Stacking

**What goes wrong:** After N navigations, N separate RAF loops run simultaneously. Canvas renders undefined (loops overwrite each other). CPU spikes.

**Why it happens:** `astro:page-load` fires on every navigation. If the loop-start code is inside it without cleanup, a new loop starts each time without stopping the old one.

**How to avoid:** Store RAF ID in module-level variable. Cancel on `astro:before-swap`. New loop starts only in `astro:page-load` after cancellation.

**Warning signs:** Animation speed visibly increases after a few navigations; CPU usage grows linearly with navigation count.

### Pitfall 2: Canvas Context Transform Not Reset After Resize

**What goes wrong:** After window resize, drawing coordinates appear offset or scaled incorrectly.

**Why it happens:** Setting `canvas.width = ...` resets the context to default state (transform matrix = identity). The previous `ctx.scale(dpr, dpr)` call is lost.

**How to avoid:** Always call `ctx.scale(dpr, dpr)` immediately after every `canvas.width` or `canvas.height` assignment.

**Warning signs:** Lines drawn off-center or scaled wrong after resize.

### Pitfall 3: Stale Canvas Reference After Navigation

**What goes wrong:** After navigating away from a hero page and back, the `canvas` module variable holds a reference to the old DOM element that has been garbage collected. Calling `ctx.clearRect` throws or does nothing.

**Why it happens:** Navigation replaces the DOM. The old canvas element reference becomes stale.

**How to avoid:** In `astro:page-load`, always re-query the canvas: `canvas = document.querySelector('#hero-canvas')`. The module-level variable is updated each time.

**Warning signs:** Console error about calling methods on null or on a detached element.

### Pitfall 4: visibilitychange Listener Restart Without Guard

**What goes wrong:** User navigates to a non-hero page, switches tabs, then switches back. `visibilitychange` fires, calls `startLoop()`, which tries to use a null `canvas` reference.

**Why it happens:** The listener is registered at module scope and never removed. It fires on every tab switch regardless of current page.

**How to avoid:** In the restart branch of the visibilitychange handler, guard: `if (canvas && document.contains(canvas)) startLoop()`.

**Warning signs:** Console errors when returning to tab on non-hero pages.

### Pitfall 5: Particle Count on Mobile Without Adjustment

**What goes wrong:** 80 particles on a 375px-wide mobile screen clusters them too densely; all particles connect via lines; the field looks like a solid green blob.

**Why it happens:** Fixed particle count ignores viewport size.

**How to avoid:** Scale particle count to viewport area: `Math.floor((canvasWidth * canvasHeight) / 8000)`, clamped to `[20, 80]`.

**Warning signs:** Dense blob effect on mobile; no visible individual particles.

---

## Code Examples

Verified patterns from official sources:

### Complete Lifecycle Skeleton (Astro Script)

```js
// Source: Combined from Astro docs (astro:page-load/astro:before-swap) + MDN APIs
// In CanvasBackground.astro <script>

let rafId = null;
let canvas = null;
let ctx = null;
let particles = [];
let resizeObserver = null;

// ---- Lifecycle ----

document.addEventListener('astro:before-swap', () => {
  cancelAnimationFrame(rafId);
  rafId = null;
  if (resizeObserver && canvas) {
    resizeObserver.unobserve(canvas);
  }
});

document.addEventListener('astro:page-load', () => {
  canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  ctx = canvas.getContext('2d');
  setupResizeObserver();
  setupVisibilityPause();
  resizeCanvas();
  initParticles();
  startLoop();
});

// ---- Canvas sizing ----

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
}

function setupResizeObserver() {
  resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(rafId);
    rafId = null;
    resizeCanvas();
    initParticles();
    startLoop();
  });
  resizeObserver.observe(canvas);
}

// ---- Tab visibility ----

document.addEventListener('visibilitychange', () => {
  if (!canvas || !document.contains(canvas)) return;
  if (document.hidden) {
    cancelAnimationFrame(rafId);
    rafId = null;
  } else {
    startLoop();
  }
});

// ---- Particles ----

function initParticles() {
  const cssWidth = canvas.getBoundingClientRect().width;
  const cssHeight = canvas.getBoundingClientRect().height;
  const count = Math.min(Math.max(Math.floor((cssWidth * cssHeight) / 8000), 20), 80);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * cssWidth,
    y: Math.random() * cssHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.2 + 0.4,
  }));
}

// ---- Loop ----

function startLoop() {
  const cssWidth = canvas.getBoundingClientRect().width;
  const cssHeight = canvas.getBoundingClientRect().height;
  const linkRadius = 130;

  function tick() {
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = cssWidth;
      if (p.x > cssWidth) p.x = 0;
      if (p.y < 0) p.y = cssHeight;
      if (p.y > cssHeight) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.6)';  // --color-accent
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkRadius) {
          const opacity = (1 - dist / linkRadius) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}
```

### Canvas Element HTML (Astro Template)

```astro
<!-- CanvasBackground.astro -->
<canvas
  id="hero-canvas"
  aria-hidden="true"
  style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;"
></canvas>
```

**Notes:**
- `aria-hidden="true"` — decorative, not meaningful to screen readers
- `pointer-events: none` — clicks pass through to hero content
- `position: absolute; inset: 0` — fills parent hero container (hero must be `position: relative`)

### Static Fallback CSS (in Hero.astro)

```css
/* When canvas is not shown (reduced motion or no JS) */
.hero {
  position: relative; /* needed for canvas absolute positioning */
}

/* Subtle static "glow" fallback — matches brand without motion */
@media (prefers-reduced-motion: reduce) {
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 50%, rgba(0, 255, 65, 0.03) 0%, transparent 60%);
    pointer-events: none;
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `window.onresize` with debounce | `ResizeObserver` | Chrome 64 / Firefox 69 (2018-2019) | Element-level, no global polling |
| CSS `animation-play-state` for canvas pause | Page Visibility API | Widely supported since 2013 | Works on non-CSS animations |
| `window.innerWidth * dpr` for canvas size | `getBoundingClientRect()` × dpr | Best practice (MDN article) | Accounts for CSS transforms on canvas element |
| Particle libraries (particles.js) | Raw Canvas 2D | Project decision | Zero dependency overhead |

**Deprecated/outdated:**
- `window.onresize` for canvas resize: Replaced by `ResizeObserver`. No debounce needed.
- `document.mozHidden` / vendor-prefixed visibility: All modern browsers support `document.hidden` unprefixed.

---

## Open Questions

1. **Hero canvas on which pages exactly?**
   - What we know: Hero section is in `src/components/sections/Hero.astro` (used in `index.astro`). `StoryHero.astro` exists for the story page.
   - What's unclear: Whether the particle canvas should appear on story page hero as well, or only home page.
   - Recommendation: Plan 08-01 should target `Hero.astro` only (home page). Story page hero gets it only if explicitly requested. This keeps scope minimal.

2. **visibilitychange listener cleanup across navigations**
   - What we know: Document-level listeners registered at module scope persist across navigations. Guard checks prevent misuse.
   - What's unclear: Whether multiple `astro:before-swap` calls could stack visibilitychange listeners if the component is somehow re-initialized.
   - Recommendation: Module scripts execute once. `visibilitychange` registration is at module scope, not inside any lifecycle handler — so it registers once only. This is safe.

3. **ResizeObserver cleanup on `astro:before-swap`**
   - What we know: ResizeObserver holds a reference to the canvas element. Old canvas is garbage collected after swap.
   - What's unclear: Whether failing to unobserve causes a memory leak or just a benign stale callback.
   - Recommendation: Unobserve in `astro:before-swap` for cleanliness: `resizeObserver.unobserve(canvas)`. Safe to skip but good practice.

---

## Validation Architecture

> `workflow.nyquist_validation` is not present in config.json — section skipped.

---

## Sources

### Primary (HIGH confidence)

- `/llmstxt/astro_build_llms_txt` (Context7) — `astro:page-load`, `astro:before-swap`, `astro:before-preparation`, lifecycle event sequence, soft-load behavior, `data-astro-rerun`
- https://web.dev/articles/canvas-hidipi — `devicePixelRatio` canvas setup pattern (`setupCanvas` function)
- https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API — `document.hidden`, `visibilitychange` event, pause/resume animation pattern
- https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame — RAF ID capture and `cancelAnimationFrame` usage
- https://docs.astro.build/en/guides/view-transitions/ — lifecycle event reference, script state management across navigations
- https://events-3bg.pages.dev/jotter/astro/flow-events/ — detailed 17-step lifecycle, soft-load state persistence, `astro:before-preparation` AbortSignal

### Secondary (MEDIUM confidence)

- https://techhub.iodigital.com/articles/particle-background-effect-with-canvas — particle class pattern, RAF loop with ID capture, distance-based opacity lines
- https://web.dev/articles/prefers-reduced-motion — `window.matchMedia` for reduced-motion detection in JS
- Multiple WebSearch results (2025) for ResizeObserver best practices and IntersectionObserver viewport pause patterns

### Tertiary (LOW confidence)

- None — all critical claims verified against official MDN or Astro docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all APIs are browser-native MDN-documented; no third-party library uncertainty
- Architecture: HIGH — Astro lifecycle events verified from Context7 and official docs; module-scope variable pattern is the documented solution for soft-load state persistence
- Pitfalls: HIGH for RAF stacking and context reset (directly from API behavior); MEDIUM for mobile particle count (reasoned, not from official source)

**Research date:** 2026-03-01
**Valid until:** 2026-06-01 (browser-native APIs and Astro ClientRouter lifecycle are stable)
