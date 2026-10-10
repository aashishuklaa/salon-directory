// Pre-renders one static home page per ready locale: dist/index.html (en), dist/hi/index.html, …
// Usage: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, READY, DEFAULT_LOCALE, byCode, pagePath } from './i18n/locales.mjs';
import { createT, money, num } from './i18n/t.mjs';
import { CONFIG, CATEGORIES, LOOKS, SALONS, HERO_PHOTOS, STEP_PHOTOS } from './data/home.mjs';
import { ICONS as I } from './src/icons.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const readJSON = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const EN = readJSON('messages/en.json');

// ---------- logo (the supplied SVGs, used as-is; only the background rect and remote font import are removed) ----------
const rawLogo = f => fs.readFileSync(path.join(ROOT, 'src/assets/img', f), 'utf8');
const cleanLogo = (svg, cls, label) =>
  svg
    .replace(/<defs>[\s\S]*?<\/defs>/, '')
    .replace(/<rect [^>]*\/>/, '')
    .replace('<svg ', `<svg class="${cls}" role="img" aria-label="${label}" preserveAspectRatio="xMinYMid meet" `)
    .replace(/ width="\d+" height="\d+"/, '');
const LOGO_H = rawLogo('trimcircle-horizontal.svg');
const MARK_G = LOGO_H.match(/<g [\s\S]*?<\/g>/)[0];
const mark = cls => `<svg class="${cls}" viewBox="26 22 212 200" aria-hidden="true" focusable="false">${MARK_G}</svg>`;

// ---------- helpers ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const emph = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const strip = s => String(s).replace(/\*/g, '');
const pad = n => String(n).padStart(2, '0');

function photo(base, name, { alt = '', cls = '', sizes = '100vw', eager = false, label } = {}) {
  return `<figure class="ph ${cls}">
      <span class="ph__in"><img src="${base}assets/photos/${name}.webp" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" sizes="${sizes}"></span>
      ${label ? `<figcaption class="ph__tag">${esc(label)}</figcaption>` : ''}
    </figure>`;
}

function render(locale) {
  const L = byCode(locale);
  const missing = [];
  const t = createT(readJSON(`messages/${locale}.json`), EN, locale, missing);
  const base = locale === DEFAULT_LOCALE ? '' : '../';
  const href = code => (code === DEFAULT_LOCALE ? (base || './') : base + pagePath(code));
  const year = new Date().getFullYear();
  const ex = t('common.examplePhoto');
  const areas = t.raw('areas');
  const price = n => money(n, locale);

  const langList = (cls) => `
    <ul class="${cls}" role="list">
      ${LOCALES.map(l => l.ready
        ? `<li><a class="lang__opt${l.code === locale ? ' is-current' : ''}" href="${href(l.code)}" hreflang="${l.hreflang}" lang="${l.hreflang}" data-locale="${l.code}"${l.code === locale ? ' aria-current="true"' : ''}><span>${l.name}</span>${l.code === locale ? I.check : ''}</a></li>`
        : `<li><span class="lang__opt is-soon" lang="${l.hreflang}" dir="${l.dir}" aria-disabled="true"><span>${l.name}</span><small lang="${L.hreflang}" dir="ltr">${esc(t('common.comingSoon'))}</small></span></li>`).join('')}
    </ul>`;

  const runtime = {
    locale, hreflang: L.hreflang,
    hero: Object.fromEntries(['locating', 'located', 'denied', 'empty', 'badPincode', 'searching', 'searchingCat'].map(k => [k, t.raw(`hero.${k}`)])),
    salons: { count: t.raw('salons.count'), empty: t.raw('salons.empty') },
    hindiPrompt: locale === 'en' ? { text: 'यह पेज हिन्दी में देखें?', yes: 'हिन्दी में देखें', no: 'No thanks', href: href('hi') } : null,
  };

  const navLinks = [['services', '#services'], ['how', '#how'], ['looks', '#looks'], ['salons', '#salons']];
  const waHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t('owners.waText'))}`;

  const html = `<!doctype html>
<html lang="${L.hreflang}" dir="${L.dir}" data-locale="${locale}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t('meta.title'))}</title>
<meta name="description" content="${esc(t('meta.description'))}">
<meta name="theme-color" content="#FFFFFF">
<link rel="canonical" href="${CONFIG.siteUrl}/${locale === DEFAULT_LOCALE ? '' : locale + '/'}">
${READY.map(l => `<link rel="alternate" hreflang="${l.hreflang}" href="${CONFIG.siteUrl}/${l.code === DEFAULT_LOCALE ? '' : l.code + '/'}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${CONFIG.siteUrl}/">
<meta property="og:title" content="${esc(t('meta.title'))}">
<meta property="og:description" content="${esc(t('meta.description'))}">
<meta property="og:locale" content="${L.hreflang.replace('-', '_')}">
<link rel="icon" href="${base}assets/img/trimcircle-app-icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}assets/img/trimcircle-app-icon.png">
<link rel="preload" href="${base}assets/fonts/cormorant-garamond-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${base}assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
${L.script === 'Devanagari' ? `<link rel="preload" href="${base}assets/fonts/tiro-devanagari-hindi-devanagari-400-normal.woff2" as="font" type="font/woff2" crossorigin>` : ''}
<link rel="preload" href="${base}assets/video/hero-poster.jpg" as="image" fetchpriority="high">
<link rel="stylesheet" href="${base}assets/css/fonts.css">
<link rel="stylesheet" href="${base}assets/css/site.css">
<script>
  // Hidden start states are only applied when JS (and motion) can actually run.
  (function(d){var h=d.documentElement;h.classList.remove('no-js');h.classList.add('js');h.lang='${L.hreflang}';h.dir='${L.dir}';h.setAttribute('data-locale','${locale}');
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!rm){h.classList.add('motion');try{if(!sessionStorage.getItem('tc-intro'))h.classList.add('intro-on')}catch(e){h.classList.add('intro-on')}}
  setTimeout(function(){if(!h.classList.contains('ready'))h.classList.remove('motion','intro-on')},4500);})(document);
</script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'TrimCircle', url: CONFIG.siteUrl + '/', inLanguage: L.hreflang,
    description: t('meta.description'),
  })}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t('common.skip'))}</a>

<div class="intro" aria-hidden="true">
  <div class="intro__mark">
    <svg class="intro__ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" pathLength="1"/></svg>
    ${mark('intro__logo')}
  </div>
  <p class="intro__count"><span class="intro__num">0</span></p>
  <p class="intro__msg">${esc(t('intro.loading'))}</p>
</div>

<div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"><span class="cursor__label"></span></span></div>

<header class="hdr">
  <div class="hdr__bar">
    <a class="hdr__logo" href="#top" aria-label="TrimCircle home">${cleanLogo(LOGO_H, 'logo', 'TrimCircle — salons near you')}</a>
    <nav class="hdr__nav" aria-label="Main">
      ${navLinks.map(([k, h]) => `<a class="ulink" href="${h}">${esc(t('nav.' + k))}</a>`).join('')}
    </nav>
    <div class="hdr__right">
      <div class="lang" data-lang>
        <button class="lang__btn" type="button" aria-expanded="false" aria-controls="lang-pop-${locale}" aria-label="${esc(t('common.chooseLanguage'))}: ${L.name}">
          ${I.globe}<span>${L.name}</span>${I.chevron}
        </button>
        <div class="lang__pop" id="lang-pop-${locale}" hidden>
          <p class="lang__title">${esc(t('common.chooseLanguage'))}</p>
          ${langList('lang__list')}
        </div>
      </div>
      <a class="btn btn--ghost btn--sm hdr__cta magnetic" href="#owners">${esc(t('nav.listCta'))}</a>
      <button class="hdr__menu" type="button" aria-expanded="false" aria-controls="sheet">${I.menu}<span class="sr">${esc(t('common.menu'))}</span></button>
    </div>
  </div>
</header>

<div class="sheet" id="sheet" hidden>
  <div class="sheet__top">
    ${cleanLogo(LOGO_H, 'logo', 'TrimCircle')}
    <button class="sheet__close" type="button">${I.close}<span class="sr">${esc(t('common.close'))}</span></button>
  </div>
  <nav class="sheet__nav" aria-label="Mobile">
    ${[...navLinks, ['owners', '#owners']].map(([k, h], i) => `<a href="${h}"><small>${pad(i + 1)}</small>${esc(t('nav.' + k))}</a>`).join('')}
  </nav>
  <div class="sheet__lang"><p class="lang__title">${I.globe} ${esc(t('common.language'))}</p>${langList('lang__list lang__list--grid')}</div>
</div>

<main id="main">
<!-- ============ HERO ============ -->
<section class="hero" id="top">
  <div class="hero__copy">
    <p class="hero__kicker rise">${esc(t('hero.kicker'))}</p>
    <h1 class="hero__title">${t.raw('hero.lines2').map(l => `<span class="line"><span class="line__in">${emph(l.trim())}</span></span>`).join('')}</h1>
    <p class="hero__sub rise">${t.raw('hero.subLines').map(esc).join('<br>')}</p>

    <!-- Directory search: what (category) + where (area / pincode / near me) -->
    <form class="search rise" role="search" action="#salons" novalidate>
      <div class="search__row">
        <div class="search__seg search__seg--what">
          <label class="search__label" for="cat-${locale}">${esc(t('hero.whatLabel'))}</label>
          <div class="search__select">
            ${I.scissors}
            <select id="cat-${locale}" name="cat">
              <option value="all">${esc(t('hero.whatAll'))}</option>
              ${CATEGORIES.map(c => `<option value="${c.key}">${esc(t(`categories.items.${c.key}.name`))}</option>`).join('')}
            </select>
            ${I.chevron}
          </div>
        </div>
        <div class="search__seg search__seg--where">
          <label class="search__label" for="q-${locale}">${esc(t('hero.searchLabel'))}</label>
          <div class="search__field">
            ${I.pin}
            <input id="q-${locale}" name="q" type="text" autocomplete="address-level3" enterkeyhint="search" placeholder="${esc(t('hero.placeholder'))}" aria-describedby="q-status-${locale}">
            <button class="search__near" type="button" data-near>${I.locate}<span>${esc(t('hero.nearMe'))}</span></button>
          </div>
        </div>
        <button class="btn btn--primary search__go" type="submit">${I.search}<span>${esc(t('hero.submit'))}</span></button>
      </div>
      <p class="search__status" id="q-status-${locale}" role="status" aria-live="polite"></p>
    </form>

    <div class="popular rise">
      <span class="popular__label">${esc(t('hero.popularShort'))}:</span>
      <ul class="popular__list" role="list" aria-label="${esc(t('hero.popular'))}">
        ${areas.slice(0, 4).map(a => `<li><button type="button" class="chip" data-area="${esc(a)}">${esc(a)}</button></li>`).join('')}
      </ul>
    </div>
  </div>

  <!-- Background video: main.js picks the small or large file and only plays it when motion is allowed. -->
  <div class="hero__bg" aria-hidden="true">
    <video class="hero__video" muted loop playsinline preload="none" poster="${base}assets/video/hero-poster.jpg"
      data-src="${base}assets/video/hero.mp4" data-src-sm="${base}assets/video/hero-sm.mp4"></video>
    <span class="hero__shade"></span>
  </div>
  <span class="hero__tag ph__tag">${esc(ex)}</span>
  <button class="hero__pause" type="button" hidden aria-pressed="false" data-label-pause="${esc(t('hero.pause'))}" data-label-play="${esc(t('hero.play'))}" aria-label="${esc(t('hero.pause'))}">${I.pause}${I.play}</button>
</section>

<!-- ============ CATEGORIES ============ -->
<section class="svc" id="services" aria-labelledby="svc-h">
  <div class="sec-head sec-head--row">
    <div>
      <p class="kicker">${esc(t('categories.kicker'))}</p>
      <h2 id="svc-h" class="h2 h2--md" data-split>${esc(t('categories.heading'))}</h2>
    </div>
    <a class="btn btn--ghost btn--sm svc__all" href="#salons" data-filter="all">${esc(t('categories.viewAll'))}${I.arrow}</a>
  </div>
  <ul class="svc__cards" role="list">
    ${CATEGORIES.map(c => `<li>
      <a class="svc-card" href="#salons" data-filter="${['men', 'women', 'kids', 'bridal', 'unisex'].includes(c.key) ? c.key : 'all'}">
        <span class="svc-card__ph"><img src="${base}assets/photos/${c.photo}.webp" alt="" loading="lazy" decoding="async" width="720" height="900"></span>
        <span class="svc-card__name">${esc(t(`categories.items.${c.key}.card`))}</span>
        <span class="svc-card__from">${esc(t('common.from', { price: price(c.from) }))}</span>
      </a>
    </li>`).join('')}
  </ul>
</section>

<!-- ============ HOW IT WORKS (three compact steps) ============ -->
<section class="how" id="how" aria-labelledby="how-h">
  <div class="sec-head">
    <p class="kicker">${esc(t('how.kicker'))}</p>
    <h2 id="how-h" class="h2 h2--md" data-split>${emph(t('how.title'))}</h2>
  </div>
  <ol class="how__steps" role="list">
    ${t.raw('how.steps').map((s, i) => `<li class="how-step">
      <span class="how-step__icon">${[I.pin, I.tag, I.phone][i]}</span>
      <span class="how-step__num">${pad(i + 1)}</span>
      <h3 class="how-step__title">${esc(s.title)}</h3>
      <p class="how-step__body">${esc(s.short)}</p>
    </li>`).join('')}
  </ol>
</section>

<!-- ============ LOOKS OF AGRA (pinned horizontal gallery) ============ -->
<section class="looks" id="looks" aria-labelledby="looks-h">
  <div class="looks__pin">
    <div class="looks__track">
      <div class="looks__intro">
        <h2 id="looks-h" class="h2 h2--xl" data-split>${emph(t('looks.title'))}</h2>
        <p class="sec-sub">${esc(t('looks.sub'))}</p>
        <p class="looks__hint"><span class="looks__hint-touch">${esc(t('looks.hintTouch'))}</span><span class="looks__hint-scroll">${esc(t('looks.hintScroll'))}</span> ${I.arrow}</p>
      </div>
      <div class="looks__cards">
      ${t.raw('looks.items').map((it, i) => `<article class="look" data-cursor="${esc(t('common.sample'))}">
        <div class="look__ph"><img src="${base}assets/photos/${LOOKS[i].photo}.webp" alt="${esc(it.name)} — ${esc(ex)}" loading="lazy" decoding="async"><span class="ph__tag">${esc(ex)}</span></div>
        <div class="look__cap">
          <span class="look__n">${pad(i + 1)}</span>
          <h3 class="look__name">${esc(it.name)}</h3>
          <p class="look__meta"><span lang="en">${esc(it.salon)}</span> · ${esc(it.area)}</p>
          <p class="look__price">${esc(t('common.from', { price: price(LOOKS[i].price) }))}</p>
        </div>
      </article>`).join('')}
      </div>
    </div>
  </div>
</section>

<!-- ============ SALONS NEAR YOU ============ -->
<section class="salons" id="salons" aria-labelledby="salons-h">
  <div class="sec-head sec-head--row">
    <div>
      <h2 id="salons-h" class="h2" data-split>${emph(t('salons.title'))}</h2>
      <p class="sec-sub" data-salons-sub>${esc(t('salons.sub'))}</p>
    </div>
    <div class="filters" role="group" aria-label="${esc(t('salons.filterLabel'))}">
      ${Object.entries(t.raw('salons.filters')).map(([k, v], i) => `<button type="button" class="pill" data-f="${k}" aria-pressed="${i === 0}">${esc(v)}</button>`).join('')}
    </div>
  </div>
  <p class="salons__count" aria-live="polite" data-count>${esc(t('salons.count', { count: SALONS.length }))}</p>
  <div class="salons__grid">
    ${SALONS.map((s, i) => `<article class="salon" data-tags="${s.tags.join(' ')}" data-open="${s.open}">
      <div class="salon__ph">
        <img src="${base}assets/photos/${s.photo}.webp" alt="${esc(s.name)} — ${esc(ex)}" loading="lazy" decoding="async">
        <span class="salon__status ${s.open ? 'is-open' : ''}">${s.open ? `<i></i>${esc(t('salons.openNow'))}` : `${I.clock}${esc(t('salons.opensAt', { time: s.opensAt }))}`}</span>
        <span class="ph__tag">${esc(ex)}</span>
        ${s.deal ? `<span class="salon__deal">${I.tag}${esc(t('salons.deals.' + s.deal))}</span>` : ''}
      </div>
      <div class="salon__body">
        <div class="salon__top">
          <h3 class="salon__name" lang="en">${esc(s.name)}</h3>
          <span class="salon__sample">${esc(t('common.sample'))}</span>
        </div>
        <p class="salon__meta">${I.pin}<span>${esc(areas[s.areaIndex])} · ${esc(t('salons.distance', { km: num(s.km, locale) }))}</span></p>
        <p class="salon__tags">${s.tags.map(x => `<span>${esc(t('salons.tags.' + x))}</span>`).join('')}</p>
        <div class="salon__foot">
          <p class="salon__price">${esc(t('common.from', { price: price(s.from) }))}</p>
          <div class="salon__actions">
            <a class="iconbtn" href="tel:${s.phone}" aria-label="${esc(t('salons.call'))} ${esc(s.name)}">${I.phone}<span>${esc(t('salons.call'))}</span></a>
            <a class="iconbtn iconbtn--wa" href="https://wa.me/${s.phone.replace('+', '')}" target="_blank" rel="noopener" aria-label="${esc(t('salons.whatsapp'))} ${esc(s.name)}">${I.chat}<span>${esc(t('salons.whatsapp'))}</span></a>
          </div>
        </div>
      </div>
    </article>`).join('')}
  </div>
  <div class="salons__empty" hidden>
    <p>${esc(t('salons.empty'))}</p>
    <button type="button" class="btn btn--ghost" data-f-reset>${esc(t('salons.showAll'))}</button>
  </div>
</section>

<!-- ============ FOR SALON OWNERS (the one dark block) ============ -->
<section class="owners" id="owners" aria-labelledby="owners-h">
  <div class="owners__in">
    <div class="owners__copy">
      <h2 id="owners-h" class="h2 h2--light" data-split>${emph(t('owners.title'))}</h2>
      <p class="owners__sub">${esc(t('owners.sub'))}</p>
      <ol class="owners__steps" role="list">
        ${t.raw('owners.steps').map((s, i) => `<li><span>${i + 1}</span>${esc(s)}</li>`).join('')}
      </ol>
      <div class="owners__cta">
        <a class="btn btn--primary btn--lg magnetic" href="${waHref}" target="_blank" rel="noopener" data-cursor="WhatsApp">${I.chat}<span>${esc(t('owners.cta'))}</span></a>
        <p class="owners__note">${esc(t('owners.ctaNote'))}</p>
      </div>
      <dl class="facts">
        ${t.raw('owners.facts').map(f => `<div class="fact"><dt><span class="fact__p">${esc(f.prefix)}</span><span class="fact__v" data-count-to="${f.value}">${f.value}</span><span class="fact__s">${esc(f.suffix)}</span></dt><dd>${esc(f.label)}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="owners__phone" aria-hidden="true">
      <div class="phone">
        <div class="phone__top">${mark('phone__avatar')}<div><strong>${esc(t('owners.chatName'))}</strong><small>${esc(t('owners.chatStatus'))}</small></div></div>
        <div class="phone__chat">
          ${t.raw('owners.chat').map(m => `<p class="bubble bubble--${m.from}">${esc(m.text)}</p>`).join('')}
          <p class="bubble bubble--bot bubble--typing"><i></i><i></i><i></i></p>
        </div>
      </div>
    </div>
  </div>
</section>
</main>

<!-- ============ FOOTER ============ -->
<footer class="ftr">
  <div class="ftr__top">
    <div class="ftr__brand">
      ${cleanLogo(LOGO_H, 'logo', 'TrimCircle')}
      <p class="ftr__tag">${esc(t('footer.tagline'))}</p>
    </div>
    <nav class="ftr__col" aria-label="${esc(t('footer.explore'))}">
      <p class="ftr__h">${esc(t('footer.explore'))}</p>
      ${navLinks.map(([k, h]) => `<a class="ulink" href="${h}">${esc(t('nav.' + k))}</a>`).join('')}
    </nav>
    <div class="ftr__col">
      <p class="ftr__h">${esc(t('footer.owners'))}</p>
      <a class="ulink" href="${waHref}" target="_blank" rel="noopener">${esc(t('footer.ownersLink'))}</a>
      <a class="ulink" href="#owners">${esc(t('nav.listCta'))}</a>
    </div>
    <div class="ftr__col ftr__langs">
      <p class="ftr__h">${I.globe} ${esc(t('footer.languages'))}</p>
      <ul class="ftr__langlist" role="list">
        ${LOCALES.filter(l => l.ready).map(l => `<li><a class="ulink${l.code === locale ? ' is-current' : ''}" href="${href(l.code)}" hreflang="${l.hreflang}" lang="${l.hreflang}" data-locale="${l.code}"${l.code === locale ? ' aria-current="true"' : ''}>${l.name}</a></li>`).join('')}
      </ul>
      <p class="ftr__soon">${esc(t('footer.moreLangs', { count: LOCALES.filter(l => !l.ready).length }))}</p>
    </div>
  </div>
  <div class="ftr__bottom">
    <p>${esc(t('footer.rights', { year }))}</p>
    <p>${esc(t('footer.photosNote'))}</p>
    <a class="ulink" href="#top">${I.arrowUp}${esc(t('footer.top'))}</a>
  </div>
</footer>

<button class="dock" type="button" data-dock aria-label="${esc(t('hero.submit'))}">${I.search}<span>${esc(t('hero.submit'))}</span></button>

<script type="application/json" id="tc-runtime">${JSON.stringify(runtime).replace(/</g, '\\u003c')}</script>
<script src="${base}assets/vendor/gsap.min.js" defer></script>
<script src="${base}assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="${base}assets/vendor/Flip.min.js" defer></script>
<script src="${base}assets/vendor/lenis.min.js" defer></script>
<script src="${base}assets/js/main.js" defer></script>
</body>
</html>`;
  return { html, missing };
}

// ---------- write ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'src/assets'), path.join(DIST, 'assets'), { recursive: true });
for (const l of READY) {
  const { html, missing } = render(l.code);
  const out = path.join(DIST, pagePath(l.code));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`built ${pagePath(l.code)}${missing.length ? `  (missing ${missing.length}: ${[...new Set(missing)].join(', ')})` : ''}`);
}
