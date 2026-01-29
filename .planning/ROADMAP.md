# Roadmap: tuniice

## Overview

A marketing site that establishes tuniice as a credible, distinctive brand through neo-brutalist design and minimal but intentional content. We start with infrastructure and design foundations, build out the home page and core navigation, add product showcases with "coming soon" teasers, and finish with about/music pages to complete the brand presence.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Astro project with design system and navigation
- [x] **Phase 1.1: Update Page Structure** - (INSERTED)
- [ ] **Phase 1.2: Remove Header & Update Styling** - (INSERTED)
- [ ] **Phase 2: Home & Core Content** - Hero page with brand presence
- [ ] **Phase 3: Products Showcase** - Coming soon teasers and product pages
- [ ] **Phase 4: About & Music** - About page and music integrations

## Phase Details

### Phase 1: Foundation
**Goal**: Site has infrastructure and core design system ready for content
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, DSGN-01, DSGN-02, DSGN-04, DSGN-05, NAV-01
**Success Criteria** (what must be TRUE):
  1. Astro project runs locally and deploys to Vercel
  2. Site has consistent neo-brutalist dark mode styling across all viewports
  3. Navigation with logo and hamburger menu works on all pages
  4. Reusable component library exists (buttons, cards, nav, footer)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Astro project with design tokens and global styles (2m 51s)
- [x] 01-02-PLAN.md — Build component library (Button, Card, Header/Nav, Footer) and BaseLayout (2m 30s)
- [x] 01-03-PLAN.md — Create page shells and deploy to Vercel (3m)

### Phase 1.1: Update Page Structure (INSERTED)
**Goal**: Convert the multi-page site to a single-page site — only the home page remains, all other pages (about, music, products) are removed, and navigation is updated accordingly
**Depends on**: Phase 1
**Requirements**: None (structural change, not a feature requirement)
**Success Criteria** (what must be TRUE):
  1. Only index.astro exists in src/pages/ (about, music, products pages removed)
  2. Navigation no longer links to removed pages (updated or simplified)
  3. Site builds and deploys without broken links or references
**Plans**: 1 plan

Plans:
- [x] 01.1-01-PLAN.md — Delete extra pages and clean up all references to removed pages (36s)

### Phase 1.2: Remove Header & Update Styling (INSERTED)
**Goal**: Remove the header component and update site styling
**Depends on**: Phase 1.1
**Requirements**: None (structural/styling change)
**Success Criteria** (what must be TRUE):
  1. Header component is removed from the site
  2. Site styling is updated as needed
  3. Site builds and deploys without errors
**Plans**: 1 plan

Plans:
- [ ] 01.2-01-PLAN.md — Remove Header component and adjust layout CSS for headerless design

### Phase 2: Home & Core Content
**Goal**: Visitors land on a compelling home page that establishes the tuniice brand
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, DSGN-03
**Success Criteria** (what must be TRUE):
  1. Home page has hero section with brand name and tagline
  2. Product preview teasers link to Products page
  3. Social links (Bandcamp, SoundCloud) are visible and functional
  4. Page transitions and hover effects work throughout the site
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 3: Products Showcase
**Goal**: Products page showcases upcoming apps and hardware with launch notifications
**Depends on**: Phase 2
**Requirements**: PROD-01, PROD-02, PROD-03, PROD-04
**Success Criteria** (what must be TRUE):
  1. Products page displays coming soon cards for apps and hardware in separate sections
  2. Each product has a detail page (even if content is sparse)
  3. Email signup form captures launch notification signups
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

### Phase 4: About & Music
**Goal**: About and Music pages complete the brand story
**Depends on**: Phase 3
**Requirements**: ABUT-01, ABUT-02, ABUT-03, ABUT-04, MUSC-01
**Success Criteria** (what must be TRUE):
  1. About page tells Greg's story with photo and technical background
  2. Contact information is accessible (email or form)
  3. Music page embeds Bandcamp players for releases
**Plans**: TBD

Plans:
- [ ] TBD during phase planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 1.1 → 1.2 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-01-28 |
| 1.1. Update Page Structure | 1/1 | Complete | 2026-01-29 |
| 1.2. Remove Header & Update Styling | 0/TBD | Not started | - |
| 2. Home & Core Content | 0/TBD | Not started | - |
| 3. Products Showcase | 0/TBD | Not started | - |
| 4. About & Music | 0/TBD | Not started | - |
