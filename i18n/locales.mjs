// Every Indian language TrimCircle plans to support.
// To launch a language: add messages/<code>.json (copy en.json, translate, native review), set ready: true, run `npm run build`.
// `font` is the CSS family used for that script (self-host its woff2 in src/assets/fonts and add @font-face in fonts.css).
export const DEFAULT_LOCALE = 'en';

export const LOCALES = [
  { code: 'en', hreflang: 'en-IN', name: 'English',   english: 'English',   dir: 'ltr', script: 'Latin',      font: null,                         ready: true },
  { code: 'hi', hreflang: 'hi-IN', name: 'हिन्दी',      english: 'Hindi',     dir: 'ltr', script: 'Devanagari', font: '"Mukta"',                    ready: true },
  { code: 'bn', hreflang: 'bn-IN', name: 'বাংলা',       english: 'Bengali',   dir: 'ltr', script: 'Bengali',    font: '"Noto Sans Bengali"',        ready: false },
  { code: 'mr', hreflang: 'mr-IN', name: 'मराठी',       english: 'Marathi',   dir: 'ltr', script: 'Devanagari', font: '"Mukta"',                    ready: false },
  { code: 'te', hreflang: 'te-IN', name: 'తెలుగు',      english: 'Telugu',    dir: 'ltr', script: 'Telugu',     font: '"Noto Sans Telugu"',         ready: false },
  { code: 'ta', hreflang: 'ta-IN', name: 'தமிழ்',       english: 'Tamil',     dir: 'ltr', script: 'Tamil',      font: '"Noto Sans Tamil"',          ready: false },
  { code: 'gu', hreflang: 'gu-IN', name: 'ગુજરાતી',     english: 'Gujarati',  dir: 'ltr', script: 'Gujarati',   font: '"Noto Sans Gujarati"',       ready: false },
  { code: 'kn', hreflang: 'kn-IN', name: 'ಕನ್ನಡ',       english: 'Kannada',   dir: 'ltr', script: 'Kannada',    font: '"Noto Sans Kannada"',        ready: false },
  { code: 'ml', hreflang: 'ml-IN', name: 'മലയാളം',     english: 'Malayalam', dir: 'ltr', script: 'Malayalam',  font: '"Noto Sans Malayalam"',      ready: false },
  { code: 'pa', hreflang: 'pa-IN', name: 'ਪੰਜਾਬੀ',      english: 'Punjabi',   dir: 'ltr', script: 'Gurmukhi',   font: '"Noto Sans Gurmukhi"',       ready: false },
  { code: 'or', hreflang: 'or-IN', name: 'ଓଡ଼ିଆ',       english: 'Odia',      dir: 'ltr', script: 'Odia',       font: '"Noto Sans Oriya"',          ready: false },
  { code: 'as', hreflang: 'as-IN', name: 'অসমীয়া',     english: 'Assamese',  dir: 'ltr', script: 'Bengali',    font: '"Noto Sans Bengali"',        ready: false },
  { code: 'ur', hreflang: 'ur-IN', name: 'اردو',        english: 'Urdu',      dir: 'rtl', script: 'Arabic',     font: '"Noto Naskh Arabic"',        ready: false },
];

export const READY = LOCALES.filter(l => l.ready);
export const byCode = code => LOCALES.find(l => l.code === code);
// Output path of each locale's home page, relative to the site root.
export const pagePath = code => (code === DEFAULT_LOCALE ? 'index.html' : `${code}/index.html`);
