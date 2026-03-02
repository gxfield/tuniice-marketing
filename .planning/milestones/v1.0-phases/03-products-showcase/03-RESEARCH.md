# Phase 3: Products Showcase - Research

**Researched:** 2026-01-29
**Domain:** Static product showcase with dynamic routes, forms, and neo-brutalist design
**Confidence:** HIGH

## Summary

Phase 3 builds a product showcase system for Astro that displays "coming soon" products with detail pages and email signup functionality. The research confirms that Astro's file-based routing with `getStaticPaths()` is the standard approach for creating individual product pages at build time. For the email signup backend, Formspree provides a zero-backend solution suitable for static sites. The "muted" card treatment for coming-soon products is achievable with standard CSS filters. Sticky/floating CTAs for the signup form require careful accessibility considerations.

The existing codebase has established patterns (hard shadow lift interactions, Intersection Observer animations, design tokens) that should be extended rather than replaced. Product data can be managed as TypeScript/JavaScript objects exported from a data file, following Astro's convention of keeping static data in `src/data/`.

**Primary recommendation:** Use Astro's native dynamic routing with hardcoded product data, implement form handling via Formspree HTML forms (simplest integration), create muted card states with CSS filters (grayscale + reduced opacity), and implement sticky CTA with `position: fixed` and proper accessibility attributes.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site framework | Already in use, native dynamic routes via getStaticPaths() |
| Formspree | N/A (service) | Form backend for static sites | Industry standard, no code needed, free tier sufficient |
| Native CSS | N/A | Filter effects, sticky positioning | Built-in browser APIs, zero dependencies |
| Native Intersection Observer | N/A | Scroll animations | Already implemented in Phase 2, consistent pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| SVG.js or inline SVG | 3.x / N/A | Geometric product imagery | For programmatic generation if needed; hand-coded SVG sufficient for 2-3 products |
| Bunny Fonts | N/A | Typography | Already in use (Phase 1), privacy-friendly |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Formspree | Basin, Getform, ProForms | Basin at $7/mo has better pricing long-term; Formspree free tier (50 submissions/month) sufficient for launch |
| Formspree | Web3Forms, Formspark | Similar features but Formspree has best documentation and ecosystem fit |
| Inline SVG | SVG library (svg-patterns, Snap.svg) | Libraries add dependencies; inline SVG keeps it simple for 2-3 placeholder products |

**Installation:**
```bash
# No new npm packages required
# Formspree is a service (no npm install)
# SVG can be inline or created manually
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── data/
│   └── products.ts          # Product data array with type definitions
├── pages/
│   ├── index.astro          # Home page (exists)
│   ├── products.astro       # NEW: Products listing page
│   └── products/
│       └── [slug].astro     # NEW: Dynamic product detail pages
├── components/
│   ├── ui/
│   │   ├── Card.astro       # Existing, extend with "muted" variant
│   │   ├── Button.astro     # Existing, use for CTA
│   │   └── ProductCard.astro # NEW: Specialized product card component
│   ├── forms/
│   │   └── NotifyForm.astro # NEW: Email signup form component
│   └── sections/
│       └── ProductGrid.astro # NEW: Grid layout for product cards
└── styles/
    ├── tokens.css           # Existing design tokens
    └── animations.css       # Existing scroll animations
```

### Pattern 1: Dynamic Routes with Static Paths
**What:** Astro's `getStaticPaths()` generates individual product pages at build time
**When to use:** Always for static sites with known content at build time
**Example:**
```astro
---
// src/pages/products/[slug].astro
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/routing.mdx

export async function getStaticPaths() {
  const products = await import('../../data/products');

  return products.default.map((product) => ({
    params: { slug: product.slug },
    props: { product }
  }));
}

const { product } = Astro.props;
---

<BaseLayout title={product.name}>
  <article>
    <h1>{product.name}</h1>
    <img src={product.image} alt={product.name} />
    <p>{product.description}</p>
    <NotifyForm productId={product.id} />
  </article>
</BaseLayout>
```

### Pattern 2: Formspree HTML Integration
**What:** Simple HTML form that POSTs to Formspree endpoint
**When to use:** Simplest approach for static sites without custom backend
**Example:**
```astro
---
// Source: https://formspree.io/
const formEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;
---

<form action={formEndpoint} method="POST" id="notify-form">
  <input type="email" name="email" required placeholder="your@email.com" />
  <input type="hidden" name="_subject" value="Product Launch Notification Signup" />
  <input type="hidden" name="_next" value="/thank-you" />
  <button type="submit">Notify Me</button>
</form>
```

### Pattern 3: Muted Card State with CSS Filters
**What:** Combine grayscale and opacity to create "locked" appearance
**When to use:** Visual indication of disabled/unavailable state without removing interactivity
**Example:**
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter */
.card-muted {
  filter: grayscale(50%) opacity(70%);
  transition: filter 0.3s ease;
}

.card-muted:hover {
  filter: grayscale(30%) opacity(85%);
}
```

### Pattern 4: Sticky CTA with Accessibility
**What:** Fixed-position form trigger that's always visible while scrolling
**When to use:** Long pages where CTA should remain accessible throughout
**Example:**
```css
/* Source: Best practices from https://www.boia.org/blog/how-sticky-and-fixed-elements-impact-accessibility */
.sticky-cta {
  position: fixed;
  bottom: var(--space-md);
  right: var(--space-md);
  z-index: 100;
  /* Ensure contrast for WCAG compliance */
  background: var(--color-accent);
  color: var(--color-bg);
}

/* Prevent obscuring focus */
:focus {
  scroll-margin-bottom: 80px; /* Adjust based on sticky element height */
}
```

### Anti-Patterns to Avoid
- **Validating on every keystroke:** Wait until user finishes typing to avoid annoying real-time errors (Source: https://blog.logrocket.com/ux-design/ux-form-validation-inline-after-submission/)
- **Too many sticky elements:** Multiple fixed CTAs distract and frustrate users (Source: https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- **Overwhelming product pages:** Research from Baymard Institute shows cluttered layouts increase bounce rates by 60% (Source: https://www.shopify.com/blog/ecommerce-mistakes)
- **Missing mobile optimization:** 53% of users abandon mobile sites loading >3 seconds (Source: https://webgamma.ca/startup-web-design-mistakes-that-kill-conversions/)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form backend | Custom API endpoint | Formspree (or Basin, Getform) | Handles spam filtering, email delivery, GDPR compliance, storage |
| Email validation | Regex patterns | HTML5 `type="email"` + Formspree validation | Browser native + server-side validation catches edge cases |
| Spam prevention | Custom honeypot | Formspree's built-in spam filtering | Includes reCAPTCHA, Akismet, custom rules |
| Scroll animations | Custom scroll listeners | Intersection Observer (already in use) | Better performance, native API, already implemented |
| SVG generation (if complex) | Canvas drawing | SVG libraries (svg-patterns, SVG.js) | But for 2-3 products, inline SVG is simpler |

**Key insight:** Static site forms require third-party services unless you add a serverless backend. Formspree's free tier (50 submissions/month) is sufficient for a new product launch page. The service handles all edge cases: spam, email delivery, data storage, export to CSV/JSON.

## Common Pitfalls

### Pitfall 1: Form Submission Without Success Feedback
**What goes wrong:** User submits form but sees no confirmation, leading to duplicate submissions or uncertainty
**Why it happens:** Developers forget to handle the post-submission state
**How to avoid:** Use Formspree's `_next` redirect or implement JavaScript-based inline success message
**Warning signs:** Form reloads to same page without visual change, users ask "did it work?"

### Pitfall 2: Sticky CTAs Obscuring Content or Focus
**What goes wrong:** Fixed-position elements cover important content or make keyboard navigation impossible
**Why it happens:** Not accounting for z-index conflicts, focus visibility, or mobile viewport height
**How to avoid:** Use `scroll-margin` properties, ensure high contrast, test with keyboard navigation
**Warning signs:** Users complain about hidden content, can't see what's focused, mobile footer buttons overlap page content

### Pitfall 3: Hardcoded Product Data Without Type Safety
**What goes wrong:** Typos in product data cause runtime errors, missing fields break pages
**Why it happens:** Plain JavaScript objects without TypeScript interfaces
**How to avoid:** Define TypeScript interface for product data structure
**Warning signs:** Product pages breaking silently, inconsistent data structure across products

### Pitfall 4: Overly Complex Product Images
**What goes wrong:** Large image files slow page load, especially on mobile
**Why it happens:** Using high-res photos or unoptimized SVG
**How to avoid:** Use simple geometric SVG shapes (tiny file size), optimize if using photos
**Warning signs:** Lighthouse performance score drops, mobile load time >3 seconds

### Pitfall 5: Missing Category Badges or Visual Hierarchy
**What goes wrong:** Apps and hardware blend together, users can't quickly scan product types
**Why it happens:** Relying only on product names to communicate category
**How to avoid:** Add visual category badges using existing accent colors (primary = apps, secondary = hardware)
**Warning signs:** User feedback asks "which ones are apps?", low engagement with specific product types

### Pitfall 6: Not Using Existing Design System
**What goes wrong:** New components don't match established patterns, inconsistent UX
**Why it happens:** Not reviewing existing Card, Button, animation patterns before building
**How to avoid:** Extend existing components (Card variants) rather than creating new styles
**Warning signs:** Different shadow sizes, conflicting hover effects, animation timing inconsistencies

## Code Examples

Verified patterns from official sources:

### TypeScript Product Data Structure
```typescript
// src/data/products.ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'app' | 'hardware' | 'web';
  image: string;
  status: 'coming-soon';
}

export const products: Product[] = [
  {
    id: 'prod-001',
    slug: 'rhythm-forge',
    name: 'Rhythm Forge',
    tagline: 'Beat creation reimagined',
    description: 'A new approach to drum sequencing and sound design.',
    category: 'app',
    image: '/images/products/rhythm-forge.svg',
    status: 'coming-soon'
  },
  {
    id: 'prod-002',
    slug: 'grid-controller',
    name: 'Grid Controller',
    tagline: 'Tactile music control',
    description: 'Hardware MIDI controller with RGB pads and endless encoders.',
    category: 'hardware',
    image: '/images/products/grid-controller.svg',
    status: 'coming-soon'
  }
];
```

### Inline SVG Geometric Product Image
```astro
---
// Simple geometric SVG for product imagery
// No library needed for basic shapes
---
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Neo-brutalist geometric composition -->
  <rect x="50" y="50" width="120" height="120"
        fill="var(--color-accent)"
        stroke="var(--color-border)"
        stroke-width="3" />
  <circle cx="280" cy="140" r="60"
          fill="var(--color-accent-warm)"
          stroke="var(--color-border)"
          stroke-width="3" />
  <polygon points="200,50 250,180 150,180"
           fill="var(--color-accent-amber)"
           stroke="var(--color-border)"
           stroke-width="3" />
</svg>
```

### Formspree Form with Success Handling
```astro
---
// src/components/forms/NotifyForm.astro
const formEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;
---

<form action={formEndpoint} method="POST" class="notify-form">
  <label for="email" class="visually-hidden">Email address</label>
  <input
    type="email"
    name="email"
    id="email"
    required
    placeholder="your@email.com"
    aria-label="Email address for launch notifications"
  />
  <input type="hidden" name="_subject" value="Product Launch Notification" />
  <input type="hidden" name="_next" value={Astro.url.pathname + '?success=true'} />
  <button type="submit">Notify Me</button>
</form>

{Astro.url.searchParams.get('success') && (
  <p class="success-message" role="status">
    You're on the list! We'll notify you when we launch.
  </p>
)}

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .success-message {
    color: var(--color-accent);
    font-weight: 700;
    margin-top: var(--space-sm);
  }
</style>
```

### Extending Card Component with Muted Variant
```astro
---
// src/components/ui/Card.astro (extend existing)
interface Props {
  accent?: 'primary' | 'secondary' | 'amber';
  muted?: boolean; // NEW
}

const { accent = 'primary', muted = false } = Astro.props;
---

<article class={`card card-${accent} ${muted ? 'card-muted' : ''}`}>
  <slot />
</article>

<style>
  /* Existing card styles... */

  /* NEW: Muted state for coming-soon products */
  .card-muted {
    filter: grayscale(40%) opacity(75%);
    transition: filter 0.3s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  .card-muted:hover {
    filter: grayscale(20%) opacity(90%);
  }
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Server-side forms | Third-party services (Formspree, Basin) | ~2018-2020 | Static sites can handle forms without backend |
| Custom scroll listeners | Intersection Observer API | 2019 (browser support) | Better performance, already in use in Phase 2 |
| JavaScript form libraries | HTML5 native validation + service provider | 2020+ | Simpler, less code, better accessibility |
| Photo product images | Abstract/geometric SVG | Ongoing trend | Faster load, scalable, brand-appropriate for coming-soon |

**Deprecated/outdated:**
- jQuery for DOM manipulation: Use vanilla JS (project has no jQuery dependency)
- Client-side email regex validation only: Always pair with server-side (Formspree handles this)
- Flash of unstyled form after submit: Use redirect with URL params or JS to maintain state

## Open Questions

Things that couldn't be fully resolved:

1. **Exact placeholder product names**
   - What we know: Need 2-3 products, mix of apps/hardware
   - What's unclear: Specific product names that fit tuniice brand
   - Recommendation: Use generic but evocative names (e.g., "Rhythm Forge", "Grid Controller", "Wave Editor") until real products are ready

2. **Sticky CTA exact positioning**
   - What we know: Should be always visible, not intrusive
   - What's unclear: Bottom-right vs bottom-center vs floating above footer
   - Recommendation: Start with bottom-right (mobile: bottom-center) as most common pattern, iterate based on testing

3. **Form fields beyond email**
   - What we know: Email is required, could add name
   - What's unclear: Does Greg want to collect product preferences or just email?
   - Recommendation: Start with email only (fewer fields = higher conversion), can add product selection later if needed

## Sources

### Primary (HIGH confidence)
- **/withastro/docs** (Context7) - Dynamic routing patterns, getStaticPaths() implementation, project structure
- [Formspree Official](https://formspree.io/) - Form service features and implementation
- [MDN CSS filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter) - CSS filter documentation for muted state

### Secondary (MEDIUM confidence)
- [Form validation UX best practices](https://blog.logrocket.com/ux-design/ux-form-validation-inline-after-submission/) - Inline validation timing guidance
- [Sticky elements accessibility](https://www.boia.org/blog/how-sticky-and-fixed-elements-impact-accessibility) - Fixed position accessibility concerns
- [CTA placement strategies 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) - Sticky CTA best practices
- [Success message UX](https://www.pencilandpaper.io/articles/success-ux) - Success indicator patterns
- [Product page mistakes](https://www.shopify.com/blog/ecommerce-mistakes) - Common pitfalls to avoid
- [Static site forms comparison](https://css-tricks.com/a-comparison-of-static-form-providers/) - Formspree vs alternatives
- [Programmatic SVG generation](https://dev.to/georgedoescode/a-generative-svg-starter-kit-5cm1) - SVG creation techniques

### Tertiary (LOW confidence)
- [Neo-brutalist design trends](https://bejamas.com/blog/neubrutalism-web-design-trend) - Design aesthetic context
- Search results on form service alternatives - Ecosystem landscape, not feature-specific

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Astro patterns verified via Context7, Formspree is industry-standard service
- Architecture: HIGH - File structure follows Astro conventions, patterns match existing codebase
- Pitfalls: MEDIUM - Based on general UX research and web standards, not Astro-specific
- Code examples: HIGH - Astro examples from official docs, CSS from MDN, Formspree from official source

**Research date:** 2026-01-29
**Valid until:** ~60 days (Astro stable, form services stable, CSS standards stable)
