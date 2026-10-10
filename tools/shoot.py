"""Screenshot + checks. usage: python shoot.py <base_url> <outdir> [locale...]"""
import sys, os, json
from playwright.sync_api import sync_playwright

BASE, OUT = sys.argv[1], sys.argv[2]
LOCS = sys.argv[3:] or ['en', 'hi']
os.makedirs(OUT, exist_ok=True)
VIEWS = {'m': dict(width=390, height=844, is_mobile=True, has_touch=True, dsf=2), 'd': dict(width=1440, height=900, is_mobile=False, has_touch=False, dsf=1)}

CHECKS = """() => {
  const vw = innerWidth, out = {};
  out.overflowX = document.documentElement.scrollWidth - vw;
  out.wide = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > vw + 1 && !e.closest('.marquee,.looks__track,.filters,.cursor,.svc__float'); }).slice(0, 8).map(e => e.className || e.tagName);
  out.smallTargets = [...document.querySelectorAll('a, button, input')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width && r.height && cs.visibility !== 'hidden' && !e.closest('.sheet,.lang__pop,.marquee') && !e.classList.contains('skip') && (r.height < 40 || r.width < 40) && !e.closest('p'); }).slice(0, 15).map(e => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height) + ' "' + e.textContent.trim().slice(0, 24) + '"');
  out.hidden = [...document.querySelectorAll('h1,h2,h3,p,li')].filter(e => { const cs = getComputedStyle(e); return parseFloat(cs.opacity) < 0.05 && !e.closest('.intro,.svc__float,.cursor,.bubble--typing,[hidden]'); }).slice(0, 8).map(e => e.tagName + '.' + e.className + ' ' + e.textContent.trim().slice(0, 30));
  out.fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style);
  return out;
}"""

with sync_playwright() as p:
    br = p.chromium.launch(headless=True)
    report = {}
    for loc in LOCS:
        url = BASE + ('index.html' if loc == 'en' else f'{loc}/index.html')
        for vk, v in VIEWS.items():
            ctx = br.new_context(viewport=dict(width=v['width'], height=v['height']), device_scale_factor=v['dsf'], is_mobile=v['is_mobile'], has_touch=v['has_touch'], locale='en-IN')
            page = ctx.new_page()
            errs = []
            page.on('console', lambda m, errs=errs: m.type in ('error', 'warning') and errs.append(m.text))
            page.on('pageerror', lambda e, errs=errs: errs.append('PAGEERROR ' + str(e)))
            page.goto(url, wait_until='networkidle')
            page.wait_for_timeout(600)
            page.screenshot(path=f'{OUT}/{loc}-{vk}-00-intro.png')
            page.wait_for_timeout(2600)
            page.screenshot(path=f'{OUT}/{loc}-{vk}-01-hero.png')
            H = page.evaluate('document.documentElement.scrollHeight')
            step = int(v['height'] * 0.9)
            y, i = 0, 2
            while y < H:
                y += step
                page.mouse.wheel(0, step) if not v['is_mobile'] else page.evaluate(f'window.scrollTo(0,{y})')
                page.wait_for_timeout(900)
                page.screenshot(path=f'{OUT}/{loc}-{vk}-{i:02d}.png')
                i += 1
                H = page.evaluate('document.documentElement.scrollHeight')
                if i > 40: break
            checks = page.evaluate(CHECKS)
            checks['errors'] = errs
            report[f'{loc}-{vk}'] = checks
            ctx.close()
    br.close()
    json.dump(report, open(f"{OUT}/report.json", "w"), indent=1, ensure_ascii=False)
