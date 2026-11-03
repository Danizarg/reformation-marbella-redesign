'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath, media } from '@/content/site';

type CategoryId = 'villas' | 'interiors' | 'pools' | 'wellness' | 'kitchensBaths';

const CATEGORY_ORDER: CategoryId[] = ['villas', 'interiors', 'pools', 'wellness', 'kitchensBaths'];

/** Wide photographs get a wider cell so the grid breathes like a magazine spread. */
const WIDE = new Set([
  'villa-piscina-luxe',
  'construction-luxe',
  'interior-exterior',
  'sauna-y-spa',
  'luxe-casa-interio',
  'sala-audiovisual',
]);

export function GalleryGrid({ dict }: { dict: Dictionary }) {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const catalogue = useMemo(() => {
    const seen = new Set<string>();
    const entries: { slug: string; category: CategoryId }[] = [];
    for (const category of CATEGORY_ORDER) {
      for (const slug of media[category]) {
        if (seen.has(slug)) continue;
        seen.add(slug);
        entries.push({ slug, category });
      }
    }
    return entries;
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? catalogue : catalogue.filter((item) => item.category === filter)),
    [catalogue, filter],
  );

  const categoryTitle = useCallback(
    (id: CategoryId) => dict.projects.categories.find((c) => c.id === id)?.title ?? id,
    [dict.projects.categories],
  );

  const close = useCallback(() => {
    setLightbox(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) =>
      setLightbox((current) =>
        current === null ? null : (current + delta + visible.length) % visible.length,
      ),
    [visible.length],
  );

  // Keyboard control and scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightbox === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'Tab') {
        // Simple two-stop focus trap: keep focus on the close control.
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, close, step]);

  const active = lightbox === null ? null : visible[lightbox];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          {dict.gallery.filterAll}
        </FilterChip>
        {CATEGORY_ORDER.map((id) => (
          <FilterChip key={id} active={filter === id} onClick={() => setFilter(id)}>
            {categoryTitle(id)}
          </FilterChip>
        ))}
        <span className="ml-auto text-xs tabular-nums text-graphite-300">
          {visible.length} {dict.common.of} {catalogue.length}
        </span>
      </div>

      <motion.ul layout className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((item, index) => (
            <motion.li
              key={item.slug}
              data-reveal
              layout
              initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
              transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={WIDE.has(item.slug) ? 'col-span-2' : ''}
            >
              <button
                type="button"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setLightbox(index);
                }}
                className="group relative block w-full overflow-hidden bg-limestone"
                style={{ aspectRatio: WIDE.has(item.slug) ? '16 / 10' : '4 / 5' }}
              >
                <Image
                  src={imagePath(item.slug)}
                  alt={categoryTitle(item.category)}
                  fill
                  quality={74}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="photo-grade object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-graphite/0 transition-colors duration-500 group-hover:bg-graphite/25"
                />
                <span className="absolute bottom-3 left-3 translate-y-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {categoryTitle(item.category)}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={dict.gallery.lightboxLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
            className="fixed inset-0 z-[70] flex flex-col bg-graphite/97 backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <p className="text-xs tabular-nums text-ivory/70">
                {dict.gallery.counter
                  .replace('{current}', String((lightbox ?? 0) + 1))
                  .replace('{total}', String(visible.length))}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={dict.gallery.close}
                className="flex h-11 w-11 items-center justify-center text-ivory/80 transition-colors hover:text-ivory"
              >
                <span aria-hidden className="text-2xl leading-none">
                  &#215;
                </span>
              </button>
            </div>

            <div
              className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-16"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={dict.gallery.prev}
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-ivory/70 transition-colors hover:text-ivory md:left-5"
              >
                <span aria-hidden className="text-3xl leading-none">
                  &#8249;
                </span>
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduced ? 1 : 0.99 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full max-h-[76vh] w-full max-w-5xl"
                >
                  <Image
                    src={imagePath(active.slug)}
                    alt={categoryTitle(active.category)}
                    fill
                    quality={88}
                    sizes="90vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label={dict.gallery.next}
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-ivory/70 transition-colors hover:text-ivory md:right-5"
              >
                <span aria-hidden className="text-3xl leading-none">
                  &#8250;
                </span>
              </button>
            </div>

            <p className="px-5 pb-6 text-center text-xs uppercase tracking-[0.16em] text-sand/70 md:px-8">
              {categoryTitle(active.category)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-400 ${
        active
          ? 'border-graphite bg-graphite text-ivory'
          : 'border-graphite/20 text-graphite/60 hover:border-graphite/45 hover:text-graphite'
      }`}
    >
      {children}
    </button>
  );
}
