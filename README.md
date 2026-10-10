# TrimCircle — home page

Static, pre-rendered home page in English (`/`) and Hindi (`/hi/`), animated with GSAP + ScrollTrigger + Lenis.

```bash
npm install          # only needed to refresh vendored libs/fonts
node build.mjs       # → dist/  (deploy this folder to Vercel/Netlify/any static host)
node tools/artifact.mjs   # optional: claude.ai preview build → dist-artifact/
```

## Where things live
- `messages/en.json`, `messages/hi.json` — every word on the page (ICU plurals, next-intl compatible). `hi.json` is an AI draft: get a native speaker to review before launch.
- `i18n/locales.mjs` — all 13 Indian languages registered (incl. Urdu RTL). To launch one: add `messages/<code>.json`, set `ready: true`, add its Noto font to `src/assets/css/fonts.css`, rebuild.
- `data/home.mjs` — **set `whatsappNumber` and `siteUrl`**; categories, looks and salons are SAMPLE data.
- `src/assets/photos/` — placeholder art (marked "Example photo"). Replace with real Agra salon photos, same file names, WebP, same aspect ratio.
- `src/assets/css/site.css`, `src/assets/js/main.js` — styles and motion. `PLAN.md` — design + motion plan.

# salon-directory

## Checks run
Playwright at 390px and 1440px, English and Hindi: no horizontal overflow, no console errors, tap targets ≥ 44px, Devanagari matras intact, reduced-motion shows everything instantly, search validation, filters, language switch.
