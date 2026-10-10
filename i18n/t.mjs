// Tiny message lookup with English fallback, {var} interpolation and ICU-style plurals
// ({count, plural, one {# salon} other {# salons}}). Same message format next-intl uses,
// so these JSON files move over unchanged if the site is ported to Next.js.
export function createT(messages, fallback, locale, missing = []) {
  const get = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const plural = new Intl.PluralRules(locale === 'en' ? 'en-IN' : `${locale}-IN`);
  const fmt = (str, vars = {}) =>
    str
      .replace(/\{(\w+), plural, ((?:[^{}]|\{[^{}]*\})*)\}/g, (_, name, body) => {
        const n = Number(vars[name]);
        const forms = Object.fromEntries([...body.matchAll(/(\w+|=\d+)\s*\{([^}]*)\}/g)].map(m => [m[1], m[2]]));
        const form = forms[`=${n}`] ?? forms[plural.select(n)] ?? forms.other ?? '';
        return form.replace(/#/g, String(n));
      })
      .replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  function t(key, vars) {
    let v = get(messages, key);
    if (v === undefined) {
      v = get(fallback, key);
      missing.push(key);
    }
    if (v === undefined) return key;
    return typeof v === 'string' ? fmt(v, vars) : v;
  }
  t.raw = key => get(messages, key) ?? get(fallback, key);
  t.fmt = fmt;
  return t;
}

export const money = (n, locale) =>
  new Intl.NumberFormat(locale === 'en' ? 'en-IN' : `${locale}-IN`, {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0, numberingSystem: 'latn',
  }).format(n);

export const num = (n, locale) =>
  new Intl.NumberFormat(locale === 'en' ? 'en-IN' : `${locale}-IN`, { numberingSystem: 'latn', maximumFractionDigits: 1 }).format(n);
