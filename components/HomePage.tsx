'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { AREA_CITY, SALONS, CONFIG } from '@/data/home.mjs';
import { DEFAULT_LOCALE, LOCALES, byCode } from '@/i18n/locales.mjs';
import { createT, money } from '@/i18n/t.mjs';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import { I } from './icons';

const messages = { en, hi };
const localeHref = (code: string) => code === DEFAULT_LOCALE ? '/' : `/${code}/`;
const categoryKeys = ['men', 'women', 'bridal', 'spa'];
const styles: Record<string, CSSProperties> = {
  page: { minHeight: '100vh', background: '#0b0c10', color: '#ffffff', fontFamily: 'Arial, sans-serif' },
  container: { width: 'min(1360px, calc(100% - 40px))', margin: '0 auto' },
  header: { borderBottom: '1px solid #1e2028', background: '#0b0c10' },
  headerInner: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '16px 0' },
  brand: { display: 'flex', alignItems: 'center', gap: 10, color: '#ffffff', fontSize: 21, fontWeight: 750, textDecoration: 'none' },
  brandIcon: { display: 'grid', width: 40, height: 40, placeItems: 'center', borderRadius: 12, background: '#e07a5f', color: '#0b0c10' },
  nav: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 },
  navLink: { color: '#c5c7d0', fontSize: 14, textDecoration: 'none' },
  button: { display: 'inline-flex', minHeight: 42, alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 17px', border: 0, borderRadius: 10, background: '#e07a5f', color: '#ffffff', fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' },
  ticker: { overflow: 'hidden', borderBottom: '1px solid #1e2028', background: '#121319', color: '#a0a5b5', fontSize: 12, letterSpacing: '0.04em' },
  tickerInner: { overflow: 'hidden', padding: '10px 0' },
  tickerTrack: { display: 'flex', width: 'max-content', animation: 'trimcircle-ticker 34s linear infinite' },
  tickerMessage: { flex: 'none', paddingRight: 48 },
  hero: { borderBottom: '1px solid #1e2028', background: 'radial-gradient(ellipse at 78% 20%, #261b1a 0, #111116 32%, #0b0c10 74%)' },
  heroInner: { padding: '60px 0 56px' },
  eyebrow: { margin: '0 0 14px', color: '#e99077', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' },
  title: { maxWidth: 820, margin: 0, color: '#ffffff', fontSize: 'clamp(38px, 7vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.045em' },
  accent: { color: '#e07a5f' },
  description: { maxWidth: 660, margin: '18px 0 0', color: '#a0a5b5', fontSize: 17, lineHeight: 1.7 },
  searchForm: { display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 860, marginTop: 28, padding: 8, border: '1px solid #292a33', borderRadius: 999, background: '#15161c', boxShadow: '0 18px 48px #0008' },
  searchBox: { display: 'flex', minWidth: 220, flex: '1 1 260px', alignItems: 'center', gap: 10, padding: '0 14px', borderRadius: 999, color: '#a0a5b5' },
  input: { width: '100%', minWidth: 0, height: 46, border: 0, outline: 0, background: 'transparent', color: '#ffffff', fontSize: 15 },
  nearButton: { display: 'inline-flex', minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: 7, padding: '0 14px', border: '1px solid #34353e', borderRadius: 999, background: '#1b1c23', color: '#e7e8ec', fontSize: 14, cursor: 'pointer' },
  main: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 22, padding: '40px 0 60px' },
  sidebar: { flex: '0 1 215px', minWidth: 205, padding: 18, border: '1px solid #1e2028', borderRadius: 14, background: '#111218' },
  sideTitle: { margin: '0 0 14px', color: '#ffffff', fontSize: 15 },
  sideGroup: { marginTop: 22 },
  filterList: { display: 'grid', gap: 5 },
  filterButton: { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 10px', border: '1px solid transparent', borderRadius: 8, textAlign: 'left', fontSize: 13, cursor: 'pointer' },
  citySelect: { width: '100%', minHeight: 42, padding: '0 10px', border: '1px solid #2b2d36', borderRadius: 8, background: '#0b0c10', color: '#ffffff', fontSize: 13 },
  toggleRow: { display: 'flex', alignItems: 'center', gap: 9, color: '#c5c7d0', fontSize: 13, cursor: 'pointer' },
  center: { minWidth: 0, flex: '1 1 560px' },
  right: { flex: '0 1 190px', minWidth: 170 },
  sectionHeading: { margin: 0, color: '#ffffff', fontSize: 22, letterSpacing: '-0.02em' },
  muted: { color: '#a0a5b5' },
  dealGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 12, marginTop: 15 },
  dealCard: { position: 'relative', display: 'block', minHeight: 138, overflow: 'hidden', padding: 17, border: '1px solid #392a28', borderRadius: 13, background: 'linear-gradient(135deg, #241917, #171519 65%, #111218)', color: '#ffffff', textDecoration: 'none' },
  dealLabel: { display: 'inline-block', marginBottom: 17, padding: '5px 8px', borderRadius: 99, background: '#e07a5f22', color: '#f1a18b', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' },
  dealName: { margin: 0, fontSize: 15 },
  dealOffer: { margin: '7px 0 0', color: '#e99077', fontSize: 13, lineHeight: 1.45 },
  resultBar: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, margin: '28px 0 14px', color: '#a0a5b5', fontSize: 13 },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 14 },
  card: { overflow: 'hidden', border: '1px solid #1e2028', borderRadius: 13, background: '#121319' },
  photo: { position: 'relative', height: 158, overflow: 'hidden', background: 'linear-gradient(135deg, #49312c, #25232a 55%, #171820)' },
  photoFallback: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 16, background: 'linear-gradient(135deg, #50352f, #24232b 58%, #171820)', color: '#ffffff', fontSize: 46, fontWeight: 700 },
  rating: { position: 'absolute', top: 12, right: 12, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 9px', border: '1px solid #ffffff20', borderRadius: 99, background: '#0b0c10dd', color: '#ffffff', fontSize: 12, fontWeight: 700 },
  cardBody: { padding: 15 },
  cardName: { overflow: 'hidden', margin: 0, color: '#ffffff', fontSize: 16, textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardLocation: { display: 'flex', alignItems: 'center', gap: 5, margin: '8px 0 0', color: '#a0a5b5', fontSize: 12 },
  tagList: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { padding: '4px 8px', borderRadius: 99, background: '#202128', color: '#c5c7d0', fontSize: 11 },
  cardBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid #24252d' },
  price: { color: '#c5c7d0', fontSize: 12 },
  viewLink: { color: '#e99077', fontSize: 12, fontWeight: 700, textDecoration: 'none' },
  empty: { padding: 36, border: '1px solid #1e2028', borderRadius: 13, background: '#111218', color: '#a0a5b5', textAlign: 'center' },
  ad: { minHeight: 330, padding: 16, border: '1px dashed #34353e', borderRadius: 13, background: 'linear-gradient(160deg, #13141a, #101116)', color: '#6f7381', textAlign: 'center' },
  adLabel: { margin: 0, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' },
  cities: { borderTop: '1px solid #1e2028', borderBottom: '1px solid #1e2028', background: '#101116' },
  cityButtons: { display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 15 },
  cityButton: { padding: '7px 11px', border: '1px solid #292a33', borderRadius: 99, background: '#15161c', color: '#c5c7d0', fontSize: 12, cursor: 'pointer' },
  footer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, padding: '22px 0', color: '#777b88', fontSize: 12 },
};

export default function HomePage({ locale }: { locale: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('');
  const [openNow, setOpenNow] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [locationMessage, setLocationMessage] = useState('');
  const t = createT(messages[locale as keyof typeof messages] ?? en, en, locale);
  const language = byCode(locale) ?? byCode('en')!;
  const areas = t.raw('areas') as string[];
  const cities = t.raw('citySec.list') as string[];
  const englishAreas = createT(en, en, 'en').raw('areas') as string[];
  const filters = t.raw('salons.filters') as Record<string, string>;
  const searchTerm = query.trim().toLocaleLowerCase();
  const salonHref = (slug: string) => `${localeHref(locale)}salon/${slug}/`;
  const deals = SALONS.filter(salon => salon.deal);
  const countFor = (key: string) => SALONS.filter(salon =>
    (key === 'all' || salon.tags.includes(key)) &&
    (!openNow || salon.open) &&
    (city === '' || String(AREA_CITY[salon.areaIndex]) === city)
  ).length;
  const filteredSalons = useMemo(() => {
    const matching = SALONS.filter(salon => {
      const matchesCategory = category === 'all' || salon.tags.includes(category);
      const matchesCity = city === '' || String(AREA_CITY[salon.areaIndex]) === city;
      const matchesOpen = !openNow || salon.open;
      const searchable = [salon.name, areas[salon.areaIndex], englishAreas[salon.areaIndex], cities[AREA_CITY[salon.areaIndex]]]
        .join(' ').toLocaleLowerCase();
      return matchesCategory && matchesCity && matchesOpen && (!searchTerm || searchable.includes(searchTerm));
    });
    if (!coordinates) return matching;
    const [latitude, longitude] = coordinates;
    return matching.sort((a, b) => {
      const distance = (salon: typeof a) => {
        const [lat, lng] = salon.geo;
        return Math.hypot(lat - latitude, (lng - longitude) * Math.cos(latitude * Math.PI / 180));
      };
      return distance(a) - distance(b);
    });
  }, [areas, category, cities, city, coordinates, englishAreas, openNow, searchTerm]);
  const resetFilters = () => { setQuery(''); setCategory('all'); setCity(''); setOpenNow(false); setCoordinates(null); setLocationMessage(''); };
  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocationMessage(t('salons.denied'));
      return;
    }
    setLocationMessage(t('salons.locating'));
    navigator.geolocation.getCurrentPosition(
      position => {
        setCoordinates([position.coords.latitude, position.coords.longitude]);
        setLocationMessage(t('salons.locFoundSub'));
      },
      () => setLocationMessage(t('salons.denied')),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };
  const filterButtonStyle = (active: boolean): CSSProperties => ({
    ...styles.filterButton,
    borderColor: active ? '#e07a5f55' : 'transparent',
    background: active ? '#e07a5f1a' : 'transparent',
    color: active ? '#f0a18a' : '#c5c7d0',
  });

  return (
    <main style={styles.page}>
      <style>{'@keyframes trimcircle-ticker{to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.trimcircle-ticker-track{animation:none!important}}'}</style>
      <header style={styles.header}>
        <div style={{ ...styles.container, ...styles.headerInner }}>
          <a href={localeHref(locale)} style={styles.brand} aria-label="TrimCircle home">
            <span style={styles.brandIcon}>{I.scissors}</span>
            <span>TrimCircle</span>
          </a>
          <nav style={styles.nav} aria-label="Main navigation">
            <a href="#directory" style={styles.navLink}>{t('nav.salons')}</a>
            <a href="#how" style={styles.navLink}>{t('nav.how')}</a>
            <a href="#cities" style={styles.navLink}>{t('nav.cities')}</a>
            <a href={`https://wa.me/${CONFIG.whatsappNumber}`} style={styles.button}>{t('nav.listCta')}</a>
            {LOCALES.filter(item => item.ready).map(item => (
              <a key={item.code} href={localeHref(item.code)} hrefLang={item.hreflang} lang={item.hreflang}
                aria-current={item.code === locale ? 'page' : undefined}
                style={{ ...styles.navLink, color: item.code === locale ? '#e99077' : '#a0a5b5' }}>
                {item.code.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div style={styles.ticker} aria-label="TrimCircle highlights">
        <div style={{ ...styles.container, ...styles.tickerInner }}>
          <div className="trimcircle-ticker-track" style={styles.tickerTrack}>
            {[0, 1].map(copy => (
              <span key={copy} aria-hidden={copy === 1} style={styles.tickerMessage}>
                • Free salon page for every owner&nbsp;&nbsp; • Real prices before you visit&nbsp;&nbsp; • Search in Hindi or English&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      <section style={styles.hero}>
        <div style={{ ...styles.container, ...styles.heroInner }}>
          <p style={styles.eyebrow}>{t('hero.eyebrow')}</p>
          <h1 style={styles.title}>Find your next <span style={styles.accent}>FAVOURITE SALON.</span></h1>
          <p style={styles.description}>{t('hero.referenceSub')}</p>
          <form style={styles.searchForm} role="search" onSubmit={event => {
            event.preventDefault();
            document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <label htmlFor="salon-search" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
              {t('hero.searchLabel')}
            </label>
            <div style={styles.searchBox}>{I.search}
              <input id="salon-search" type="search" value={query} onChange={event => setQuery(event.target.value)}
                placeholder="Search city, area or salon name" style={styles.input} />
            </div>
            <button type="button" onClick={locateMe} style={styles.nearButton}>{I.locate}{t('hero.nearMe')}</button>
            <button type="submit" style={styles.button}>{t('hero.submitShort')} {I.arrow}</button>
          </form>
          {locationMessage && <p role="status" style={{ ...styles.description, marginTop: 12, fontSize: 13 }}>{locationMessage}</p>}
        </div>
      </section>

      <div id="directory" style={{ ...styles.container, ...styles.main }}>
        <aside style={styles.sidebar} aria-label={t('salons.filterLabel')}>
          <h2 style={styles.sideTitle}>{t('salons.filterLabel')}</h2>
          <div style={styles.sideGroup}>
            <h3 style={styles.sideTitle}>{t('salons.serviceLabel')}</h3>
            <div style={styles.filterList} role="group" aria-label={t('salons.serviceLabel')}>
              <button type="button" onClick={() => setCategory('all')} aria-pressed={category === 'all'} style={filterButtonStyle(category === 'all')}>
                <span>{filters.all}</span><span>{countFor('all')}</span>
              </button>
              {categoryKeys.map(key => {
                const label = key === 'men' ? 'Barbers' : key === 'women' ? 'Beauty Parlours' : filters[key];
                return (
                  <button key={key} type="button" onClick={() => setCategory(key)} aria-pressed={category === key} style={filterButtonStyle(category === key)}>
                    <span>{label}</span><span>{countFor(key)}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={styles.sideGroup}>
            <h3 style={styles.sideTitle}>{t('salons.cityLabel')}</h3>
            <select value={city} onChange={event => setCity(event.target.value)} style={styles.citySelect} aria-label={t('salons.cityLabel')}>
              <option value="">{t('salons.allCities')}</option>
              {cities.map((name, index) => <option key={name} value={index}>{name}</option>)}
            </select>
          </div>
          <div style={styles.sideGroup}>
            <label style={styles.toggleRow}>
              <input type="checkbox" checked={openNow} onChange={event => setOpenNow(event.target.checked)} style={{ accentColor: '#e07a5f' }} />
              {t('salons.openNow')}
            </label>
          </div>
          {(query || category !== 'all' || city !== '' || openNow || coordinates) && (
            <button type="button" onClick={resetFilters} style={{ ...styles.button, width: '100%', marginTop: 20 }}>
              {t('salons.showAll')}
            </button>
          )}
        </aside>

        <section style={styles.center} aria-label={t('salons.title')}>
          <section aria-labelledby="deals-title">
            <p style={styles.eyebrow}>Sponsored / Deals</p>
            <h2 id="deals-title" style={styles.sectionHeading}>{t('home2.offers.title')}</h2>
            <div style={styles.dealGrid}>
              {deals.slice(0, 3).map(salon => (
                <a key={salon.slug} href={salonHref(salon.slug)} style={styles.dealCard}>
                  <span style={styles.dealLabel}>Featured offer</span>
                  <h3 style={styles.dealName} lang="en">{salon.name}</h3>
                  <p style={styles.dealOffer}>{t(`salons.deals.${salon.deal}`)}</p>
                </a>
              ))}
            </div>
          </section>

          <div style={{ ...styles.resultBar, marginTop: 30 }} aria-live="polite">
            <h2 style={styles.sectionHeading}>{t('salons.title')}</h2>
            <span>{t('salons.count', { count: filteredSalons.length })} · {city === '' ? t('salons.allIndia') : cities[Number(city)]}</span>
          </div>
          {filteredSalons.length > 0 ? (
            <div style={styles.cardGrid}>
              {filteredSalons.map(salon => (
                <article key={salon.slug} style={styles.card}>
                  <div style={styles.photo}>
                    <span style={styles.photoFallback}>{salon.name.slice(0, 1)}</span>
                    <img src={`/assets/photos/${salon.photo}.webp`} alt="" loading="lazy" decoding="async"
                      onError={event => { event.currentTarget.style.display = 'none'; }}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={styles.rating}><span style={{ color: '#e99077' }}>{I.star}</span>{salon.rating}</span>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardName} lang="en">{salon.name}</h3>
                    <p style={styles.cardLocation}>{I.pin}{areas[salon.areaIndex]}</p>
                    <div style={styles.tagList}>
                      {salon.tags.slice(0, 3).map(tag => <span key={tag} style={styles.tag}>{t(`salons.tags.${tag}`)}</span>)}
                    </div>
                    <div style={styles.cardBottom}>
                      <span style={styles.price}>{t('common.from', { price: money(salon.from, locale) })}</span>
                      <a href={salonHref(salon.slug)} style={styles.viewLink}>{t('salons.view')} →</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>
              <p>{t('salons.empty')}</p>
              <button type="button" onClick={resetFilters} style={styles.button}>{t('salons.showAll')}</button>
            </div>
          )}
        </section>

        <aside style={styles.right} aria-label="Advertisement">
          <div style={styles.ad}>
            <p style={styles.adLabel}>Advertisement</p>
          </div>
        </aside>
      </div>

      <section id="how" style={{ ...styles.cities, padding: '25px 0' }}>
        <div style={styles.container}>
          <h2 style={styles.sectionHeading}>{t('how.kicker')}</h2>
          <p style={{ ...styles.muted, margin: '8px 0 0', lineHeight: 1.6 }}>
            Search your area, compare prices and offers, then choose the salon that feels right.
          </p>
        </div>
      </section>

      <section id="cities" style={styles.cities}>
        <div style={{ ...styles.container, padding: '24px 0' }}>
          <h2 style={styles.sectionHeading}>{t('citySec.title')}</h2>
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
        <a href={localeHref(locale)} style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'none' }}>TrimCircle</a>
        <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
        <span lang={language.hreflang}>{t('footer.photosNote')}</span>
      </footer>
    </main>
  );
}
