---
status: investigating
trigger: "Scroll animations not working - no animation happens when scrolling"
created: 2026-01-29T00:00:00Z
updated: 2026-01-29T00:00:00Z
---

## Current Focus

hypothesis: Hero.astro section is missing data-animate attribute, so it stays invisible (opacity:0) and never animates. ProductTeasers and SocialLinks partially have data-animate but the section headings and Hero do not.
test: Check which elements have data-animate vs which should
expecting: Missing data-animate on Hero section means it is permanently hidden (opacity:0, translateY:30px)
next_action: Verify CSS specificity and check if Hero is truly invisible

## Symptoms

expected: Elements with data-animate fade in on scroll via IntersectionObserver. Product cards stagger appearance.
actual: No animation happens when scrolling.
errors: None reported
reproduction: Load page, scroll down - nothing animates
started: Unknown

## Eliminated

## Evidence

- timestamp: 2026-01-29T00:01:00Z
  checked: Hero.astro
  found: No data-animate attribute on any element. The <section class="hero"> and its children have zero data-animate attributes.
  implication: Hero section is NOT targeted by IntersectionObserver at all. But since it also lacks data-animate, the CSS rules in animations.css (opacity:0, translateY:30px) do NOT apply to it. So Hero should be visible normally (no animation, but not hidden either). This is not the primary bug for Hero - it simply won't animate.

- timestamp: 2026-01-29T00:02:00Z
  checked: ProductTeasers.astro
  found: data-animate is on the three <a class="card-link"> elements (lines 9, 15, 21). The parent <section> and <h2> do NOT have data-animate.
  implication: Product cards SHOULD animate. The cards will start invisible (opacity:0) and need is-visible class to appear.

- timestamp: 2026-01-29T00:03:00Z
  checked: SocialLinks.astro
  found: data-animate is on the <div class="links-container"> (line 8). The <section> and <h2> do NOT have data-animate.
  implication: Social links container SHOULD animate.

- timestamp: 2026-01-29T00:04:00Z
  checked: BaseLayout.astro - IntersectionObserver script
  found: Script listens to 'astro:page-load', queries all [data-animate], observes them with threshold 0.15 and rootMargin '0px 0px -10% 0px'. Adds 'is-visible' class on intersection.
  implication: Script logic looks correct for standard Astro usage.

- timestamp: 2026-01-29T00:05:00Z
  checked: animations.css
  found: [data-animate] sets opacity:0 and translateY(30px). [data-animate].is-visible sets opacity:1 and translateY(0). Transitions defined.
  implication: CSS is correct. Elements with data-animate start hidden, become visible when is-visible class added.

## Resolution

root_cause:
fix:
verification:
files_changed: []
