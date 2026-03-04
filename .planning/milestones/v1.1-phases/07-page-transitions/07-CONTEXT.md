# Phase 7: Page Transitions - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Smooth, styled transitions when navigating between all pages. Default fade transition plus distinct per-page styles for product detail and story pages. All timing controlled by CSS custom properties. No new pages or content — purely visual navigation enhancement.

</domain>

<decisions>
## Implementation Decisions

### Transition feel
- Bold & intentional — transitions are a design feature, not just plumbing
- Sequential animation: old page exits completely, then new page enters (not simultaneous crossfade)
- Clean dark gap between pages — brief moment of background (#0a0a0a) visible between exit and enter
- Scroll-triggered animations (data-animate) replay on every page visit, not just first

### Per-page transition styles
- Default (home, products listing): fade out / fade in — old page fades to dark, new page fades up from dark
- Product detail pages: slide from right on enter, slide back left on return — drill-down metaphor
- Story page: scale/zoom in — focusing in on something personal
- Products listing page uses the default fade — no distinct treatment

### Timing & easing
- Default transition duration: ~600ms total (300ms out + 300ms in)
- Story page gets longer duration: ~800ms total for more contemplative feel
- Product detail pages use default 600ms
- Both `--transition-duration` and `--transition-easing` CSS custom properties defined in tokens.css

### Edge cases
- Back/forward navigation reverses transition direction (slide left becomes slide right, etc.)
- Scroll position always resets to top on every navigation (consistent with replaying entrance animations)

### Claude's Discretion
- Easing curve selection — pick what complements the bold sequential feel
- Reduced-motion handling — accessible approach, consistent with existing animations.css pattern
- Interrupted transition behavior — work with what Astro ClientRouter supports natively

</decisions>

<specifics>
## Specific Ideas

- Sequential exit-then-enter creates a deliberate "beat" between pages — the dark gap is intentional, not a bug
- Product detail slide direction should feel spatial: right = deeper, left = back
- Story scale-in should feel like "focusing" or "zooming into" the narrative

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ClientRouter` (astro:transitions): Already imported in BaseLayout.astro — Astro's built-in view transition API
- `animations.css`: Existing scroll-triggered fade-in system with `data-animate`, `is-visible`, stagger delays, and `prefers-reduced-motion` support
- `tokens.css`: Design token system — transition tokens (`--transition-duration`, `--transition-easing`) should be added here

### Established Patterns
- `astro:page-load` event: Already used in BaseLayout.astro to reinitialize IntersectionObserver after transitions
- `prefers-reduced-motion`: Already handled in animations.css — new transition code should follow the same pattern
- CSS custom properties: All visual values flow through tokens.css

### Integration Points
- `BaseLayout.astro`: Where `<ClientRouter />` lives and where `transition:animate` directives would be added
- Individual page files (index.astro, products.astro, story.astro, products/[slug].astro): May need `transition:animate` attributes on page-level elements
- `tokens.css`: Where `--transition-duration` and `--transition-easing` get defined

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-page-transitions*
*Context gathered: 2026-03-01*
