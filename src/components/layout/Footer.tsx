import Link from 'next/link';

import { Wordmark } from './Wordmark';
import { pageKeys, pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { mapsUrl, site } from '@/content/site';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-graphite text-ivory">
      <div className="shell py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Wordmark tone="light" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-sand/70">{dict.footer.tagline}</p>
            <p className="mt-8 text-sm text-sand/55">
              {dict.common.since} {site.foundedYear}
            </p>
          </div>

          <nav aria-label={dict.footer.navTitle} className="md:col-span-3">
            <p className="eyebrow text-sand/55">{dict.footer.navTitle}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {pageKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={pathFor(key, locale)}
                    className="link-underline text-[0.9375rem] text-ivory/80 transition-colors hover:text-ivory"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow text-sand/55">{dict.footer.contactTitle}</p>
            <ul className="mt-6 flex flex-col gap-3 text-[0.9375rem] text-ivory/80">
              <li>
                <a href={site.phone.href} className="link-underline hover:text-ivory">
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={site.email.href} className="link-underline break-all hover:text-ivory">
                  {site.email.display}
                </a>
              </li>
              <li>
                <a
                  href={site.phone.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-ivory"
                >
                  {dict.common.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-ivory"
                >
                  {dict.contact.addressValue}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-sand/55">{dict.footer.areasTitle}</p>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-ivory/65">
              {site.areas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule-light mt-14" />

        <div className="mt-8 flex flex-col gap-4 text-xs text-sand/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalLine} — {dict.footer.builtNote}. {dict.footer.rights}
          </p>
          <a
            href={site.legacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline w-fit hover:text-sand"
          >
            {dict.footer.legacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
