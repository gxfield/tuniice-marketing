# Feature Research

**Domain:** UI candy and subdomain app sites for a creative music/software brand (Astro marketing site)
**Researched:** 2026-03-01
**Confidence:** MEDIUM-HIGH

---

## Feature Landscape

### Table Stakes (Users Expect These)

These are non-negotiable for the "bold visual effects" milestone. A creative brand site without these reads as unfinished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| `prefers-reduced-motion` respect | WCAG 2.3.3 compliance; vestibular disorders affect 70M+ people | LOW | CSS media query + JS check; disable or freeze all animated backgrounds and transitions for affected users |
| Mobile fallback for cursor effects | Cursor effects require a fine pointer; touch devices have no cursor | LOW | Gate with `@media (any-hover: hover) and (pointer: fine)`; render nothing on touch |
| Animated elements don't break scroll | Scroll-reactive JS must not fight existing Intersection Observer animations | MEDIUM | Must coordinate with existing animation system; don't double-init |
| Page transitions preserve scroll position | Users expect pages to start at top after navigation | LOW | Swup and Astro ClientRouter both handle this automatically |
| Subdomain shares brand identity | App mini-sites must feel like the same product family | MEDIUM | Shared CSS custom properties and layout primitives |
| Subdomain has its own identity signal | App sub-sites should differ enough to feel product-specific | LOW | Swap accent color via CSS custom property (`--accent`); each app gets its own value |

### Differentiators (Competitive Advantage)

Features that make the tuniice site memorable and reinforce the brand as credible, technical, and creative.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Canvas particle background (hero) | Sets immediate "technical + creative" tone; hard to fake in stock templates | MEDIUM | tsParticles is the pragmatic pick — documented, modular, zero-dependency core; limit to 80-120 particles on mobile, 200-300 on desktop |
| Glitch text effect on key headings | Signals digital/hardware aesthetic; matches neo-brutalist design language | LOW | Pure CSS with pseudo-elements and `clip-path`; no library needed; applies to hero headline and section headers |
| Scroll-reactive element transforms | Depth and dimensionality as user scrolls; differentiates from static marketing sites | MEDIUM | Extend existing Intersection Observer with CSS custom property updates driven by `scrollY`; or add GSAP ScrollTrigger for richer control |
| Page transition (fade or slide) | Smooth SPA-like navigation raises perceived quality significantly | MEDIUM | Astro's built-in ClientRouter (View Transitions) now works in Firefox 144+; native solution preferred over adding Swup dependency |
| Hover image/card distortion | Cards that warp or tilt on hover feel high-end and interactive | MEDIUM | CSS `perspective` + JS `mousemove` listener for 3D card tilt; WebGL displacement shader is overkill for cards |
| Bluepriint mini-site as first app subdomain | Proves the subdomain pattern; gives Bluepriint a real product page | HIGH | Most complex feature overall — requires subdomain config, content, Vercel project setup, and shared design system extraction |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full-screen particle background covering entire page | "Maximum impact" immersive effect | Violates WCAG motion guidelines; kills performance on mid-range mobile; obscures content; Canvas context limit per page | Confine particles to hero section only; use CSS noise texture for body |
| WebGL displacement shader on hover | Looks impressive in demos | Bundle weight (Three.js is 150kb+ gzipped); initialization overhead; overkill for card hovers; hard to gracefully degrade | CSS `perspective` + JS `mousemove` 3D card tilt achieves 80% of the effect with near-zero cost |
| Custom animated cursor replacing default cursor | Strong brand signal seen on many creative sites | Breaks accessibility (WCAG pointer targets); confusing on touch/hybrid devices; adds mousemove listener overhead to every page; frequently cited as the #1 UX mistake on creative sites | Cursor-adjacent hover effects (e.g., magnetic button pull, glow on hover) convey same energy without replacing cursor |
| Barba.js for page transitions | Well-known in creative dev community | Does not update `<head>` on navigation (dropped in v2); treats site as SPA (scripts only init on first page load); Astro's own ClientRouter does this better natively | Use Astro ClientRouter (View Transitions) — native, smaller, maintained by Astro team |
| Swup for page transitions | Has official Astro integration | Adds an external dependency for something Astro now does natively and with Firefox support since v144 | Astro ClientRouter unless a specific Swup plugin is needed |
| Three.js particle system | WebGL particles at full fidelity | 150kb+ gzipped; steep learning curve; build complexity; far more than needed for a decorative background on a static marketing site | tsParticles with Canvas renderer — same visual, fraction of the bundle |
| GSAP ScrollTrigger for all scroll effects | Industry standard, powerful | Requires ScrollTrigger teardown/reinit on every page transition (leaks if not cleaned up); adds ~60kb gzipped; existing Intersection Observer already handles reveal animations | Use Intersection Observer for reveal animations (already in place); only add GSAP ScrollTrigger if a specific effect cannot be done otherwise |
| Monorepo (Turborepo/Nx) for subdomain sites | Clean shared-code story | Significant infrastructure overhead for a two-project scenario; Vercel free tier limits to 3 projects; current site is ~1,800 LOC | Use a single Git repo with separate directories (`/` for main, `/apps/bluepriint/`); deploy as separate Vercel projects pointed at each directory |

---

## Feature Dependencies

```
Page Transitions (Astro ClientRouter)
    └──requires──> GSAP or CSS animation cleanup
                       (kill any scroll listeners before route change)

Particle Background (tsParticles)
    └──requires──> prefers-reduced-motion check
    └──requires──> mobile particle count limit

Scroll-Reactive Transforms
    └──depends-on──> Existing Intersection Observer (must not conflict)
    └──enhances──> Page Transitions (reset on route enter)

Bluepriint Mini-Site
    └──requires──> Shared CSS design tokens extracted to shareable file
    └──requires──> Vercel subdomain config (bluepriint.tuniice.com)
    └──requires──> Content (product description, screenshots — currently placeholder)

Subdomain Shared Design System
    └──requires──> CSS custom properties isolated (already using tokens)
    └──enables──> Any future app mini-site (tuniice.com subdomain)

Glitch Text Effect
    └──independent──> (pure CSS, no dependencies)

Hover Card Distortion (3D tilt)
    └──independent──> (pure CSS + inline JS, no library)
```

### Dependency Notes

- **Page Transitions require animation cleanup:** GSAP ScrollTrigger instances and Canvas animation loops must be paused/killed on `astro:before-swap` and restarted on `astro:after-swap`. Skipping this causes memory leaks and stale scroll positions.
- **Particle Background requires prefers-reduced-motion:** Initialize the Canvas loop only when `window.matchMedia('(prefers-reduced-motion: reduce)').matches === false`. Provide a static CSS noise/grain fallback otherwise.
- **Bluepriint mini-site is blocked on content:** The subdomain infrastructure can be scaffolded without content, but the page cannot launch without real product copy, screenshots, or feature list.
- **Scroll-reactive transforms depend on existing Intersection Observer:** The existing animation system uses Intersection Observer. Scroll-reactive JS (parallax, `scrollY`-driven transforms) runs in `scroll` event listeners. These are additive but must not re-trigger Intersection Observer classes.

---

## MVP Definition

This is milestone v1.1, not a greenfield MVP. "Launch with" means merging to main as a shippable increment.

### Launch With (v1.1 core)

- [ ] Canvas particle background — hero section only, `prefers-reduced-motion` gated, mobile particle cap — **establishes the "technical creative" tone immediately**
- [ ] Glitch text on hero headline — pure CSS, zero risk, immediate brand signal — **very low effort, high impact**
- [ ] Astro ClientRouter page transitions — fade or slide, replaces the hard-cut between pages — **raises perceived quality of entire site**
- [ ] Bluepriint subdomain scaffold — Vercel project + subdomain DNS + base page with shared design tokens — **unlocks product marketing before app ships**

### Add After Validation (v1.1 follow-on)

- [ ] Hover card distortion (3D tilt) — add once core is stable; test on Products page cards first
- [ ] Scroll-reactive section transforms — extend with `scrollY` listeners after transition system is stable; verify no conflicts with Intersection Observer

### Future Consideration (v2+)

- [ ] Additional app subdomains — add as products are ready (each follows the Bluepriint pattern)
- [ ] Generative art backgrounds per-section — high complexity, needs dedicated research phase
- [ ] On-page animation toggle UI — needed if user research shows motion complaints; defer unless accessibility audit flags it

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Canvas particle background (hero) | HIGH | MEDIUM | P1 |
| Glitch text (CSS) | HIGH | LOW | P1 |
| Astro ClientRouter transitions | HIGH | LOW-MEDIUM | P1 |
| Bluepriint subdomain scaffold | HIGH | MEDIUM-HIGH | P1 |
| `prefers-reduced-motion` gating | MEDIUM (accessibility) | LOW | P1 — required with P1 animations |
| Hover card 3D tilt | MEDIUM | LOW | P2 |
| Scroll-reactive transforms | MEDIUM | MEDIUM | P2 |
| Generative art backgrounds | LOW-MEDIUM | HIGH | P3 |
| Custom cursor (magnetic buttons only) | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have, add when P1 is stable
- P3: Nice to have, future milestone

---

## Competitor Feature Analysis

Reference sites in the neo-brutalist / creative developer space:

| Feature | Teenage Engineering (inspiration) | Eloy Benoffi Portfolio (Codrops) | Our Approach |
|---------|-----------------------------------|----------------------------------|--------------|
| Animated backgrounds | Subtle; product photography dominates | Heavy glitch, distortion layers | Hero particles only; subtle by default |
| Page transitions | Hard cuts; not a priority for them | GSAP + Barba.js, full SPA feel | Astro ClientRouter fade — balanced effort |
| Custom cursor | None | Custom crosshair cursor | Skip cursor replacement; use hover effects |
| Subdomain / app sites | Separate product sites per device | N/A (portfolio) | Shared design system, separate Vercel deploys |
| Glitch text | Occasional; product-focused | Heavy glitch throughout | Targeted use on hero + key moments |
| Mobile experience | First-class | Desktop-first (heavy effects) | Desktop effects, graceful mobile degradation |

---

## Sources

- [tsParticles GitHub](https://github.com/tsparticles/tsparticles) — particle library documentation and examples
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) — ClientRouter, `astro:before-swap` / `astro:after-swap` lifecycle
- [View Transitions supported in all major browsers](https://events-3bg.pages.dev/jotter/in-all-major-browsers/) — Firefox 144 support confirmed
- [swup Astro integration](https://swup.js.org/integrations/astro/) — for reference only; Astro native preferred
- [Vercel monorepo subdomain deployment](https://dev.to/jdtjenkins/how-to-deploy-a-monorepo-to-different-subdomains-on-vercel-2chn) — separate Vercel projects per subdomain pattern
- [Custom Cursor Accessibility](https://dbushell.com/2025/10/27/custom-cursor-accessibility/) — `(any-hover: hover) and (pointer: fine)` gating
- [prefers-reduced-motion MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — implementation reference
- [Eloy Benoffi portfolio Codrops case study](https://tympanus.net/codrops/2025/10/15/from-blank-canvas-to-mayhem-eloy-benoffis-brutalist-glitchy-portfolio-built-with-webflow-and-gsap/) — GSAP + neo-brutalism in practice
- [Building a Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro and Barba.js](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — shows complexity cost of full WebGL approach
- [GSAP + Astro ScrollTrigger cleanup requirement](https://gsap.com/community/forums/topic/40950-compatibility-with-gsap-scrolltrigger-astro-view-transitiosn-api/) — critical pitfall documented by GSAP community

---

*Feature research for: tuniice marketing site v1.1 — UI candy and subdomain infrastructure*
*Researched: 2026-03-01*
