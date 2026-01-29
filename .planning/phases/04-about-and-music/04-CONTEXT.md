# Phase 4: About & Music - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

A combined Story page (/story) that tells Greg's founder story and showcases music. Includes an About narrative, embedded music players, and contact information. This completes the brand presence — the final page of the site.

</domain>

<decisions>
## Implementation Decisions

### About page content & tone
- Founder story tone — personal narrative about who Greg is and why tuniice exists
- Rich detail level — full narrative with journey, influences, technical interests, creative philosophy (multiple sections)
- Photo: geometric placeholder SVG for now, with a slot designed for swapping in a real photo later
- Technical background highlights full-stack breadth — iOS, web, hardware, audio engineering — tuniice spans multiple disciplines

### Page navigation & structure
- Combined single page at /story (not separate /about and /music pages)
- Single scroll flow — no internal section navigation or jump links
- Navigation: both a brief "About tuniice" teaser section on the home page linking to /story AND a Story link in the footer
- Nav label: "Story"

### Music page presentation
- Bandcamp + SoundCloud both featured
- Bandcamp displayed as embedded iframe players (visitors can preview/play directly on page)
- Show latest 1-2 releases only, with a link to full Bandcamp profile for the complete discography
- Placeholder embed styling for now — ready to swap in real Bandcamp/SoundCloud URLs later

### Contact approach
- Email link only (no contact form)
- Lives on the Story page — contact section at the bottom as natural end to the narrative
- Styled as a button/link ("Get in touch" or similar) rather than showing raw email address
- Contact section includes social links (Bandcamp, SoundCloud, etc.) grouped as a "Connect" section

### Claude's Discretion
- Exact section ordering within the Story page
- Typography and spacing choices for the narrative sections
- Placeholder photo SVG design
- Placeholder music embed styling
- How to visually separate the story, music, and contact sections

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-about-and-music*
*Context gathered: 2026-01-29*
