---
phase: 10
slug: subdomain-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-03
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build (smoke test) — no unit test framework for this phase |
| **Config file** | bluepriint/astro.config.mjs |
| **Quick run command** | `cd bluepriint && npm run build` |
| **Full suite command** | `cd bluepriint && npm run build && npm run preview` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd bluepriint && npm run build`
- **After every plan wave:** Run `cd bluepriint && npm run build && npm run preview`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | SUB-02, SUB-03 | smoke | `cd bluepriint && npm run build` | ❌ W0 | ⬜ pending |
| 10-01-02 | 01 | 1 | SUB-04 | smoke | `cd bluepriint && npm run build` | ❌ W0 | ⬜ pending |
| 10-01-03 | 01 | 1 | SUB-04 | smoke | `cd bluepriint && npm run build` | ❌ W0 | ⬜ pending |
| 10-02-01 | 02 | 2 | SUB-01 | manual | `dig bluepriint.tuniice.com CNAME` | N/A | ⬜ pending |
| 10-02-02 | 02 | 2 | SUB-01 | manual | Visual check: visit bluepriint.tuniice.com | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `bluepriint/` directory — entire project scaffolded (Plan 01, Task 1)
- [ ] `bluepriint/package.json` — npm project initialized
- [ ] `bluepriint/astro.config.mjs` — Astro config created
- [ ] `bluepriint/src/styles/tokens.css` — copied from main site with accent override
- [ ] `bluepriint/src/styles/global.css` — copied from main site
- [ ] `bluepriint/src/styles/animations.css` — copied from main site

*Wave 0 is Plan 01 Task 1 — scaffolding the project creates the test infrastructure.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| bluepriint.tuniice.com resolves | SUB-01 | Requires DNS propagation + Vercel project setup | 1. Run `dig bluepriint.tuniice.com CNAME` 2. Visit URL in browser 3. Verify page loads (not 404) |
| Amber accent visually distinct from neon green | SUB-03 | Visual comparison required | 1. Open bluepriint.tuniice.com 2. Verify amber (#ffbf00) accents on borders/shadows 3. Compare with tuniice.com neon green (#00ff41) |
| Landing page has placeholder content | SUB-04 | Content presence verification | 1. Visit page 2. Verify hero has product name + tagline 3. Verify features section exists 4. Verify CTA section exists |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
