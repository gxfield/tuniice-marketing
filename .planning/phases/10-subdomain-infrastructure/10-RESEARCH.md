# Phase 10: Subdomain Infrastructure - Research

**Researched:** 2026-03-03
**Domain:** Astro monorepo subdirectory setup + Vercel subdomain deployment
**Confidence:** HIGH

## Summary

Phase 10 creates `bluepriint.tuniice.com` as a separate Astro project living in a `bluepriint/` directory at the repo root, deployed via its own Vercel project, and wired via DNS CNAME. The design system is shared by copying `tokens.css` and `global.css` from the main site into the bluepriint project, then overriding `--color-accent` from `#00ff41` (neon green) to `#ffbf00` (amber). Because bluepriint is a single-page site with no internal navigation, it needs no `ClientRouter`, no `transition:animate`, and no interactive effects — just a clean Astro static project.

The two tasks are clearly separated: Plan 01 scaffolds the Astro project and builds the landing page; Plan 02 sets up the Vercel project pointing at the `bluepriint/` root directory and adds the DNS CNAME record. Both are independent of monorepo tooling (no pnpm workspaces, no Turborepo) — Vercel's root directory setting is sufficient at one subdomain.

**Primary recommendation:** Scaffold `bluepriint/` as a standalone Astro 5.x project with its own `package.json`, `astro.config.mjs`, and copied/modified CSS files. Set Vercel root directory to `bluepriint/` for a separate project. Add CNAME record pointing `bluepriint.tuniice.com` to the project-specific Vercel CNAME value provided by the dashboard.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Landing page structure:**
- Hero section with product name, tagline, and description + features/highlights section + CTA section
- No header/navigation — standalone single page, matches main site's no-header pattern
- Footer with link back to tuniice.com
- Static dark background — no canvas particle animation for v1
- No ClientRouter/page transitions — single page, no internal navigation needed

**Content and messaging:**
- Pro tool tone — serious and precise, like Teenage Engineering or Ableton
- Email signup CTA via Formspree — "Get notified when bluepriint launches" (reuse proven pattern)
- Placeholder tagline: "Master clock and tempo control for live performance"
- Text only — no product screenshots or mockups for v1

**Design inheritance:**
- Copy tokens.css into bluepriint project, override --color-accent to amber — no cross-project dependencies (per SUB-02)
- Same fonts: Space Grotesk (headings) + Space Mono (body) — consistent brand family
- No interactive effects (glitch text, magnetic buttons) — keep it clean for v1
- Identical neo-brutalist styling (hard borders, colored box-shadows, zero radius)

**Accent color application:**
- Full swap: override --color-accent from #00ff41 to #ffbf00 (existing --color-accent-amber value)
- All elements using --color-accent token automatically become amber
- Single amber accent only — no secondary accent color

### Claude's Discretion
- Exact hero layout proportions and spacing
- Features section presentation (list, grid, icons, etc.)
- Formspree form styling adaptation for amber theme
- Footer design and "back to tuniice.com" link treatment
- Vercel project configuration specifics
- DNS CNAME setup details

### Deferred Ideas (OUT OF SCOPE)
- Canvas particle animation for bluepriint (amber particles) — future enhancement
- Interactive effects (glitch, magnetic) on bluepriint — future enhancement
- Additional app subdomains following bluepriint pattern (SUB-05) — v2
- Multi-page bluepriint site with features, docs (SUB-06) — v2
- Real product content replacement — blocked on app development
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SUB-01 | bluepriint.tuniice.com resolves to a separate Vercel project from the same repo | Vercel monorepo root directory setting + DNS CNAME record covered in Architecture Patterns section |
| SUB-02 | Bluepriint site shares the neo-brutalist design system via copied design tokens | Copy tokens.css + global.css into bluepriint/src/styles/ — no symlinks, no cross-project imports — covered in Standard Stack |
| SUB-03 | Bluepriint site uses its own accent color override | Single override after the tokens.css import: `--color-accent: #ffbf00` — covered in Code Examples |
| SUB-04 | Bluepriint landing page exists with placeholder content and base layout | Astro index.astro with hero, features, CTA sections — covered in Architecture Patterns |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^5.16.16 | Static site framework | Same as main site — no new dependency introduced |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| fonts.bunny.net CDN | N/A | Space Grotesk + Space Mono font loading | Same CDN as main site — no additional setup |
| Formspree | existing account | Email signup POST endpoint | Already proven in main site NotifyForm pattern |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Copy CSS files | Symlinks or npm workspace shared package | Symlinks break on some platforms; workspace adds tooling overhead. Copy is simpler at one subdomain scale. |
| Vercel root directory setting | Separate repo | Same repo is correct — Vercel supports this natively with no monorepo tooling required |

**Installation (bluepriint/ subdirectory):**
```bash
mkdir bluepriint && cd bluepriint && npm install astro
```

---

## Architecture Patterns

### Recommended Project Structure

```
bluepriint/
├── astro.config.mjs       # Astro config, output: 'static'
├── package.json           # name: "bluepriint", scripts, astro dependency
├── tsconfig.json          # extends astro/tsconfigs/strict
├── public/
│   └── favicon.svg        # bluepriint favicon (amber color variant)
└── src/
    ├── styles/
    │   ├── tokens.css     # Copied from main site, --color-accent overridden to #ffbf00
    │   ├── global.css     # Copied from main site (resets, typography, body background)
    │   └── animations.css # Copied from main site (data-animate scroll reveals)
    └── pages/
        └── index.astro    # Single page: hero + features + CTA + footer
```

### Pattern 1: Standalone Astro project in subdirectory

**What:** A full Astro project lives in `bluepriint/` with its own `package.json` and `astro.config.mjs`. It has no dependency on the parent project — CSS files are copied, not imported across project boundaries.

**When to use:** One subdomain, no shared component logic, different accent color. Any cross-project import would require workspace tooling. Copying CSS is the correct approach at this scale.

**bluepriint/package.json:**
```json
{
  "name": "bluepriint",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.16.16"
  }
}
```

**bluepriint/astro.config.mjs:**
```javascript
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static'
});
```

**bluepriint/tsconfig.json:**
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### Pattern 2: Accent color override in copied tokens.css

**What:** Copy `src/styles/tokens.css` to `bluepriint/src/styles/tokens.css`. At the end of the `:root` block, override `--color-accent` to amber. Also override the `@media (prefers-color-scheme: light)` block's accent value.

**When to use:** Whenever the amber theme needs to propagate to all neo-brutalist elements (borders, box-shadows, focus rings, form buttons, link hovers) automatically via the token.

**Example — bluepriint/src/styles/tokens.css (only the overrides, appended after copy):**
```css
/* bluepriint accent override — amber instead of neon green */
:root {
  --color-accent: #ffbf00;
}

@media (prefers-color-scheme: light) {
  :root {
    --color-accent: #b98300;
  }
}
```

OR simpler: edit the token values directly in the copied file. Either approach is correct — direct edit is cleaner since this is a standalone copy.

### Pattern 3: Single-page layout (no BaseLayout, no ClientRouter)

**What:** `index.astro` is self-contained: includes `<head>` directly, imports the three CSS files, loads fonts from bunny.net, and renders all sections in one file. No `ClientRouter` is needed (single page). No `transition:animate` directives.

**When to use:** Single-page site with no internal navigation. Adding `ClientRouter` to a single-page site is unnecessary overhead.

```astro
---
// bluepriint/src/pages/index.astro
import '../styles/tokens.css';
import '../styles/global.css';
import '../styles/animations.css';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.bunny.net" />
    <link
      href="https://fonts.bunny.net/css?family=space-grotesk:700,900|space-mono:400,700"
      rel="stylesheet"
    />
    <meta name="description" content="bluepriint — master clock and tempo control for live performance" />
    <title>bluepriint | tuniice</title>
  </head>
  <body>
    <main>
      <!-- Hero section -->
      <!-- Features section -->
      <!-- CTA / email signup section -->
      <!-- Footer -->
    </main>
    <script>
      // Scroll animation observer (same pattern as main site BaseLayout)
      document.addEventListener('DOMContentLoaded', () => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
      });
    </script>
  </body>
</html>
```

Note: Use `DOMContentLoaded` (not `astro:page-load`) since there is no ClientRouter on this single-page site.

### Pattern 4: Vercel project pointing at bluepriint/ subdirectory

**What:** In Vercel dashboard, create a new project from the same Git repository. Before deploying, set the **Root Directory** to `bluepriint`. Vercel then runs `astro build` from within `bluepriint/` and serves `bluepriint/dist/`.

**Steps (confirmed from Vercel docs):**
1. Vercel Dashboard → Add New → Project → Import same git repo
2. Before deploying, click **Edit** next to Root Directory → type `bluepriint`
3. Framework preset: Astro (auto-detected)
4. Build command: `astro build` (auto-detected)
5. Output directory: `dist` (auto-detected)
6. Deploy

No monorepo tooling (pnpm workspaces, Turborepo) required. Vercel handles it natively.

### Pattern 5: DNS CNAME for bluepriint subdomain

**What:** After the Vercel project is deployed, add a custom domain in Vercel's project settings. Vercel provides a project-specific CNAME value (e.g. `d1d4fc829fe7bc7c.vercel-dns-017.com`). Add that CNAME at the DNS registrar for `bluepriint.tuniice.com`.

**Steps:**
1. In the bluepriint Vercel project → Settings → Domains → Add Domain → enter `bluepriint.tuniice.com`
2. Vercel displays the CNAME record to add (it is project-specific, not `cname.vercel-dns.com`)
3. At DNS registrar: add CNAME record `bluepriint` → `[vercel-provided-value]`
4. DNS propagation: typically minutes to a few hours
5. Vercel auto-provisions SSL certificate once DNS resolves

**Key insight from official docs:** Each project has a unique CNAME value (e.g. `d1d4fc829fe7bc7c.vercel-dns-017.com`). The generic `cname.vercel-dns.com` is an older pattern. Always use the value displayed in the Vercel dashboard for that specific project.

### Anti-Patterns to Avoid

- **Importing CSS across project boundaries:** Don't `import '../../src/styles/tokens.css'` from `bluepriint/`. Astro build won't find it. Copy the files.
- **Adding ClientRouter to a single-page site:** Unnecessary. Causes `astro:page-load` events that won't fire correctly. Use `DOMContentLoaded` for the scroll animation observer instead.
- **Using `npm create astro@latest` in an existing repo without caution:** The wizard may conflict with root-level `package.json`. Create `bluepriint/` manually with the minimal files shown above.
- **Forgetting to install `node_modules` in bluepriint/:** The subdirectory is a separate npm project. Run `npm install` inside `bluepriint/` before local dev.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email signup form | Custom AJAX form | Formspree + existing NotifyForm pattern | Edge cases: validation, spam, double-submit; NotifyForm already handles all of this |
| Font loading | Self-host fonts | fonts.bunny.net CDN | Same CDN as main site; fonts already cached in user's browser from main site visit |
| Static site generation | Custom build pipeline | Astro 5 static output | Already the project standard |

**Key insight:** The existing NotifyForm.astro is a proven, copy-adaptable pattern. Adapt it for bluepriint rather than building from scratch.

---

## Common Pitfalls

### Pitfall 1: Using astro:page-load in single-page site

**What goes wrong:** Scroll animation observer uses `astro:page-load` (copied from BaseLayout). On a single-page site without ClientRouter, `astro:page-load` never fires, so no elements animate in.

**Why it happens:** Direct copy of BaseLayout scroll observer script without adjusting the event listener.

**How to avoid:** Use `DOMContentLoaded` instead of `astro:page-load` in bluepriint's index.astro. Or add ClientRouter — but that contradicts the locked decision to omit it.

**Warning signs:** Page loads but `[data-animate]` elements remain invisible (opacity: 0).

### Pitfall 2: Cross-project CSS import path

**What goes wrong:** Importing `../../src/styles/tokens.css` from bluepriint fails at build time because Astro's build boundary is the root of the Astro project (`bluepriint/`).

**Why it happens:** Assuming Astro can import from parent directories like a regular bundler.

**How to avoid:** Copy `tokens.css`, `global.css`, and `animations.css` into `bluepriint/src/styles/` during Plan 01 scaffolding. These are static files with no shared logic — copying is correct.

**Warning signs:** Build error about file not found or import resolution failure during `astro build`.

### Pitfall 3: Vercel project using repo root instead of bluepriint/ subdirectory

**What goes wrong:** The new Vercel project builds the main tuniice site instead of bluepriint. The subdomain serves the main site.

**Why it happens:** Root Directory not set to `bluepriint` during project import. Easy to miss — it is an optional field shown before the first deploy.

**How to avoid:** During project import, click Edit next to Root Directory and type `bluepriint` before clicking Deploy. Verify in project Settings → Build and Deployment that Root Directory shows `bluepriint`.

**Warning signs:** The bluepriint Vercel project's build output looks identical to the main site (shows tuniice content).

### Pitfall 4: Formspree form ID collision

**What goes wrong:** bluepriint uses the same Formspree form ID as the main site, so signups from bluepriint go to the tuniice notification list.

**Why it happens:** Directly copying NotifyForm without creating a separate Formspree form for bluepriint.

**How to avoid:** Create a new Formspree form for bluepriint and use a separate `PUBLIC_FORMSPREE_ID` environment variable or hardcode a different form ID in bluepriint's form. The hidden `_subject` field should say "bluepriint Launch Notification Signup".

**Warning signs:** Formspree dashboard shows signups tagged with wrong product.

### Pitfall 5: Light mode accent not overridden

**What goes wrong:** In dark mode, the amber accent looks correct. In light mode, the accent reverts to the dark green (#0f7a3a from the light mode block in tokens.css) because only the `:root` block's accent was overridden.

**Why it happens:** Copying tokens.css then only overriding the first `:root` block, forgetting the `@media (prefers-color-scheme: light)` block.

**How to avoid:** When editing the copied tokens.css, change `--color-accent` in BOTH the main `:root` block AND the `@media (prefers-color-scheme: light)` `:root` block. The light-mode amber value is already defined as `--color-accent-amber: #b98300` in the existing tokens.css — use that value.

---

## Code Examples

### Accent override in copied tokens.css

```css
/* In bluepriint/src/styles/tokens.css */
/* Change these two lines from their main-site values: */

:root {
  /* ... all existing tokens ... */
  --color-accent: #ffbf00;  /* was: #00ff41 */
  /* ... */
}

@media (prefers-color-scheme: light) {
  :root {
    /* ... */
    --color-accent: #b98300;  /* was: #0f7a3a */
    /* ... */
  }
}
```

### Scroll animation observer for single-page (no ClientRouter)

```javascript
// In bluepriint/src/pages/index.astro <script> block
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
});
```

### Neo-brutalist button (amber variant)

```css
/* bluepriint amber CTA button — same pattern as main site, accent token does the work */
.cta-btn {
  padding: var(--space-sm) var(--space-xl);
  border: var(--border-width) solid var(--color-text);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: var(--shadow-offset-md) var(--shadow-offset-md) 0 var(--color-accent);
  /* --color-accent is #ffbf00 in bluepriint — amber shadow automatically */
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.cta-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-offset-lg) var(--shadow-offset-lg) 0 var(--color-accent);
}
```

### Formspree form adapted for bluepriint

```astro
---
// In bluepriint/src/pages/index.astro or a local component
// Use a separate Formspree form ID for bluepriint
const formEndpoint = 'https://formspree.io/f/YOUR_BLUEPRIINT_FORM_ID';
---

<form action={formEndpoint} method="POST" id="bluepriint-notify-form">
  <input type="hidden" name="_subject" value="bluepriint Launch Notification Signup" />
  <input type="email" name="email" required placeholder="your@email.com" />
  <button type="submit">Get Notified</button>
</form>
```

### Vercel project root directory (conceptual)

```
Vercel Project: bluepriint-tuniice
  Repository: tuniice-marketing (same repo as main site)
  Root Directory: bluepriint          ← set this during import
  Framework Preset: Astro             ← auto-detected
  Build Command: astro build          ← auto-detected
  Output Directory: dist              ← auto-detected
  Environment Variables:
    PUBLIC_FORMSPREE_ID = [bluepriint-specific form ID]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| cname.vercel-dns.com (generic) | Project-specific CNAME (e.g. `xxx.vercel-dns-017.com`) | Vercel changed this silently | Always copy the exact CNAME value from the dashboard for your specific project |
| Monorepo tooling required | Vercel root directory setting sufficient | Always been this way, better documented now | No pnpm workspaces or Turborepo needed at one subdomain |

**Deprecated/outdated:**
- Generic `cname.vercel-dns.com` target: While still documented in some older guides, Vercel now provides a project-specific CNAME value in the dashboard. Use whatever the dashboard shows.

---

## Open Questions

1. **Formspree form ID for bluepriint**
   - What we know: Main site uses `PUBLIC_FORMSPREE_ID` env var pointing to an existing form
   - What's unclear: Whether a separate Formspree form exists for bluepriint, or whether one needs to be created in the Formspree dashboard
   - Recommendation: Create a new Formspree form titled "bluepriint launch notifications" and set `PUBLIC_FORMSPREE_ID` as a Vercel environment variable on the bluepriint project (separate from the main site project's env vars)

2. **DNS registrar access**
   - What we know: bluepriint.tuniice.com requires a CNAME added at wherever tuniice.com's DNS is managed
   - What's unclear: Which registrar/DNS provider manages tuniice.com
   - Recommendation: Plan 02 should document that the implementer needs access to the DNS registrar. The CNAME value comes from the Vercel dashboard after adding the domain.

---

## Validation Architecture

`workflow.nyquist_validation` is not set to `false` in config.json — validation section is included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — this phase is Astro static site scaffolding |
| Config file | N/A |
| Quick run command | `cd /Users/greg/ai/tuniice-marketing/bluepriint && npm run build` |
| Full suite command | `cd /Users/greg/ai/tuniice-marketing/bluepriint && npm run build && npm run preview` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SUB-01 | bluepriint.tuniice.com resolves to separate Vercel project | manual | DNS lookup after deploy: `dig bluepriint.tuniice.com CNAME` | N/A — infrastructure |
| SUB-02 | Design tokens shared (copied, amber override) | smoke | `cd bluepriint && npm run build` — build succeeds, dist/ contains CSS with #ffbf00 | ❌ Wave 0 (project doesn't exist yet) |
| SUB-03 | Amber accent visibly different from neon green | manual | Visual inspection of deployed site | N/A — visual |
| SUB-04 | Landing page with placeholder content | smoke | `cd bluepriint && npm run build` — build produces index.html with expected sections | ❌ Wave 0 (project doesn't exist yet) |

### Sampling Rate

- **Per task commit:** `cd /Users/greg/ai/tuniice-marketing/bluepriint && npm run build`
- **Per wave merge:** Build + preview visual check
- **Phase gate:** `npm run build` green + visual inspection of deployed subdomain before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `bluepriint/` directory — entire Astro project doesn't exist yet; Plan 01 creates it
- [ ] `bluepriint/package.json` — Wave 0 (Plan 01 Task 1)
- [ ] `bluepriint/astro.config.mjs` — Wave 0 (Plan 01 Task 1)
- [ ] `bluepriint/src/pages/index.astro` — Wave 0 (Plan 01 Task 2)
- [ ] `bluepriint/src/styles/tokens.css` (copied + overridden) — Wave 0 (Plan 01 Task 1)

---

## Sources

### Primary (HIGH confidence)

- Vercel official docs: https://vercel.com/docs/monorepos — Root Directory setting for separate projects within same repo
- Vercel official docs: https://vercel.com/docs/domains/working-with-domains/add-a-domain — CNAME configuration for subdomains, project-specific CNAME value
- Astro official docs: https://docs.astro.build/en/install-and-setup/ — Minimal Astro project structure (package.json, astro.config.mjs, tsconfig.json)
- Project codebase: `/Users/greg/ai/tuniice-marketing/src/styles/tokens.css` — existing token values, accent colors
- Project codebase: `/Users/greg/ai/tuniice-marketing/src/layouts/BaseLayout.astro` — font loading, scroll observer pattern
- Project codebase: `/Users/greg/ai/tuniice-marketing/src/components/forms/NotifyForm.astro` — Formspree pattern to adapt

### Secondary (MEDIUM confidence)

- Vercel community discussion https://github.com/vercel/community/discussions/438 — confirms separate project per subdirectory is the standard approach, no monorepo tooling needed

### Tertiary (LOW confidence)

- WebSearch result re: Astro monorepo subdirectory setup — general pattern confirmed by official docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Astro 5 is already the project's framework; Vercel root directory setting confirmed from official docs
- Architecture: HIGH — Patterns directly derived from existing project codebase and official Vercel docs
- Pitfalls: HIGH — Derived from specific technical interactions confirmed by codebase inspection (e.g., astro:page-load requires ClientRouter, CSS import boundaries)
- DNS/Vercel setup: MEDIUM — Steps confirmed from official docs; project-specific CNAME value must be obtained from dashboard at deploy time

**Research date:** 2026-03-03
**Valid until:** 2026-06-03 (Vercel and Astro APIs are stable; DNS configuration is timeless)
