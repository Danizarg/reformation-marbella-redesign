import Link from 'next/link';
import { defaultLocale, pathFor } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

/**
 * Rendered for any unknown slug under a valid locale. The segment's own locale
 * is not available to `not-found`, so this falls back to Spanish.
 */
export default function NotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <section className="flex min-h-[70svh] items-center bg-ivory">
      <div className="shell py-28">
        <p className="eyebrow text-bronze">404</p>
        <h1 className="mt-6 text-display text-graphite">{dict.notFound.title}</h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-graphite-500">
          {dict.notFound.body}
        </p>
        <Link
          href={pathFor('home', defaultLocale)}
          className="mt-10 inline-flex items-center gap-3 bg-graphite px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors duration-500 hover:bg-bronze"
        >
          {dict.notFound.cta}
          <span aria-hidden>&#8594;</span>
        </Link>
      </div>
    </section>
  );
}
