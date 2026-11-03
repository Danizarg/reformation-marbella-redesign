'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  isLocale,
  locales,
  localeNames,
  pageKeyFromSlug,
  pathFor,
  type Locale,
} from '@/i18n/config';

/**
 * Switches language while staying on the same page. Because each locale has its
 * own slugs, the current path is resolved back to a page key and then rebuilt
 * in the target language — so `/es/servicios` becomes `/ru/uslugi`, not a 404.
 */
export function LanguageSwitcher({
  locale,
  label,
  tone = 'dark',
  className = '',
}: {
  locale: Locale;
  label: string;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;

  const equivalentPath = (target: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    const [maybeLocale, ...rest] = segments;
    if (!isLocale(maybeLocale)) return pathFor('home', target);

    const key = pageKeyFromSlug(rest.join('/'), maybeLocale);
    return key ? pathFor(key, target) : pathFor('home', target);
  };

  const idle = tone === 'light' ? 'text-ivory/55 hover:text-ivory' : 'text-graphite/45 hover:text-graphite';
  const active = tone === 'light' ? 'text-ivory' : 'text-graphite';
  const divider = tone === 'light' ? 'bg-ivory/30' : 'bg-graphite/25';

  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label={label}>
      {locales.map((target, index) => {
        const isActive = target === locale;
        return (
          <span key={target} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden className={`h-3 w-px ${divider}`} />}
            <Link
              href={equivalentPath(target)}
              hrefLang={target}
              lang={target}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => {
                // Remember the choice so the root redirect honours it next visit.
                document.cookie = `locale=${target}; path=/; max-age=31536000; samesite=lax`;
              }}
              className={`text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                isActive ? active : idle
              }`}
            >
              <span className="sr-only">{localeNames[target].long}</span>
              <span aria-hidden>{localeNames[target].short}</span>
            </Link>
          </span>
        );
      })}
    </div>
  );
}
