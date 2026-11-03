'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { ActionLink } from '@/components/ui/ActionLink';
import { Reveal } from '@/components/ui/Reveal';
import { pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath, media } from '@/content/site';

const CATEGORY_MEDIA: Record<string, readonly string[]> = {
  villas: media.villas,
  interiors: media.interiors,
  pools: media.pools,
  wellness: media.wellness,
  kitchensBaths: media.kitchensBaths,
};

/**
 * Category navigator. Selecting a category wipes the feature photograph away
 * with a clip-path mask and brings the next one in underneath it, so the
 * viewer moves image-to-image without a page change.
 */
export function ProjectsShowcase({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const categories = dict.projects.categories;
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const category = categories[active];
  const pool = CATEGORY_MEDIA[category.id] ?? media.interiors;
  const feature = pool[0];
  const strip = pool.slice(1, 5);

  return (
    <section className="bg-limestone py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal distance={14}>
              <p className="eyebrow flex items-center gap-3 text-bronze">
                <span className="tabular-nums opacity-70">04</span>
                <span aria-hidden className="h-px w-8 bg-bronze/40" />
                {dict.home.projectsEyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-display-sm text-graphite">{dict.home.projectsTitle}</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-graphite-500">
                {dict.home.projectsLead}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18}>
            <ActionLink href={pathFor('projects', locale)} variant="ghost" className="shrink-0">
              {dict.common.viewProjects}
            </ActionLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Category list */}
          <div className="lg:col-span-4">
            <ul className="flex flex-col border-t border-graphite/12">
              {categories.map((item, index) => {
                const selected = index === active;
                return (
                  <li key={item.id} className="border-b border-graphite/12">
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      aria-pressed={selected}
                      className="group flex w-full items-baseline gap-4 py-5 text-left"
                    >
                      <span
                        className={`text-[0.6875rem] font-semibold tabular-nums tracking-[0.18em] transition-colors duration-400 ${
                          selected ? 'text-bronze' : 'text-graphite/35'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block font-display text-2xl font-light leading-tight transition-colors duration-400 md:text-[1.75rem] ${
                            selected ? 'text-graphite' : 'text-graphite/45'
                          }`}
                        >
                          {item.title}
                        </span>
                        <AnimatePresence initial={false}>
                          {selected && (
                            <motion.span
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className="block overflow-hidden"
                            >
                              <span className="block pt-2 text-sm leading-relaxed text-graphite-500">
                                {item.caption}
                              </span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span
                        aria-hidden
                        className={`mt-1 transition-all duration-400 ${
                          selected ? 'translate-x-0 text-bronze opacity-100' : '-translate-x-2 opacity-0'
                        }`}
                      >
                        &#8594;
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Feature image + strip */}
          <div className="lg:col-span-8">
            <div
              className="relative overflow-hidden bg-graphite"
              style={{ aspectRatio: '16 / 11' }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={feature}
                  data-reveal
                  className="absolute inset-0"
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : { clipPath: 'inset(0% 0% 0% 100%)', scale: 1.06 }
                  }
                  animate={
                    reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
                  }
                  exit={reduced ? { opacity: 0 } : { opacity: 1, scale: 1.04 }}
                  transition={{ duration: reduced ? 0.2 : 0.95, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Image
                    src={imagePath(feature)}
                    alt={category.title}
                    fill
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="photo-grade object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{
                  background: 'linear-gradient(to top, rgba(20,22,25,0.72), transparent)',
                }}
              />

              <div className="pointer-events-none absolute bottom-0 left-0 p-6 md:p-8">
                <p className="font-display text-2xl text-ivory md:text-3xl">{category.title}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {strip.map((slug) => (
                <motion.div
                  key={slug}
                  data-reveal
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 0.5 }}
                  className="relative overflow-hidden bg-graphite/10"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <Image
                    src={imagePath(slug)}
                    alt=""
                    fill
                    quality={70}
                    sizes="20vw"
                    className="photo-grade object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
