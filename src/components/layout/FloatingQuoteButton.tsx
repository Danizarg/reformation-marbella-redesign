'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { site } from '@/content/site';

/**
 * Refined floating enquiry control. It appears once the visitor has moved past
 * the hero, expands on hover into a small cluster of direct contact actions and
 * hides itself on the quote page, where it would be redundant.
 */
export function FloatingQuoteButton({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() ?? '';
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  const quoteHref = pathFor('quote', locale);
  const onQuotePage = pathname === quoteHref;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (onQuotePage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 20, scale: reduced ? 1 : 0.96 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 md:bottom-8 md:right-8"
        >
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : 8 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="hidden flex-col items-end gap-2 md:flex"
              >
                <a
                  href={site.phone.href}
                  className="flex items-center gap-2 border border-graphite/15 bg-ivory/95 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite shadow-[0_8px_30px_rgba(28,30,34,0.1)] backdrop-blur transition-colors hover:bg-graphite hover:text-ivory"
                >
                  {dict.common.callUs}
                </a>
                <a
                  href={site.phone.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-graphite/15 bg-ivory/95 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite shadow-[0_8px_30px_rgba(28,30,34,0.1)] backdrop-blur transition-colors hover:bg-graphite hover:text-ivory"
                >
                  {dict.common.whatsapp}
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href={quoteHref}
            className="group flex items-center gap-3 bg-graphite px-6 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ivory shadow-[0_12px_40px_rgba(28,30,34,0.28)] transition-colors duration-500 hover:bg-bronze"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-sand transition-colors duration-500 group-hover:bg-ivory"
            />
            {dict.common.requestQuote}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
