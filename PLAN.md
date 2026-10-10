# TrimCircle home page — design + motion plan

## User and goal
- **Who:** a parent in Agra on a mid-range Android phone, often more comfortable in Hindi. Second audience: a salon owner with little tech experience.
- **One main action:** search for salons near me (area / pincode, or "Near me").
- **Second action (owners):** start a free salon page on WhatsApp.
- **Must know before acting:** salons are nearby, prices are real, photos are real, it's free, no login.

## Stack (and why)
Static, pre-rendered multi-page site: `index.html` (English) and `hi/index.html` (Hindi), built by `build.mjs` from one template + `messages/<locale>.json`.
Every language has its own URL, `<html lang>`, hreflang, translated title/meta, and text that renders without JS.
GSAP + ScrollTrigger + Lenis are vendored locally (no CDN dependency). Fonts self-hosted (Manrope, Cormorant Garamond, Mukta, Tiro Devanagari Hindi, Cinzel + Montserrat for the logo wordmark), Devanagari files load only when Devanagari text is on screen (unicode-range).
Adding a language = add `messages/<code>.json` + flip `ready: true` in `i18n/locales.mjs`. All 13 locales from the skill are registered (incl. Urdu RTL).

## Sections, layout, motion
| # | Section | Mobile (390) | Desktop (1440) | Motion |
|---|---|---|---|---|
| 0 | Intro (once per session) | App-icon mark, terracotta circle draws around it, 0–100 counter | same | ≤1.4s, then curtain lifts (clip-path) |
| 1 | Header | Logo + language pill + menu | Logo, 4 links, language switcher, "List your salon" | Smart sticky: blur, hides on scroll down |
| 2 | Hero + search | Headline, sub-line, search card (area/pincode, Near me, Search), area chips, photo stack below | 7/5 split; layered 3-photo collage right with rotating circular badge | Lines rise from masks → sub-line → search → photos clip-reveal; scroll + mouse parallax; badge rotates |
| 3 | Area marquee | Agra colonies | same | Slow loop, speeds up with scroll velocity |
| 4 | Statement | Large serif paragraph | same, wider | Words ink 14% → 100% on scroll |
| 5 | Categories for the whole family | Rows with small thumb + "from ₹" | Hover list; image follows cursor | Row underline draws; quickTo image follow |
| 6 | How it works | 3 steps, each with its image | Sticky story: image pinned left, steps scroll right and swap image | Crossfade + scale; step number fills |
| 7 | Looks of Agra | Native swipe carousel (scroll-snap) | Pinned horizontal gallery | Scrubbed x; inner image parallax via containerAnimation |
| 8 | Salons near you | Filter pills + stacked tiles | Filter pills + staggered 3-col tiles (offset middle column) | Tiles clip-reveal; filter re-layout with FLIP |
| 9 | For salon owners (one dark green block) | Headline, 3 facts, WhatsApp CTA, chat mockup | Split: copy left, phone chat right | Chat bubbles type in on scroll; count-up facts; magnetic CTA |
| 10 | Footer | Links, language list, giant logo | same, giant logo full width | Logo rises in |

Global: magnetic buttons + custom cursor (desktop, pointer:fine only), focus rings, reduced-motion = everything shown instantly (no Lenis/pins/parallax/intro).
Indic: masked reveals get extra block padding, no letter-spacing/uppercase except `:lang(en)`, Hindi line-height 1.75.

## Checked against brand skill — removed
- No ALL-CAPS eyebrows above headings; no emoji icons; no identical card rows; no gradient blobs.
- Terracotta only on primary buttons, logo, one italic word and small highlights.
- No invented stats (salon counts, ratings). Sample salons/looks are labelled "Sample" and photos "Example photo".
