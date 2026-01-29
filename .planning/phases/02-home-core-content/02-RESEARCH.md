# Phase 2: Home & Core Content - Research

**Researched:** 2026-01-29
**Domain:** Single-page home layout, hero sections, product teasers, social links, page transitions & animations
**Confidence:** HIGH

## Summary

Phase 2 builds out the home page content for a single-page marketing site using Astro's native capabilities for animations and transitions. Research confirms that Astro's built-in View Transitions API provides zero-JavaScript page transitions, CSS-based hover effects are the performance standard in 2026, and Intersection Observer API is the modern approach for scroll-triggered animations.

For neo-brutalist hero sections, the standard approach emphasizes oversized typography, asymmetrical layouts, and bold contrast. Product teasers should use the existing Card component pattern with clear "coming soon" messaging. Social links to Bandcamp and SoundCloud are straightforward anchor links (not embeds at this phase) positioned prominently in the footer or a dedicated section.

The single-page structure benefits from CSS scroll snap for section navigation, smooth scrolling anchor links, and strategic use of Astro's client-side scripts for minimal interactive enhancements while keeping the core static.

**Primary recommendation:** Use Astro's ClientRouter component for view transitions, implement scroll animations with vanilla Intersection Observer, keep hover effects pure CSS using transform/opacity for performance, and structure content in clear sections with smooth anchor navigation.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro ClientRouter | Built-in | Page transitions & animations | Native zero-JS view transitions, browser fallback, prefers-reduced-motion support |
| Intersection Observer API | Native browser API | Scroll-triggered animations | Modern standard, performant, no external library needed |
| CSS Transitions | Native CSS | Hover effects | GPU-accelerated, zero JavaScript, smoothest performance |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Scroll Snap | Native CSS | Section snapping | Single-page sites with distinct content sections |
| scroll-behavior: smooth | Native CSS | Smooth anchor links | Navigation to page sections via anchor links |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Intersection Observer | Scroll event listeners | Scroll listeners drain performance; Intersection Observer is async and efficient |
| CSS transitions | JavaScript animation libraries (GSAP, Anime.js) | JS libraries add bundle size; CSS is sufficient for simple hover/fade effects |
| Astro View Transitions | Manual SPA routing | Manual routing is complex and error-prone; Astro handles it with zero config |

**Installation:**
```bash
# No installation needed - all features are native to Astro or browser APIs
# View Transitions are built into Astro
# Intersection Observer is a native browser API
# CSS transitions are native CSS
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   └── index.astro          # Single-page site with all sections
├── components/
│   ├── sections/            # NEW: Home page sections
│   │   ├── Hero.astro       # Hero section with brand/tagline
│   │   ├── ProductTeasers.astro  # Product preview cards
│   │   └── SocialLinks.astro     # Bandcamp/SoundCloud links
│   ├── ui/                  # Existing: Button, Card
│   └── common/              # Existing: Footer
├── layouts/
│   └── BaseLayout.astro     # Add ClientRouter for transitions
└── styles/
    ├── tokens.css           # Existing design tokens
    ├── global.css           # Existing global styles
    └── animations.css       # NEW: Scroll animation utilities
```

### Pattern 1: Single-Page Sections with Anchor Navigation
**What:** Organize content into semantic sections with IDs, provide smooth anchor navigation
**When to use:** Single-page sites with multiple content areas
**Example:**
```astro
---
// src/pages/index.astro
import Hero from '../components/sections/Hero.astro';
import ProductTeasers from '../components/sections/ProductTeasers.astro';
import SocialLinks from '../components/sections/SocialLinks.astro';
---
<BaseLayout title="Home">
  <section id="hero">
    <Hero />
  </section>

  <section id="products">
    <ProductTeasers />
  </section>

  <section id="connect">
    <SocialLinks />
  </section>
</BaseLayout>

<style>
  section {
    min-height: 100vh;
    scroll-margin-top: 2rem; /* Offset for fixed header if present */
  }
</style>
```

### Pattern 2: Astro View Transitions for Page Animations
**What:** Enable site-wide view transitions using Astro's ClientRouter component
**When to use:** All Astro sites wanting smooth page transitions with zero JavaScript
**Example:**
```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from "astro:transitions";
---
<html lang="en">
  <head>
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```
Source: https://docs.astro.build/en/guides/view-transitions/

### Pattern 3: Neo-Brutalist Hero Section
**What:** Bold, oversized typography with asymmetrical layout and high contrast
**When to use:** Hero/landing section for brand impact
**Example:**
```astro
---
// src/components/sections/Hero.astro
---
<div class="hero">
  <h1 class="brand">tuniice</h1>
  <p class="tagline">music. software. hardware.</p>
</div>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: var(--space-xl);
  }

  .brand {
    font-family: var(--font-heading);
    font-size: clamp(3rem, 12vw, 8rem); /* Responsive oversized type */
    font-weight: 900;
    line-height: 1;
    color: var(--color-text);
    margin-bottom: var(--space-md);
    text-transform: lowercase; /* Neo-brutalist all-lowercase trend */
  }

  .tagline {
    font-family: var(--font-body);
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: var(--color-text-muted);
    letter-spacing: 0.2em;
  }
</style>
```

### Pattern 4: Scroll-Triggered Fade-In Animations
**What:** Use Intersection Observer to add classes when elements enter viewport
**When to use:** Fade-in, slide-up effects on cards/sections as user scrolls
**Example:**
```astro
---
// In any component with animation needs
---
<div class="fade-in-on-scroll">
  <!-- Content here -->
</div>

<style>
  .fade-in-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .fade-in-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<script>
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    observer.observe(el);
  });
</script>
```
Source: Multiple Intersection Observer tutorials from web search

### Pattern 5: Performance-Optimized Hover Effects
**What:** CSS transitions on transform and opacity properties only (GPU-accelerated)
**When to use:** All interactive elements (buttons, cards, links)
**Example:**
```css
/* Good - GPU-accelerated properties */
.card {
  transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translate(-2px, -2px); /* Already in use on Button/Card */
  box-shadow: 6px 6px 0 var(--color-accent);
}

/* Avoid - triggers layout recalculation */
/* width, height, margin, padding on hover */
```
Source: https://www.joshwcomeau.com/animation/css-transitions/

### Pattern 6: Product Teaser Cards
**What:** Use existing Card component with "Coming Soon" content and optional links
**When to use:** Showcasing upcoming products/apps
**Example:**
```astro
---
// src/components/sections/ProductTeasers.astro
import Card from '../ui/Card.astro';
---
<div class="product-teasers">
  <h2>What's Coming</h2>
  <div class="grid">
    <Card accent="primary">
      <h3>iOS Apps</h3>
      <p>Music creation tools coming soon</p>
    </Card>
    <Card accent="secondary">
      <h3>Hardware</h3>
      <p>Physical devices in development</p>
    </Card>
    <Card accent="amber">
      <h3>Web Tools</h3>
      <p>Online utilities launching soon</p>
    </Card>
  </div>
</div>

<style>
  .product-teasers {
    padding: var(--space-2xl) var(--space-md);
  }

  h2 {
    font-size: var(--font-2xl);
    margin-bottom: var(--space-xl);
    text-align: center;
  }

  .grid {
    display: grid;
    gap: var(--space-lg);
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
```

### Pattern 7: Social Links Component
**What:** Simple anchor links to Bandcamp and SoundCloud with neo-brutalist button styling
**When to use:** Footer or dedicated section for external music links
**Example:**
```astro
---
// src/components/sections/SocialLinks.astro
import Button from '../ui/Button.astro';
---
<div class="social-links">
  <h2>Listen</h2>
  <div class="links-grid">
    <Button href="https://bandcamp.com/tuniice" variant="primary" size="lg">
      Bandcamp
    </Button>
    <Button href="https://soundcloud.com/tuniice" variant="secondary" size="lg">
      SoundCloud
    </Button>
  </div>
</div>

<style>
  .social-links {
    padding: var(--space-2xl) var(--space-md);
    text-align: center;
  }

  h2 {
    font-size: var(--font-2xl);
    margin-bottom: var(--space-xl);
  }

  .links-grid {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
```

### Pattern 8: Smooth Scroll with CSS
**What:** Enable smooth scrolling for anchor link navigation
**When to use:** Single-page sites with section anchors
**Example:**
```css
/* src/styles/global.css */
html {
  scroll-behavior: smooth;
}

/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### Anti-Patterns to Avoid
- **Heavy JavaScript animation libraries for simple effects:** CSS and Intersection Observer cover 95% of needs; GSAP/Anime.js add unnecessary bundle size
- **Animating width/height/margin on hover:** These trigger expensive layout recalculations; use transform/opacity instead
- **Scroll event listeners for animation triggers:** Use Intersection Observer instead for better performance
- **Auto-playing embedded media on load:** Bandcamp/SoundCloud embeds should be click-to-play, not auto-play
- **Complex multi-step animations on first load:** Keep initial page load simple; add animations on interaction/scroll

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page transitions between routes | Custom fade/slide animations | Astro ClientRouter | Handles browser fallback, reduced-motion, and all edge cases |
| Scroll animation triggers | Custom scroll position calculation | Intersection Observer API | Async, performant, no scroll event overhead |
| Smooth anchor navigation | Manual scrollIntoView with easing | scroll-behavior: smooth CSS | Native, respects prefers-reduced-motion, zero JS |
| Responsive typography | Manual media query breakpoints | CSS clamp() function | Fluid scaling between min/max with viewport units |
| Music embeds at this phase | Full Bandcamp/SoundCloud players | Simple anchor links | Embeds add complexity/load time; links suffice for Phase 2 |

**Key insight:** Modern CSS and browser APIs (View Transitions, Intersection Observer, scroll-behavior, clamp()) eliminate most animation needs. Libraries like GSAP are overkill for marketing page hover/fade/scroll effects. Astro's zero-JavaScript philosophy means preferring native solutions over imported dependencies.

## Common Pitfalls

### Pitfall 1: View Transitions Not Re-Initializing Scripts
**What goes wrong:** After client-side navigation via View Transitions, event listeners stop working (e.g., hamburger menu clicks)
**Why it happens:** JavaScript runs on initial load but not after view transition navigations; DOM is swapped but scripts don't re-run
**How to avoid:** Wrap event listener setup in `astro:page-load` event listener to re-initialize after transitions
**Warning signs:** Interactive elements work on first page load but break after navigation

**Example:**
```javascript
// BAD - only runs on initial load
document.querySelector('.hamburger').addEventListener('click', handler);

// GOOD - runs on initial load AND after view transitions
document.addEventListener('astro:page-load', () => {
  document.querySelector('.hamburger').addEventListener('click', handler);
});
```
Source: https://docs.astro.build/en/guides/view-transitions/

### Pitfall 2: Animating Expensive CSS Properties
**What goes wrong:** Hover effects feel janky or cause visible layout shifts
**Why it happens:** Animating width, height, margin, or padding triggers layout recalculation and repaint on every frame
**How to avoid:** Only animate transform, opacity, and box-shadow (GPU-accelerated properties)
**Warning signs:** Hover effects lag on lower-end devices, DevTools shows layout/paint warnings

### Pitfall 3: Scroll Listeners for Animation Triggers
**What goes wrong:** Scroll animations drain battery, feel sluggish, block main thread
**Why it happens:** Scroll events fire continuously, running logic on every pixel scrolled
**How to avoid:** Use Intersection Observer which fires only when element enters/leaves viewport
**Warning signs:** Janky scrolling, high CPU usage in DevTools during scroll

### Pitfall 4: Missing prefers-reduced-motion Checks
**What goes wrong:** Users with motion sensitivity get disoriented by animations
**Why it happens:** Forgetting to respect OS-level accessibility setting
**How to avoid:** Wrap animations in `@media (prefers-reduced-motion: no-preference)` or disable in Astro
**Warning signs:** Accessibility audit flags motion without reduced-motion fallback

**Example:**
```css
.fade-in-on-scroll {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-on-scroll {
    transition: none; /* Instant appearance */
  }
}
```

### Pitfall 5: Over-Complicating Single-Page Navigation
**What goes wrong:** Building custom scroll-to-section logic with smooth scrolling math
**Why it happens:** Not knowing about scroll-behavior: smooth CSS property
**How to avoid:** Use native `scroll-behavior: smooth` on html element, let browser handle it
**Warning signs:** Complex JavaScript for what should be a one-line CSS fix

### Pitfall 6: Embedding Full Media Players Too Early
**What goes wrong:** Adding Bandcamp/SoundCloud iframes in Phase 2 increases page load time significantly
**Why it happens:** Thinking embeds are required for social links
**How to avoid:** Phase 2 only needs clickable links; save full embeds for Phase 4 (Music page)
**Warning signs:** Slow page load metrics, Core Web Vitals warnings

### Pitfall 7: Forgetting Scroll Margin for Fixed Headers
**What goes wrong:** Anchor links scroll content under fixed header, hiding top of section
**Why it happens:** Fixed headers overlap content when scrolling to anchor
**How to avoid:** Add `scroll-margin-top` or `scroll-padding-top` to account for header height
**Warning signs:** Section content partially hidden after clicking anchor links

**Example:**
```css
section {
  scroll-margin-top: 80px; /* Height of fixed header */
}

/* OR on scroll container */
html {
  scroll-padding-top: 80px;
}
```

### Pitfall 8: Not Testing on Mobile Touch Devices
**What goes wrong:** Hover effects activate on tap and "stick" until another element is tapped
**Why it happens:** Touch devices have no true hover state; :hover triggers on touch
**How to avoid:** Use `@media (hover: hover)` to target devices with pointer hover capability, provide tap alternatives
**Warning signs:** Buttons stay in hover state after tap on mobile

## Code Examples

Verified patterns from official sources:

### Enable View Transitions Site-Wide
```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from "astro:transitions";
import '../styles/tokens.css';
import '../styles/global.css';

const { title } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} | tuniice</title>
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```
Source: https://docs.astro.build/en/guides/view-transitions/

### Custom View Transition Animation
```astro
---
// Define custom transition for specific element
const customFade = {
  old: {
    name: 'fade',
    duration: '0.3s',
    easing: 'ease-out',
  },
  new: {
    name: 'fade',
    duration: '0.3s',
    easing: 'ease-in',
  },
};
---
<main transition:animate={customFade}>
  <slot />
</main>

<style is:global>
  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
```
Source: https://docs.astro.build/en/guides/view-transitions/

### Intersection Observer Scroll Animations
```astro
---
// Any component with scroll-triggered animation
---
<div class="animate-on-scroll" data-animate>
  <slot />
</div>

<style>
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .animate-on-scroll {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>

<script>
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optionally unobserve after animating once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
</script>
```

### Smooth Scrolling with Anchor Links
```css
/* src/styles/global.css */
html {
  scroll-behavior: smooth;
}

/* Offset for fixed header */
section {
  scroll-margin-top: 2rem;
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### Neo-Brutalist Hero with Responsive Typography
```astro
---
// src/components/sections/Hero.astro
---
<div class="hero">
  <h1 class="brand">tuniice</h1>
  <p class="tagline">music. software. hardware.</p>
</div>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-xl) var(--space-md);
    text-align: center;
  }

  .brand {
    font-family: var(--font-heading);
    font-size: clamp(3rem, 12vw, 8rem);
    font-weight: 900;
    line-height: 1;
    color: var(--color-text);
    text-transform: lowercase;
    letter-spacing: -0.02em;
  }

  .tagline {
    font-family: var(--font-body);
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: var(--color-text-muted);
    letter-spacing: 0.2em;
    text-transform: lowercase;
  }
</style>
```

### Product Teaser Grid
```astro
---
// src/components/sections/ProductTeasers.astro
import Card from '../ui/Card.astro';
---
<section id="products" class="product-section">
  <h2>Coming Soon</h2>
  <div class="product-grid">
    <Card accent="primary" data-animate>
      <h3>iOS Apps</h3>
      <p>Music creation tools in development</p>
    </Card>
    <Card accent="secondary" data-animate>
      <h3>Hardware</h3>
      <p>Physical devices coming soon</p>
    </Card>
    <Card accent="amber" data-animate>
      <h3>Web Tools</h3>
      <p>Online utilities launching soon</p>
    </Card>
  </div>
</section>

<style>
  .product-section {
    padding: var(--space-2xl) var(--space-md);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h2 {
    font-family: var(--font-heading);
    font-size: var(--font-2xl);
    font-weight: 900;
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .product-grid {
    display: grid;
    gap: var(--space-lg);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  @media (min-width: 768px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Stagger animation delay for grid items */
  .product-grid :global(.card:nth-child(1)) {
    transition-delay: 0.1s;
  }
  .product-grid :global(.card:nth-child(2)) {
    transition-delay: 0.2s;
  }
  .product-grid :global(.card:nth-child(3)) {
    transition-delay: 0.3s;
  }
</style>
```

### Social Links Section
```astro
---
// src/components/sections/SocialLinks.astro
import Button from '../ui/Button.astro';
---
<section id="connect" class="social-section">
  <h2>Connect</h2>
  <div class="social-grid">
    <Button
      href="https://bandcamp.com/tuniice"
      variant="primary"
      size="lg"
    >
      Bandcamp
    </Button>
    <Button
      href="https://soundcloud.com/tuniice"
      variant="secondary"
      size="lg"
    >
      SoundCloud
    </Button>
  </div>
</section>

<style>
  .social-section {
    padding: var(--space-2xl) var(--space-md);
    text-align: center;
  }

  h2 {
    font-family: var(--font-heading);
    font-size: var(--font-2xl);
    font-weight: 900;
    margin-bottom: var(--space-xl);
  }

  .social-grid {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery plugins for scroll effects | Intersection Observer API | 2019+ (browser support reached critical mass) | Zero dependencies, better performance, native browser support |
| JavaScript animation libraries for simple effects | CSS transitions + transform/opacity | Ongoing shift to CSS-first | Smaller bundles, GPU acceleration, better mobile performance |
| Manual SPA routing | Astro View Transitions | Astro 2.9+ (2023) | Zero-JavaScript page transitions with browser fallback |
| scroll event listeners | Intersection Observer | 2016+ (API standardized) | Async, non-blocking, massive performance improvement |
| Fixed viewport-unit typography | CSS clamp() | 2020+ (broad browser support) | Fluid responsive text without media queries |
| JavaScript smooth scroll libraries | scroll-behavior: smooth CSS | 2018+ (Safari support added 2022) | Native, respects prefers-reduced-motion, zero JS |

**Deprecated/outdated:**
- jQuery animate() for scroll effects: Use Intersection Observer instead
- ScrollMagic/GSAP for simple fade-in animations: CSS + Intersection Observer covers this
- Libraries like AOS (Animate On Scroll): Native Intersection Observer + CSS is simpler and lighter
- JavaScript-based smooth scrolling: CSS scroll-behavior is now universal

## Open Questions

Things that couldn't be fully resolved:

1. **Exact product teaser content**
   - What we know: Cards should say "coming soon" and hint at iOS apps, hardware, web tools
   - What's unclear: Specific product names, descriptions, or imagery (not available yet)
   - Recommendation: Use placeholder content ("iOS Apps," "Hardware," "Web Tools") with generic descriptions; update later when products are ready

2. **Social link URLs**
   - What we know: Links should point to Bandcamp and SoundCloud profiles
   - What's unclear: Actual URLs (tuniice profiles may not exist yet)
   - Recommendation: Use placeholder hrefs (https://bandcamp.com/tuniice, https://soundcloud.com/tuniice); update with real URLs when accounts are created

3. **Scroll animation timing**
   - What we know: Intersection Observer threshold 0.1-0.2 and rootMargin for early triggering are standard
   - What's unclear: Optimal timing for this specific brand aesthetic
   - Recommendation: Start with 0.15 threshold, -10% rootMargin, 0.6s duration; adjust based on feel during implementation

4. **Light mode vs dark mode tension**
   - What we know: Current design is dark mode neo-brutalism; there's a pending todo to switch to light-mode neo-brutalism
   - What's unclear: Whether Phase 2 should implement current dark mode or wait for light mode redesign
   - Recommendation: Implement Phase 2 in current dark mode per existing design tokens; treat light mode switch as a separate phase/task to avoid blocking progress

5. **Section scroll snap behavior**
   - What we know: CSS scroll-snap-type can create full-viewport section snapping
   - What's unclear: Whether this feels too restrictive for content browsing
   - Recommendation: Implement smooth scrolling but NOT scroll snap initially; add scroll snap later if desired after user testing

## Sources

### Primary (HIGH confidence)
- Astro Official Documentation via Context7: `/withastro/docs` - View Transitions, ClientRouter, client-side scripts, animation patterns
- MDN Web Docs: CSS Scroll Snap, scroll-behavior, Intersection Observer API - https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap
- Josh W. Comeau: CSS Transitions Interactive Guide - https://www.joshwcomeau.com/animation/css-transitions/

### Secondary (MEDIUM confidence)
- [Neobrutalism: Definition and Best Practices - NN/G](https://www.nngroup.com/articles/neobrutalism/) - Neo-brutalist design principles, typography, hero sections
- [Hero Section Design: Best Practices & Examples for 2026](https://www.perfectafternoon.com/2025/hero-section-design/) - Hero section structure, typography trends
- [View Transitions in Astro - Astro Docs](https://docs.astro.build/en/guides/view-transitions/) - Official Astro View Transitions guide
- [Animate on scroll with the Intersection Observer API](https://medium.com/@cgustin/animate-on-scroll-with-the-intersection-observer-api-ad368d91ebab) - Intersection Observer patterns
- [5 Best Practices for Single-Page UX Design](https://designmodo.com/ux-single-page-websites/) - Single-page layout patterns
- [Web Layout Best Practices – 12 Timeless UI Patterns](https://www.toptal.com/designers/ui/web-layout-best-practices) - Content section organization
- [Mastering CSS Scroll Snap](https://medium.com/@canozcannn/mastering-css-scroll-snap-smooth-vertical-and-horizontal-experiences-without-javascript-4cd8c03285e7) - Scroll snap implementation
- [Bandcamp Artist Guide](https://bandcamp.com/guide) - Bandcamp embedding and linking best practices
- [Squarespace for Musicians 2026](https://www.sitebuilderreport.com/squarespace-for-musicians) - Music platform embeds and links

### Tertiary (LOW confidence)
- None - all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Astro documentation, native browser APIs with wide support
- Architecture patterns: HIGH - Verified Astro patterns from Context7 and official docs
- Animation techniques: HIGH - MDN, Josh Comeau, official Intersection Observer spec
- Neo-brutalist design patterns: MEDIUM - Multiple design sources agree on principles, but aesthetic is subjective
- Single-page layout: MEDIUM - Industry best practices, but implementation varies by use case
- Music platform integration: MEDIUM - Official platform docs, but specific UX choices vary

**Research date:** 2026-01-29
**Valid until:** 30 days (2026-02-28) - Stable ecosystem; browser APIs and Astro patterns evolve slowly
