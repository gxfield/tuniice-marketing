# Phase 1: Foundation - Research

**Researched:** 2026-01-28
**Domain:** Astro static site generator, design systems, neo-brutalist styling
**Confidence:** HIGH

## Summary

Phase 1 establishes the technical foundation for a neo-brutalist marketing site using Astro as the static site generator, deployed to Vercel. Research confirms Astro is ideal for content-focused static sites with its zero-JavaScript-by-default philosophy and excellent developer experience. The neo-brutalist aesthetic requires specific CSS patterns (hard shadows, thick borders, bold typography) that map well to CSS custom properties for a design token system.

The standard approach is to scaffold Astro with `npm create astro@latest`, establish a design token system using CSS variables in a global stylesheet, build reusable components in `src/components/`, and deploy to Vercel with zero configuration for static sites. For the neo-brutalist aesthetic, the key is implementing solid offset shadows (not blurred), thick borders, and bold typography with high contrast.

**Primary recommendation:** Use Astro's native features (scoped styles, CSS variables via `define:vars`, layout components) rather than external CSS frameworks. Establish design tokens as CSS custom properties early, organize components by type (layout/ui), and leverage Astro's static-first approach for maximum performance.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | Latest (v4+) | Static site generator | Industry-standard for content-focused static sites, zero JS by default, excellent DX |
| Node.js | 18+ | Runtime | Required for Astro, LTS versions recommended |
| Vercel CLI | Latest | Deployment | Official Vercel integration, zero-config for static sites |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/vercel | Latest | Vercel adapter | Only needed if using Vercel-specific features (analytics, image optimization); not required for static sites |
| Bunny Fonts | N/A | Web fonts | Privacy-first alternative to Google Fonts, GDPR compliant, API-compatible |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Bunny Fonts | Google Fonts | Google Fonts has wider selection but privacy concerns; Bunny Fonts is API-compatible drop-in replacement |
| Manual CSS | Tailwind CSS | Tailwind adds build complexity and utility-class bloat; manual CSS with design tokens is simpler for this scope |
| Style Dictionary | Manual CSS variables | Style Dictionary adds tooling overhead; hand-authored CSS variables sufficient for this project size |

**Installation:**
```bash
# Create new Astro project
npm create astro@latest

# Or with specific template
npm create astro@latest -- --template minimal

# For Vercel deployment (optional, only if using Vercel-specific features)
npx astro add vercel
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── layouts/          # Layout components (BaseLayout.astro)
├── components/       # Reusable UI components
│   ├── nav/         # Navigation components (Header.astro, HamburgerMenu.astro)
│   ├── ui/          # UI primitives (Button.astro, Card.astro)
│   └── common/      # Shared components (Footer.astro)
├── pages/           # Route pages (index.astro, about.astro, etc.)
├── styles/          # Global styles and design tokens
│   ├── tokens.css   # Design token definitions (CSS custom properties)
│   └── global.css   # Global styles and resets
└── assets/          # Images, fonts (processed by Astro)
public/
└── fonts/           # Self-hosted fonts (not processed)
```

### Pattern 1: Design Token System with CSS Custom Properties
**What:** Define design decisions (colors, spacing, typography) as CSS variables in `:root`, then reference throughout components.
**When to use:** All styling should reference tokens, never hard-coded values.
**Example:**
```css
/* src/styles/tokens.css */
:root {
  /* Colors */
  --color-bg: #0a0a0a;
  --color-text: #ffffff;
  --color-accent: #00ff41;
  --color-accent-warm: #ff6b35;

  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Space Mono', monospace;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 3rem;

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;

  /* Neo-brutalist specific */
  --border-thick: 3px;
  --shadow-offset: 4px;
  --shadow-color: var(--color-accent);
}
```

### Pattern 2: Neo-Brutalist Hard Shadows
**What:** Solid, offset box shadows (no blur) create the signature neo-brutalist "floating" effect.
**When to use:** Cards, buttons, and interactive elements.
**Example:**
```css
/* Hard shadow pattern - offset down-right */
.card {
  border: var(--border-thick) solid var(--color-text);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
  background: var(--color-bg);
}

/* Hover state - lift effect */
.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--shadow-color);
}
```

### Pattern 3: Astro Layout Component with Slot
**What:** Base layout provides HTML shell and common elements, pages inject content via `<slot />`.
**When to use:** All pages should use a layout for consistency.
**Example:**
```astro
---
// src/layouts/BaseLayout.astro
import '../styles/tokens.css';
import '../styles/global.css';

const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title} | tuniice</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 4: Scoped Component Styles
**What:** Astro automatically scopes styles to components, preventing conflicts.
**When to use:** Component-specific styles that don't need to be global.
**Example:**
```astro
---
// src/components/ui/Button.astro
const { variant = 'primary' } = Astro.props;
---
<button class={`btn btn-${variant}`}>
  <slot />
</button>

<style>
  .btn {
    padding: var(--space-sm) var(--space-lg);
    border: var(--border-thick) solid var(--color-text);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-weight: 700;
    cursor: pointer;
    box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-accent);
    transition: all 0.2s ease;
  }

  .btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--color-accent);
  }

  .btn-secondary {
    box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-accent-warm);
  }
</style>
```

### Pattern 5: Mobile-First Responsive Breakpoints
**What:** Start with mobile styles, enhance for larger screens using `min-width` media queries.
**When to use:** All layout and component styles.
**Example:**
```css
/* Mobile-first approach */
.container {
  padding: var(--space-sm);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--space-lg);
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-xl);
    max-width: 1200px;
  }
}
```

### Pattern 6: Accessible Hamburger Menu
**What:** Keyboard-accessible navigation toggle with proper ARIA attributes.
**When to use:** Mobile navigation.
**Example:**
```astro
---
// src/components/nav/HamburgerMenu.astro
---
<button
  class="hamburger"
  aria-label="Toggle navigation menu"
  aria-expanded="false"
  aria-controls="nav-menu"
>
  <span class="hamburger-icon" aria-hidden="true"></span>
</button>

<nav id="nav-menu" role="navigation" aria-label="Main navigation" hidden>
  <slot />
</nav>

<script>
  const button = document.querySelector('.hamburger');
  const menu = document.querySelector('#nav-menu');

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    menu.hidden = expanded;
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      button.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      button.focus();
    }
  });
</script>
```

### Anti-Patterns to Avoid
- **Blurred shadows on neo-brutalist designs:** Use hard, offset shadows only (no blur radius)
- **Client-side hydration for static content:** Avoid `client:load` unless absolutely necessary; Astro defaults to zero JS
- **Device-specific breakpoints:** Use content-driven breakpoints, not fixed device widths
- **Importing entire icon libraries:** Self-host only the icons you need
- **Using `is:global` everywhere:** Scope styles to components by default, use global sparingly

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading optimization | Custom font-face with manual FOUT handling | Bunny Fonts or Google Fonts API | Handles FOIT/FOUT, subsetting, format selection automatically |
| Responsive navigation state | Custom event emitters and state management | Native HTML + ARIA + vanilla JS | Screen readers need proper ARIA; framework state is overkill |
| Image optimization | Manual srcset generation | Astro Image component | Handles responsive images, format conversion, lazy loading |
| CSS reset/normalization | Writing from scratch | Modern CSS Reset (e.g., Josh Comeau's) | Edge cases are hard (box-sizing inheritance, form elements, etc.) |
| Design token transformation | Custom build scripts | CSS custom properties (simple) or Style Dictionary (complex) | Token transformation has edge cases (color math, responsive values) |

**Key insight:** Static site generation has matured significantly. Hand-rolling solutions for fonts, images, or component hydration ignores years of edge-case handling. Astro's built-in features (Image component, scoped styles, partial hydration) are battle-tested. For design tokens, CSS custom properties are sufficient for this project's scope—adding Style Dictionary or token build tools would be premature optimization.

## Common Pitfalls

### Pitfall 1: Installing Vercel Adapter for Static Sites
**What goes wrong:** Developers install `@astrojs/vercel` adapter thinking it's required for Vercel deployment.
**Why it happens:** Confusion between static sites and on-demand rendering. The adapter is prominently mentioned in docs.
**How to avoid:** Astro projects are static by default (`output: 'static'`). Vercel adapter is only needed for server-side rendering or Vercel-specific features (analytics, image optimization). Static sites deploy with zero config.
**Warning signs:** Build includes adapter when you only need static HTML.

### Pitfall 2: Scoped Styles Don't Apply to Slotted Content
**What goes wrong:** Styles in a component don't affect content passed via `<slot />`.
**Why it happens:** Astro's style scoping only affects elements in the component template, not slotted content.
**How to avoid:** Use `is:global` for styles that need to affect slotted content, or pass classes as props.
**Warning signs:** Slot content appears unstyled despite component having styles.

### Pitfall 3: Hard-Coding Values Instead of Design Tokens
**What goes wrong:** Using `color: #00ff41` directly in component styles instead of `var(--color-accent)`.
**Why it happens:** Faster to hard-code during prototyping.
**How to avoid:** Establish token system first, enforce usage through code review or linting.
**Warning signs:** Difficulty making global style changes, inconsistent values across components.

### Pitfall 4: Non-Accessible Hamburger Menus
**What goes wrong:** Hamburger menu works with mouse but fails with keyboard or screen readers.
**Why it happens:** Missing ARIA attributes, no keyboard event handlers, incorrect semantic HTML.
**How to avoid:** Use `<button>` (not `<div>`), add `aria-expanded`, `aria-controls`, `aria-label`, handle Escape key.
**Warning signs:** Can't navigate menu with Tab/Enter/Escape, screen reader doesn't announce state.

### Pitfall 5: Mobile-Last Responsive Design
**What goes wrong:** Desktop styles defined first, then overridden for mobile using `max-width` media queries.
**Why it happens:** Designing desktop-first out of habit.
**How to avoid:** Always use mobile-first approach with `min-width` queries. Smaller CSS payload, simpler overrides.
**Warning signs:** Complex cascade of overrides, large CSS for mobile devices.

### Pitfall 6: Importing Components Incorrectly
**What goes wrong:** Using wrong import paths for components, especially after refactoring folder structure.
**Why it happens:** Relative imports can break when moving files.
**How to avoid:** Use consistent relative imports or configure path aliases in `tsconfig.json`.
**Warning signs:** Build errors about missing component imports.

### Pitfall 7: Forgetting to Import Global Styles
**What goes wrong:** Design tokens defined but not imported, components lack styling.
**Why it happens:** Global styles must be explicitly imported in layout or pages.
**How to avoid:** Import `tokens.css` and `global.css` in BaseLayout frontmatter.
**Warning signs:** CSS custom properties undefined, fallback values used.

### Pitfall 8: Neo-Brutalist Shadows with Blur Radius
**What goes wrong:** Using `box-shadow: 4px 4px 8px rgba(0,0,0,0.3)` instead of hard shadows.
**Why it happens:** Muscle memory from traditional shadow patterns.
**How to avoid:** Neo-brutalist shadows have NO blur radius: `box-shadow: 4px 4px 0 #00ff41`.
**Warning signs:** Soft, subtle shadows instead of bold, graphic effect.

## Code Examples

Verified patterns from official sources:

### Creating New Astro Project
```bash
# Interactive setup (recommended)
npm create astro@latest

# Minimal template
npm create astro@latest -- --template minimal

# Install dependencies
npm install

# Start dev server
npm run dev
```
Source: Astro official documentation via Context7

### Design Token System
```css
/* src/styles/tokens.css */
:root {
  /* Foundation colors */
  --color-bg-base: #0a0a0a;
  --color-text-base: #ffffff;

  /* Accent colors */
  --color-accent-neon: #00ff41;
  --color-accent-amber: #ffbf00;
  --color-accent-orange: #ff6b35;

  /* Semantic tokens */
  --color-bg: var(--color-bg-base);
  --color-text: var(--color-text-base);
  --color-primary: var(--color-accent-neon);
  --color-secondary: var(--color-accent-amber);

  /* Typography scale */
  --font-base: 16px;
  --font-scale: 1.25; /* Major third */
  --font-xs: calc(var(--font-base) / var(--font-scale));
  --font-sm: var(--font-base);
  --font-md: calc(var(--font-base) * var(--font-scale));
  --font-lg: calc(var(--font-md) * var(--font-scale));
  --font-xl: calc(var(--font-lg) * var(--font-scale));
  --font-2xl: calc(var(--font-xl) * var(--font-scale));
  --font-3xl: calc(var(--font-2xl) * var(--font-scale));

  /* Spacing scale (based on 8px grid) */
  --space-base: 0.5rem; /* 8px */
  --space-xs: var(--space-base); /* 8px */
  --space-sm: calc(var(--space-base) * 2); /* 16px */
  --space-md: calc(var(--space-base) * 3); /* 24px */
  --space-lg: calc(var(--space-base) * 4); /* 32px */
  --space-xl: calc(var(--space-base) * 6); /* 48px */
  --space-2xl: calc(var(--space-base) * 8); /* 64px */

  /* Neo-brutalist visual tokens */
  --border-width: 3px;
  --shadow-offset-sm: 2px;
  --shadow-offset-md: 4px;
  --shadow-offset-lg: 6px;
}
```

### Neo-Brutalist Button Component
```astro
---
// src/components/ui/Button.astro
export interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const { variant = 'primary', size = 'md' } = Astro.props;
---
<button class={`btn btn-${variant} btn-${size}`}>
  <slot />
</button>

<style>
  .btn {
    display: inline-block;
    padding: var(--space-sm) var(--space-lg);
    border: var(--border-width) solid var(--color-text);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: var(--font-md);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: var(--shadow-offset-md) var(--shadow-offset-md) 0 var(--color-primary);
  }

  .btn:hover,
  .btn:focus-visible {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-offset-lg) var(--shadow-offset-lg) 0 var(--color-primary);
  }

  .btn:active {
    transform: translate(0, 0);
    box-shadow: var(--shadow-offset-sm) var(--shadow-offset-sm) 0 var(--color-primary);
  }

  .btn-secondary {
    box-shadow: var(--shadow-offset-md) var(--shadow-offset-md) 0 var(--color-secondary);
  }

  .btn-secondary:hover,
  .btn-secondary:focus-visible {
    box-shadow: var(--shadow-offset-lg) var(--shadow-offset-lg) 0 var(--color-secondary);
  }

  .btn-sm {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--font-sm);
  }

  .btn-lg {
    padding: var(--space-md) var(--space-xl);
    font-size: var(--font-lg);
  }
</style>
```

### Responsive Card Component
```astro
---
// src/components/ui/Card.astro
---
<article class="card">
  <slot />
</article>

<style>
  .card {
    padding: var(--space-md);
    border: var(--border-width) solid var(--color-text);
    background: var(--color-bg);
    box-shadow: var(--shadow-offset-md) var(--shadow-offset-md) 0 var(--color-primary);
  }

  @media (min-width: 768px) {
    .card {
      padding: var(--space-lg);
    }
  }
</style>
```

### Accessible Navigation with Hamburger Menu
```astro
---
// src/components/nav/Header.astro
---
<header class="header">
  <div class="container">
    <a href="/" class="logo">tuniice</a>

    <button
      class="hamburger"
      aria-label="Toggle navigation menu"
      aria-expanded="false"
      aria-controls="main-nav"
    >
      <span class="hamburger-line" aria-hidden="true"></span>
      <span class="hamburger-line" aria-hidden="true"></span>
      <span class="hamburger-line" aria-hidden="true"></span>
    </button>

    <nav id="main-nav" class="nav" role="navigation" aria-label="Main navigation" hidden>
      <ul class="nav-list">
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/music">Music</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </div>
</header>

<style>
  .header {
    padding: var(--space-md) 0;
    border-bottom: var(--border-width) solid var(--color-text);
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--space-md);
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo {
    font-family: var(--font-heading);
    font-size: var(--font-xl);
    font-weight: 900;
    color: var(--color-primary);
    text-decoration: none;
    text-transform: uppercase;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--space-xs);
    border: var(--border-width) solid var(--color-text);
    background: var(--color-bg);
    cursor: pointer;
  }

  .hamburger-line {
    width: 24px;
    height: 3px;
    background: var(--color-text);
    transition: transform 0.2s ease;
  }

  .hamburger[aria-expanded="true"] .hamburger-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .hamburger[aria-expanded="true"] .hamburger-line:nth-child(2) {
    opacity: 0;
  }

  .hamburger[aria-expanded="true"] .hamburger-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .nav {
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    padding: var(--space-xl) var(--space-md);
    background: var(--color-bg);
    border-left: var(--border-width) solid var(--color-text);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .nav:not([hidden]) {
    transform: translateX(0);
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-list a {
    font-family: var(--font-body);
    font-size: var(--font-lg);
    font-weight: 700;
    color: var(--color-text);
    text-decoration: none;
    text-transform: uppercase;
  }

  .nav-list a:hover {
    color: var(--color-primary);
  }

  @media (min-width: 768px) {
    .hamburger {
      display: none;
    }

    .nav {
      position: static;
      width: auto;
      height: auto;
      padding: 0;
      background: transparent;
      border: none;
      transform: none;
    }

    .nav[hidden] {
      display: block;
    }

    .nav-list {
      flex-direction: row;
      gap: var(--space-lg);
    }

    .nav-list a {
      font-size: var(--font-md);
    }
  }
</style>

<script>
  const button = document.querySelector('.hamburger') as HTMLButtonElement;
  const nav = document.querySelector('#main-nav') as HTMLElement;

  button?.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    nav.hidden = expanded;
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && !nav.hidden) {
      button.setAttribute('aria-expanded', 'false');
      nav.hidden = true;
      button.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.hidden && !nav.contains(e.target as Node) && !button.contains(e.target as Node)) {
      button.setAttribute('aria-expanded', 'false');
      nav.hidden = true;
    }
  });
</script>
```

### Loading Web Fonts (Bunny Fonts)
```html
<!-- In BaseLayout.astro <head> -->
<link rel="preconnect" href="https://fonts.bunny.net">
<link href="https://fonts.bunny.net/css?family=space-grotesk:700,900|space-mono:400,700" rel="stylesheet" />
```

Alternative fonts for neo-brutalist aesthetic:
- **Headings:** Space Grotesk, Archivo Black, Plus Jakarta Sans, Work Sans, Darker Grotesque, Barlow (DIN alternative)
- **Body/Code:** Space Mono, Roboto Mono, Inconsolata, IBM Plex Mono

Source: Multiple web searches on neo-brutalist typography and Google Fonts 2026

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Global CSS files imported everywhere | Scoped component styles in Astro | Astro v1.0 (2022) | Eliminates style conflicts, better code splitting |
| Client-side rendering | Static generation + selective hydration | Astro v1.0 (2022) | Faster load times, better SEO, smaller JS bundles |
| Tailwind for all projects | Utility CSS vs semantic CSS based on project | Ongoing debate | Simple projects benefit from semantic CSS + tokens |
| `max-width` media queries | `min-width` mobile-first queries | Long-standing best practice | Smaller mobile CSS payload |
| Device-specific breakpoints (375px, 414px) | Content-driven breakpoints (when layout breaks) | Design evolution | More maintainable, future-proof |
| Soft box shadows with blur | Hard offset shadows for neo-brutalism | Neo-brutalist trend (2020+) | Defines the aesthetic |

**Deprecated/outdated:**
- Vercel adapter for static sites: Only needed for SSR or Vercel-specific features; static sites deploy with zero config
- jQuery for DOM manipulation: Modern vanilla JS is sufficient and performs better
- Autoprefixer for all CSS: Modern browsers have good CSS support; only needed for specific legacy support
- Heavy JavaScript frameworks for static content: Astro's island architecture makes this unnecessary

## Open Questions

Things that couldn't be fully resolved:

1. **Specific font pairing for neo-brutalist aesthetic**
   - What we know: Space Grotesk, Space Mono, Archivo Black, Plus Jakarta Sans are popular; bold sans-serif for headings, monospace for body is the pattern
   - What's unclear: Best specific pairing from free options (Google/Bunny Fonts)
   - Recommendation: Space Grotesk (headings) + Space Mono (body) as starting point; evaluate visually during implementation

2. **Animation/transition strategy**
   - What we know: Neo-brutalism can include subtle transitions (hover states) but should avoid complex animations
   - What's unclear: Exact timing, easing functions for brand consistency
   - Recommendation: Start with simple `transition: all 0.15s ease` on interactive elements; refine based on feel

3. **Exact breakpoint values**
   - What we know: Mobile-first, content-driven breakpoints preferred; common values 768px, 1024px
   - What's unclear: Optimal breakpoints for this specific content and component library
   - Recommendation: Start with 768px (tablet), 1024px (desktop); adjust based on actual component behavior

4. **Footer content and structure**
   - What we know: Should follow neo-brutalist aesthetic, provide site navigation/social links
   - What's unclear: Exact content, layout, complexity
   - Recommendation: Defer to implementation; keep minimal for Phase 1 (copyright + social links)

## Sources

### Primary (HIGH confidence)
- Context7: `/llmstxt/astro_build_llms-full_txt` - Astro project setup, components, layouts, styling, configuration
- Context7: `/llmstxt/astro_build_llms-full_txt` - Astro deployment, static site generation, Vercel integration
- Astro official documentation (docs.astro.build) - Verified via Context7 queries

### Secondary (MEDIUM confidence)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns) - Design tokens and CSS variables best practices
- [The developer's guide to design tokens and CSS variables](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/) - Token system architecture
- [Neobrutalism: Definition and Best Practices - NN/G](https://www.nngroup.com/articles/neobrutalism/) - Neo-brutalist design patterns
- [Neubrutalism - UI Design Trend](https://bejamas.com/blog/neubrutalism-web-design-trend) - Hard shadows and border patterns
- [6 CSS Neobrutalism UI Examples](https://freefrontend.com/css-neobrutalism/) - Practical CSS implementations
- [Mobile Navigation Design: 6 Patterns That Work in 2026](https://phone-simulator.com/blog/mobile-navigation-patterns-in-2026) - Navigation best practices
- [Mobile Navigation UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/) - Hamburger menu patterns
- [Accessible Mobile Navigation](https://a11ymatters.com/pattern/mobile-nav/) - ARIA attributes for navigation
- [Bunny Fonts](https://fonts.bunny.net/) - Privacy-first font hosting
- [The 40 Best Google Fonts for 2026](https://www.typewolf.com/google-fonts) - Typography recommendations
- [My Favourite Fonts for Neobrutalist Web Design](https://blog.kristi.digital/p/my-favourite-fonts-for-neobrutalist-web-design) - Font choices for neo-brutalism
- [Top 10 Brutalist Fonts for 2026](https://www.typewolf.com/top-10-brutalist-fonts) - Typography for brutalist aesthetic
- [Responsive Design Breakpoints 2025 Playbook](https://dev.to/gerryleonugroho/responsive-design-breakpoints-2025-playbook-53ih) - Mobile-first breakpoints
- [Responsive Design Best Practices: The Complete 2026 Guide](https://pxlpeak.com/blog/web-design/responsive-design-best-practices) - Layout strategies
- [Astro Islands Architecture Explained](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide) - Component hydration patterns
- [Understanding Astro islands architecture](https://blog.logrocket.com/understanding-astro-islands-architecture/) - Static-first approach
- [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro) - Deployment configuration
- [Style Dictionary + Tokens Studio](https://docs.tokens.studio/transform-tokens/style-dictionary) - Design token tools

### Tertiary (LOW confidence)
- None - all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Astro documentation via Context7, verified Vercel integration
- Architecture: HIGH - Official Astro patterns, verified CSS approaches
- Neo-brutalist patterns: MEDIUM - Multiple credible sources agree, but specific implementation varies
- Navigation patterns: MEDIUM - Industry best practices from multiple UX sources
- Typography: MEDIUM - Based on current font trends, but subjective aesthetic choices
- Pitfalls: HIGH - Based on official Astro error reference and community patterns

**Research date:** 2026-01-28
**Valid until:** 30 days (2026-02-27) - Stable ecosystem; Astro and CSS best practices evolve slowly
