# Phase 7: Page Transitions - Research

**Researched:** 2026-03-01
**Domain:** Astro View Transitions / ClientRouter
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Transition feel:** Bold & intentional — sequential animation (old page exits completely, then new page enters), clean dark gap (#0a0a0a) between pages
- **Per-page transition styles:**
  - Default (home, products listing): fade out / fade in
  - Product detail pages: slide from right on enter, slide back left on return
  - Story page: scale/zoom in — longer, contemplative feel
- **Timing:**
  - Default: ~600ms total (300ms out + 300ms in)
  - Story page: ~800ms total
  - Product detail: 600ms (default)
  - Both `--transition-duration` and `--transition-easing` defined in tokens.css
- **Edge cases:**
  - Back/forward navigation reverses transition direction
  - Scroll position always resets to top on every navigation
  - `data-animate` elements replay on every page visit (not just first)

### Claude's Discretion

- Easing curve selection — pick what complements the bold sequential feel
- Reduced-motion handling — accessible approach, consistent with existing animations.css pattern
- Interrupted transition behavior — work with what Astro ClientRouter supports natively

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TRANS-01 | User sees smooth fade transition when navigating between any pages | Astro built-in `fade()` + custom sequential keyframes on `<main>` in BaseLayout |
| TRANS-02 | User sees distinct transition styles per page type (slide for products, morph for story) | Custom `TransitionDirectionalAnimations` objects in each page file's frontmatter + keyframes in global style |
| TRANS-03 | Transition timing is defined as CSS custom property for consistent feel across site | `--transition-duration` and `--transition-easing` added to tokens.css, referenced by keyframe `animation` shorthand in BaseLayout `<style is:global>` |
</phase_requirements>

---

## Summary

Astro 5's `ClientRouter` (already active in `BaseLayout.astro`) powers all view transitions via the browser's native View Transitions API with a polyfill fallback. The core primitives are `transition:animate` directives applied to elements, and custom `TransitionDirectionalAnimations` objects that map named CSS `@keyframes` to old/new page states for forwards and backwards navigation. No additional npm packages are needed.

The user wants a sequential exit-then-enter model (not simultaneous crossfade). Astro's built-in `fade` and `slide` are simultaneous by default, so the correct approach is **custom keyframes** defined in `BaseLayout.astro <style is:global>` with `transition:animate={customObject}` applied to `<main>` in `BaseLayout.astro`. Per-page overrides (slide for product detail, scale for story) are applied by adding `transition:animate` to the page-level wrapper element in each individual page file.

Three key integration concerns: (1) scroll reset to top on every navigation requires `astro:after-swap` listener in addition to the existing `astro:page-load` logic; (2) `data-animate` elements must re-animate on every visit, which means the `observer.unobserve` call in `BaseLayout.astro` must be removed so IntersectionObserver re-observes on each `astro:page-load`; (3) CSS custom properties referenced inside keyframe `animation` shorthand strings must be resolved at runtime — the pattern is to embed the token in the duration field of the custom animation object, reading it via `getComputedStyle`.

**Primary recommendation:** Use custom `TransitionDirectionalAnimations` objects with named `@keyframes` defined globally in BaseLayout. Apply to `<main>` for the default fade. Override per page with `transition:animate` on the top-level wrapper element.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro:transitions` (built-in) | Astro 5.x | ClientRouter, fade, slide, custom animation types | Already active; no additional install |
| `astro:transitions/client` (built-in) | Astro 5.x | Event constants (TRANSITION_PAGE_LOAD, etc.) | Type-safe event names |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Browser View Transitions API | Native | Hardware-accelerated DOM transitions | Used automatically by ClientRouter |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom keyframes | Built-in `fade()`/`slide()` | Built-ins are simultaneous, not sequential; don't support the dark-gap pattern |
| `transition:animate` on `<main>` | `transition:animate` on `<html>` | `<html>` scoping can conflict with persistent elements; `<main>` is cleanest scope for this layout |
| CSS custom properties in keyframes | Hard-coded values | Custom properties don't interpolate in `@keyframes` without JS assist; duration must be passed through the animation object |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro      # ClientRouter + default fade keyframes (is:global) + scroll reset + data-animate replay
├── styles/
│   └── tokens.css            # Add --transition-duration and --transition-easing tokens
├── pages/
│   ├── index.astro           # No override needed (uses BaseLayout default fade)
│   ├── products.astro        # No override needed (uses BaseLayout default fade)
│   ├── story.astro           # transition:animate={storyTransition} on wrapper
│   └── products/[slug].astro # transition:animate={slideTransition} on wrapper
```

### Pattern 1: Default Sequential Fade (BaseLayout)

**What:** Apply a custom animation object to `<main>` in BaseLayout that sequences exit then enter with a dark gap.

**When to use:** The default for all pages that don't override.

**How sequential works:** The old page's `out` keyframe runs to completion (fades to opacity 0), then the new page's `in` keyframe begins (fades from opacity 0). The background color `#0a0a0a` shows through during the gap. Astro executes `old` and `new` animations for the outgoing and incoming page respectively.

```astro
---
// BaseLayout.astro
import { ClientRouter } from 'astro:transitions';

const fadeTransition = {
  forwards: {
    old: { name: 'page-fade-out', duration: '0.3s', easing: 'cubic-bezier(0.4, 0, 1, 1)', fillMode: 'both' },
    new: { name: 'page-fade-in',  duration: '0.3s', easing: 'cubic-bezier(0, 0, 0.2, 1)', fillMode: 'both', delay: '0.3s' }
  },
  backwards: {
    old: { name: 'page-fade-out', duration: '0.3s', easing: 'cubic-bezier(0.4, 0, 1, 1)', fillMode: 'both' },
    new: { name: 'page-fade-in',  duration: '0.3s', easing: 'cubic-bezier(0, 0, 0.2, 1)', fillMode: 'both', delay: '0.3s' }
  }
};
---

<!-- In template: -->
<main transition:animate={fadeTransition}>
  <slot />
</main>
```

```css
/* BaseLayout.astro <style is:global> */
@keyframes page-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes page-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/view-transitions.mdx

### Pattern 2: Per-Page Override (Product Detail — Slide)

**What:** Slide from right (forward = drill-down), slide to right (backward = return).

**When to use:** On the product detail page `[slug].astro`, applied to the top-level wrapper div.

**Key insight:** Forwards enters from the right; backwards enters from the left (reversing the spatial metaphor).

```astro
---
// products/[slug].astro
const slideTransition = {
  forwards: {
    old: { name: 'slide-out-left',  duration: '0.3s', easing: 'cubic-bezier(0.4, 0, 1, 1)', fillMode: 'both' },
    new: { name: 'slide-in-right',  duration: '0.3s', easing: 'cubic-bezier(0, 0, 0.2, 1)', fillMode: 'both', delay: '0.3s' }
  },
  backwards: {
    old: { name: 'slide-out-right', duration: '0.3s', easing: 'cubic-bezier(0.4, 0, 1, 1)', fillMode: 'both' },
    new: { name: 'slide-in-left',   duration: '0.3s', easing: 'cubic-bezier(0, 0, 0.2, 1)', fillMode: 'both', delay: '0.3s' }
  }
};
---

<BaseLayout title={product.name}>
  <div class="product-detail" transition:animate={slideTransition}>
    ...
  </div>
</BaseLayout>
```

```css
/* BaseLayout.astro <style is:global> */
@keyframes slide-out-left  { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-5%); opacity: 0; } }
@keyframes slide-in-right  { from { transform: translateX(5%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slide-out-right { from { transform: translateX(0); opacity: 1; } to { transform: translateX(5%); opacity: 0; } }
@keyframes slide-in-left   { from { transform: translateX(-5%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
```

Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/view-transitions.mdx

### Pattern 3: Per-Page Override (Story — Scale/Zoom)

**What:** Scale up from slightly smaller on enter; scale down on exit.

**When to use:** story.astro only.

**Timing note:** Story uses 400ms out + 400ms in = 800ms total, as decided.

```astro
---
// story.astro
const storyTransition = {
  forwards: {
    old: { name: 'story-out', duration: '0.4s', easing: 'cubic-bezier(0.4, 0, 1, 1)', fillMode: 'both' },
    new: { name: 'story-in',  duration: '0.4s', easing: 'cubic-bezier(0, 0, 0.2, 1)', fillMode: 'both', delay: '0.4s' }
  },
  backwards: {
    old: { name: 'story-out', duration: '0.4s', easing: 'cubic-bezier(0.4, 0, 1, 1)', fillMode: 'both' },
    new: { name: 'story-in',  duration: '0.4s', easing: 'cubic-bezier(0, 0, 0.2, 1)', fillMode: 'both', delay: '0.4s' }
  }
};
---

<BaseLayout title="Story">
  <div transition:animate={storyTransition}>
    <StoryHero />
    ...
  </div>
</BaseLayout>
```

```css
/* BaseLayout.astro <style is:global> */
@keyframes story-out { from { opacity: 1; transform: scale(1); }    to { opacity: 0; transform: scale(1.04); } }
@keyframes story-in  { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
```

### Pattern 4: Scroll Reset on Every Navigation

**What:** Force scroll to top after every page swap.

**When to use:** Added once in BaseLayout `<script>`.

```js
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/view-transitions.mdx
document.addEventListener('astro:after-swap', () =>
  window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
);
```

### Pattern 5: data-animate Replay on Every Visit

**What:** Remove `observer.unobserve()` so elements re-animate on every page load (currently it fires once only).

**Current BaseLayout code (line 50):**
```js
observer.unobserve(entry.target); // Trigger animation once — REMOVE THIS for replay
```

**After change:** Elements lose the `is-visible` class when the new page loads (because the DOM is replaced by view transitions), and the IntersectionObserver is re-initialized on `astro:page-load`. Removing `unobserve` means if an element is still in view on re-initialization, it immediately gets `is-visible`. This is the correct behavior for scroll replay.

**HOWEVER:** There is a subtlety. The DOM swap in view transitions replaces the content, so all `is-visible` classes are gone on the new page. The `astro:page-load` event fires after the swap, re-running the observer. Elements in the viewport immediately become visible; elements below fold animate in on scroll. This is correct regardless of whether `unobserve` is present. Removing `unobserve` would only matter for elements that scroll out of view and back in — but given the design intent ("replay on every page visit"), removing it is still the right call.

### Pattern 6: CSS Timing Tokens

**What:** Add `--transition-duration` and `--transition-easing` to tokens.css. Reference in animation objects via JS (since CSS custom properties cannot be directly interpolated inside `@keyframes` `animation` duration fields at this time — they must be read via `getComputedStyle` if dynamic, or simply kept in sync manually).

**Pragmatic approach:** Define the tokens in tokens.css for documentation and future JS use. Hardcode the resolved values (e.g., `'0.3s'`) in the animation objects in page/layout frontmatter. The tokens serve as the single source of truth for the design system even if the keyframe JS objects don't directly read them.

```css
/* tokens.css additions */
:root {
  --transition-duration: 0.3s;
  --transition-duration-story: 0.4s;
  --transition-easing-out: cubic-bezier(0.4, 0, 1, 1);
  --transition-easing-in: cubic-bezier(0, 0, 0.2, 1);
}
```

### Anti-Patterns to Avoid

- **Applying `transition:animate` to `<html>` or `<body>`:** These elements persist across page swaps; animating them causes flicker or no visible effect. Apply to `<main>` (BaseLayout) or a per-page wrapper div.
- **Using built-in `fade()` / `slide()` for sequential effect:** Built-ins run old and new simultaneously (crossfade). Must use custom objects for sequential exit-then-enter.
- **CSS custom property in `@keyframes` animation shorthand strings:** `animation-duration: var(--transition-duration)` works inside standard CSS rules but not when the value is passed as a JS string to Astro's animation object `duration` field. Keep values consistent manually or read via `getComputedStyle`.
- **Forgetting `fillMode: 'both'`:** Without `fillMode: 'both'`, elements snap back to their non-animated state between the exit completing and the enter beginning (visible flash during the dark gap).
- **Not testing back/forward button:** The `backwards` animation object must explicitly reverse the slide direction. Leaving `backwards` the same as `forwards` means back navigation looks identical to forward — breaks spatial metaphor.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Client-side navigation | Custom fetch/swap | Astro ClientRouter | Already handles history, scroll, focus, prefetch, fallback |
| Reduced-motion detection | JS media query check | ClientRouter auto-disables all transitions | Built into ClientRouter automatically |
| Browser fallback | Custom polyfill | ClientRouter `fallback="animate"` (default) | Handles non-View-Transitions browsers |
| Animation sequencing | `setTimeout` + class toggle | `delay` field in `TransitionAnimationPair.new` | Correct: tied to animation system, not timers |

**Key insight:** The delay field in the `new` animation object is the correct way to sequence exit-then-enter. It is part of the CSS animation and runs in sync with the view transition lifecycle — no JS timers needed.

---

## Common Pitfalls

### Pitfall 1: Persistent Element Bleed-Through

**What goes wrong:** Elements marked with `transition:persist` or `transition:name` can appear to jump or flash if they overlap with animated content.

**Why it happens:** Persistent elements are moved across pages without animation. If the animated `<main>` sits behind them, the z-index and timing may cause visual artifacts.

**How to avoid:** This site has no persistent elements (no shared navbar etc.) so this is low risk. If added later, ensure persistent elements have a higher z-index than the transitioning content.

**Warning signs:** Elements appear at wrong position briefly during transition.

### Pitfall 2: Flash During Sequential Gap

**What goes wrong:** The "dark gap" between exit and enter briefly shows default browser background instead of `#0a0a0a`.

**Why it happens:** If `body` background-color is not set, the browser shows its default (white or gray) between the two animation phases.

**How to avoid:** Ensure `body { background-color: var(--color-bg); }` is in global.css (verify). The `#0a0a0a` dark background must be set on the document, not just on content elements.

**Warning signs:** White flash visible between exit and enter animations.

### Pitfall 3: `data-animate` Elements Not Resetting

**What goes wrong:** After a view transition, scroll-animated elements already have `is-visible` class from a previous visit and don't re-animate.

**Why it happens:** View transitions swap the DOM (so `is-visible` is gone on new-page elements), but if `astro:page-load` fires before the transition completes, observer may fire before the element is visible and immediately add `is-visible`.

**How to avoid:** The existing `astro:page-load` pattern already handles this correctly because ClientRouter replaces DOM content. Elements that arrive without `is-visible` will animate in correctly. No special handling needed beyond ensuring scroll resets to top (so above-fold elements trigger immediately and below-fold elements wait for scroll).

**Warning signs:** Elements that should animate in on scroll are already visible instantly on page arrival.

### Pitfall 4: `transition:animate` on Per-Page Element Without Wrapper

**What goes wrong:** Adding `transition:animate` directly to a section or article that doesn't span the full page means only that element transitions, while other content on the page pops in instantly.

**Why it happens:** The directive only applies to the element it's on.

**How to avoid:** Wrap the entire page content in a single `<div>` and apply `transition:animate` to that wrapper in the page files that need overrides. The BaseLayout `<main>` already handles the default; per-page overrides go on the root element inside `<main>`.

### Pitfall 5: Reduced-Motion is Handled Automatically

**What does NOT go wrong (avoid over-engineering):** You do not need to add `@media (prefers-reduced-motion: reduce)` rules for the view transition keyframes. ClientRouter detects the media query and disables all transitions automatically. Adding manual overrides would be redundant.

**Exception:** The existing `animations.css` scroll animation already has a reduced-motion rule — keep it. But new keyframes in BaseLayout do not need one.

Source: https://docs.astro.build/en/guides/view-transitions — "Astro's `<ClientRouter />` component respects the user's `prefers-reduced-motion` setting... automatically disables all view transition animations"

---

## Code Examples

Verified patterns from official sources:

### Custom Sequential Animation Object

```typescript
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/view-transitions.mdx
// TransitionDirectionalAnimations interface
export interface TransitionAnimation {
  name: string;       // @keyframes name
  delay?: number | string;
  duration?: number | string;
  easing?: string;
  fillMode?: string;
  direction?: string;
}

export interface TransitionAnimationPair {
  old: TransitionAnimation | TransitionAnimation[];
  new: TransitionAnimation | TransitionAnimation[];
}

export interface TransitionDirectionalAnimations {
  forwards: TransitionAnimationPair;
  backwards: TransitionAnimationPair;
}
```

### Scroll Reset After Swap

```js
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/view-transitions.mdx
document.addEventListener('astro:after-swap', () =>
  window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
);
```

### Built-in fade() with Custom Duration (for reference only — not used here)

```astro
---
import { fade } from 'astro:transitions';
---
<header transition:animate={fade({ duration: '0.4s' })} />
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `transition:name` shared element morphing | Custom `TransitionDirectionalAnimations` objects | Astro 3+ | Precise control over exit/enter sequence |
| Swup / Barba.js | Astro ClientRouter | v1.1 requirement (Swup ruled out) | No extra dependency, built-in lifecycle events |
| `DOMContentLoaded` for script init | `astro:page-load` | Astro 3+ | Fires on both initial load and post-transition |

**Deprecated/outdated:**
- `ViewTransitions` component: Renamed to `ClientRouter` in Astro 3.x. Old docs may reference `ViewTransitions` — ignore, use `ClientRouter`.

---

## Open Questions

1. **CSS custom property reference in animation duration field**
   - What we know: `duration: 'var(--transition-duration)'` is not a valid CSS time value when passed as a JS string to the animation object
   - What's unclear: Whether Astro resolves custom properties before passing to Web Animations API
   - Recommendation: Hardcode duration values in the JS objects (`'0.3s'`, `'0.4s'`). Define tokens in tokens.css for design system reference. Keep in sync manually. This is a known limitation of the Web Animations API.

2. **`transition:animate` on `<main>` vs per-page wrapper**
   - What we know: `<main>` in BaseLayout is the correct place for the default transition. Per-page wrappers inside `<main>` can override with their own `transition:animate`.
   - What's unclear: Whether Astro applies the nearest `transition:animate` ancestor or the first one it finds during DOM diffing.
   - Recommendation: Test by applying on `<main>` in BaseLayout for default, and on the root div in page files for overrides. This matches the documented pattern.

---

## Sources

### Primary (HIGH confidence)

- `/withastro/docs` (Context7) — TransitionDirectionalAnimations interfaces, `transition:animate` directive, `astro:after-swap` scroll reset, built-in fade/slide API, `astro:page-load` event, automatic reduced-motion support
- https://docs.astro.build/en/guides/view-transitions — ClientRouter setup, per-page animation overrides, lifecycle events
- https://github.com/withastro/docs/blob/main/src/content/docs/en/reference/modules/astro-transitions.mdx — Direction type, TRANSITION_PAGE_LOAD constant, fade()/slide() signatures

### Secondary (MEDIUM confidence)

- Project source: `BaseLayout.astro` — confirmed ClientRouter already imported and active, `astro:page-load` already used, `observer.unobserve` is current behavior
- Project source: `tokens.css` — confirmed no transition tokens exist yet; full token list verified

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from Context7 and official Astro docs
- Architecture: HIGH — pattern confirmed by official code examples; per-page wrapper approach is documented
- Pitfalls: HIGH for flash/reduced-motion (official docs); MEDIUM for persistent element bleed (reasoned from API behavior)

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (Astro stable, low churn in transitions API)
