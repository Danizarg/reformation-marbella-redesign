'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

import { pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath, media } from '@/content/site';

const ROTATE_MS = 6500;

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const slides = media.hero;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '26%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);

  // Hold on a single frame when the visitor has asked for reduced motion.
  useEffect(() => {
    if (reduced || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, slides.length]);

  const lines = [dict.hero.headline.lead, dict.hero.headline.trail];

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-graphite"
      aria-label={dict.nav.home}
    >
      <motion.div className="absolute inset-0" style={{ scale: mediaScale }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={slides[index]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 1.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <Image
              src={imagePath(slides[index])}
              alt=""
              fill
              priority={index === 0}
              quality={85}
              sizes="100vw"
              className="photo-grade object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Scrim: deep at the foot so the headline always clears AA contrast. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(20,22,25,0.92) 0%, rgba(20,22,25,0.76) 30%, rgba(20,22,25,0.52) 58%, rgba(20,22,25,0.40) 78%, rgba(20,22,25,0.58) 100%)',
        }}
      />
      <div aria-hidden className="grain absolute inset-0" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 pb-12 pt-32 md:pb-16"
      >
        <motion.p
          data-reveal
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.15 }}
          className="eyebrow flex items-center gap-3 text-sand"
        >
          <span aria-hidden className="hidden h-px w-10 shrink-0 bg-sand/50 sm:block" />
          {dict.hero.eyebrow}
        </motion.p>

        <h1 className="mt-7 text-display-lg text-ivory">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                data-reveal
                className="block"
                initial={{ y: reduced ? 0 : '110%', opacity: reduced ? 0 : 1 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: reduced ? 0.4 : 1.15,
                  delay: reduced ? 0 : 0.3 + i * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={i === 1 ? { color: 'var(--color-sand)' } : undefined}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          data-reveal
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.72 }}
          className="mt-9 flex max-w-xl flex-col gap-8"
        >
          <p className="text-base leading-relaxed text-ivory/80 md:text-lg">{dict.hero.subline}</p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={pathFor('quote', locale)}
              className="group inline-flex items-center gap-3 bg-ivory px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-graphite transition-colors duration-500 hover:bg-sand"
            >
              {dict.hero.primaryCta}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
            <Link
              href={pathFor('projects', locale)}
              className="group inline-flex items-center gap-3 border border-ivory/40 px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors duration-500 hover:bg-ivory hover:text-graphite"
            >
              {dict.hero.secondaryCta}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                &#8594;
              </span>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        data-reveal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 1 }}
        className="relative z-10 border-t border-ivory/15"
      >
        <div className="shell flex items-center justify-between gap-6 py-5">
          <span className="eyebrow text-ivory/55">{dict.hero.scrollHint}</span>

          <div className="flex items-center gap-3" aria-hidden>
            {slides.map((slide, i) => (
              <span
                key={slide}
                className={`h-px transition-all duration-700 ${
                  i === index ? 'w-10 bg-sand' : 'w-5 bg-ivory/30'
                }`}
              />
            ))}
            <span className="ml-2 text-xs tabular-nums text-ivory/55">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
