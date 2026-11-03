'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { LanguageSwitcher } from './LanguageSwitcher';
import { Wordmark } from './Wordmark';
import { pageKeys, pathFor, type Locale, type PageKey } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { site } from '@/content/site';

const PRIMARY_NAV: PageKey[] = ['about', 'services', 'projects', 'gallery', 'process', 'contact'];

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() ?? '';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const isHome = pathname === `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the overlay whenever navigation happens. Adjusting during render
  // rather than in an effect avoids a second, cascading render pass.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    if (open) setOpen(false);
  }

  // Lock the page behind the open overlay and allow Escape to dismiss it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Over the hero the bar is transparent with light type; everywhere else it is solid.
  const solid = scrolled || !isHome;
  // The open overlay is ivory, so light-tone marks would vanish into it.
  const tone: 'dark' | 'light' = solid || open ? 'dark' : 'light';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          solid
            ? 'border-b border-graphite/10 bg-ivory/92 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Link
            href={pathFor('home', locale)}
            className="shrink-0"
            aria-label={site.name}
          >
            <Wordmark tone={tone} />
          </Link>

          <nav aria-label={dict.common.menu} className="hidden items-center gap-7 lg:flex">
            {PRIMARY_NAV.map((key) => {
              const href = pathFor(key, locale);
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`link-underline text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300 ${
                    solid
                      ? active
                        ? 'text-bronze'
                        : 'text-graphite/70 hover:text-graphite'
                      : 'text-ivory/80 hover:text-ivory'
                  }`}
                >
                  {dict.nav[key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <LanguageSwitcher locale={locale} label={dict.common.language} tone={tone} />

            <Link
              href={pathFor('quote', locale)}
              className={`hidden items-center border px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 md:inline-flex ${
                tone === 'dark'
                  ? 'border-graphite/25 text-graphite hover:border-graphite hover:bg-graphite hover:text-ivory'
                  : 'border-ivory/40 text-ivory hover:bg-ivory hover:text-graphite'
              }`}
            >
              {dict.common.requestQuoteShort}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
              className={`relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden ${
                open || solid ? 'text-graphite' : 'text-ivory'
              }`}
            >
              <span
                className={`block h-px w-6 bg-current transition-transform duration-400 ${
                  open ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-current transition-transform duration-400 ${
                  open ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: reduced ? 0 : -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -16 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 overflow-y-auto bg-ivory lg:hidden"
          >
            <div className="shell flex min-h-full flex-col pb-14" style={{ paddingTop: 'var(--header-h)' }}>
              <nav aria-label={dict.common.menu} className="mt-10 flex flex-col">
                {pageKeys
                  .filter((key) => key !== 'home')
                  .map((key, index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.5,
                        delay: reduced ? 0 : 0.06 + index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="border-b border-graphite/10"
                    >
                      <Link
                        href={pathFor(key, locale)}
                        className="flex items-baseline gap-4 py-5 font-display text-3xl font-light text-graphite"
                      >
                        <span className="text-[0.6875rem] font-sans font-semibold tracking-[0.2em] text-bronze/70">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {dict.nav[key]}
                      </Link>
                    </motion.div>
                  ))}
              </nav>

              <div className="mt-auto pt-12">
                <p className="eyebrow text-bronze">{dict.footer.contactTitle}</p>
                <div className="mt-5 flex flex-col gap-2 text-graphite">
                  <a href={site.phone.href} className="link-underline w-fit text-lg">
                    {site.phone.display}
                  </a>
                  <a href={site.email.href} className="link-underline w-fit break-all text-lg">
                    {site.email.display}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
