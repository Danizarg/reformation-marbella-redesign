/**
 * Facts carried over from the company's own site (reformation9.webnode.es).
 * Nothing here is invented: phone, email, location, service area and the
 * founding year all come from the original pages.
 */
export const site = {
  name: 'Reformation Marbella',
  legalLine: 'Reformation Marbella',
  foundedYear: 2014,
  phone: {
    display: '+34 656 383 848',
    href: 'tel:+34656383848',
    whatsapp: 'https://wa.me/34656383848',
  },
  email: {
    display: 'reformationmarbella@gmail.com',
    href: 'mailto:reformationmarbella@gmail.com',
  },
  location: {
    city: 'Marbella',
    province: 'Málaga',
    country: 'ES',
    countryName: 'España',
    // Marbella town centre — used for the map link only.
    geo: { lat: 36.5101, lng: -4.8824 },
  },
  /** Service area, exactly as listed on the original site. */
  areas: [
    'Marbella',
    'Estepona',
    'Sotogrande',
    'Málaga',
    'Fuengirola',
    'Puerto Banús',
    'Costa del Sol',
  ],
  legacyUrl: 'https://reformation9.webnode.es/',
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://reformation-marbella-redesign.vercel.app';

export const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Marbella%2C%20M%C3%A1laga%2C%20Spain';

/** Photograph slugs grouped by the kind of work they show. */
export const media = {
  hero: ['villa-piscina-luxe', 'luxe-casa-interio', 'construction-luxe', 'sauna-y-spa'],
  villas: ['villa-piscina-luxe', 'villa-luxe', 'casa-5', 'construction-luxe', 'interior-exterior'],
  interiors: [
    'luxe-casa-interio',
    'interior-salon',
    'luxury-salon',
    'salon',
    'interior-c',
    'interior-8',
    'salon-interior',
    'proyecto-1',
    'interior-dormitorio-2',
    'dormitorio02',
    'dormitorio03',
    'proyecto-2',
    'proyecto-3',
    'interior4',
  ],
  kitchensBaths: ['cocina-luxe', 'bano-luxuri'],
  wellness: ['sauna-y-spa', 'sauna', 'sauna-1', 'sauna3', 'sala-audiovisual'],
  pools: [
    'piscina4',
    'piscina-6',
    'piscina-3',
    'jardin-con-piscina',
    'casa-piscina',
    'villa-piscina',
    'piscinas-1-1',
    'vivienda-piscina2',
    'villa-portada',
  ],
} as const;

export const imagePath = (slug: string) => `/images/projects/${slug}.jpg`;

/**
 * Before/after demonstration pairs. No genuine paired photographs exist in the
 * client archive, so the "before" frame is generated from the finished
 * photograph and is labelled as a simulation everywhere it appears.
 */
export const beforeAfterDemos = [
  { slug: 'luxe-casa-interio', category: 'interiors' },
  { slug: 'cocina-luxe', category: 'kitchen' },
  { slug: 'villa-piscina-luxe', category: 'exteriors' },
] as const;

export const demoPath = (slug: string, side: 'before' | 'after') =>
  `/images/demo/${slug}-${side}.jpg`;
