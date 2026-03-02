---
phase: 03
plan: 01
subsystem: products-data
type: foundation
status: complete
completed: 2026-01-29

requires:
  - phase: 01
    plan: 02
    artifact: Card component with accent variants
  - phase: 01
    plan: 02
    artifact: Design tokens (CSS custom properties)

provides:
  - artifact: Product data structure
    exports: [Product interface, products array]
    file: src/data/products.ts
  - artifact: Card muted variant
    pattern: filter-based visual treatment
    file: src/components/ui/Card.astro
  - artifact: ProductCard component
    uses: [Card, Product type]
    file: src/components/ui/ProductCard.astro
  - artifact: NotifyForm component
    integration: Formspree
    file: src/components/forms/NotifyForm.astro
  - artifact: Geometric product SVGs
    files: [rhythm-forge.svg, grid-controller.svg, wave-editor.svg]
    directory: public/images/products/

affects:
  - phase: 03
    plan: 02
    reason: Products page will consume ProductCard and product data
  - phase: 03
    plan: 02
    reason: Detail pages will use NotifyForm for launch signups

tech-stack:
  added:
    - name: Formspree
      type: service
      purpose: Email signup backend for static site
      integration: HTML form + fetch API
  patterns:
    - name: Filter-based muted state
      approach: CSS grayscale + opacity for coming-soon visual treatment
    - name: Client-side form handling
      approach: Fetch API with inline success/error messages
    - name: Typed product data
      approach: TypeScript interface with exported array

key-files:
  created:
    - src/data/products.ts
    - src/components/ui/ProductCard.astro
    - src/components/forms/NotifyForm.astro
    - public/images/products/rhythm-forge.svg
    - public/images/products/grid-controller.svg
    - public/images/products/wave-editor.svg
  modified:
    - src/components/ui/Card.astro

decisions:
  - id: D-03-01-1
    choice: Muted card treatment via CSS filters
    rationale: Grayscale + opacity creates locked/unavailable appearance without removing interactivity
    alternatives: [Overlay div, opacity-only, disabled attribute]
    decision: Filter-based approach preserves hover effects and is simpler to implement
  - id: D-03-01-2
    choice: Client-side form submission with fetch API
    rationale: Provides immediate feedback without page reload, better UX for static site
    alternatives: [Native form submission with redirect, AJAX library]
    decision: Native fetch with inline success message for zero-dependency approach
  - id: D-03-01-3
    choice: Placeholder product data with 3 products
    rationale: Mix of apps and hardware demonstrates category system and accent variants
    alternatives: [Single product, many products, real product names]
    decision: 3 placeholder products (Rhythm Forge, Grid Controller, Wave Editor) sufficient to establish pattern
  - id: D-03-01-4
    choice: Simple geometric SVG product images
    rationale: Fast load, scalable, brand-appropriate for coming-soon state, hand-coded simplicity
    alternatives: [Photo mockups, canvas-generated, SVG library]
    decision: Hand-coded inline SVG using design tokens for consistency

metrics:
  duration: 2m 15s
  tasks_completed: 2
  commits: 2
  files_created: 7
  files_modified: 1

tags: [products, data-layer, components, forms, svg, neo-brutalist]
---

# Phase 3 Plan 1: Products Data & Components

**One-liner:** Created product data structure, geometric SVG imagery, muted Card variant, ProductCard component, and Formspree-based NotifyForm for the products showcase.

## What Was Built

Established the complete data layer and component foundation for the products showcase system:

1. **Product Data Structure** - TypeScript interface and exported array with 3 placeholder products (Rhythm Forge, Grid Controller, Wave Editor), each with name, slug, tagline, description, category (app/hardware), image path, status, and accent color.

2. **Geometric Product Images** - Three hand-coded SVG files using design token CSS variables:
   - rhythm-forge.svg: 4x4 beat grid pattern (primary/green accent)
   - grid-controller.svg: 3x4 pad array circles (secondary/orange accent)
   - wave-editor.svg: Zigzag waveform pattern (amber accent)

3. **Card Muted Variant** - Extended existing Card component with optional `muted` boolean prop that applies CSS filter (grayscale 40% + opacity 75%) for coming-soon visual treatment. Hover reduces muting to grayscale 20% + opacity 90%.

4. **ProductCard Component** - Specialized card that renders product image, name, tagline, category badge (with border in product's accent color), and coming-soon status. Composes the Card component with muted=true.

5. **NotifyForm Component** - Email signup form with Formspree integration (configurable via PUBLIC_FORMSPREE_ID env var). Features:
   - Client-side fetch API submission
   - Inline success ("You're on the list!") and error messages
   - Horizontal layout on desktop, stacked on mobile
   - Neo-brutalist button styling matching existing Button component patterns
   - Accessible labels and ARIA attributes

## Task Breakdown

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create product data file and SVG product images | 0594e83 | products.ts, rhythm-forge.svg, grid-controller.svg, wave-editor.svg |
| 2 | Extend Card with muted prop and create ProductCard and NotifyForm | 9087502 | Card.astro, ProductCard.astro, NotifyForm.astro |

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

**D-03-01-1: Muted Card Treatment via CSS Filters**
- Chose CSS `filter: grayscale(40%) opacity(75%)` for coming-soon visual state
- Preserves hover effects while communicating unavailability
- Simpler than overlay divs or disabled attributes

**D-03-01-2: Client-Side Form Submission**
- Implemented fetch API with inline success/error messages
- Avoids page reload, provides immediate feedback
- Zero-dependency approach aligns with existing project patterns

**D-03-01-3: Placeholder Product Names**
- Selected "Rhythm Forge" (app), "Grid Controller" (hardware), "Wave Editor" (app)
- Names evoke music production tools while remaining generic
- Mix of categories demonstrates the badge system and accent variants

**D-03-01-4: Hand-Coded Geometric SVGs**
- Created simple geometric patterns using design token CSS variables
- Each SVG is 10-15 lines, tiny file size, scalable
- Neo-brutalist aesthetic (hard borders, geometric shapes) matches brand

## Technical Notes

### Component Architecture
- ProductCard is NOT wrapped in an `<a>` tag - consumers (products page) will handle linking
- NotifyForm reinitializes on `astro:page-load` event for view transitions compatibility
- Category badges use square corners (no border-radius) per neo-brutalist design system

### Form Integration
- Formspree endpoint configurable via `PUBLIC_FORMSPREE_ID` environment variable
- Hidden `_subject` field set to "tuniice Launch Notification Signup"
- Form submission handled via fetch with JSON accept header for proper API response

### SVG Approach
- All SVGs use dark background (#141414) matching `--color-bg-elevated`
- Colors reference CSS custom properties via `var()` for consistency
- Simple shapes only (rect, circle, polyline) - no complex paths

## Next Phase Readiness

**Ready for Plan 03-02:**
- Product data structure is complete and typed
- ProductCard component ready for use in products listing
- NotifyForm ready for use in detail pages and sticky CTA
- SVG images exist and load correctly

**Blockers:** None

**Considerations:**
- Formspree endpoint needs real form ID before production (currently uses placeholder "YOUR_FORM_ID")
- Environment variable PUBLIC_FORMSPREE_ID should be set in Vercel or .env for actual email capture

## Build Verification

- `npx astro build` completed successfully
- All components importable and typed correctly
- No TypeScript errors
- Build output: 1 page, 415ms total build time

---

*Completed: 2026-01-29*
*Duration: 2m 15s*
*Commits: 0594e83, 9087502*
