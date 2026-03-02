# Pitfalls Research

**Domain:** UI candy (animated backgrounds, page transitions, interactive elements) + subdomain app sites on Astro/Vercel
**Researched:** 2026-03-01
**Confidence:** HIGH (most findings verified against official docs and multiple sources)

---

## Critical Pitfalls

### Pitfall 1: Swup Hooks Not Replacing DOMContentLoaded

**What goes wrong:**
Third-party initializers, Intersection Observers, GSAP triggers, and canvas setup code run once on initial load inside `DOMContentLoaded`. After Swup navigates to a new page, that event never fires again. Animations and interactive elements appear broken on all pages reached via transition — they work only when landing directly on a URL.

**Why it happens:**
Swup replaces DOM content without a full page reload. Scripts that fire on `DOMContentLoaded` are browser-level events tied to the initial document parse, not Swup's synthetic page changes. This is documented as the single most common mistake in the official Swup docs.

**How to avoid:**
Run all initialization code in a shared function. Register it on BOTH `DOMContentLoaded` (first visit) AND `swup:page:view` (subsequent visits). Use the cleanup hook `swup:content:replace` to tear down anything that would duplicate on re-init.

```js
function init() {
  // Set up IntersectionObserver, canvas, cursors, etc.
}
function cleanup() {
  // Disconnect observers, cancel rAF loops, remove listeners
}
document.addEventListener('DOMContentLoaded', init);
swup.hooks.on('page:view', init);
swup.hooks.before('content:replace', cleanup);
```

**Warning signs:**
- Scroll animations work on first visit but not after clicking a nav link
- Canvas renders on home page but is blank when navigating back to it
- Console shows duplicate event listener warnings after multiple navigations

**Phase to address:** Animated Backgrounds phase (before transitions are wired) — establish the init/cleanup pattern early so it is not retrofitted.

---

### Pitfall 2: WebGL GPU Memory Accumulates Across Page Transitions

**What goes wrong:**
Three.js (or OGL/vanilla WebGL) geometries, textures, and materials are allocated on the GPU. Removing a mesh from the scene does not free GPU memory. When Swup swaps the DOM, the canvas element is removed but the WebGL allocations persist. After navigating back and forth several times, GPU memory climbs until the browser crashes the tab or forces a context loss.

**Why it happens:**
WebGL buffers live outside JavaScript's garbage collector. The GC can clean JS objects but has no visibility into GPU allocations. Developers familiar with JS assume object removal = memory release — it does not.

**How to avoid:**
In the Swup `content:replace` cleanup hook, explicitly dispose every GPU-allocated resource before swapping:

```js
function cleanupWebGL() {
  scene.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material.dispose();
    }
  });
  renderer.dispose();
  cancelAnimationFrame(rafId);
}
```

Monitor with `renderer.info.memory` during development — `textures` and `geometries` counts should drop to zero after navigation.

**Warning signs:**
- Chrome Task Manager shows GPU memory growing with each navigation
- `renderer.info.memory.textures` never returns to zero
- Tab crashes or goes blank after 5-10 page transitions
- WebGL context loss event fires unexpectedly

**Phase to address:** Animated Backgrounds phase — build cleanup into the initial canvas module before Swup is integrated.

---

### Pitfall 3: Canvas/WebGL Runs Continuously When Not Visible

**What goes wrong:**
The `requestAnimationFrame` loop keeps running when the user switches tabs, minimizes the browser, or navigates to a page without a canvas. This drains battery on mobile, pegs the CPU/GPU at idle load, and causes thermal throttling on lower-end devices.

**Why it happens:**
Developers start the rAF loop and never cancel it because the effect looks good in dev. The browser does reduce rAF frequency when a tab is hidden, but the loop is never fully stopped. On mobile, even reduced-frequency canvas rendering creates measurable battery impact.

**How to avoid:**
Use two mechanisms together:
1. `document.addEventListener('visibilitychange', ...)` — pause when `document.hidden` is true, resume on visible
2. `IntersectionObserver` on the canvas element — cancel rAF when canvas scrolls out of viewport, restart when it returns

```js
let rafId;
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) startLoop();
  else cancelAnimationFrame(rafId);
});
observer.observe(canvas);
document.addEventListener('visibilitychange', () => {
  document.hidden ? cancelAnimationFrame(rafId) : startLoop();
});
```

**Warning signs:**
- DevTools Performance panel shows continuous GPU activity even on static pages
- Mobile devices warm up noticeably after a few seconds on the home page
- CPU usage stays elevated when the tab is backgrounded

**Phase to address:** Animated Backgrounds phase — implement visibility pausing from day one.

---

### Pitfall 4: Canvas Sized to Window Instead of Its CSS Box

**What goes wrong:**
Setting `canvas.width = window.innerWidth` makes the canvas appear correct on desktop but produces blurry or incorrectly-scaled output on high-DPI screens, misaligns on mobile when the browser chrome changes height (address bar hiding/showing), and breaks when the canvas is not full-viewport (e.g., positioned inside a section element).

**Why it happens:**
`window.innerWidth`/`innerHeight` is a shortcut that appears correct at first glance. The actual rendered size of the canvas is controlled by CSS, not by the canvas's intrinsic dimensions. On Retina displays, the physical pixel count is 2x the CSS pixel count, so the canvas needs to be 2x the `clientWidth` to appear crisp.

**How to avoid:**
Use `ResizeObserver` on the canvas element and scale by `devicePixelRatio`:

```js
const ro = new ResizeObserver(entries => {
  const { width, height } = entries[0].contentRect;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  // Re-set WebGL viewport and projection
});
ro.observe(canvas);
```

**Warning signs:**
- Animation looks crisp on 1x display but blurry on MacBook/iPhone
- Canvas clips or overflows its container on resize
- Particles or lines appear at the wrong position relative to page elements

**Phase to address:** Animated Backgrounds phase — bake correct sizing into the canvas utility before building any effect on top of it.

---

### Pitfall 5: Subdomain Requires Full Vercel Nameserver Delegation for Wildcard SSL

**What goes wrong:**
Adding `bluepriint.tuniice.com` as a custom subdomain on Vercel works with a CNAME record. However, if a wildcard (`*.tuniice.com`) is ever needed for multiple app subdomains, Vercel requires full nameserver delegation (ns1.vercel-dns.com) to issue wildcard SSL certificates. If DNS is managed elsewhere (e.g., Cloudflare), wildcard SSL fails silently or requires a separate certificate.

**Why it happens:**
Wildcard TLS certificates require DNS-01 ACME challenges, which Vercel can only automate if it controls the zone. Per-subdomain CNAMEs work but each requires manual addition in Vercel's dashboard and its own certificate issuance. Teams assume CNAME is sufficient for wildcard use — it is not.

**How to avoid:**
For the current scope (one subdomain: `bluepriint.tuniice.com`), a CNAME record is sufficient. Add the subdomain in Vercel's project settings, add the CNAME to your DNS provider, and let Vercel issue an individual certificate. Do not set up wildcard unless 3+ subdomains are needed simultaneously. If you later need wildcard routing, plan for a full nameserver migration to Vercel DNS.

**Warning signs:**
- SSL certificate shows "pending" for more than 30 minutes after adding subdomain
- Browser shows cert invalid on `bluepriint.tuniice.com` but not on `tuniice.com`
- Vercel dashboard shows "DNS misconfigured" even though CNAME is set

**Phase to address:** Subdomain Infrastructure phase — verify DNS approach before building the mini-site to avoid a rename/re-point mid-phase.

---

### Pitfall 6: Custom Cursor Breaks on Touch Devices and Fails Accessibility

**What goes wrong:**
A JavaScript cursor element (`div` following `mousemove`) renders on touch devices where there is no cursor, sometimes flickering or appearing at position 0,0 on tap. Screen reader users and keyboard-only users see no benefit. Users who have OS-level cursor enlargement or high-contrast cursor settings lose those accommodations entirely because the system cursor is hidden.

**Why it happens:**
Custom cursors are developed and tested on desktop with a mouse. Mobile/touch and accessibility edge cases are found later in production. `cursor: none` on the `body` hides the system cursor globally, including for assistive technology.

**How to avoid:**
- Only activate the custom cursor if `matchMedia('(pointer: fine)')` is true (mouse/trackpad) — this excludes all touch-only devices
- Honor `prefers-reduced-motion: reduce` — disable the cursor follower animation (the cursor can still exist but should not animate)
- Add `pointer-events: none` to the cursor element so it never blocks clicks
- Never remove the cursor outline/focus ring from keyboard-navigable elements

```js
const hasMouse = window.matchMedia('(pointer: fine)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (hasMouse && !reducedMotion) initCustomCursor();
```

**Warning signs:**
- Tapping on mobile shows a cursor element flash at the tap location
- Keyboard tabbing produces no visible focus indicator
- `cursor: none` applied to `body` with no fallback for accessibility modes

**Phase to address:** Interactive Elements phase — gate the cursor from the start rather than disabling it later.

---

### Pitfall 7: Glitch Text Effects Implemented in Canvas Instead of CSS

**What goes wrong:**
A glitch text effect built with Canvas 2D pixel manipulation (reading and scrambling pixel data per frame) is CPU-intensive and causes visible frame drops, especially on mobile devices from before 2022. The same visual result is achievable with CSS `@keyframes` and `clip-path`/`transform` at a fraction of the cost.

**Why it happens:**
Canvas feels like the "correct" tool for pixel-level distortion. The pixel-manipulation approach is common in tutorials because it looks impressive in isolation, but it runs poorly in the context of a page that is also running a particle background and cursor follower.

**How to avoid:**
Use pure CSS `@keyframes` for glitch text. CSS animations run on the compositor thread and do not touch the main thread or GPU compute budget in the same way canvas pixel ops do. Use canvas/WebGL only if the effect requires per-pixel color channel splitting that CSS cannot achieve. GSAP `SplitText` + transforms is a reasonable middle ground for sequenced glitch reveals.

**Warning signs:**
- Chrome DevTools shows long paint tasks in the Performance panel during glitch animation
- Glitch text causes dropped frames on the canvas particle background
- Mobile Safari jank during glitch sequence

**Phase to address:** Interactive Elements phase — establish the CSS-first rule before any JS effects are built.

---

### Pitfall 8: Swup Transition Animation Timing Determined by CSS, Not JS

**What goes wrong:**
A developer sets a 600ms JS `setTimeout` for the transition delay, but the actual Swup animation completes in 300ms (or vice versa). Content either flashes in before the animation finishes or the page hangs blank waiting for a timer that does not match the CSS. The animation feels broken even though both parts work independently.

**Why it happens:**
Swup determines transition completion by CSS animation/transition duration on the element marked with `transition-*` class. If the JS and CSS durations are set separately and fall out of sync during iteration, the handoff between out-animation and content-replace is misaligned.

**How to avoid:**
Set the duration in one place only — the CSS `transition-duration` on the Swup-controlled element. Do not use JS `setTimeout` for transition timing. Use CSS custom properties to share the value if JS needs to read it:

```css
:root { --transition-duration: 400ms; }
.transition-fade { transition: opacity var(--transition-duration) ease; }
```

```js
const dur = parseFloat(getComputedStyle(document.documentElement)
  .getPropertyValue('--transition-duration')) * 1000;
```

**Warning signs:**
- Flash of white/black between pages
- Content appears before out-animation finishes
- `swup:animation:out:end` fires at a different time than expected

**Phase to address:** Page Transitions phase — define timing token first, then animate.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline canvas setup script per page | Faster initial implementation | Script does not re-run after Swup navigation; each page needs its own re-init logic | Never — put in shared module from day one |
| `requestAnimationFrame` loop with no visibility check | Simpler code, easy to demo | Continuous battery drain on mobile, thermal throttling | Never |
| Wildcard CNAME for subdomains at DNS provider | Seems like it handles all future subdomains | Wildcard SSL fails unless Vercel controls nameservers | Only if migrating all DNS to Vercel |
| `window.innerWidth` for canvas sizing | One-liner | Blurry on HiDPI, breaks inside non-fullscreen containers | Never for production |
| Canvas pixel manipulation for glitch text | Fine-grained control | CPU-intensive, causes jank alongside particle background | Only if CSS cannot achieve the effect |
| `client:load` for all canvas/animation islands | Simple hydration directive | Canvas initializes before page is painted, delaying LCP | Use `client:visible` or `client:idle` for below-fold |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Swup + Astro `<script>` tags | Inline scripts added by Astro are module scripts; browser caches them and does not re-execute on navigation | Wrap all init logic in Swup `page:view` hook, not bare module-level code |
| Swup + Intersection Observer | Observers created on first load are never disconnected; after Swup swaps content, they point at detached DOM nodes | Disconnect all observers in `content:replace` hook; reconnect in `page:view` |
| Three.js / OGL + Swup | Renderer persists after DOM swap; next page instantiates a second renderer, exhausting WebGL contexts (browsers limit to 8-16 per page) | Dispose renderer in cleanup hook; limit to one renderer singleton |
| Vercel + subdomain | Adding subdomain in Vercel does not auto-propagate SSL — it must show "Valid Configuration" in dashboard before the domain works | Wait for certificate issuance (up to 15 min) before testing; do not assume HTTPS works immediately |
| Vercel + separate Astro project for subdomain | Deploying subdomain as a separate Vercel project requires connecting the same Git org and adding the subdomain in Project Settings > Domains | Do not use rewrites from the main project — a separate Vercel project with its own domain is cleaner for a full mini-site |
| CSS custom properties + subdomain shared styles | CSS custom properties defined in the main site's stylesheet are not automatically available on the subdomain | Extract design tokens to a standalone `tokens.css` file that both projects import; do not duplicate manually |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Multiple simultaneous canvas animations without shared rAF | Each canvas runs its own loop; 3 canvases = 3x the GPU calls per frame | One rAF loop per page; pass a single timestamp to all effects | Immediately on mid-tier mobile |
| High particle count without LOD | 2,000 particles at 60fps is silky on M3 MacBook, choppy on mid-tier Android | Default to 500-800 particles; reduce count below `matchMedia('(max-width: 768px)')` | 2020-era Android, low-power mode |
| Canvas at full `devicePixelRatio` on all screens | 3x DPR (iPhone 15 Pro) means 9x the pixels to render vs. 1x screen | Cap DPR at 2: `Math.min(window.devicePixelRatio, 2)` | Any 3x DPR device |
| Page transition animation blocking navigation | Long out-animation (>500ms) makes the site feel sluggish | Keep out+in total under 600ms; Swup will wait for CSS duration | Users with slow connections who want to navigate fast |
| Swup Head Plugin loading per-page stylesheets | Each navigation fetches a new stylesheet from network | Use one global stylesheet; avoid per-page CSS unless critical | Slow networks, many navigations |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Putting Formspree endpoint in JS bundle for subdomain sign-up | Endpoint is public and can be harvested for spam | Formspree endpoints are already public by design; mitigate with Formspree's built-in reCAPTCHA option |
| Content-Security-Policy (CSP) headers not updated for WebGL | `script-src` and `worker-src` directives may block inline WebGL shaders | If adding CSP headers via `vercel.json`, include `'unsafe-eval'` only if required by the WebGL library; prefer compiled shader strings |
| Subdomain shares session storage with main domain | `bluepriint.tuniice.com` can read `tuniice.com` localStorage under same eTLD+1 | Not a risk for this project (no auth, no secrets in storage); note for future if user data is ever stored |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Particle background with no reduced-motion fallback | Users with vestibular disorders experience nausea; EU accessibility law now requires compliance | Check `prefers-reduced-motion: reduce` in JS; stop the rAF loop and show a static gradient fallback |
| Custom cursor with no fallback on touch | Touch users see a ghost cursor element at random positions | Gate custom cursor on `(pointer: fine)` media query |
| Page transition longer than 500ms | Users who clicked intentionally are penalized; feels like lag | Cap total transition at 400ms; out=150ms, in=250ms is a good baseline |
| Glitch text that triggers on every scroll event | Glitch firing constantly (not as a one-shot on first view) feels epileptic and cheap | Trigger glitch once on IntersectionObserver entry; do not loop indefinitely |
| Subdomain navigation with no back-to-main link | Users land on `bluepriint.tuniice.com` from an external link and cannot find the main site | Include a persistent header link or footer link back to `tuniice.com` |
| Hover distortion effects with no keyboard equivalent | Keyboard users miss the interactive feedback entirely | Add `:focus-within` CSS equivalents for any hover state that communicates information |

---

## "Looks Done But Isn't" Checklist

- [ ] **Canvas animation:** Test by navigating away and back — does it reinitialize correctly or stay blank?
- [ ] **WebGL cleanup:** Check `renderer.info.memory.textures` after 5 navigations — should be 0 on pages without canvas
- [ ] **rAF loop:** Switch to another tab for 30 seconds — confirm CPU drops to near zero in Task Manager
- [ ] **Custom cursor:** Open on iPhone Safari — confirm no cursor element appears or flickers on tap
- [ ] **Reduced motion:** Enable "Reduce Motion" in macOS System Settings — confirm all JS animations stop, not just CSS ones
- [ ] **Swup re-init:** Navigate to Home → Products → Home — confirm scroll animations replay on second Home visit
- [ ] **Subdomain SSL:** Visit `https://bluepriint.tuniice.com` — confirm green lock, no mixed-content warnings
- [ ] **Subdomain design tokens:** Confirm neon green accent and font stack match main site — not hardcoded differently
- [ ] **Page transition timing:** Confirm no flash of unstyled content between pages; check at throttled 3G in DevTools
- [ ] **Particle count on mobile:** Open DevTools mobile emulation (Moto G4) — confirm no dropped frames in Performance panel

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Scripts not re-initializing after Swup | MEDIUM | Audit all `DOMContentLoaded` usages; wrap in shared `init()` callable from Swup `page:view`; add debug plugin to surface issues |
| GPU memory leak discovered post-launch | HIGH | Add dispose calls in cleanup hook; may require refactoring canvas module if it lacks a teardown interface |
| rAF battery drain found in production | LOW | Add `visibilitychange` and IntersectionObserver guards in the canvas module; deploy as hotfix |
| Wrong canvas sizing on HiDPI | LOW | Replace `window.innerWidth` with `ResizeObserver + clientWidth + devicePixelRatio`; one-file change |
| Subdomain SSL stuck "pending" | LOW | Verify CNAME propagated (`dig bluepriint.tuniice.com`); re-trigger in Vercel dashboard; wait up to 24h for DNS TTL |
| Glitch text causing jank | LOW | Replace canvas pixel manipulation with CSS `@keyframes`; net improvement to performance |
| Page transition timing mismatch | LOW | Consolidate duration to a single CSS custom property; remove any JS `setTimeout` timers tied to transition |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Swup hooks not replacing DOMContentLoaded | Page Transitions | Navigate Home→Products→Home; confirm scroll animations replay |
| WebGL GPU memory accumulation | Animated Backgrounds (before Swup integration) | `renderer.info.memory.textures === 0` after navigating away from canvas page |
| rAF running when not visible | Animated Backgrounds | Background tab + CPU profiler; confirm <5% CPU after 30s backgrounded |
| Canvas sized to window not CSS box | Animated Backgrounds | Inspect on 3x DPR iPhone and resize desktop window; no blur or clip |
| Subdomain wildcard SSL | Subdomain Infrastructure | HTTPS green lock on `bluepriint.tuniice.com` with no cert errors |
| Custom cursor touch/a11y | Interactive Elements | iPhone smoke test; Reduce Motion system setting; keyboard-only tab navigation |
| Glitch text in canvas not CSS | Interactive Elements | DevTools Performance panel shows no long paint tasks during glitch |
| Swup transition timing mismatch | Page Transitions | No content flash; `swup:animation:out:end` aligns with CSS duration |

---

## Sources

- [Swup Common Issues & Troubleshooting](https://swup.js.org/getting-started/common-issues/) — official docs, script re-init, memory management
- [Swup Reloading Scripts](https://swup.js.org/getting-started/reloading-javascript/) — `page:view` hook pattern
- [WebGL2Fundamentals Anti-Patterns](https://webgl2fundamentals.org/webgl/lessons/webgl-anti-patterns.html) — canvas sizing, clientWidth vs innerWidth
- [WebGL Best Practices — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) — context management
- [Handling Context Lost — Khronos WebGL Wiki](https://www.khronos.org/webgl/wiki/HandlingContextLost) — context loss recovery
- [Three.js Memory Leak Discussion](https://discourse.threejs.org/t/webgl-memory-management-puzzlers/24583) — dispose patterns
- [Optimize Battery Drain of WebGL Elements](https://blog.squareys.de/optimize-battery-drain-of-webgl-elements/) — visibility pausing
- [Custom Cursor Accessibility — dbushell](https://dbushell.com/2025/10/27/custom-cursor-accessibility/) — accessibility concerns
- [Don't Use Custom CSS Mouse Cursors — Eric Bailey](https://ericwbailey.website/published/dont-use-custom-css-mouse-cursors/) — OS accommodation loss
- [WCAG 2.3.3 Animation from Interactions — W3C](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) — reduced-motion legal basis
- [Vercel Wildcard Domains](https://vercel.com/blog/wildcard-domains) — nameserver requirement for wildcard SSL
- [Vercel Subdomain CNAME Guide](https://dev.to/farhadjaman/setting-up-a-domain-and-subdomain-on-vercel-a-step-by-step-guide-2idg) — per-subdomain CNAME approach
- [Astro View Transitions — third party script issue](https://github.com/withastro/astro/issues/9359) — inline scripts not re-executing
- [Building WebGL Gallery with Astro and Barba.js — Codrops](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — GSAP/Three.js cleanup with page transitions
- [Animation performance and frame rate — MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) — rAF performance model

---
*Pitfalls research for: UI candy (Canvas/WebGL, page transitions, interactive effects) + subdomain infrastructure on Astro 5.x / Vercel*
*Researched: 2026-03-01*
