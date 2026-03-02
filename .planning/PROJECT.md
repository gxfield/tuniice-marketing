# tuniice

## What This Is

A marketing site for the tuniice brand — a creative studio at the intersection of music production and software engineering. The site showcases upcoming iOS apps, hardware devices, and web-based products, while soft-promoting music and art via Bandcamp and SoundCloud. Built with a neo-brutalist dark mode design system on Astro, deployed to Vercel as a fully static site.

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

### Active

- [ ] Canvas/WebGL animated backgrounds (particle fields, generative art)
- [ ] Page transitions via JS library (Swup/Barba.js) with broad browser support
- [ ] Interactive elements (cursor effects, hover distortions, glitch text, scroll-reactive)
- [ ] Subdomain infrastructure for app mini-sites with shared design system
- [ ] Bluepriint app site at bluepriint.tuniice.com (full mini-site)

### Out of Scope

- Documentation pages — deferred until apps are built and need docs
- Blog / news section — not needed at launch
- E-commerce / direct sales — products sold through App Store and other channels
- CMS / admin panel — content managed via code for now
- OAuth / user accounts — no user-facing auth needed
- Analytics dashboard — basic Vercel analytics sufficient
- Light mode — dark mode only, confirmed for v1.1

## Context

- Greg is a music producer and software engineer building a personal brand that spans both disciplines
- iOS apps, hardware devices, and web apps are in development but not yet ready to show
- Music is already published on Bandcamp and SoundCloud
- Site is live on Vercel as static Astro build (~1,800 LOC across Astro, TypeScript, CSS)
- 6 pages: Home, Products, 4 product detail pages, Story
- Tech stack: Astro 5.x, CSS custom properties, Intersection Observer for animations
- Placeholder content exists for: music embed URLs, avatar image, product descriptions
- Formspree integration for email signup (needs env var configured in Vercel)
- Bluepriint: master clock/tempo control with arrangement for live PA, electronic music producers and DJs (iOS app, content to be provided)
- Subdomain sites share the neo-brutalist design system but each app can have its own accent color

## Current Milestone: v1.1 UI Candy & Subdomains

**Goal:** Add bold visual effects (animated backgrounds, page transitions, interactive elements) to the main site and build subdomain infrastructure for app mini-sites, starting with Bluepriint.

**Target features:**
- Animated backgrounds (Canvas/WebGL particles, generative art)
- Page transitions (JS library for broad browser support)
- Interactive elements (cursor effects, hover distortions, glitch text)
- Subdomain routing and shared design system
- Bluepriint mini-site as first app subdomain

## Constraints

- **Tech stack**: Astro — chosen for fast static sites with easy content expansion later
- **Hosting**: Vercel — easy deployment, good Astro support
- **Design**: Neo-brutalism, dark mode only, monochrome + neon green accents
- **Design inspiration**: Teenage Engineering (EP-133 KO II and similar devices)
- **Content**: Placeholder content in several areas — replace as real content becomes available

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Content-focused static site, no need for React complexity | Good — fast builds, simple DX |
| Dark mode only | Matches brand aesthetic, reduces design scope | Good — cohesive look |
| Neon green accent | High contrast against dark, terminal/hacker energy | Good — distinctive brand color |
| No CMS | Content is sparse and changes infrequently | Good — simpler workflow |
| CSS custom properties over Tailwind | Design tokens in pure CSS, no build dependency | Good — clean, maintainable |
| Intersection Observer for animations | Zero-dependency scroll animations | Good — lightweight |
| Formspree for email signup | Backend-free form handling on static site | Good — simple integration |
| Single Story page over separate About + Music | Unified narrative flow | Good — more compelling |
| Stay dark mode for v1.1 | Dark mode is core brand identity, light mode deferred | Good — focus on effects |
| JS page transition library over View Transitions API | Broader browser support (Firefox) | — Pending |
| Shared design system across subdomains | Consistent brand, less maintenance | — Pending |

---
*Last updated: 2026-03-01 after v1.1 milestone started*
