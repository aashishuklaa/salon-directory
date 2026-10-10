// Makes the preview build for a claude.ai Artifact: CSS/JS inlined, GSAP/Lenis from pinned CDNs,
// the English page without its own document skeleton (the host wraps it). Usage: node tools/artifact.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist'), OUT = path.join(ROOT, 'dist-artifact');
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(DIST, OUT, { recursive: true });
fs.rmSync(path.join(OUT, 'assets/vendor'), { recursive: true });
fs.rmSync(path.join(OUT, 'assets/css'), { recursive: true });
fs.rmSync(path.join(OUT, 'assets/js'), { recursive: true });
fs.rmSync(path.join(OUT, 'assets/img/trimcircle-horizontal.png'), { force: true });
const read = f => fs.readFileSync(path.join(DIST, f), 'utf8');
const CDN = {
  'gsap.min.js': 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'ScrollTrigger.min.js': 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'Flip.min.js': 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Flip.min.js',
  'lenis.min.js': 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js',
};
function transform(file, base, wrapped) {
  let h = read(file);
  const css = f => read(`assets/css/${f}`).replace(/url\(\.\.\/fonts\//g, `url(${base}assets/fonts/`);
  // Function replacements so "$$" etc. in the inlined code isn't treated as a replacement pattern.
  h = h.replace(/<link rel="stylesheet" href="[^"]*fonts\.css">/, () => `<style>${css('fonts.css')}</style>`)
       .replace(/<link rel="stylesheet" href="[^"]*site\.css">/, () => `<style>${css('site.css')}</style>`)
       .replace(/<script src="[^"]*assets\/vendor\/([^"]+)" defer><\/script>/g, (_, f) => `<script src="${CDN[f]}" defer></script>`)
       .replace(/<script src="[^"]*main\.js" defer><\/script>/, () => `<script>addEventListener('DOMContentLoaded',function(){\n${read('assets/js/main.js')}\n});</script>`);
  if (wrapped) {
    h = h.replace(/<!doctype html>\s*/i, '').replace(/<html[^>]*>\s*/, '').replace(/<\/?head>\s*/g, '').replace(/<body>\s*/, '').replace(/<\/body>\s*<\/html>\s*$/, '')
         .replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/, '')
         .replace(/<title>[^<]*<\/title>/, '');
    h = '<title>TrimCircle Home</title>\n' + h;
  }
  fs.writeFileSync(path.join(OUT, file), h);
}
transform('index.html', '', true);
transform('hi/index.html', '../', false);
console.log('artifact build ready');
