/* TrimCircle home — interactions + motion.
   Content is fully visible without JS; hidden start states only apply under html.motion. */
(() => {
  'use strict';
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const R = JSON.parse($('#tc-runtime').textContent);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const fmt = (s, v = {}) => s
    .replace(/\{(\w+), plural, ((?:[^{}]|\{[^{}]*\})*)\}/g, (_, k, body) => {
      const n = Number(v[k]);
      const forms = Object.fromEntries([...body.matchAll(/(\w+|=\d+)\s*\{([^}]*)\}/g)].map(m => [m[1], m[2]]));
      const pr = new Intl.PluralRules(R.hreflang).select(n);
      return (forms['=' + n] ?? forms[pr] ?? forms.other ?? '').replace(/#/g, n);
    })
    .replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));

  /* ------------------------------------------------------------------ language */
  function rememberLocale(code) {
    try { localStorage.setItem('tc-locale', code); } catch (e) {}
    // Same cookie name next-intl reads, so a later Next.js version keeps the choice.
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;SameSite=Lax`;
  }
  $$('a[data-locale]').forEach(a => a.addEventListener('click', () => rememberLocale(a.dataset.locale)));

  $$('[data-lang]').forEach(box => {
    const btn = $('.lang__btn', box), pop = $('.lang__pop', box);
    const close = () => { btn.setAttribute('aria-expanded', 'false'); pop.hidden = true; };
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open)); pop.hidden = !open;
      if (open) $('a.lang__opt, .lang__opt', pop)?.focus?.();
    });
    document.addEventListener('click', e => { if (!box.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { close(); btn.focus(); } });
  });

  // Gentle Hindi suggestion on the English page: never a redirect, only once, only if the browser prefers Hindi.
  try {
    const saved = localStorage.getItem('tc-locale');
    const prefersHi = (navigator.languages || [navigator.language]).some(l => /^hi\b/i.test(l));
    if (R.hindiPrompt && !saved && prefersHi && !sessionStorage.getItem('tc-hi-asked')) {
      sessionStorage.setItem('tc-hi-asked', '1');
      const el = document.createElement('div');
      el.className = 'toast'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Language');
      el.innerHTML = `<p lang="hi">${R.hindiPrompt.text}</p><a href="${R.hindiPrompt.href}" lang="hi" hreflang="hi-IN">${R.hindiPrompt.yes}</a><button type="button">${R.hindiPrompt.no}</button>`;
      $('a', el).addEventListener('click', () => rememberLocale('hi'));
      $('button', el).addEventListener('click', () => { rememberLocale('en'); el.remove(); });
      setTimeout(() => document.body.appendChild(el), 2600);
    }
  } catch (e) {}

  /* ------------------------------------------------------------------ mobile sheet */
  const sheet = $('#sheet'), menuBtn = $('.hdr__menu');
  const setSheet = open => {
    sheet.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    if (open) $('.sheet__close', sheet).focus(); else menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => setSheet(true));
  $('.sheet__close', sheet).addEventListener('click', () => setSheet(false));
  $$('.sheet__nav a', sheet).forEach(a => a.addEventListener('click', () => { sheet.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; window.__lenis?.start(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) setSheet(false); });

  /* ------------------------------------------------------------------ smooth anchor scrolling */
  const scrollToEl = (el, offset = 0) => {
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -(parseInt(getComputedStyle(html).scrollPaddingTop) || 80) + offset, duration: 1.2 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = id === '#top' ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    if (id === '#top') { window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }
    else scrollToEl(target);
    history.replaceState(null, '', id);
  });

  /* ------------------------------------------------------------------ search */
  const form = $('.search'), input = $('input', form), status = $('.search__status', form), nearBtn = $('[data-near]', form);
  const salonsSub = $('[data-salons-sub]');
  const say = (msg, err = false) => { status.textContent = msg; status.classList.toggle('is-error', err); };
  function showResults(msg) {
    say(msg);
    salonsSub.textContent = msg;
    setTimeout(() => scrollToEl($('#salons')), 450);
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim(), cat = form.elements.cat;
    // A service on its own is a valid search; an area is only needed when no service is picked.
    if (!q && cat.value === 'all') { say(R.hero.empty, true); input.focus(); return; }
    if (/^\d+$/.test(q) && q.length !== 6) { say(R.hero.badPincode, true); input.focus(); return; }
    applyFilter(cat.value);
    showResults(q ? fmt(R.hero.searching, { query: q }) : fmt(R.hero.searchingCat, { cat: cat.selectedOptions[0].text }));
  });
  nearBtn.addEventListener('click', () => {
    if (!('geolocation' in navigator)) { say(R.hero.denied, true); input.focus(); return; }
    nearBtn.classList.add('is-busy'); nearBtn.setAttribute('aria-busy', 'true'); say(R.hero.locating);
    navigator.geolocation.getCurrentPosition(
      () => { nearBtn.classList.remove('is-busy'); nearBtn.removeAttribute('aria-busy'); showResults(R.hero.located); },
      () => { nearBtn.classList.remove('is-busy'); nearBtn.removeAttribute('aria-busy'); say(R.hero.denied, true); input.focus(); },
      { timeout: 10000, maximumAge: 300000 }
    );
  });
  $$('.chip[data-area]').forEach(c => c.addEventListener('click', () => { input.value = c.dataset.area; form.requestSubmit(); }));

  /* ------------------------------------------------------------------ salon filters (FLIP) */
  const grid = $('.salons__grid'), cards = $$('.salon', grid), pills = $$('.pill[data-f]'), empty = $('.salons__empty'), countEl = $('[data-count]');
  function applyFilter(f) {
    const state = hasGsap && window.Flip && !reduced ? Flip.getState(cards) : null;
    let n = 0;
    cards.forEach(c => {
      const ok = f === 'all' || (f === 'open' ? c.dataset.open === 'true' : c.dataset.tags.split(' ').includes(f));
      c.hidden = !ok; if (ok) n++;
    });
    pills.forEach(p => p.setAttribute('aria-pressed', String(p.dataset.f === f)));
    empty.hidden = n > 0;
    countEl.textContent = n ? fmt(R.salons.count, { count: n }) : '';
    if (state) Flip.from(state, { duration: .7, ease: 'expo.out', absolute: true, onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: .6, ease: 'expo.out' }), onLeave: els => gsap.to(els, { opacity: 0, scale: .94, duration: .3 }) });
    if (hasGsap) ScrollTrigger.refresh();
  }
  pills.forEach(p => p.addEventListener('click', () => applyFilter(p.dataset.f)));
  $('[data-f-reset]').addEventListener('click', () => applyFilter('all'));
  $$('.svc-card[data-filter], .svc__all[data-filter]').forEach(r => r.addEventListener('click', () => applyFilter(r.dataset.filter)));

  /* ------------------------------------------------------------------ mobile dock */
  const dock = $('[data-dock]');
  dock.addEventListener('click', () => {
    window.__lenis ? window.__lenis.scrollTo(0, { duration: 1 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(() => input.focus({ preventScroll: true }), reduced ? 0 : 700);
  });
  if ('IntersectionObserver' in window) {
    let pastSearch = false, inOwners = false, inFtr = false;
    const upd = () => dock.classList.toggle('is-on', pastSearch && !inOwners && !inFtr);
    new IntersectionObserver(([e]) => { pastSearch = !e.isIntersecting && e.boundingClientRect.top < 0; upd(); }).observe(form);
    new IntersectionObserver(([e]) => { inOwners = e.isIntersecting; upd(); }, { rootMargin: '0px 0px -30% 0px' }).observe($('.owners'));
    new IntersectionObserver(([e]) => { inFtr = e.isIntersecting; upd(); }).observe($('.ftr'));
  }

  /* ------------------------------------------------------------------ header (works without GSAP) */
  const hdr = $('.hdr');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-scrolled', y > 12);
    const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (goingDown && y > 240 && sheet.hidden) { hdr.classList.add('is-hidden'); $$('.lang__pop').forEach(p => { p.hidden = true; }); $$('.lang__btn').forEach(b => b.setAttribute('aria-expanded', 'false')); }
    else if (goingUp || y < 240) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  hdr.addEventListener('focusin', () => hdr.classList.remove('is-hidden'));

  /* ------------------------------------------------------------------ hero background video (works without GSAP) */
  // Poster only for reduced motion or data saver; small file on phones; paused while off screen.
  const heroVideo = $('.hero__video');
  const saveData = navigator.connection?.saveData;
  if (heroVideo && !reduced && !saveData) {
    // Start after page load so the multi-MB video doesn't hold up the category photos and fonts.
    const pauseBtn = $('.hero__pause');
    let userPaused = false;
    const start = () => {
      heroVideo.src = matchMedia('(min-width: 700px)').matches ? heroVideo.dataset.src : heroVideo.dataset.srcSm;
      const play = () => { if (!userPaused) heroVideo.play().catch(() => {}); };
      play();
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { e.isIntersecting ? play() : heroVideo.pause(); }).observe(heroVideo);
      // Visible pause control for the looping video (WCAG 2.2.2); a user pause sticks while scrolling.
      pauseBtn.hidden = false;
      pauseBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        userPaused ? heroVideo.pause() : play();
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        pauseBtn.setAttribute('aria-label', userPaused ? pauseBtn.dataset.labelPlay : pauseBtn.dataset.labelPause);
      });
    };
    document.readyState === 'complete' ? start() : addEventListener('load', start, { once: true });
  }

  /* ================================================================== MOTION */
  if (!hasGsap || reduced) { html.classList.add('ready'); html.classList.remove('motion', 'intro-on'); return; }

  gsap.registerPlugin(ScrollTrigger);
  if (window.Flip) gsap.registerPlugin(Flip);
  const EXPO = 'expo.out';
  html.classList.add('ready');

  // Lenis smooth scroll on desktop pointers only
  if (fine && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    window.__lenis = lenis;
    html.classList.add('lenis');
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- split helpers ---------- */
  function splitWords(el) {
    // Keeps <em> intact: wraps each word in a mask; em words stay italic.
    const out = [];
    const walk = (node, wrapEm) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const m = document.createElement('span'); m.className = 'wm';
            const i = document.createElement('span'); i.textContent = p;
            m.appendChild(i); frag.appendChild(m); out.push(i);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n, true);
      });
    };
    walk(el);
    return out;
  }

  /* ---------- hero entrance (after intro) ---------- */
  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: EXPO } });
    tl.to('.hero__title .line__in', { y: 0, duration: 1.25, stagger: .1 })
      .to('.hero .rise', { opacity: 1, y: 0, duration: 1, stagger: .08 }, '-=.9')
      .from('.hero__bg', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hdr__bar > *', { y: -20, opacity: 0, duration: .8, stagger: .06 }, 0);
    return tl;
  }

  /* ---------- intro (once per session) ---------- */
  if (html.classList.contains('intro-on')) {
    const num = $('.intro__num'), counter = { v: 0 };
    window.__lenis?.stop();
    const tl = gsap.timeline({ defaults: { ease: EXPO } });
    tl.from('.intro__logo', { scale: .6, opacity: 0, duration: .8 })
      .to('.intro__ring circle', { strokeDashoffset: 0, duration: 1.05, ease: 'power3.inOut' }, 0.1)
      .to(counter, { v: 100, duration: 1.05, ease: 'power3.inOut', onUpdate: () => { num.textContent = Math.round(counter.v); } }, 0.1)
      .from('.intro__msg', { opacity: 0, y: 8, duration: .6 }, 0.2)
      .to('.intro', { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' }, 1.2)
      .add(() => { html.classList.remove('intro-on'); window.__lenis?.start(); gsap.set('.intro', { display: 'none' }); try { sessionStorage.setItem('tc-intro', '1'); } catch (e) {} ScrollTrigger.refresh(); }, 2.0)
      .add(heroIn(), 1.45);
  } else {
    heroIn();
  }

  const mm = gsap.matchMedia();

  /* ---------- hero: video drifts slower than the page, copy lifts away ---------- */
  gsap.to('.hero__video', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__copy', { y: -60, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------- section headings: words rise from masks ---------- */
  $$('[data-split]').forEach(h => {
    const words = splitWords(h);
    gsap.from(words, { yPercent: 110, duration: 1.1, ease: EXPO, stagger: .06, scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
  });
  $$('.sec-sub, .owners__sub').forEach(p => gsap.from(p, { opacity: 0, y: 20, duration: 1, ease: EXPO, scrollTrigger: { trigger: p, start: 'top 90%', once: true } }));

  /* ---------- image clip reveals (outside hero) ---------- */
  $$('.reveal').forEach(r => {
    if (r.closest('.hero')) return;
    const inner = $('.ph__in', r), img = $('img', r);
    gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 88%', once: true } })
      .to(inner, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' })
      .to(img, { scale: 1, duration: 1.6, ease: EXPO }, 0);
  });

  /* ---------- category cards rise in ---------- */
  gsap.from('.svc__cards li', { opacity: 0, y: 30, duration: .9, ease: EXPO, stagger: .07, scrollTrigger: { trigger: '.svc__cards', start: 'top 88%', once: true } });

  /* ---------- how it works: steps rise in ---------- */
  gsap.from('.how-step', { opacity: 0, y: 30, duration: .9, ease: EXPO, stagger: .1, scrollTrigger: { trigger: '.how__steps', start: 'top 88%', once: true } });

  /* ---------- looks of agra: pinned horizontal gallery (desktop), native swipe (mobile) ---------- */
  mm.add('(min-width: 1024px)', () => {
    const track = $('.looks__track');
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.looks', start: 'top top', end: () => '+=' + dist(), pin: '.looks__pin', scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    $$('.look__ph img').forEach(img => {
      gsap.fromTo(img, { xPercent: -8, scale: 1.18 }, { xPercent: 8, scale: 1.18, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
    $$('.look').forEach(l => gsap.from($('.look__cap', l), { y: 30, opacity: 0, duration: .9, ease: EXPO, scrollTrigger: { trigger: l, containerAnimation: tween, start: 'left 85%', once: true } }));
  });
  mm.add('(max-width: 1023px)', () => {
    gsap.from('.look', { x: 60, opacity: 0, duration: 1, ease: EXPO, stagger: .08, scrollTrigger: { trigger: '.looks', start: 'top 70%', once: true } });
  });

  /* ---------- salon tiles ---------- */
  gsap.from('.salon', { y: 60, opacity: 0, duration: 1.1, ease: EXPO, stagger: .1, scrollTrigger: { trigger: '.salons__grid', start: 'top 85%', once: true }, clearProps: 'opacity' });
  $$('.salon__ph').forEach(p => gsap.fromTo(p, { clipPath: 'inset(12% 8% 12% 8% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 92%', once: true } }));

  /* ---------- owners: chat types in, count-up facts ---------- */
  const bubbles = $$('.bubble:not(.bubble--typing)'), typing = $('.bubble--typing');
  gsap.set(bubbles, { display: 'none', opacity: 0, y: 14, scale: .96 });
  const chat = gsap.timeline({ scrollTrigger: { trigger: '.phone', start: 'top 80%', once: true }, delay: .3 });
  bubbles.forEach(b => {
    const bot = b.classList.contains('bubble--bot');
    if (bot) chat.add(() => { b.before(typing); typing.style.display = 'flex'; }).to({}, { duration: .55 }).add(() => { typing.style.display = 'none'; });
    else chat.to({}, { duration: .3 });
    chat.set(b, { display: 'block' }).to(b, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(1.6)' });
  });
  gsap.from('.phone', { y: 80, rotate: 4, opacity: 0, duration: 1.3, ease: EXPO, scrollTrigger: { trigger: '.owners', start: 'top 70%', once: true } });
  gsap.from('.owners__steps li', { x: -24, opacity: 0, duration: .8, ease: EXPO, stagger: .1, scrollTrigger: { trigger: '.owners__steps', start: 'top 85%', once: true } });
  $$('[data-count-to]').forEach(el => {
    const to = parseFloat(el.dataset.countTo), o = { v: 0 };
    if (!to) return;
    el.textContent = '0';
    gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-IN'); } });
  });

  /* ---------- magnetic buttons + custom cursor (desktop) ---------- */
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const cleanups = [];
    $$('.magnetic').forEach(b => {
      const mv = e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: 'power3.out' }); };
      const lv = () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' });
      b.addEventListener('mousemove', mv); b.addEventListener('mouseleave', lv);
      cleanups.push(() => { b.removeEventListener('mousemove', mv); b.removeEventListener('mouseleave', lv); });
    });

    html.classList.add('cursor-on');
    const c = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const dx = gsap.quickTo(dot, 'x', { duration: .12, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: .12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    const mv = e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = e => {
      const media = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, input, [role="button"]');
      c.classList.toggle('is-media', !!media);
      c.classList.toggle('is-link', !media && !!link);
      if (media) label.textContent = media.dataset.cursor;
    };
    const hide = () => gsap.to(c, { opacity: 0, duration: .2 }), show = () => gsap.to(c, { opacity: 1, duration: .2 });
    addEventListener('mousemove', mv); document.addEventListener('mouseover', over);
    document.addEventListener('mouseleave', hide); document.addEventListener('mouseenter', show);
    cleanups.push(() => { html.classList.remove('cursor-on'); removeEventListener('mousemove', mv); document.removeEventListener('mouseover', over); });
    return () => cleanups.forEach(f => f());
  });

  // Fonts change line lengths; re-measure pins once they're in.
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
