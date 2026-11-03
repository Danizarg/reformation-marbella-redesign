'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import type { Dictionary } from '@/i18n/getDictionary';
import { beforeAfterDemos, demoPath } from '@/content/site';

/**
 * Interactive before/after comparison.
 *
 * Accessibility: the divider is a real `<input type="range">` stretched across
 * the frame, so arrow keys, Home/End and screen readers work without any custom
 * key handling. Pointer dragging is the browser's own.
 *
 * Honesty: the company archive holds no genuine paired before/after
 * photographs, so the "before" frame is a simulation generated from the
 * finished photograph. That is stated on the control itself and again below it.
 */
export function BeforeAfterSlider({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(50);
  const sliderId = useId();
  const reduced = useReducedMotion();

  const demo = beforeAfterDemos[active];
  const labels = dict.beforeAfter.demos[active] ?? dict.beforeAfter.demos[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Demo selector */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={dict.beforeAfter.title}>
        {beforeAfterDemos.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setActive(index);
                setPosition(50);
              }}
              className={`border px-5 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-400 ${
                selected
                  ? 'border-graphite bg-graphite text-ivory'
                  : 'border-graphite/20 text-graphite/65 hover:border-graphite/50 hover:text-graphite'
              }`}
            >
              {dict.beforeAfter.demos[index]?.title}
            </button>
          );
        })}
      </div>

      <figure className="m-0">
        <motion.div
          key={demo.slug}
          data-reveal
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative select-none overflow-hidden bg-limestone"
          style={{ aspectRatio: '16 / 10' }}
        >
          {/* Finished state sits underneath. */}
          <Image
            src={demoPath(demo.slug, 'after')}
            alt={`${labels.title} — ${dict.beforeAfter.after}`}
            fill
            quality={86}
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="photo-grade object-cover"
            draggable={false}
          />

          {/* Simulated prior state, revealed from the left. */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            aria-hidden
          >
            <Image
              src={demoPath(demo.slug, 'before')}
              alt=""
              fill
              quality={82}
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
              draggable={false}
            />
          </div>

          {/* Side labels */}
          <span className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2 bg-graphite/80 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ivory backdrop-blur-sm md:left-6 md:top-6">
            {dict.beforeAfter.before}
            <span className="font-normal normal-case tracking-normal text-sand/80">
              · {dict.beforeAfter.disclaimerShort}
            </span>
          </span>
          <span className="pointer-events-none absolute right-4 top-4 z-20 bg-ivory/90 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-graphite backdrop-blur-sm md:right-6 md:top-6">
            {dict.beforeAfter.after}
          </span>

          {/* Divider */}
          <div
            className="pointer-events-none absolute inset-y-0 z-20 w-px bg-ivory/90 shadow-[0_0_20px_rgba(0,0,0,0.35)]"
            style={{ left: `${position}%` }}
            aria-hidden
          >
            <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 bg-ivory/95 text-graphite shadow-[0_6px_24px_rgba(0,0,0,0.3)]">
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden>
                <path
                  d="M7 1.5 2.5 6 7 10.5M13 1.5 17.5 6 13 10.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* The real control. Transparent, full-bleed, fully keyboard operable. */}
          <label htmlFor={sliderId} className="sr-only">
            {dict.beforeAfter.sliderLabel}
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label={dict.beforeAfter.sliderLabel}
            aria-valuetext={`${Math.round(position)}%`}
            className="ba-range absolute inset-0 z-30 h-full w-full cursor-ew-resize appearance-none bg-transparent"
          />
        </motion.div>

        <figcaption className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl text-graphite">{labels.title}</p>
            <p className="mt-1 text-sm text-graphite-500">{labels.caption}</p>
          </div>
          <p className="text-xs text-graphite-500 md:max-w-xs md:text-right">
            {dict.beforeAfter.instruction}
          </p>
        </figcaption>
      </figure>

      <p className="max-w-3xl border-l-2 border-bronze/40 pl-4 text-xs leading-relaxed text-graphite-500">
        {dict.beforeAfter.disclaimer}
      </p>

      <style jsx>{`
        .ba-range:focus-visible {
          outline: 2px solid var(--color-bronze);
          outline-offset: -2px;
        }
        .ba-range::-webkit-slider-thumb {
          appearance: none;
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          background: transparent;
          cursor: ew-resize;
        }
        .ba-range::-moz-range-thumb {
          width: 48px;
          height: 48px;
          border: 0;
          border-radius: 9999px;
          background: transparent;
          cursor: ew-resize;
        }
        .ba-range::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
