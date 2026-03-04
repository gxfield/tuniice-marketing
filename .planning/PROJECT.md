# tuniice

## What This Is

A marketing site for the tuniice brand — a creative studio at the intersection of music production and software engineering. The site showcases upcoming iOS apps, hardware devices, and web-based products, while soft-promoting music and art via Bandcamp and SoundCloud. Built with a neo-brutalist dark mode design system on Astro, deployed to Vercel as a fully static site. Features smooth page transitions, animated canvas backgrounds, interactive CSS effects (glitch text, magnetic buttons), and subdomain infrastructure for per-app mini-sites.

## Core Value

The site must establish tuniice as a credible, distinctive brand that makes visitors want to follow what's coming next.

## Requirements

### Validated

- Home page with hero, product teasers, About teaser, social links, and scroll animations — v1.0
- Products page with coming-soon cards, detail pages, and email signup — v1.0
- Story page with founder bio, technical background, and Bandcamp embeds — v1.0
- Neo-brutalist dark mode design with monochrome + neon green accent palette — v1.0
- Responsive design (mobile + desktop) — v1.0
- Deployed on Vercel — v1.0
- Smooth fade page transitions with per-page overrides (slide for products, scale for story) — v1.1
- Canvas particle field animation with lifecycle-safe RAF and HiDPI support — v1.1
- Visibility-based animation pause + prefers-reduced-motion fallback — v1.1
- Glitch text on hero headline + hover distortion on product cards — v1.1
- Magnetic cursor-follow on buttons with accessibility gating — v1.1
- Subdomain infrastructure with shared design system and per-app accent colors — v1.1
- bluepriint.tuniice.com live with amber accent and landing page — v1.1

### Active

- [ ] 3D tilt effect on product cards on hover
- [ ] Scroll-reactive section transforms (parallax, scale, rotation)
- [ ] Generative art backgrounds per-section (beyond particles)
- [ ] Additional app subdomains following the Bluepriint pattern
- [ ] Bluepriint site with multiple pages and real content

### Out of Scope

- Documentation pages — deferred until apps are built and need docs
- Blog / news section — not needed at launch
- E-commerce / direct sales — products sold through App Store and other channels
- CMS / admin panel — content managed via code for now
- OAuth / user accounts — no user-facing auth needed
- Analytics dashboard — basic Vercel analytics sufficient
- Light mode — dark mode is core brand identity
- Custom cursor replacement — magnetic hover effects achieve same brand energy without accessibility cost
- GSAP/Three.js — overkill for current effects; 60kb+ for capabilities not yet needed
- Monorepo tooling — not needed at current scale (1 subdomain)

## Context

Shipped v1.1 with ~3,300 LOC across Astro, TypeScript, CSS.
Tech stack: Astro 5.x, CSS custom properties, Canvas 2D, vanilla JS.
6 pages on main site: Home, Products, 4 product detail pages, Story.
1 subdomain live: bluepriint.tuniice.com (standalone Astro project, amber accent).
Formspree integration for email signup (needs env var configured in Vercel).
Placeholder content exists for: music embed URLs, avatar image, product descriptions, Bluepriint product copy.

## Constraints

- **Tech stack**: Astro — chosen for fast static sites with easy content expansion later
- **Hosting**: Vercel — easy deployment, good Astro support; separate project per subdomain
- **Design**: Neo-brutalism, dark mode only, monochrome + neon green accents (amber for Bluepriint)
- **Design inspiration**: Teenage Engineering (EP-133 KO II and similar devices)
- **Content**: Placeholder content in several areas — replace as real content becomes available
- **Dependencies**: Zero external JS dependencies for effects — pure CSS + vanilla JS only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Content-focused static site, no need for React complexity | Good |
| Dark mode only | Matches brand aesthetic, reduces design scope | Good |
| Neon green accent | High contrast against dark, terminal/hacker energy | Good |
| No CMS | Content is sparse and changes infrequently | Good |
| CSS custom properties over Tailwind | Design tokens in pure CSS, no build dependency | Good |
| Intersection Observer for animations | Zero-dependency scroll animations | Good |
| Formspree for email signup | Backend-free form handling on static site | Good |
| Single Story page over separate About + Music | Unified narrative flow | Good |
| Astro ClientRouter for transitions | Already active, Swup conflicts with it | Good — clean lifecycle |
| Raw Canvas 2D for particles | No new dependencies, full control | Good — performant |
| Pure CSS + vanilla JS for effects | Zero dependencies, easy to maintain | Good — lightweight |
| Separate Vercel project per subdomain | No monorepo tooling needed at current scale | Good — simple |
| Forked tokens.css for subdomains | Only accent color differs, all other tokens shared | Good — minimal divergence |
| DNS CNAME + Vercel auto-SSL | Zero-config HTTPS for subdomains | Good |
| DPR capped at 2x | GPU memory control on ultra-dense displays | Good |
| Module-level RAF lifecycle | Prevents stacking across Astro navigations | Good |
| Dual-gated effects (pointer:fine + reduced-motion) | Accessibility without separate code paths | Good |

---
*Last updated: 2026-03-04 after v1.1 milestone*
