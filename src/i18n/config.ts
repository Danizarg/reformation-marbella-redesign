export const locales = ['es', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Every page of the site, keyed by a stable identifier. */
export const pageKeys = [
  'home',
  'about',
  'services',
  'projects',
  'gallery',
  'process',
  'quote',
  'contact',
] as const;

export type PageKey = (typeof pageKeys)[number];

/**
 * Localised URL segments. Each language gets its own readable slug so a Russian
 * visitor never sees Spanish in the address bar, while both languages stay on a
 * single, consistent `/{locale}/{slug}` structure.
 */
export const routes: Record<PageKey, Record<Locale, string>> = {
  home: { es: '', ru: '' },
  about: { es: 'sobre-nosotros', ru: 'o-kompanii' },
  services: { es: 'servicios', ru: 'uslugi' },
  projects: { es: 'proyectos', ru: 'proekty' },
  gallery: { es: 'galeria', ru: 'galereya' },
  process: { es: 'proceso-de-trabajo', ru: 'kak-my-rabotaem' },
  quote: { es: 'solicitar-presupuesto', ru: 'zapros-smety' },
  contact: { es: 'contacto', ru: 'kontakty' },
};

/** Builds an absolute in-app path, e.g. `pathFor('services', 'ru')` -> `/ru/uslugi`. */
export function pathFor(key: PageKey, locale: Locale): string {
  const slug = routes[key][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/** Resolves an incoming slug back to its page key, or `null` when unknown. */
export function pageKeyFromSlug(slug: string | undefined, locale: Locale): PageKey | null {
  const normalised = slug ?? '';
  for (const key of pageKeys) {
    if (routes[key][locale] === normalised) return key;
  }
  return null;
}

/** The `hreflang` value advertised for each locale. */
export const hreflang: Record<Locale, string> = { es: 'es-ES', ru: 'ru-RU' };

export const localeNames: Record<Locale, { short: string; long: string }> = {
  es: { short: 'ES', long: 'Español' },
  ru: { short: 'RU', long: 'Русский' },
};
