# Phase 10: Subdomain Infrastructure - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Get bluepriint.tuniice.com live as a separate Astro site within the same repo, sharing the main site's neo-brutalist design system with an amber accent color override. The page contains a base landing layout with placeholder content. DNS/Vercel configuration wires the subdomain. No additional app subdomains, no multi-page bluepriint site, no real product content (placeholder sufficient).

</domain>

<decisions>
## Implementation Decisions

### Landing page structure
- Hero section with product name, tagline, and description + features/highlights section + CTA section
- No header/navigation — standalone single page, matches main site's no-header pattern
- Footer with link back to tuniice.com
- Static dark background — no canvas particle animation for v1 (simpler scope, can add later)
- No ClientRouter/page transitions — single page, no internal navigation needed

### Content & messaging
- Pro tool tone — serious and precise, like Teenage Engineering or Ableton. Focus on capability, clean technical language
- Email signup CTA via Formspree — "Get notified when bluepriint launches" (reuse proven pattern from main site)
- Placeholder tagline based on PROJECT.md description: "Master clock and tempo control for live performance"
- Text only — no product screenshots or mockups for v1. Clean and placeholder-friendly

### Design inheritance
- Copy tokens.css into bluepriint project, override --color-accent to amber — no cross-project dependencies (per SUB-02)
- Same fonts: Space Grotesk (headings) + Space Mono (body) — consistent brand family
- No interactive effects (glitch text, magnetic buttons) — keep it clean for v1, simpler scope
- Identical neo-brutalist styling (hard borders, colored box-shadows, zero radius) — bluepriint looks like an amber color variant of tuniice

### Accent color application
- Full swap: override --color-accent from #00ff41 to #ffbf00 (existing --color-accent-amber value)
- All elements using --color-accent token automatically become amber — borders, shadows, buttons, links
- Trust #ffbf00 everywhere — contrast ratio ~12:1 on #0a0a0a is sufficient for all sizes
- Single amber accent only — no secondary accent color. Keep it simple

### Claude's Discretion
- Exact hero layout proportions and spacing
- Features section presentation (list, grid, icons, etc.)
- Formspree form styling adaptation for amber theme
- Footer design and "back to tuniice.com" link treatment
- Vercel project configuration specifics
- DNS CNAME setup details

</decisions>

<specifics>
## Specific Ideas

- Bluepriint is a master clock/tempo control app with arrangement for live PA, targeting electronic music producers and DJs (iOS app)
- Page should feel like a focused product page for a serious music tool — not a generic coming-soon template
- The amber accent should make it immediately clear this is a different product from the main green-accented tuniice site

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tokens.css`: Complete design token system — copy and override --color-accent for amber theming
- `global.css`: Base styles, resets, and utility classes — can be copied as foundation
- `BaseLayout.astro`: Page shell pattern (head, fonts, footer) — reference for bluepriint's layout
- `Footer.astro`: Footer component — can be adapted with bluepriint branding
- `Button.astro`: Button component with neo-brutalist styling — reusable if copied
- Formspree email signup pattern from main site products pages

### Established Patterns
- CSS custom properties flow through tokens.css — accent color override is a single variable change
- Neo-brutalist style: --border-width: 3px, colored box-shadows, --radius: 0
- Font loading via fonts.bunny.net CDN
- Astro 5.x with static output mode
- prefers-reduced-motion pattern in animations.css

### Integration Points
- Root-level `bluepriint/` directory for the separate Astro project
- Separate Vercel project pointing at bluepriint/ directory
- DNS CNAME: bluepriint.tuniice.com → Vercel project
- Shared repo but independent build/deploy pipelines

</code_context>

<deferred>
## Deferred Ideas

- Canvas particle animation for bluepriint (amber particles) — future enhancement
- Interactive effects (glitch, magnetic) on bluepriint — future enhancement
- Additional app subdomains following bluepriint pattern (SUB-05) — v2
- Multi-page bluepriint site with features, docs (SUB-06) — v2
- Real product content replacement — blocked on app development

</deferred>

---

*Phase: 10-subdomain-infrastructure*
*Context gathered: 2026-03-03*
