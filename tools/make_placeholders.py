"""Generate soft, brand-toned placeholder 'photos' (salon interiors, abstracted).
They are clearly marked 'Example photo' in the page. Replace files in src/assets/photos/ with real photos
using the same names (WebP, same aspect ratio) and nothing else needs to change.
"""
import random, sys, os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

PALETTES = [
    # wall_top, wall_bottom, floor, mirror, accent, dark
    ("#EFE6D8", "#E2D3BD", "#C9B193", "#F7F1E8", "#C26F53", "#0B3D2E"),
    ("#E3E8DF", "#CDD6C8", "#A99A84", "#F4F6F1", "#C26F53", "#173F33"),
    ("#F1DDD0", "#E2C1AE", "#B98E77", "#FAF0E9", "#0B3D2E", "#3B2A22"),
    ("#E8E1D6", "#D6CBB9", "#8E7D69", "#F6F2EC", "#C26F53", "#0B3D2E"),
    ("#DCE3DD", "#BACBC1", "#7D8F84", "#EEF3EF", "#C26F53", "#062319"),
    ("#F3E9DC", "#E6D0B5", "#B48A62", "#FBF5EC", "#2E7D57", "#2B2018"),
]

def hex2rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def vgrad(w, h, a, b):
    a, b = np.array(hex2rgb(a), float), np.array(hex2rgb(b), float)
    t = np.linspace(0, 1, h)[:, None, None]
    arr = a * (1 - t) + b * t
    return np.repeat(arr, w, axis=1)

def scene(name, w, h, seed, kind="chair"):
    rnd = random.Random(seed)
    wt, wb, fl, mi, ac, dk = PALETTES[seed % len(PALETTES)]
    floor_y = int(h * rnd.uniform(0.70, 0.80))
    arr = vgrad(w, h, wt, wb)
    arr[floor_y:] = vgrad(w, h - floor_y, fl, wb)[:, :w]
    img = Image.fromarray(arr.astype('uint8'))
    d = ImageDraw.Draw(img, 'RGBA')

    # panelled wall lines
    for x in range(rnd.randint(-40, 0), w, rnd.randint(70, 130)):
        d.line([(x, 0), (x, floor_y)], fill=(255, 255, 255, 28), width=2)

    # arched mirrors
    n = rnd.choice([1, 2, 2, 3])
    mw = int(w * rnd.uniform(0.22, 0.34))
    gap = int(w * 0.08)
    total = n * mw + (n - 1) * gap
    x0 = (w - total) // 2 + rnd.randint(-w // 10, w // 10)
    mtop = int(h * rnd.uniform(0.10, 0.20))
    mbot = int(floor_y - h * rnd.uniform(0.16, 0.24))
    for i in range(n):
        x = x0 + i * (mw + gap)
        frame = hex2rgb(dk) + (255,)
        d.rounded_rectangle([x - 8, mtop - 8, x + mw + 8, mbot + 8], radius=mw // 2 + 8, fill=frame)
        glass = Image.fromarray(vgrad(mw, mbot - mtop, mi, wb).astype('uint8'))
        mask = Image.new('L', (mw, mbot - mtop), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, mw, mbot - mtop], radius=mw // 2, fill=255)
        img.paste(glass, (x, mtop), mask)
        d = ImageDraw.Draw(img, 'RGBA')
        for k in range(3):  # reflections
            ox = x + int(mw * (0.2 + 0.12 * k))
            d.line([(ox, mtop + mw // 2), (ox + mw // 3, mtop + mw // 6)], fill=(255, 255, 255, 70), width=6 - k * 2)
        # lamp above mirror
        lx, ly = x + mw // 2, mtop - int(h * 0.05)
        if ly > 10:
            glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
            ImageDraw.Draw(glow).ellipse([lx - 90, ly - 90, lx + 90, ly + 90], fill=(255, 236, 200, 110))
            img.paste(glow.filter(ImageFilter.GaussianBlur(40)), (0, 0), glow.filter(ImageFilter.GaussianBlur(40)))
            d = ImageDraw.Draw(img, 'RGBA')
            d.ellipse([lx - 14, ly - 14, lx + 14, ly + 14], fill=(255, 244, 222, 255))
        # chair in front
        if kind in ("chair", "mixed"):
            cx = x + mw // 2 + rnd.randint(-10, 10)
            cw = int(mw * 0.62)
            ch_col = hex2rgb(rnd.choice([ac, dk, "#5A3B2E"])) + (255,)
            back_top = mbot - int(mw * 0.55)
            d.rounded_rectangle([cx - cw // 2 + 10, back_top, cx + cw // 2 - 10, mbot + int(mw * 0.15)], radius=26, fill=ch_col)
            d.rounded_rectangle([cx - cw // 2, mbot + int(mw * 0.1), cx + cw // 2, mbot + int(mw * 0.32)], radius=18, fill=ch_col)
            d.rectangle([cx - 8, mbot + int(mw * 0.3), cx + 8, floor_y + int(h * 0.04)], fill=(60, 60, 60, 255))
            d.ellipse([cx - cw // 3, floor_y + int(h * 0.03), cx + cw // 3, floor_y + int(h * 0.06)], fill=(50, 50, 50, 255))
        # shelf + bottles
        sy = mbot - int((mbot - mtop) * 0.05)
        d.rectangle([x - 4, sy, x + mw + 4, sy + 6], fill=hex2rgb(dk) + (200,))

    # bottles on a side shelf
    for b in range(rnd.randint(3, 6)):
        bx = rnd.randint(10, w - 30)
        bh = rnd.randint(28, 60)
        col = hex2rgb(rnd.choice([ac, dk, "#E9D7BF", "#8C6B54"])) + (230,)
        d.rounded_rectangle([bx, floor_y - bh - 4, bx + 18, floor_y - 4], radius=6, fill=col)

    # plant
    if rnd.random() > 0.35:
        px = rnd.choice([int(w * 0.06), int(w * 0.92)])
        green = hex2rgb("#3E6B4F")
        for _ in range(14):
            ang = rnd.uniform(-1.2, 1.2)
            lx = px + int(np.sin(ang) * rnd.randint(30, 90))
            ly = floor_y - rnd.randint(60, int(h * 0.32))
            d.ellipse([lx - 18, ly - 40, lx + 18, ly + 40], fill=green + (rnd.randint(170, 230),))
        d.rounded_rectangle([px - 36, floor_y - 70, px + 36, floor_y + 6], radius=10, fill=hex2rgb("#B87B5F") + (255,))

    # soft depth, grain, vignette
    img = img.filter(ImageFilter.GaussianBlur(1.6))
    a = np.asarray(img).astype(float)
    a += np.random.default_rng(seed).normal(0, 7, a.shape)
    yy, xx = np.mgrid[0:h, 0:w]
    v = 1 - 0.28 * (((xx - w / 2) / (w / 1.2)) ** 2 + ((yy - h / 2) / (h / 1.2)) ** 2)
    a *= v[..., None]
    # warm daylight wash from one side
    side = np.linspace(1.06, 0.94, w)[None, :, None] if seed % 2 else np.linspace(0.94, 1.06, w)[None, :, None]
    a *= side
    img = Image.fromarray(np.clip(a, 0, 255).astype('uint8'))
    img.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=78, method=6)

SPECS = {
    # hero
    "hero-1": (900, 1125), "hero-2": (720, 900), "hero-3": (720, 720),
    # categories
    "cat-men": (720, 900), "cat-women": (720, 900), "cat-kids": (720, 900),
    "cat-bridal": (720, 900), "cat-unisex": (720, 900), "cat-spa": (720, 900),
    # how it works
    "step-1": (900, 1100), "step-2": (900, 1100), "step-3": (900, 1100),
    # looks of agra
    "look-1": (900, 1125), "look-2": (900, 1125), "look-3": (900, 1125),
    "look-4": (900, 1125), "look-5": (900, 1125), "look-6": (900, 1125),
    # salons
    "salon-1": (960, 720), "salon-2": (960, 720), "salon-3": (960, 720),
    "salon-4": (960, 720), "salon-5": (960, 720), "salon-6": (960, 720),
}
for i, (n, (w, h)) in enumerate(SPECS.items()):
    scene(n, w, h, seed=i * 7 + 3, kind="chair" if i % 3 else "mixed")
print("ok", len(SPECS))
