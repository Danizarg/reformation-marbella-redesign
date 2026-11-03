import type { MetadataRoute } from 'next';
import { hreflang, locales, pageKeys, pathFor } from '@/i18n/config';
import { siteUrl } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    pageKeys.map((key) => ({
      url: `${siteUrl}${pathFor(key, locale)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: key === 'home' ? 1 : key === 'quote' ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [hreflang[other], `${siteUrl}${pathFor(key, other)}`]),
        ),
      },
    })),
  );
}
