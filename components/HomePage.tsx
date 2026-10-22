'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { AREA_CITY, CATEGORIES, SALONS, CONFIG } from '@/data/home.mjs';
import { DEFAULT_LOCALE, LOCALES, byCode } from '@/i18n/locales.mjs';
import { createT, money } from '@/i18n/t.mjs';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import { I } from './icons';

const messages = { en, hi };
const localeHref = (code: string) => code === DEFAULT_LOCALE ? '/' : `/${code}/`;
const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', background: '#0b1120', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' },
  container: { width: 'min(1180px, calc(100% - 40px))', margin: '0 auto' },
  header: { borderBottom: '1px solid #263247', background: '#0b1120' },
  headerInner: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '18px 0' },
  brand: { display: 'flex', alignItems: 'center', gap: 12, color: '#f8fafc', fontSize: 21, fontWeight: 700, textDecoration: 'none' },
  brandIcon: { display: 'grid', width: 42, height: 42, placeItems: 'center', borderRadius: 13, background: '#fbbf24', color: '#111827' },
  nav: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18 },
  navLink: { color: '#cbd5e1', fontSize: 14, textDecoration: 'none' },
  hero: { borderBottom: '1px solid #263247', background: 'radial-gradient(ellipse at 80% 10%, #1e293b 0, #0b1120 55%)' },
  heroInner: { padding: '64px 0 56px' },
  eyebrow: { margin: '0 0 14px', color: '#fbbf24', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' },
  title: { maxWidth: 760, margin: 0, color: '#f8fafc', fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.08, letterSpacing: '-0.04em' },
  accent: { color: '#fbbf24' },
  description: { maxWidth: 690, margin: '18px 0 0', color: '#aab7c9', fontSize: 18, lineHeight: 1.7 },
  searchForm: { display: 'flex', flexWrap: 'wrap', gap: 10, maxWidth: 760, marginTop: 28, padding: 10, border: '1px solid #334155', borderRadius: 16, background: '#111a2b', boxShadow: '0 18px 45px #02061766' },
  searchBox: { display: 'flex', minWidth: 220, flex: '1 1 300px', alignItems: 'center', gap: 10, padding: '0 12px', borderRadius: 11, background: '#1e293b', color: '#94a3b8' },
  input: { width: '100%', minWidth: 0, height: 48, border: 0, outline: 0, background: 'transparent', color: '#f8fafc', fontSize: 16 },
  primaryButton: { display: 'inline-flex', minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 22px', border: 0, borderRadius: 11, background: '#fbbf24', color: '#111827', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  directory: { padding: '48px 0 60px' },
  sectionTitle: { margin: 0, color: '#f8fafc', fontSize: 32, lineHeight: 1.2 },
  sectionSub: { margin: '10px 0 0', color: '#94a3b8', lineHeight: 1.6 },
  resultsLayout: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24, marginTop: 28 },
  sidebar: { flex: '1 1 220px', maxWidth: 270, padding: 20, border: '1px solid #273449', borderRadius: 16, background: '#111a2b' },
  sideHeading: { margin: '0 0 14px', color: '#f8fafc', fontSize: 16 },
  select: { width: '100%', minHeight: 44, marginBottom: 24, padding: '0 12px', border: '1px solid #334155', borderRadius: 10, background: '#0b1120', color: '#f8fafc', fontSize: 14 },
  filterList: { display: 'grid', gap: 8 },
  filterButton: { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', border: '1px solid transparent', borderRadius: 10, textAlign: 'left', fontSize: 14, cursor: 'pointer' },
  results: { minWidth: 0, flex: '4 1 600px' },
  resultBar: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, color: '#94a3b8', fontSize: 14 },
  clearButton: { padding: '6px 0', border: 0, background: 'transparent', color: '#fbbf24', fontWeight: 600, cursor: 'pointer' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 245px), 1fr))', gap: 16 },
  card: { overflow: 'hidden', border: '1px solid #273449', borderRadius: 16, background: '#111a2b' },
  cardTop: { position: 'relative', display: 'flex', height: 150, alignItems: 'flex-end', padding: 18, background: 'linear-gradient(135deg, #334155, #172033 65%, #0b1120)' },
  cardInitial: { color: '#f8fafc', fontSize: 52, fontWeight: 700, lineHeight: 1 },
  rating: { position: 'absolute', top: 14, right: 14, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 99, background: '#0b1120dd', color: '#f8fafc', fontSize: 13, fontWeight: 700 },
  cardBody: { padding: 18 },
  cardName: { margin: 0, color: '#f8fafc', fontSize: 18 },
  cardArea: { display: 'flex', alignItems: 'center', gap: 5, margin: '8px 0 0', color: '#94a3b8', fontSize: 14 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 15 },
  tag: { padding: '5px 9px', borderRadius: 99, background: '#202c3e', color: '#cbd5e1', fontSize: 12 },
  cardFoot: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 17, paddingTop: 14, borderTop: '1px solid #273449', color: '#94a3b8', fontSize: 14 },
  cardLink: { color: '#fbbf24', fontWeight: 700, textDecoration: 'none' },
  empty: { padding: '54px 20px', border: '1px solid #273449', borderRadius: 16, background: '#111a2b', color: '#cbd5e1', textAlign: 'center' },
  cities: { borderTop: '1px solid #263247', borderBottom: '1px solid #263247', background: '#0e1727' },
  citiesInner: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '28px 0' },
  cityButtons: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  cityButton: { padding: '8px 13px', border: '1px solid #334155', borderRadius: 99, background: '#0b1120', color: '#cbd5e1', fontSize: 13, cursor: 'pointer' },
  footer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, padding: '24px 0', color: '#64748b', fontSize: 13 },
};

export default function HomePage({ locale }: { locale: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('');
  const t = createT(messages[locale as keyof typeof messages] ?? en, en, locale);
  const language = byCode(locale) ?? byCode('en')!;
  const areas = t.raw('areas') as string[];
  const cities = t.raw('citySec.list') as string[];
  const englishAreas = createT(en, en, 'en').raw('areas') as string[];
  const filters = t.raw('salons.filters') as Record<string, string>;
  const searchTerm = query.trim().toLocaleLowerCase();
  const filteredSalons = useMemo(() => SALONS.filter(salon => {
    const matchesCategory = category === 'all' || salon.tags.includes(category);
    const matchesCity = city === '' || String(AREA_CITY[salon.areaIndex]) === city;
    const searchable = [salon.name, areas[salon.areaIndex], englishAreas[salon.areaIndex], cities[AREA_CITY[salon.areaIndex]]]
      .join(' ').toLocaleLowerCase();
    return matchesCategory && matchesCity && (!searchTerm || searchable.includes(searchTerm));
  }), [areas, category, cities, city, englishAreas, searchTerm]);
  const resetFilters = () => { setQuery(''); setCategory('all'); setCity(''); };
  const salonHref = (slug: string) => `${localeHref(locale)}salon/${slug}/`;
  const activeFilterStyle = (active: boolean): CSSProperties => ({
    ...styles.filterButton,
    borderColor: active ? '#fbbf24' : 'transparent',
    background: active ? '#fbbf241f' : 'transparent',
    color: active ? '#fcd34d' : '#cbd5e1',
  });

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={{ ...styles.container, ...styles.headerInner }}>
          <a href={localeHref(locale)} style={styles.brand} aria-label="TrimCircle home">
            <span style={styles.brandIcon}>{I.scissors}</span>
            <span>TrimCircle</span>
          </a>
          <nav style={styles.nav} aria-label="Main">
            <a href="#directory" style={styles.navLink}>{t('nav.salons')}</a>
            <a href="#cities" style={styles.navLink}>{t('nav.cities')}</a>
            <a href={`https://wa.me/${CONFIG.whatsappNumber}`} style={{ ...styles.primaryButton, minHeight: 38, textDecoration: 'none' }}>{t('nav.listCta')}</a>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, borderLeft: '1px solid #334155' }}>
              {LOCALES.filter(item => item.ready).map(item => (
                <a
                  key={item.code}
                  href={localeHref(item.code)}
                  hrefLang={item.hreflang}
                  lang={item.hreflang}
                  aria-current={item.code === locale ? 'page' : undefined}
                  style={{ ...styles.navLink, color: item.code === locale ? '#fbbf24' : '#94a3b8' }}
                >
                  {item.code.toUpperCase()}
                </a>
              ))}
            </span>
          </nav>
        </div>
      </header>

      <section style={styles.hero}>
        <div style={{ ...styles.container, ...styles.heroInner }}>
          <p style={styles.eyebrow}>{t('home2.hero.pick')}</p>
          <h1 style={styles.title}>{t('hero.titleLead')} <span style={styles.accent}>{t('hero.titleAccent')}</span></h1>
          <p style={styles.description}>{t('hero.referenceSub')}</p>
          <form
            style={styles.searchForm}
            role="search"
            onSubmit={event => {
              event.preventDefault();
              document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <label htmlFor="salon-search" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
              {t('hero.searchLabel')}
            </label>
            <div style={styles.searchBox}>
              {I.search}
              <input
                id="salon-search"
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={t('hero.placeholder')}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.primaryButton}>{t('hero.submitShort')}{I.arrow}</button>
          </form>
        </div>
      </section>

      <section id="directory" style={{ ...styles.container, ...styles.directory }}>
        <p style={styles.eyebrow}>{t('home2.salons.eyebrow')}</p>
        <h2 style={styles.sectionTitle}>{t('salons.title')}</h2>
        <p style={styles.sectionSub}>{t('salons.sub')}</p>

        <div style={styles.resultsLayout}>
          <aside style={styles.sidebar} aria-label={t('salons.filterLabel')}>
            <h3 style={styles.sideHeading}>{t('salons.cityLabel')}</h3>
            <select value={city} onChange={event => setCity(event.target.value)} style={styles.select}>
              <option value="">{t('salons.allCities')}</option>
              {cities.map((name, index) => <option key={name} value={index}>{name}</option>)}
            </select>

            <h3 style={styles.sideHeading}>{t('salons.filterLabel')}</h3>
            <div style={styles.filterList} role="group" aria-label={t('salons.filterLabel')}>
              {Object.entries(filters).filter(([key]) => key !== 'open').map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  aria-pressed={category === key}
                  style={activeFilterStyle(category === key)}
                >
                  <span>{label}</span>
                  <span>{key === 'all' ? SALONS.length : SALONS.filter(salon => salon.tags.includes(key)).length}</span>
                </button>
              ))}
            </div>
            {(query || category !== 'all' || city !== '') && (
              <button type="button" onClick={resetFilters} style={{ ...styles.clearButton, marginTop: 16 }}>
                {t('salons.showAll')}
              </button>
            )}
          </aside>

          <div style={styles.results}>
            <div style={styles.resultBar} aria-live="polite">
              <span>{t('salons.count', { count: filteredSalons.length })} · {city === '' ? t('salons.allIndia') : cities[Number(city)]}</span>
            </div>
            {filteredSalons.length > 0 ? (
              <div style={styles.cardGrid}>
                {filteredSalons.map(salon => (
                  <article key={salon.slug} style={styles.card}>
                    <a href={salonHref(salon.slug)} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <div style={styles.cardTop}>
                        <span style={styles.cardInitial}>{salon.name.slice(0, 1)}</span>
                        <span style={styles.rating}><span style={{ color: '#fbbf24' }}>{I.star}</span>{salon.rating}</span>
                      </div>
                      <div style={styles.cardBody}>
                        <h3 style={styles.cardName} lang="en">{salon.name}</h3>
                        <p style={styles.cardArea}>{I.pin}{areas[salon.areaIndex]}</p>
                        <div style={styles.tags}>
                          {salon.tags.slice(0, 3).map(tag => <span key={tag} style={styles.tag}>{t(`salons.tags.${tag}`)}</span>)}
                        </div>
                        <div style={styles.cardFoot}>
                          <span>{t('common.from', { price: money(salon.from, locale) })}</span>
                          <span style={{ color: salon.open ? '#86efac' : '#94a3b8' }}>
                            {salon.open ? t('salons.openNow') : t('salons.opensAt', { time: salon.opensAt })}
                          </span>
                          <span style={styles.cardLink}>{t('salons.view')} {I.arrow}</span>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div style={styles.empty}>
                <p>{t('salons.empty')}</p>
                <button type="button" onClick={resetFilters} style={styles.primaryButton}>{t('salons.showAll')}</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="cities" style={styles.cities}>
        <div style={{ ...styles.container, ...styles.citiesInner }}>
          <div>
            <h2 style={{ ...styles.sectionTitle, fontSize: 22 }}>{t('citySec.title')}</h2>
            <p style={styles.sectionSub}>{t('citySec.sub')}</p>
          </div>
          <div style={styles.cityButtons}>
            {[...new Set(SALONS.map(salon => AREA_CITY[salon.areaIndex]))].map(index => (
              <button key={index} type="button" onClick={() => { setCity(String(index)); document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' }); }} style={styles.cityButton}>
                {cities[index]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ ...styles.container, ...styles.footer }}>
        <a href={localeHref(locale)} style={{ color: '#cbd5e1', fontWeight: 700, textDecoration: 'none' }}>TrimCircle</a>
        <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
        <span lang={language.hreflang}>{t('footer.photosNote')}</span>
      </footer>
    </main>
  );
}
