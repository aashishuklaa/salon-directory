// Locale-independent data for the home page. Text lives in messages/<locale>.json.
// SAMPLE DATA: replace with real partner salons before launch.
export const CONFIG = {
  // TODO: set TrimCircle's WhatsApp Business number (country code, no +). Used for the owners CTA.
  whatsappNumber: '910000000000',
  siteUrl: 'https://trimcircle.in', // TODO: confirm domain (used for canonical + hreflang)
  city: 'Agra',
};

export const CATEGORIES = [
  { key: 'men', from: 80, photo: 'cat-men' },
  { key: 'women', from: 50, photo: 'cat-women' },
  { key: 'kids', from: 60, photo: 'cat-kids' },
  { key: 'bridal', from: 2500, photo: 'cat-bridal' },
  { key: 'unisex', from: 150, photo: 'cat-unisex' },
  { key: 'spa', from: 300, photo: 'cat-spa' },
];

export const LOOKS = [
  { price: 150, photo: 'look-1' },
  { price: 450, photo: 'look-2' },
  { price: 120, photo: 'look-3' },
  { price: 100, photo: 'look-4' },
  { price: 3500, photo: 'look-5' },
  { price: 1800, photo: 'look-6' },
];

// areaIndex points into messages.areas so the area name is translated.
export const SALONS = [
  { name: 'Royal Cuts', areaIndex: 0, km: 0.4, open: true, from: 120, tags: ['men', 'kids'], deal: 'kidsFree', phone: '+910000000001', photo: 'salon-1' },
  { name: 'Gulmohar Beauty Studio', areaIndex: 2, km: 1.2, open: true, from: 50, tags: ['women', 'bridal'], deal: 'weekday', phone: '+910000000002', photo: 'salon-2' },
  { name: 'Little Stars Kids Salon', areaIndex: 1, km: 1.8, open: false, opensAt: '11:00', from: 100, tags: ['kids'], deal: 'firstVisit', phone: '+910000000003', photo: 'salon-3' },
  { name: 'Shringaar Bridal Lounge', areaIndex: 8, km: 2.3, open: true, from: 2500, tags: ['bridal', 'women'], deal: 'bridalTrial', phone: '+910000000004', photo: 'salon-4' },
  { name: 'Studio Eleven Unisex', areaIndex: 3, km: 2.9, open: true, from: 150, tags: ['unisex', 'men', 'women'], deal: null, phone: '+910000000005', photo: 'salon-5' },
  { name: 'Nawab Hair Salon', areaIndex: 5, km: 3.4, open: false, opensAt: '10:30', from: 80, tags: ['men'], deal: 'firstVisit', phone: '+910000000006', photo: 'salon-6' },
];

export const HERO_PHOTOS = ['hero-1', 'hero-2', 'hero-3'];
export const STEP_PHOTOS = ['step-1', 'step-2', 'step-3'];
