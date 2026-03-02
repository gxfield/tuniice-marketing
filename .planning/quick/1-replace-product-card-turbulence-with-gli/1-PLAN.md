---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/ui/ProductCard.astro
  - src/styles/effects.css
  - src/components/ui/Button.astro
  - src/components/ui/Card.astro
autonomous: true
must_haves:
  truths:
    - "Product card images show a glitch effect on hover, not turbulence warp"
    - "Secondary buttons follow the cursor magnetically on hover, same as primary"
    - "Product cards follow the cursor magnetically on hover"
    - "All effects respect prefers-reduced-motion and pointer:fine gating"
  artifacts:
    - path: "src/components/ui/ProductCard.astro"
      provides: "Glitch hover on product images, no SVG turbulence filter"
    - path: "src/styles/effects.css"
      provides: "Product image glitch keyframes and pseudo-element styles"
    - path: "src/components/ui/Button.astro"
      provides: "Magnetic cursor-follow on both primary and secondary buttons"
    - path: "src/components/ui/Card.astro"
      provides: "Magnetic cursor-follow CSS custom properties on cards"
  key_links:
    - from: "src/styles/effects.css"
      to: "src/components/ui/ProductCard.astro"
      via: "glitch keyframes consumed by .product-image pseudo-elements"
      pattern: "glitch-image"
    - from: "src/components/ui/Button.astro"
      to: ".btn-secondary"
      via: "JS mousemove listener targets both .btn-primary and .btn-secondary"
      pattern: "querySelectorAll.*btn-primary.*btn-secondary"
---

<objective>
Replace the SVG feTurbulence warp effect on product card images with a CSS clip-path glitch effect (consistent with the existing brand glitch aesthetic), and extend the magnetic cursor-follow behavior to secondary buttons and product cards.

Purpose: The turbulence filter is a different visual language from the glitch aesthetic used on the brand text. Replacing it with a glitch effect creates visual consistency. Extending magnetic cursor-follow to secondary buttons and cards makes the interactive layer feel cohesive across all interactive elements.

Output: Updated ProductCard, Button, Card, and effects.css with unified glitch + magnetic effects.
</objective>

<execution_context>
@/Users/greg/.claude/get-shit-done/workflows/execute-plan.md
@/Users/greg/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/styles/effects.css
@src/components/ui/ProductCard.astro
@src/components/ui/Button.astro
@src/components/ui/Card.astro
@src/pages/products.astro

<interfaces>
<!-- Existing glitch pattern in effects.css (brand text) -->
<!-- Uses @keyframes with clip-path: inset() + translate offsets -->
<!-- Gated by @media (prefers-reduced-motion: reduce) { display: none } -->
<!-- Pseudo-elements with content: attr(data-text), position: absolute, pointer-events: none -->

<!-- Existing magnetic pattern in Button.astro -->
<!-- CSS: --mag-x: 0px; --mag-y: 0px; defaults, used in calc() within hover transform -->
<!-- JS: astro:page-load listener, matchMedia gates, mouseenter/mouseleave/mousemove pattern -->
<!-- Scoped listeners: attach mousemove on mouseenter, remove on mouseleave -->

<!-- Card.astro hover: transform: translate(-2px, -2px) on .card:hover -->
<!-- Card accent shadows: .card-primary (green), .card-secondary (orange), .card-amber -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace product card turbulence with CSS glitch effect</name>
  <files>src/components/ui/ProductCard.astro, src/styles/effects.css</files>
  <action>
In ProductCard.astro:
1. Remove the entire inline SVG block (the `<svg>` with `<defs><filter id="card-warp">...</filter></defs></svg>`)
2. Add `data-glitch-image` attribute to the `.product-image` div (this will be the hook for the glitch effect)
3. Remove the `@media (pointer: fine) and (prefers-reduced-motion: no-preference)` block that applied `filter: url(#card-warp)` on `.product-image:hover` from the scoped style
4. Keep the existing `.product-image` base styles (aspect-ratio, overflow: hidden, transition)

In effects.css, add after the existing brand glitch section:

**Product image glitch keyframes** -- two keyframes (`glitch-image-before` and `glitch-image-after`) that use clip-path: inset() to reveal colored overlay slices on hover. Pattern:
- `glitch-image-before`: Green-tinted overlay. On hover, rapidly cycles through 4-5 horizontal clip-path slices over 300ms, with small translate offsets (3-4px), then hides. Use `steps(1)` timing.
- `glitch-image-after`: Orange-tinted overlay. Same pattern offset by ~50ms from the before layer. Different clip-path values for visual variety.
- Both keyframes should be short burst (300ms duration, triggered once on hover, not infinite loop)

**Product image glitch pseudo-elements:**
```css
.product-image {
  position: relative;
}

.product-image::before,
.product-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  mix-blend-mode: screen;
}

.product-image::before {
  background: var(--color-accent); /* green */
  opacity: 0;
}

.product-image::after {
  background: var(--color-accent-warm); /* orange */
  opacity: 0;
}
```

**Hover trigger** (gated for pointer:fine + no-preference):
```css
@media (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .product-image:hover::before {
    animation: glitch-image-before 0.3s steps(1) forwards;
  }
  .product-image:hover::after {
    animation: glitch-image-after 0.3s steps(1) 0.05s forwards;
  }
}
```

**Reduced-motion override:**
```css
@media (prefers-reduced-motion: reduce) {
  .product-image::before,
  .product-image::after {
    display: none;
  }
}
```

The glitch-image keyframes should show colored horizontal slices that flash briefly (opacity 0 -> 0.4 -> 0 pattern through clip-path inset values), creating a quick digital interference burst on hover that matches the brand glitch aesthetic. Keep the effect subtle -- max opacity around 0.3-0.4 so the product image remains clearly visible beneath.

Important: The `.product-image` position:relative rule must be in effects.css (global), not in ProductCard.astro scoped style, so the pseudo-elements work without Astro scoping interference (same pattern decision as the brand glitch -- see STATE.md decision about effects.css being global).
  </action>
  <verify>
    <automated>cd /Users/greg/ai/tuniice-marketing && npx astro check 2>&1 | tail -20 && grep -c "feTurbulence" src/components/ui/ProductCard.astro; echo "Should be 0" && grep -c "glitch-image" src/styles/effects.css; echo "Should be >0"</automated>
  </verify>
  <done>
- SVG feTurbulence filter completely removed from ProductCard.astro
- Product images show colored clip-path glitch burst on hover (green + orange layers)
- Effect gated by pointer:fine and prefers-reduced-motion
- Glitch keyframes and pseudo-element styles in effects.css (global scope)
- No horizontal scrollbar from pseudo-element offsets (overflow:hidden on .product-image handles this)
  </done>
</task>

<task type="auto">
  <name>Task 2: Extend magnetic cursor-follow to secondary buttons and product cards</name>
  <files>src/components/ui/Button.astro, src/components/ui/Card.astro</files>
  <action>
In Button.astro:

1. Add `--mag-x: 0px; --mag-y: 0px;` CSS custom properties to `.btn-secondary` (matching the existing pattern on `.btn-primary`)
2. Add `will-change: transform;` to `.btn-secondary`
3. Update `.btn-secondary:hover` and `.btn-secondary:focus-visible` to use `calc()` with magnetic offsets:
   ```css
   .btn-secondary:hover,
   .btn-secondary:focus-visible {
     transform: translate(calc(-2px + var(--mag-x)), calc(-2px + var(--mag-y)));
     box-shadow: var(--shadow-offset-lg) var(--shadow-offset-lg) 0 var(--color-accent-warm);
   }
   ```
4. Update the `<script>` section: change the selector from `document.querySelectorAll('.btn-primary')` to `document.querySelectorAll('.btn-primary, .btn-secondary')` so both button variants get the magnetic mousemove listener. No other JS changes needed -- the existing mouseenter/mouseleave/mousemove pattern and the --mag-x/--mag-y property setting works identically for both.

In Card.astro:

1. Add `--mag-x: 0px; --mag-y: 0px;` CSS custom properties to `.card` base styles
2. Add `will-change: transform;` to `.card`
3. Update `.card:hover` to use magnetic offsets:
   ```css
   .card:hover {
     transform: translate(calc(-2px + var(--mag-x)), calc(-2px + var(--mag-y)));
   }
   ```
4. Add a `<script>` block to Card.astro with the same magnetic cursor-follow pattern used in Button.astro:
   - `astro:page-load` listener
   - Gate checks: `(pointer: fine)` and `(prefers-reduced-motion: reduce)` -- skip if touch or reduced motion
   - Select all `.card` elements
   - For each card: mouseenter attaches mousemove, mouseleave removes mousemove and resets `--mag-x`/`--mag-y` to `0px`
   - mousemove handler: calculate center of card rect, compute dx/dy from cursor, multiply by 0.15 (slightly less than Button's 0.25 factor -- cards are larger so less movement feels right), set `--mag-x` and `--mag-y`

Important: The magnetic factor for cards should be 0.15 (vs 0.25 for buttons) because cards have a larger surface area and too much movement would feel jarring. This is a deliberate difference.
  </action>
  <verify>
    <automated>cd /Users/greg/ai/tuniice-marketing && npx astro check 2>&1 | tail -20 && grep -c "mag-x" src/components/ui/Card.astro; echo "Should be >0" && grep -c "btn-secondary" src/components/ui/Button.astro | head -1 && grep "btn-primary, .btn-secondary\|btn-primary,.btn-secondary" src/components/ui/Button.astro; echo "Should match selector"</automated>
  </verify>
  <done>
- Secondary buttons have --mag-x/--mag-y custom properties and calc()-based hover transform
- Button.astro JS targets both .btn-primary and .btn-secondary
- Card.astro has --mag-x/--mag-y custom properties and calc()-based hover transform
- Card.astro has its own magnetic cursor-follow script (factor 0.15)
- All magnetic effects gated by pointer:fine and prefers-reduced-motion
- Cards and secondary buttons follow cursor on hover, snap back on leave
  </done>
</task>

</tasks>

<verification>
1. `npx astro check` passes with no errors
2. `npx astro build` succeeds
3. No SVG turbulence filter remaining in ProductCard.astro: `grep -c "feTurbulence" src/components/ui/ProductCard.astro` returns 0
4. Glitch keyframes exist in effects.css: `grep -c "glitch-image" src/styles/effects.css` returns > 0
5. Magnetic properties on Card: `grep -c "mag-x" src/components/ui/Card.astro` returns > 0
6. Both button variants targeted: `grep "btn-primary.*btn-secondary" src/components/ui/Button.astro` matches
</verification>

<success_criteria>
- Product card images display CSS glitch effect on hover (colored clip-path slices), not SVG turbulence warp
- Secondary buttons magnetically follow the cursor on hover, same as primary buttons
- Product cards magnetically follow the cursor on hover (with reduced factor 0.15)
- All effects properly gated for accessibility (pointer:fine + prefers-reduced-motion)
- Astro build passes cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/1-replace-product-card-turbulence-with-gli/1-SUMMARY.md`
</output>
