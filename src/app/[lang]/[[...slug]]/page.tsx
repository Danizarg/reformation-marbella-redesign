import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HomePage } from '@/components/pages/HomePage';
import { AboutPage } from '@/components/pages/AboutPage';
import { ServicesPage } from '@/components/pages/ServicesPage';
import { ProjectsPage } from '@/components/pages/ProjectsPage';
import { GalleryPage } from '@/components/pages/GalleryPage';
import { ProcessPage } from '@/components/pages/ProcessPage';
import { QuotePage } from '@/components/pages/QuotePage';
import { ContactPage } from '@/components/pages/ContactPage';

import {
  hreflang,
  isLocale,
  locales,
  pageKeyFromSlug,
  pageKeys,
  pathFor,
  routes,
  type Locale,
  type PageKey,
} from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { siteUrl } from '@/content/site';

type Params = { lang: string; slug?: string[] };

/** Every locale × page combination is rendered at build time. */
export function generateStaticParams(): Params[] {
  return locales.flatMap((lang) =>
    pageKeys.map((key) => {
      const slug = routes[key][lang];
      return slug ? { lang, slug: [slug] } : { lang, slug: [] };
    }),
  );
}

export const dynamicParams = true;

function resolve(params: Params): { locale: Locale; key: PageKey } | null {
  if (!isLocale(params.lang)) return null;
  const key = pageKeyFromSlug((params.slug ?? []).join('/'), params.lang);
  return key ? { locale: params.lang, key } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = resolve(await params);
  if (!resolved) return { title: 'Reformation Marbella' };

  const { locale, key } = resolved;
  const dict = getDictionary(locale);
  const seo = dict.seo[key];
  const canonical = `${siteUrl}${pathFor(key, locale)}`;

  // Point each language at its counterpart, plus an x-default for the root.
  const languages: Record<string, string> = {};
  for (const other of locales) {
    languages[hreflang[other]] = `${siteUrl}${pathFor(key, other)}`;
  }
  languages['x-default'] = `${siteUrl}${pathFor(key, 'es')}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical, languages },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      type: 'website',
      images: [{ url: '/opengraph-image.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = resolve(await params);
  if (!resolved) notFound();

  const { locale, key } = resolved;
  const dict = getDictionary(locale);
  const props = { locale, dict };

  switch (key) {
    case 'home':
      return <HomePage {...props} />;
    case 'about':
      return <AboutPage {...props} />;
    case 'services':
      return <ServicesPage {...props} />;
    case 'projects':
      return <ProjectsPage {...props} />;
    case 'gallery':
      return <GalleryPage {...props} />;
    case 'process':
      return <ProcessPage {...props} />;
    case 'quote':
      return <QuotePage {...props} />;
    case 'contact':
      return <ContactPage {...props} />;
    default:
      notFound();
  }
}
