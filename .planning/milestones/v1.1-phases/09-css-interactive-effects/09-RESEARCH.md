# Phase 9: CSS Interactive Effects - Research

**Researched:** 2026-03-02
**Domain:** CSS animations, SVG filters, vanilla JS interaction
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Glitch text**: Layered color offset style using CSS pseudo-elements — subtle chromatic aberration, not dramatic
- **Glitch colors**: existing accent palette (--color-accent green, --color-accent-warm orange)
- **Glitch timing**: fast glitch bursts with gaps in between — not continuous, not a single on-load event
- **Glitch scope**: headline "tuniice" only — tagline stays clean and static
- **Glitch implementation**: Pure CSS (keyframes + pseudo-elements), no JS needed
- **Card distortion**: SVG feTurbulence warp effect on product cards (per FX-02)
- **Card intensity**: Low — subtle wobble/heat-shimmer, not dramatic warping. Content stays readable
- **Card layering**: Layer WITH existing Card hover (translate -2px + shadow grow stays, turbulence adds on top)
- **Button effect**: Magnetic cursor-follow on hover (requires small JS mousemove handler)
- **Button layering**: Layer WITH existing button hover — magnetic pull adds to translate + shadow interaction
- **Touch gating**: `(pointer: fine)` — no magnetic on touch, keep existing active states
- **Reduced-motion**: Completely disabled — all effects fully removed with `prefers-reduced-motion: reduce`
- **Reduced-motion pattern**: No glitch layers, no turbulence, no magnetic. Plain text, standard hovers
- **No new libraries**: Pure CSS + vanilla JS, zero dependencies

### Claude's Discretion
- Turbulence warp target (entire card vs image only) — prioritize readability
- Magnetic pull radius and strength values
- Which buttons get magnetic (primary only vs all variants)
- Exact glitch burst duration and gap timing
- SVG filter placement strategy (inline vs shared defs)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FX-01 | User sees glitch text animation on hero headline | CSS pseudo-element + keyframe technique documented; `data-text` attribute pattern; clip-path inset approach |
| FX-02 | User sees SVG feTurbulence hover distortion effect on product cards | SVG filter defs + feDisplacementMap pattern documented; CSS `filter: url()` for hover trigger |
| FX-03 | User sees magnetic pull/glow hover effect on interactive buttons | Vanilla JS mousemove + getBoundingClientRect pattern documented; CSS transition support |
| FX-04 | All effects respect `prefers-reduced-motion` and `(pointer: fine)` where applicable | Media query gating patterns established; existing animations.css pattern confirms approach |
</phase_requirements>

## Summary

Phase 9 implements three pure CSS/vanilla JS interactive effects with no new dependencies. The techniques are well-established: CSS glitch text uses pseudo-element duplication + `clip-path: inset()` keyframes; SVG turbulence distortion uses an inline `<filter>` def referenced via `filter: url(#id)` CSS; magnetic buttons use a lightweight `mousemove` handler calculating element-center delta.

The key constraint across all three effects is the layering requirement — each must augment the existing hover states (translate -2px + shadow grow) rather than replace them. This means magnetic JS must compose with CSS transform (add to existing translate, not override), and the turbulence filter must sit on top of the card's existing transition behavior.

The reduced-motion and pointer gating patterns are already established in this codebase: `animations.css` uses hard disable (`opacity: 1; transform: none; transition: none`) and the canvas component uses `window.matchMedia('(prefers-reduced-motion: reduce)')` for JS checks. Phase 9 follows the same pattern exactly.

**Primary recommendation:** One plan for glitch + turbulence (both pure CSS, natural pair), one plan for magnetic + gating (JS-required, needs pointer:fine logic). This matches the planned split in 09-01 and 09-02.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS `@keyframes` | Native | Glitch animation bursts | No JS needed, performant, reduced-motion trivial to gate |
| CSS pseudo-elements | Native | Duplicate text layers for chromatic offset | Only way to get true layered color shift in pure CSS |
| SVG `<filter>` / `feTurbulence` | Native SVG | Turbulence displacement on hover | Built into browser; no JS; composable with CSS `filter` property |
| `feDisplacementMap` | Native SVG | Translates turbulence noise into pixel displacement | Required companion to feTurbulence for warp effects |
| Vanilla JS `mousemove` | Native | Magnetic button cursor tracking | Lightest possible implementation; no dependency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS `clip-path: inset()` | Native | Mask pseudo-element to horizontal strips | Creates scan-line slice for glitch; better than legacy `clip: rect()` |
| CSS `@media (pointer: fine)` | Native | Gate magnetic effect to mouse devices | Touch devices skip magnetic JS activation |
| `window.matchMedia()` | Native | JS-side reduced-motion check | Required for JS effects (magnetic); CSS media query handles CSS effects |
| `will-change: transform` | Native | Hint browser for transform optimization | Magnetic buttons animate transform on every mousemove |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native SVG filter | CSS `backdrop-filter: blur()` | blur is wrong effect type; turbulence gives actual warp |
| `clip-path: inset()` | Legacy `clip: rect()` | `clip` is deprecated; `clip-path` is the current standard |
| Vanilla JS magnetic | GSAP / anime.js | Explicit out-of-scope (REQUIREMENTS.md: "GSAP/Three.js: Overkill for current effects") |
| Inline SVG `<filter>` | External `.svg` file filter | Inline avoids separate HTTP request; simpler for a single filter |

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure

New files this phase introduces:

```
src/
├── styles/
│   └── effects.css              # New — glitch keyframes + turbulence reduced-motion overrides
├── components/
│   └── sections/
│       └── Hero.astro           # Modified — add data-text attr + glitch pseudo-element styles
│   └── ui/
│       ├── Card.astro           # Modified — add SVG filter def + hover filter CSS
│       └── Button.astro         # Modified — add magnetic <script> + pointer:fine guard
```

The project already has `animations.css` for scroll animations and could host reduced-motion overrides. A new `effects.css` keeps the interactive effect keyframes separate and easier to maintain.

### Pattern 1: CSS Glitch Text (Hero h1.brand)

**What:** Two pseudo-elements duplicate the headline text, each colored with an accent channel offset, animated with `clip-path: inset()` keyframes to show random horizontal strips at different moments.

**When to use:** Pure CSS, continuous repeating animation with idle gaps.

**Key implementation details:**
- The `.brand` element needs `data-text="tuniice"` on the HTML element
- Pseudo-elements use `content: attr(data-text)` to duplicate text without JS
- `position: absolute; top: 0; left: 0` over the base text
- `::before` uses `color: var(--color-accent)` with 2-3px left offset
- `::after` uses `color: var(--color-accent-warm)` with 2-3px right offset
- Each pseudo-element gets independent `clip-path: inset()` animation with `steps()` timing
- **Burst + gap pattern:** animation is short (e.g. 0.15s burst) followed by a long `animation-delay` or long `animation-duration` with most keyframes at 0% displacement (idle)

**Example:**
```css
/* Source: CSS-Tricks glitch pattern, verified technique */

.brand {
  position: relative;
}

.brand::before,
.brand::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.brand::before {
  color: var(--color-accent);        /* green channel */
  left: 2px;
  animation: glitch-before 4s infinite;
  animation-timing-function: steps(1);
}

.brand::after {
  color: var(--color-accent-warm);   /* orange channel */
  left: -2px;
  animation: glitch-after 4s infinite;
  animation-timing-function: steps(1);
}

@keyframes glitch-before {
  0%,  85%         { clip-path: inset(100% 0 0 0); }   /* invisible — idle gap */
  86%              { clip-path: inset(40% 0 50% 0); }
  88%              { clip-path: inset(10% 0 80% 0); }
  90%              { clip-path: inset(70% 0 20% 0); }
  92%, 100%        { clip-path: inset(100% 0 0 0); }   /* invisible again */
}

@keyframes glitch-after {
  0%,  87%         { clip-path: inset(100% 0 0 0); }
  88%              { clip-path: inset(60% 0 30% 0); }
  90%              { clip-path: inset(20% 0 65% 0); }
  92%, 100%        { clip-path: inset(100% 0 0 0); }
}

/* Reduced motion: remove pseudo-elements entirely */
@media (prefers-reduced-motion: reduce) {
  .brand::before,
  .brand::after {
    display: none;
  }
}
```

**Timing note:** The "burst gap" is controlled by how many keyframe stops are in the idle state (0%, 85% both at `inset(100%)` = fully clipped = invisible). Animating to visible only for a few percentage points of a long animation creates natural pauses.

### Pattern 2: SVG feTurbulence Card Hover

**What:** An inline SVG `<filter>` def with `feTurbulence` + `feDisplacementMap` is placed once in the Card component. On hover, CSS applies `filter: url(#card-warp)` to trigger the displacement.

**When to use:** Hover state only; filter is "off" (not referenced) at rest.

**Key implementation details:**
- SVG `<defs>` can be placed as a hidden element inside the Card or ProductCard template
- `baseFrequency="0.015 0.02"` — low values = broad, smooth waves (heat shimmer, not jarring)
- `numOctaves="2"` — minimal complexity
- `type="fractalNoise"` — smoother than `turbulence` type
- `feDisplacementMap scale="6"` — very low scale for subtle effect (content stays readable)
- The `scale` value is the primary intensity knob; 6-12 is the subtle range
- Applying to `.product-image` only (not full card) maximizes readability of text content

**Recommendation (Claude's discretion):** Apply turbulence filter to `.product-image` only. The card text (.product-name, .product-tagline) must stay sharp and readable. The image is purely decorative, so warping it provides the effect without hurting legibility.

**Example:**
```html
<!-- In ProductCard.astro or Card.astro — hidden SVG defs -->
<!-- Source: MDN feTurbulence reference, verified -->
<svg width="0" height="0" style="position: absolute;">
  <defs>
    <filter id="card-warp" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.015 0.02"
        numOctaves="2"
        seed="5"
        result="noise" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="8"
        xChannelSelector="R"
        yChannelSelector="G" />
    </filter>
  </defs>
</svg>
```

```css
/* Apply filter only on hover */
.product-image {
  transition: filter 0.2s ease;
}

.card:hover .product-image {
  filter: url(#card-warp);
}

/* Reduced motion: no filter */
@media (prefers-reduced-motion: reduce) {
  .card:hover .product-image {
    filter: none;
  }
}
```

**SVG filter placement:** Inline in the component as a zero-size hidden SVG. The filter `id` must be unique per page. Since only one instance of the card filter is needed, a single shared def works — place it once, reference from CSS.

**Important:** The `x`, `y`, `width`, `height` on the filter element expand the filter region beyond the element bounds to prevent clipping at the edges. `-5%` / `110%` is the standard pattern for displacement filters that shift pixels outward.

### Pattern 3: Magnetic Button (vanilla JS)

**What:** A `mousemove` listener on each `.btn-primary` element calculates cursor delta from element center and applies a small translate offset layered on top of the existing hover transform.

**When to use:** Only when `(pointer: fine)` and `prefers-reduced-motion` is not set.

**Key implementation details:**
- Gate with `window.matchMedia('(pointer: fine)')` — skip setup entirely on touch devices
- Gate with `window.matchMedia('(prefers-reduced-motion: reduce)')` — skip setup if reduced motion
- Listen on `mouseenter` → attach `mousemove` → `mouseleave` to clean up
- **Do not** use a global `document.mousemove` — only active while cursor is over button
- Calculate offset from element center using `getBoundingClientRect()`
- Apply multiplier of ~0.2–0.3 for subtle pull (not a dramatic follow)
- **Composing with existing transform:** The existing `.btn:hover` applies `translate(-2px, -2px)`. The magnetic JS must ADD to this, not replace it. Two approaches:
  1. Use CSS custom properties to pass JS values, combined in CSS
  2. Apply magnetic transform to an inner wrapper element (zero conflict)
- On `mouseleave`: reset magnetic offset, CSS handles existing hover translate removal

**Recommendation (Claude's discretion):** Apply to `.btn-primary` only. Primary buttons are call-to-action elements where the effect adds brand energy. Secondary buttons are supporting actions; magnetic on both may be too busy. Radius: 80px activation distance. Multiplier: 0.25.

**CSS custom property composition approach (avoids transform conflict):**
```css
/* Source: verified pattern for composing JS + CSS transforms */
.btn-primary {
  --mag-x: 0px;
  --mag-y: 0px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary:hover {
  transform: translate(calc(-2px + var(--mag-x)), calc(-2px + var(--mag-y)));
}
```

```javascript
// Source: verified magnetic button technique
// In Button.astro <script> block

document.addEventListener('astro:page-load', () => {
  // Gate: skip on touch devices or reduced-motion preference
  const ptrFine = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!ptrFine || reducedMotion) return;

  const buttons = document.querySelectorAll('.btn-primary');

  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      btn.addEventListener('mousemove', onMove);
    });

    btn.addEventListener('mouseleave', () => {
      btn.removeEventListener('mousemove', onMove);
      btn.style.setProperty('--mag-x', '0px');
      btn.style.setProperty('--mag-y', '0px');
    });

    function onMove(e) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.setProperty('--mag-x', `${dx}px`);
      btn.style.setProperty('--mag-y', `${dy}px`);
    }
  });
});
```

**Astro ClientRouter note:** Wrap JS in `astro:page-load` exactly as the canvas background does. This prevents listener accumulation across navigations (established pattern from Phase 8).

### Anti-Patterns to Avoid

- **Overriding existing transform with magnetic:** Setting `element.style.transform = 'translate(...)'` in JS replaces the CSS `:hover` translate. Use CSS custom properties to compose instead.
- **Global `document.mousemove` for magnetic:** Adding the listener globally fires on every mouse move across the entire page; only add it during `mouseenter`.
- **`clip` (deprecated) for glitch:** Use `clip-path: inset()` instead of the legacy `clip: rect()` property.
- **Large `feDisplacementMap scale`:** Values above 15-20 make content unreadable. Keep at 6-12 for heat-shimmer.
- **Single large glitch animation with `animation-iteration-count: infinite`:** An `infinite` animation that's mostly idle is fine, but do NOT use `animation-play-state: paused` for the gap — it pauses where it stopped. Use keyframe percentages that keep the pseudo-elements `clip-path: inset(100% 0 0 0)` (fully clipped) for the majority of the cycle.
- **Missing filter region expansion:** SVG `<filter>` without `x/y/width/height` overrides clips displacement at element edges. Always expand by 5-10%.
- **Placing magnetic JS at module scope (not inside `astro:page-load`):** Astro ClientRouter will not re-run module scripts. Must use the `astro:page-load` event pattern.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chromatic aberration text | Custom canvas text rendering | CSS pseudo-elements + `clip-path` | Native CSS handles exactly this; canvas adds complexity and DPR concerns |
| Card image distortion | WebGL shader or canvas overlay | SVG `feTurbulence` + `feDisplacementMap` | Browser-native, CSS-toggleable, no RAF loop needed |
| Smooth magnetic easing | Custom RAF easing loop | CSS `transition: transform 0.15s ease` | Let the browser handle interpolation; no JS animation loop needed |

**Key insight:** All three effects are CSS-native capabilities. JS is only needed for the magnetic button's cursor position math — the animation itself is CSS transitions.

## Common Pitfalls

### Pitfall 1: Transform Composition Conflict (Magnetic)
**What goes wrong:** Magnetic JS sets `element.style.transform`, overriding the CSS `:hover { transform: translate(-2px, -2px) }` state. The neo-brutalist lift effect disappears on hover.
**Why it happens:** Inline styles (`style.transform`) have higher specificity than stylesheet rules.
**How to avoid:** Use CSS custom properties (`--mag-x`, `--mag-y`) passed from JS, composed in CSS `calc()` alongside the existing translate.
**Warning signs:** Neo-brutalist shadow grows on hover but element doesn't lift.

### Pitfall 2: Filter ID Collision
**What goes wrong:** If two Card instances on the same page define `<filter id="card-warp">`, the second definition shadows the first in Chrome/Firefox; all cards use the same filter reference but may behave unexpectedly.
**Why it happens:** SVG filter IDs are global within the document.
**How to avoid:** Place one shared filter definition once (e.g., in BaseLayout or at the top of the ProductTeasers section) rather than inside each card instance. Reference it from all cards.
**Warning signs:** Cards on the products page have inconsistent distortion behavior.

### Pitfall 3: Glitch Pseudo-Elements Inherit Overflow
**What goes wrong:** Pseudo-elements with `left: 2px` or `left: -2px` extend beyond the parent element bounds, causing horizontal scroll or layout shift.
**Why it happens:** `.brand` may not have `overflow: hidden`, and pseudo-elements are absolutely positioned relative to it.
**How to avoid:** Set `overflow: hidden` on the `.brand` element, or use `pointer-events: none` and `user-select: none` on pseudo-elements. Alternatively, keep the offset small (2-3px maximum).
**Warning signs:** Horizontal scrollbar appears briefly during glitch burst.

### Pitfall 4: Magnetic Listener Stacking Across Navigations
**What goes wrong:** Each Astro navigation re-runs `astro:page-load`, re-attaching magnetic listeners to buttons. After 3 navigations, each button has 3 `mouseenter` listeners.
**Why it happens:** `astro:page-load` fires on every page load; if not handled, listeners accumulate.
**How to avoid:** Either (a) use the Astro `is:inline` script pattern which is DOM-scoped and replaced on navigation, or (b) track setup state with a `data-magnetic-init` attribute and check before attaching. The safest pattern: use `mouseenter`/`mouseleave` scoped to each button (not a global listener), so fresh DOM on each navigation means fresh elements.
**Warning signs:** Magnetic effect feels increasingly "jittery" after multiple page navigations.

### Pitfall 5: feTurbulence Causes Layout Shift
**What goes wrong:** Applying `filter: url(#card-warp)` triggers a repaint that causes neighboring elements to shift position.
**Why it happens:** SVG filters can affect element sizing when filter region is not expanded.
**How to avoid:** Expand filter region with `x="-5%" y="-5%" width="110%" height="110%"`. Apply filter to `.product-image` inner div, not the outer `<article>` card, to contain the repaint area.
**Warning signs:** Card text or adjacent elements visually jump when hovering a product card.

## Code Examples

Verified patterns from official sources and established codebase patterns:

### Reduced-Motion Full Disable (matching existing pattern)
```css
/* Source: mirrors animations.css established pattern */
@media (prefers-reduced-motion: reduce) {
  .brand::before,
  .brand::after {
    display: none;                  /* Remove glitch layers entirely */
  }

  .card:hover .product-image,
  .card-muted:hover .product-image {
    filter: none;                   /* No turbulence filter */
  }
}
```

### Pointer Fine Gate in CSS (for effects that can be CSS-only)
```css
/* Gate turbulence to pointer:fine devices only */
@media (pointer: fine) {
  .card:hover .product-image {
    filter: url(#card-warp);
  }
}
```

### Combined Gate (both conditions)
```css
/* Only apply effects when motion is ok AND pointer is precise */
@media (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .card:hover .product-image {
    filter: url(#card-warp);
  }
}
```

### Astro ClientRouter Pattern for JS Effects
```javascript
// Mirrors Phase 8 CanvasBackground.astro established pattern
document.addEventListener('astro:page-load', () => {
  const ptrFine = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!ptrFine || reducedMotion) return;
  // ... attach listeners
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `clip: rect()` for glitch | `clip-path: inset()` | ~2018 | `clip` deprecated in CSS specs; `clip-path` is standard |
| External `.svg` file for filters | Inline `<svg><defs>` | ~2015 | Avoids CORS issues; no extra HTTP request |
| GSAP for magnetic buttons | Vanilla JS + CSS transitions | Ongoing | GSAP is 60kb+; custom property + CSS transition achieves 95% of the effect |
| `animation-play-state: paused` for gaps | Long keyframe idle at `clip-path: inset(100%)` | Established | paused stops at last position; keyframe idle is more predictable |

**Deprecated/outdated:**
- `clip: rect()`: Deprecated; use `clip-path: inset()` for the glitch slice technique
- `text-shadow` for chromatic aberration: Works but lacks per-line control that `clip-path` provides

## Open Questions

1. **SVG filter ID global placement**
   - What we know: Filter IDs are document-global; having one per Card instance causes shadowing
   - What's unclear: Best Astro pattern for sharing one SVG def across multiple component instances
   - Recommendation: Place the `<svg><defs>` block once in the ProductTeasers section component (wraps all cards), not in Card.astro itself. Or in BaseLayout with conditional inclusion.

2. **CSS custom property compose vs inner wrapper for magnetic**
   - What we know: Both approaches avoid transform override conflict
   - What's unclear: Whether the CSS custom property approach works with the existing `.btn:active` state that resets transform to `(0, 0)`
   - Recommendation: Test CSS custom property approach first (simpler). If active state conflict appears, switch to inner wrapper `<span>` for magnetic-only transform.

## Sources

### Primary (HIGH confidence)
- MDN Web Docs: `<feTurbulence>` — attributes, values, interaction with feDisplacementMap. Verified current.
- MDN Web Docs: `prefers-reduced-motion` — confirmed full disable pattern is valid
- CSS-Tricks: Glitch Effect article — verified `clip-path: inset()` technique, pseudo-element duplication pattern
- `src/styles/animations.css` — established project reduced-motion pattern (direct file read)
- `src/components/canvas/CanvasBackground.astro` — established Astro ClientRouter lifecycle pattern (direct file read)

### Secondary (MEDIUM confidence)
- inithtml.com: Magnetic button vanilla JS — core mousemove + getBoundingClientRect pattern; verified against MDN APIs
- Codrops feTurbulence article — filter region expansion pattern (`x/y/width/height`); cross-referenced with MDN

### Tertiary (LOW confidence)
- WebSearch general results on glitch, turbulence, magnetic patterns — used for discovery; all critical claims verified against primary sources above

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all techniques are native CSS/SVG/JS APIs verified against MDN
- Architecture: HIGH — patterns read directly from existing codebase files
- Pitfalls: HIGH for transform conflict and listener stacking (known JS pitfalls); MEDIUM for filter collision (SVG behavior verified via MDN)

**Research date:** 2026-03-02
**Valid until:** 2027-03-02 (CSS/SVG native APIs; stable indefinitely)
