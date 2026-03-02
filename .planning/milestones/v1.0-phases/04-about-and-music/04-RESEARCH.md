# Phase 4: About & Music - Research

**Researched:** 2026-01-29
**Domain:** Narrative content layout with embedded music players
**Confidence:** HIGH

## Summary

Phase 4 creates a single Story page (/story) combining founder narrative, music showcase, and contact information into one cohesive scrollable experience. The research confirms that Astro's native layout composition pattern (nested layouts) is ideal for narrative content pages. For music embeds, both Bandcamp and SoundCloud provide iframe embed codes that work with modern CSS aspect-ratio for responsive display. The responsive iframe technique has evolved significantly — the CSS `aspect-ratio` property eliminates the need for padding-top wrapper hacks, providing cleaner markup and better browser support in 2026.

The existing codebase already has section components (Hero, ProductTeasers, SocialLinks) and a scroll animation system via Intersection Observer that should be extended for the Story page. The neo-brutalist design system (hard shadows, 3px borders, zero radius) applies to all new components. Social links already exist in a dedicated SocialLinks component that can be reused or extended for the Connect section. The Footer component needs expansion to include a Story navigation link.

**Primary recommendation:** Create a dedicated /story page using BaseLayout, build specialized section components (StoryHero, Narrative, MusicEmbeds, Connect) following existing patterns, use CSS `aspect-ratio: 16 / 9` for responsive music player iframes, implement a geometric SVG placeholder for the founder photo, and extend the existing SocialLinks pattern for the Connect section with email button styling.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site framework with layout composition | Already in use, nested layouts for narrative pages |
| Native CSS `aspect-ratio` | N/A | Responsive iframe sizing | Browser standard as of 2026, eliminates wrapper divs |
| Native Intersection Observer | N/A | Scroll animations | Already implemented in BaseLayout, consistent pattern |
| Inline SVG | N/A | Geometric placeholder images | Zero dependencies, matches neo-brutalist aesthetic |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Bandcamp embed | N/A (service) | Music player iframe | Direct iframe code from Bandcamp share dialog |
| SoundCloud embed | N/A (service) | Music player iframe | Direct iframe code from SoundCloud share dialog |
| Bunny Fonts | N/A | Typography | Already in use (Phase 1), privacy-friendly |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `aspect-ratio` | Padding-top wrapper technique | Older approach, more CSS, less semantic — use modern property |
| Inline SVG | Jdenticon, Boring Avatars | Libraries add dependencies; simple geometric SVG sufficient for placeholder |
| Single page layout | Separate /about and /music pages | Context decision: combined Story page for unified narrative flow |
| Email link | Contact form (like Formspree from Phase 3) | Context decision: email link only, simpler interaction |

**Installation:**
```bash
# No new npm packages required
# All features use native browser APIs or existing dependencies
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   ├── index.astro          # Home page (exists)
│   ├── products.astro       # Products listing (exists)
│   ├── products/
│   │   └── [slug].astro     # Product detail pages (exists)
│   └── story.astro          # NEW: Combined About & Music page
├── components/
│   ├── sections/
│   │   ├── Hero.astro       # Existing
│   │   ├── ProductTeasers.astro # Existing
│   │   ├── SocialLinks.astro    # Existing - can be reused/extended
│   │   ├── StoryHero.astro      # NEW: Story page hero section
│   │   ├── Narrative.astro      # NEW: Founder story content
│   │   ├── MusicEmbeds.astro    # NEW: Bandcamp/SoundCloud players
│   │   └── Connect.astro        # NEW: Contact + social links section
│   ├── ui/
│   │   ├── Card.astro       # Existing
│   │   ├── Button.astro     # Existing - use for email link
│   │   └── Avatar.astro     # NEW: Geometric SVG placeholder
│   └── common/
│       └── Footer.astro     # Existing - extend with Story link
├── layouts/
│   └── BaseLayout.astro     # Existing - use for Story page
└── styles/
    ├── tokens.css           # Existing design tokens
    ├── animations.css       # Existing scroll animations
    └── global.css           # Existing global styles
```

### Pattern 1: Nested Layout Composition for Narrative Pages
**What:** Astro's native layout nesting creates specialized page templates while reusing site-wide structure
**When to use:** Always for content-focused pages that need consistent site shell (BaseLayout) with custom content structure
**Example:**
```astro
---
// src/pages/story.astro
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/basics/layouts.mdx
import BaseLayout from '../layouts/BaseLayout.astro';
import StoryHero from '../components/sections/StoryHero.astro';
import Narrative from '../components/sections/Narrative.astro';
import MusicEmbeds from '../components/sections/MusicEmbeds.astro';
import Connect from '../components/sections/Connect.astro';
---

<BaseLayout title="Story">
  <StoryHero />
  <Narrative />
  <MusicEmbeds />
  <Connect />
</BaseLayout>
```

### Pattern 2: Responsive Music Player Embeds with CSS aspect-ratio
**What:** Modern CSS property maintains aspect ratio without wrapper divs or padding-top hacks
**When to use:** All iframe embeds in 2026 (Bandcamp, SoundCloud, YouTube, etc.)
**Example:**
```astro
---
// src/components/sections/MusicEmbeds.astro
// Source: https://gomakethings.com/responsive-iframes-with-the-css-aspect-ratio-property/
---

<section class="music-section">
  <h2>Music</h2>

  <div class="player-grid">
    <!-- Bandcamp embed -->
    <div class="player-wrapper">
      <h3>Latest Release</h3>
      <iframe
        src="https://bandcamp.com/EmbeddedPlayer/album=PLACEHOLDER/size=large/bgcol=0a0a0a/linkcol=00ff41/"
        class="music-player"
        allowfullscreen
        loading="lazy">
      </iframe>
    </div>

    <!-- SoundCloud embed -->
    <div class="player-wrapper">
      <h3>Recent Tracks</h3>
      <iframe
        src="https://w.soundcloud.com/player/?url=https://soundcloud.com/PLACEHOLDER"
        class="music-player"
        loading="lazy">
      </iframe>
    </div>
  </div>
</section>

<style>
  .music-player {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    border: var(--border-width) solid var(--color-border);
  }
</style>
```

### Pattern 3: Geometric SVG Placeholder Avatar
**What:** Hand-coded SVG with neo-brutalist geometric shapes for founder photo placeholder
**When to use:** Placeholder images that need to match brand aesthetic and be easily swappable
**Example:**
```astro
---
// src/components/ui/Avatar.astro
// Source: Inline SVG pattern from existing codebase (products used geometric SVG)
interface Props {
  size?: 'md' | 'lg';
}

const { size = 'md' } = Astro.props;
const sizeMap = { md: '200', lg: '400' };
---

<div class="avatar-wrapper">
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class={`avatar avatar-${size}`}>
    <!-- Neo-brutalist geometric composition -->
    <rect x="20" y="20" width="160" height="160"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border)"
          stroke-width="3" />
    <circle cx="100" cy="80" r="30"
            fill="var(--color-accent)"
            stroke="var(--color-border)"
            stroke-width="3" />
    <rect x="70" y="120" width="60" height="50"
          fill="var(--color-accent-warm)"
          stroke="var(--color-border)"
          stroke-width="3" />
  </svg>
</div>

<style>
  .avatar {
    width: 100%;
    height: auto;
    border: var(--border-width) solid var(--color-border);
  }

  .avatar-md {
    max-width: 200px;
  }

  .avatar-lg {
    max-width: 400px;
  }
</style>
```

### Pattern 4: Email Link Button with Accessibility
**What:** Styled link using existing Button component with proper mailto: protocol
**When to use:** Contact sections where email is preferred over forms
**Example:**
```astro
---
// Source: https://tailkits.com/blog/link-vs-button-accessibility/
// Links navigate, buttons act — email links are navigation to email client
import Button from '../ui/Button.astro';
---

<section class="connect-section">
  <h2>Get in Touch</h2>
  <Button
    href="mailto:greg@tuniice.com"
    variant="primary"
    size="lg"
    aria-label="Send email to Greg">
    Email Me
  </Button>
</section>
```

### Pattern 5: Long-Form Narrative Scroll Experience
**What:** Section-based vertical scroll with Intersection Observer animations (already implemented)
**When to use:** Story pages, case studies, editorial content with sequential narrative
**Example:**
```astro
---
// Narrative sections use existing data-animate attribute for scroll reveals
---

<section class="narrative-section" data-animate>
  <h2>The Story</h2>
  <div class="narrative-content">
    <p>Founder story paragraph 1...</p>
  </div>
</section>

<section class="technical-background" data-animate>
  <h2>Technical Background</h2>
  <ul class="skills-list">
    <li>iOS Development</li>
    <li>Web Engineering</li>
    <li>Hardware Design</li>
    <li>Audio Engineering</li>
  </ul>
</section>

<style>
  /* Existing animations.css handles .is-visible transitions */
  .narrative-section,
  .technical-background {
    padding: var(--space-2xl) 0;
  }
</style>
```

### Anti-Patterns to Avoid
- **Using padding-top for iframe responsive:** CSS `aspect-ratio` is the 2026 standard, eliminates wrapper divs (Source: https://gomakethings.com/responsive-iframes-with-the-css-aspect-ratio-property/)
- **Autoplay embedded music players:** SoundCloud disables autoplay on mobile, Bandcamp doesn't support it — avoid setting autoplay parameters (Source: https://help.soundcloud.com/hc/en-us/articles/115003453587-Embedded-players)
- **Removing underline from email links:** Accessibility requires persistent visual cue beyond color (Source: https://tailkits.com/blog/link-vs-button-accessibility/)
- **Too many scroll effects:** 47% of websites fail Core Web Vitals with heavy scroll animations (Source: https://www.digitalsilk.com/digital-trends/scrolling-effects/)
- **Generic "Click here" link text:** Use descriptive labels like "Email Greg" or "Send a message" (Source: https://www.elon.edu/u/university-communications/online-communications/accessibility-toolkit/emails/links/)
- **Separate /about and /music pages:** Context decision is combined /story page for unified narrative flow

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive iframes | Padding-top wrapper divs | CSS `aspect-ratio` property | Native browser support in 2026, cleaner markup, fewer bugs |
| Music player UI | Custom audio players | Bandcamp/SoundCloud embeds | Handles streaming, licensing, analytics, mobile playback |
| SVG avatar generation | Canvas or complex libraries | Inline hand-coded SVG | For simple placeholders, 10 lines of SVG beats library overhead |
| Email validation | Client-side regex | Native HTML5 `type="email"` | Browser handles edge cases, accessibility, mobile keyboards |
| Scroll animations | Custom scroll listeners | Intersection Observer (already in use) | Better performance, native API, already implemented in BaseLayout |
| Social link icons | Icon fonts or libraries | Existing Button component with text labels | Accessibility, existing design system, no dependencies |

**Key insight:** Music streaming embeds handle complex edge cases (licensing, DRM, mobile compatibility, analytics, buffering) that custom players can't match. Both Bandcamp and SoundCloud offer free embed codes with customization options for colors and size. For a brand page, embedded players provide discoverability while linking to full profiles for deeper exploration.

## Common Pitfalls

### Pitfall 1: Bandcamp Embed Customization Complexity
**What goes wrong:** Default Bandcamp embed includes tracklistings, artwork, and merchandise that may not fit page design
**Why it happens:** Bandcamp's embed dialog has many options that aren't immediately obvious
**How to avoid:** Use Bandcamp's share/embed dialog to customize size, color, minimal mode, and transparent background before copying iframe code
**Warning signs:** Embed looks cluttered, colors clash with site theme, player too large for mobile

### Pitfall 2: SoundCloud Player Height Not Responsive
**What goes wrong:** SoundCloud embeds have fixed pixel heights that don't scale with aspect-ratio
**Why it happens:** SoundCloud uses different player heights for single tracks (166px) vs playlists (450px)
**How to avoid:** Set explicit height in CSS based on embed type, or use max-width to constrain overall size
**Warning signs:** Player too tall on mobile, content overflow, layout breaking at different viewport sizes

### Pitfall 3: Missing lazy Loading on Iframes
**What goes wrong:** Music player iframes load immediately, slowing initial page render
**Why it happens:** Forgetting to add `loading="lazy"` attribute to iframe elements
**How to avoid:** Always add `loading="lazy"` to off-screen iframes (anything below fold)
**Warning signs:** Slow page load times, poor Lighthouse performance scores, high network usage on page load

### Pitfall 4: Founder Photo Placeholder Not Swap-Ready
**What goes wrong:** SVG placeholder styled in a way that makes replacing with real photo difficult
**Why it happens:** Not planning for image swap workflow or using inconsistent sizing
**How to avoid:** Design Avatar component to accept either SVG or img src, maintain consistent dimensions and aspect ratio
**Warning signs:** Need to refactor styles when real photo is ready, layout shifts when swapping placeholder

### Pitfall 5: Email Link Not Keyboard Accessible
**What goes wrong:** Styled email button loses focus indicator or can't be activated with keyboard
**Why it happens:** Custom CSS removes outline without replacement, or using div instead of anchor element
**How to avoid:** Use semantic `<a>` element, ensure visible focus state, test with Tab + Enter navigation
**Warning signs:** Invisible focus ring, can't activate with Enter key, screen reader doesn't announce as link

### Pitfall 6: Narrative Sections Too Long Without Visual Breaks
**What goes wrong:** Wall of text overwhelms readers, high bounce rate on Story page
**Why it happens:** Not breaking founder story into digestible sections with headings and spacing
**How to avoid:** Use multiple section components with headings, introduce rhythm with varying content blocks (text, image, quote)
**Warning signs:** User feedback about "too much text", analytics show rapid page exits, low scroll depth

### Pitfall 7: Social Links Duplicated Between Connect Section and Footer
**What goes wrong:** Bandcamp/SoundCloud links appear in both Connect section and SocialLinks component, causing maintenance issues
**Why it happens:** Not planning component reuse or data sources
**How to avoid:** Create shared data source for social links, import into both components, or conditionally render SocialLinks
**Warning signs:** Links out of sync between sections, duplicate code, inconsistent styling

### Pitfall 8: Not Testing Music Embeds on Mobile
**What goes wrong:** Players don't work on iOS Safari, controls too small to tap, audio doesn't play
**Why it happens:** Bandcamp/SoundCloud have different mobile behaviors not tested during development
**How to avoid:** Test embeds on actual iOS and Android devices, verify touch targets are 44px+ minimum
**Warning signs:** User reports players "don't work", can't tap play button, no audio on mobile

## Code Examples

Verified patterns from official sources:

### Bandcamp Responsive Embed Container
```html
<!-- Source: https://iframely.com/domains/bandcamp -->
<!-- Classic padding-top approach still works, but CSS aspect-ratio preferred -->

<!-- Modern approach (2026): -->
<iframe
  src="https://bandcamp.com/EmbeddedPlayer/album=2497221679/size=large/bgcol=0a0a0a/linkcol=00ff41/minimal=true/transparent=true/"
  style="width: 100%; aspect-ratio: 16 / 9; border: 3px solid #ffffff;"
  allowfullscreen
  loading="lazy">
</iframe>

<!-- Legacy approach (pre-2024, still valid): -->
<div style="max-width: 700px;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe
      src="https://bandcamp.com/EmbeddedPlayer/..."
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
      allowfullscreen>
    </iframe>
  </div>
</div>
```

### SoundCloud Embed with Parameters
```html
<!-- Source: https://developers.soundcloud.com/docs/api/html5-widget -->
<iframe
  width="100%"
  height="166"
  scrolling="no"
  frameborder="no"
  src="https://w.soundcloud.com/player/?url=https://soundcloud.com/tuniice/track-name&color=%2300ff41&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false"
  loading="lazy">
</iframe>

<style>
  iframe {
    aspect-ratio: 16 / 3; /* SoundCloud single track is wide/short */
    width: 100%;
    height: auto;
  }
</style>
```

### Footer with Story Navigation Link
```astro
---
// src/components/common/Footer.astro (extended)
const currentYear = new Date().getFullYear();
---

<footer class="site-footer">
  <div class="footer-container">
    <nav class="footer-nav">
      <a href="/">Home</a>
      <a href="/products">Products</a>
      <a href="/story">Story</a>
    </nav>
    <div class="footer-meta">
      <p class="copyright">&copy; {currentYear} tuniice</p>
      <p class="built-by">Built by tuniice</p>
    </div>
  </div>
</footer>

<style>
  .footer-nav {
    display: flex;
    gap: var(--space-md);
    font-family: var(--font-body);
    font-size: var(--font-sm);
  }

  .footer-nav a {
    color: var(--color-text-muted);
    text-decoration: underline;
    transition: color 0.15s ease;
  }

  .footer-nav a:hover {
    color: var(--color-accent);
  }

  @media (min-width: 768px) {
    .footer-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
```

### Narrative Section with Scroll Animation
```astro
---
// Uses existing Intersection Observer from BaseLayout
// data-animate attribute triggers animation when scrolled into view
---

<section class="story-narrative" data-animate>
  <div class="narrative-container">
    <div class="narrative-header">
      <Avatar size="lg" />
      <h2>About tuniice</h2>
    </div>

    <div class="narrative-text">
      <p>
        tuniice started as an idea: what if music production tools felt as
        intuitive and immediate as playing an instrument?
      </p>

      <p>
        Greg, the founder, spent years building iOS apps by day and making
        music by night, always frustrated by the gap between creative vision
        and technical execution.
      </p>

      <p>
        tuniice bridges that gap — apps, hardware, and web tools designed for
        musicians who think in sound, not in specs.
      </p>
    </div>
  </div>
</section>

<style>
  .story-narrative {
    padding: var(--space-2xl) 0;
  }

  .narrative-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .narrative-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
    text-align: center;
  }

  .narrative-text {
    font-family: var(--font-body);
    font-size: var(--font-md);
    line-height: 1.8;
    color: var(--color-text);
  }

  .narrative-text p {
    margin-bottom: var(--space-lg);
  }

  /* Scroll animation uses existing animations.css classes */
  /* .is-visible class added by Intersection Observer */
</style>
```

### Technical Background Section with Lists
```astro
<section class="technical-background" data-animate>
  <h2>Technical Breadth</h2>
  <div class="skills-grid">
    <div class="skill-category">
      <h3>Software</h3>
      <ul>
        <li>iOS Development</li>
        <li>Web Engineering</li>
        <li>Audio DSP</li>
      </ul>
    </div>

    <div class="skill-category">
      <h3>Hardware</h3>
      <ul>
        <li>Circuit Design</li>
        <li>MIDI Controllers</li>
        <li>Embedded Systems</li>
      </ul>
    </div>

    <div class="skill-category">
      <h3>Audio</h3>
      <ul>
        <li>Music Production</li>
        <li>Sound Design</li>
        <li>Mixing & Mastering</li>
      </ul>
    </div>
  </div>
</section>

<style>
  .technical-background {
    padding: var(--space-2xl) 0;
    text-align: center;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    margin-top: var(--space-xl);
  }

  @media (min-width: 768px) {
    .skills-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .skill-category h3 {
    font-family: var(--font-heading);
    font-size: var(--font-lg);
    color: var(--color-accent);
    margin-bottom: var(--space-md);
  }

  .skill-category ul {
    list-style: none;
    padding: 0;
    font-family: var(--font-body);
    font-size: var(--font-base);
    line-height: 1.8;
  }
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Padding-top wrapper for responsive iframes | CSS `aspect-ratio` property | 2021-2024 (widespread support) | Cleaner markup, fewer divs, easier to maintain |
| Custom audio players with Web Audio API | Embedded Bandcamp/SoundCloud players | Ongoing | Handles licensing, streaming, analytics, mobile compatibility |
| Icon fonts (Font Awesome) for social links | Text labels in Button components | 2023+ accessibility push | Better screen reader support, no loading dependencies |
| Separate About and Music pages | Combined Story page with scroll narrative | 2025+ (long-form content trend) | Better engagement, unified narrative, fewer clicks |
| Flash-based music players | HTML5 iframe embeds | 2015+ (Flash deprecation) | Works on all devices, no plugins needed |
| jQuery for scroll effects | Intersection Observer API | 2019+ (browser support) | Better performance, native API, already in use |

**Deprecated/outdated:**
- Padding-top percentage hack for responsive iframes: Use CSS `aspect-ratio` property instead
- SoundCloud Widget API for custom controls: Complex, use standard embeds unless advanced features needed
- Generic avatar placeholder images: Use brand-consistent geometric SVG that matches neo-brutalist aesthetic
- Auto-play music on page load: Disabled by browsers, poor UX, avoid setting autoplay parameters

## Open Questions

Things that couldn't be fully resolved:

1. **Exact Bandcamp/SoundCloud embed URLs**
   - What we know: Both services provide embed codes via share dialogs with customization options
   - What's unclear: Greg's actual Bandcamp and SoundCloud profile URLs for production embeds
   - Recommendation: Use placeholder URLs in implementation, document swap process for when real URLs are ready

2. **Founder narrative tone and length**
   - What we know: Context specifies "founder story tone — personal narrative" with "rich detail level"
   - What's unclear: How many sections/paragraphs, specific story beats to highlight
   - Recommendation: Create 3-4 section structure (Origin, Problem, Solution, Future) with 2-3 paragraphs each as starting point

3. **Avatar placeholder SVG design specifics**
   - What we know: Geometric, neo-brutalist, designed for swapping with real photo later
   - What's unclear: Exact geometric composition that best represents tuniice brand
   - Recommendation: Use simple 3-shape composition (circle, rectangle, triangle) in accent colors, maintain 1:1 aspect ratio for easy photo swap

4. **Music embed aspect ratios**
   - What we know: Bandcamp and SoundCloud have different player dimensions
   - What's unclear: Whether to force consistent aspect ratio or allow different heights
   - Recommendation: Allow different aspect ratios per service (Bandcamp ~1:1 for album art, SoundCloud ~16:3 for waveform) for authentic embed appearance

5. **Connect section social link duplication**
   - What we know: Home page has SocialLinks component, Story page needs Connect section with email + social
   - What's unclear: Should Connect section replace SocialLinks on Story page or both appear?
   - Recommendation: Reuse SocialLinks component within Connect section, add email button above it, remove redundant SocialLinks from Story page layout

## Sources

### Primary (HIGH confidence)
- [/withastro/docs](https://github.com/withastro/docs) (Context7) - Layout composition patterns, nested layouts, page structure
- [Astro Layouts Documentation](https://docs.astro.build/en/basics/layouts/) - Official layout best practices and examples
- [CSS aspect-ratio for Responsive Iframes](https://gomakethings.com/responsive-iframes-with-the-css-aspect-ratio-property/) - Modern responsive iframe technique
- [W3Schools Responsive Iframes](https://www.w3schools.com/howto/howto_css_responsive_iframes.asp) - Browser support and implementation
- [NN/g Footer Design Patterns](https://www.nngroup.com/articles/footers/) - Footer navigation and contact placement best practices

### Secondary (MEDIUM confidence)
- [Shopify About Us Page Best Practices 2026](https://www.shopify.com/blog/how-to-write-an-about-us-page) - Founder story structure and photo placement
- [Link vs Button Accessibility](https://tailkits.com/blog/link-vs-button-accessibility/) - Email link semantic HTML and accessibility
- [Email Accessibility Best Practices](https://www.litmus.com/blog/ultimate-guide-accessible-emails) - Button sizing, contrast, focus states
- [Bandcamp Embed Documentation](https://iframely.com/domains/bandcamp) - Embed code structure and customization
- [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget) - Embed parameters and options
- [Scrolling Effects in Web Design 2026](https://www.digitalsilk.com/digital-trends/scrolling-effects/) - Long-form narrative scroll patterns
- [Scrollytelling Examples 2026](https://www.vev.design/blog/scrollytelling-examples/) - Narrative page design patterns
- [Social Media Icons in Footer](https://www.nngroup.com/articles/footers/) - Footer social link placement

### Tertiary (LOW confidence)
- [Boring Avatars Library](https://boringavatars.com/) - SVG avatar generation (not using, but informative on patterns)
- WebSearch results on geometric SVG placeholders - Various icon libraries and generators (informative but not directly actionable)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Astro patterns verified via Context7, CSS aspect-ratio is 2026 browser standard, Intersection Observer already in use
- Architecture: HIGH - Nested layouts follow Astro conventions, section components match existing codebase patterns, no new dependencies
- Pitfalls: MEDIUM - Based on general UX research (NN/g, Shopify), iframe embed gotchas from web standards, accessibility from WCAG sources
- Code examples: HIGH - Astro examples from official docs, CSS from verified sources (Go Make Things, W3Schools), iframe embed structure from service documentation

**Research date:** 2026-01-29
**Valid until:** ~60 days (Astro stable, CSS standards stable, music embed services stable, design patterns evergreen)
