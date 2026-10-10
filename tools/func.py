from playwright.sync_api import sync_playwright
import sys
OUT=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch()
    # interactions (desktop)
    pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(3000)
    pg.click('.search__go'); print('empty search ->', pg.inner_text('.search__status'))
    pg.fill('.search input','2820'); pg.click('.search__go'); print('bad pin ->', pg.inner_text('.search__status'))
    pg.fill('.search input','Kamla Nagar'); pg.click('.search__go'); pg.wait_for_timeout(2500)
    print('search ->', pg.inner_text('[data-salons-sub]'))
    pg.click('.pill[data-f="kids"]'); pg.wait_for_timeout(900)
    print('kids filter ->', pg.inner_text('[data-count]'), 'visible', pg.locator('.salon:not([hidden])').count())
    pg.click('.pill[data-f="bridal"]'); pg.wait_for_timeout(900); print('bridal ->', pg.inner_text('[data-count]'))
    pg.click('.pill[data-f="all"]'); pg.wait_for_timeout(500)
    pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(1200)
    pg.click('.hdr .lang__btn'); pg.wait_for_timeout(400); pg.screenshot(path=f'{OUT}/lang-open.png')
    pg.click('.hdr .lang__pop a[data-locale="hi"]'); pg.wait_for_load_state(); pg.wait_for_timeout(800)
    print('switched to', pg.evaluate('document.documentElement.lang'), pg.url)
    print('errors', errs)
    # reduced motion mobile
    ctx=b.new_context(viewport={'width':390,'height':844}, reduced_motion='reduce', is_mobile=True, has_touch=True, device_scale_factor=2)
    m=ctx.new_page(); m.goto('http://localhost:8765/hi/index.html'); m.wait_for_timeout(800)
    m.screenshot(path=f'{OUT}/reduced-hi.png')
    print('reduced: intro visible?', m.evaluate("getComputedStyle(document.querySelector('.intro')).display"), 'motion class', m.evaluate("document.documentElement.className"))
    m.click('.hdr__menu'); m.wait_for_timeout(300); m.screenshot(path=f'{OUT}/sheet-hi.png')
    b.close()
