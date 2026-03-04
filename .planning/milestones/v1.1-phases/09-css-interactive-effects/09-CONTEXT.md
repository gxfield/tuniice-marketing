# Phase 9: CSS Interactive Effects - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Add glitch text animation to the hero headline, hover distortion on product cards, and magnetic hover effect on buttons. All effects must respect `prefers-reduced-motion` and `(pointer: fine)` where applicable. No new pages, components, or features beyond these three effects.

</domain>

<decisions>
## Implementation Decisions

### Glitch text (hero headline)
- Layered color offset style using CSS pseudo-elements — subtle chromatic aberration, not dramatic
- Colors: existing accent palette (--color-accent green, --color-accent-warm orange)
- Timing: fast glitch bursts with gaps in between — not continuous, not a single on-load event. Quick shifts then pauses, repeating
- Scope: headline "tuniice" only — tagline stays clean and static
- Pure CSS implementation (keyframes + pseudo-elements), no JS needed

### Card hover distortion
- SVG feTurbulence warp effect on product cards (per FX-02)
- Low intensity — subtle wobble/heat-shimmer, not dramatic warping. Content stays readable
- Layer WITH existing Card hover (translate -2px + shadow grow stays, turbulence adds on top)
- Claude's discretion on whether to warp entire card or image only — prioritize readability

### Button magnetic effect
- Magnetic cursor-follow on hover (requires small JS mousemove handler)
- Layer WITH existing button hover — magnetic pull adds to the translate + shadow interaction
- Claude's discretion on which buttons (primary only vs all) and magnetic pull radius/strength
- Touch devices: gated by `(pointer: fine)` — no magnetic on touch, keep existing active states

### Reduced-motion behavior
- Completely disabled — all effects fully removed with `prefers-reduced-motion: reduce`
- No glitch layers, no turbulence, no magnetic. Plain text, standard hovers
- Matches existing pattern in animations.css (transition: none, opacity: 1, transform: none)

### Claude's Discretion
- Turbulence warp target (entire card vs image only) — prioritize readability
- Magnetic pull radius and strength values
- Which buttons get magnetic (primary only vs all variants)
- Exact glitch burst duration and gap timing
- SVG filter placement strategy (inline vs shared defs)

</decisions>

<specifics>
## Specific Ideas

- Glitch should feel "subtle color shift" — not aggressive VHS corruption, more like a gentle digital artifact
- Gaps between glitch bursts are important — the stillness makes the bursts noticeable
- feTurbulence "could be cool" at low intensity — lean toward understated rather than flashy
- Overall vibe: effects that reward attention, not demand it

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Hero.astro`: h1.brand "tuniice" — target for glitch pseudo-elements. Already has z-index: 1 for layering over canvas
- `Card.astro`: has hover transform + shadow transitions. feTurbulence filter will layer via CSS `filter` property
- `ProductCard.astro`: wraps Card, has product-image div that could be an alternative warp target
- `Button.astro`: primary/secondary variants with translate(-2px,-2px) hover. Magnetic JS needs to work with existing transform
- `animations.css`: established reduced-motion pattern — `@media (prefers-reduced-motion: reduce)` sets transition: none

### Established Patterns
- Design tokens in `tokens.css`: all colors, spacing, shadows use CSS custom properties
- Neo-brutalist style: hard borders (--border-width: 3px), colored box-shadows, zero border-radius
- Hover pattern: translate(-2px, -2px) + shadow offset increase — consistent across Card and Button
- Reduced-motion: full disable (not gentle reduction) — new effects should match this pattern

### Integration Points
- Hero.astro: add glitch pseudo-element styles in existing `<style>` block
- Card.astro or ProductCard.astro: add SVG filter def + hover filter CSS
- Button.astro: add magnetic JS (inline `<script>` or separate file) + gated by pointer:fine
- animations.css or new effects.css: reduced-motion overrides for all three effects

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-css-interactive-effects*
*Context gathered: 2026-03-02*
