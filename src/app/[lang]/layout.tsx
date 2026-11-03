import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingQuoteButton } from '@/components/layout/FloatingQuoteButton';
import { hreflang, isLocale, locales, pathFor, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { site, siteUrl } from '@/content/site';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1c1e22',
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.home.title,
      template: `%s`,
    },
    description: dict.seo.home.description,
    applicationName: site.name,
    authors: [{ name: site.name }],
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: hreflang[lang].replace('-', '_'),
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);

  // Only facts published by the company itself go into structured data.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: site.name,
    url: `${siteUrl}${pathFor('home', locale)}`,
    email: site.email.display,
    telephone: '+34656383848',
    foundingDate: String(site.foundedYear),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.province,
      addressCountry: site.location.country,
    },
    areaServed: site.areas.map((name) => ({ '@type': 'Place', name })),
    availableLanguage: ['es', 'ru'],
    image: `${siteUrl}/images/projects/villa-piscina-luxe.jpg`,
  };

  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable}`}>
      <head>
        {/* Entry animations are server-rendered in their hidden state, so
            without JavaScript the page would come up blank. Reveal everything. */}
        <noscript>
          <style>{
            '[data-reveal]{opacity:1!important;transform:none!important}' +
            '[data-wipe]{display:none!important}'
          }</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-ivory antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-graphite focus:px-5 focus:py-3 focus:text-sm focus:text-ivory"
        >
          {dict.common.skipToContent}
        </a>

        <Header locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
        <FloatingQuoteButton locale={locale} dict={dict} />

        <script
          type="application/ld+json"
          // Static, trusted payload built from the constants above.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
