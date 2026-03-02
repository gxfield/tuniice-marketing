# Phase 3: Products Showcase - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Showcase upcoming apps and hardware products with "coming soon" teasers and a launch notification signup. Products page displays cards for each product, each product has a detail page, and an email signup captures launch notification interest. Product launching, purchasing, and inventory are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Product card design
- Image-forward cards: large product image/mockup at top, name and short description below
- Each card shows: product image, name, tagline, category badge ("App" / "Hardware"), status indicator, and notify button
- "Coming soon" communicated via muted card treatment — card itself looks slightly desaturated/locked, implying not-yet-available
- Hover interaction: hard shadow lift matching the existing neo-brutalist design system pattern

### Product detail pages
- Minimal placeholder pages: product name, image, short description, and "notify me" form
- Shared template across all products — consistent, data-driven layout
- Explicit "Back to Products" link at top of each detail page
- No related products section — keep it focused on the single product

### Content & categories
- Apps and hardware in one mixed grid, distinguished by category badges on each card
- Placeholder products (2-3 generic products) for now — not real product names
- Abstract/geometric art as product imagery — neo-brutalist geometric shapes or abstract visuals
- Direct, confident copy tone — clear product name and what it does, just not launched yet

### Email signup flow
- Global signup form — one form for all products ("Get notified when we launch")
- Sticky/floating CTA that's always visible, opens or reveals the signup form
- Backend: Formspree or similar third-party form service (no backend code needed)
- Confirmation: inline success message replaces the form with "You're on the list"

### Claude's Discretion
- Exact placeholder product names and descriptions
- Geometric art style/colors for product images
- Sticky CTA exact positioning and animation
- Form field design (just email, or email + name)
- Muted card treatment exact visual approach (opacity, grayscale, overlay)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Products should feel like real upcoming things even if placeholder, fitting the neo-brutalist brand aesthetic established in earlier phases.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-products-showcase*
*Context gathered: 2026-01-29*
