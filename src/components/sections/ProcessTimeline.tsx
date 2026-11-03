'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

import { RevealItem, RevealGroup } from '@/components/ui/Reveal';
import type { Dictionary } from '@/i18n/getDictionary';

/**
 * Scroll-driven process timeline: a rule fills as the section passes the
 * viewport, with each step revealed in turn.
 */
export function ProcessTimeline({
  dict,
  tone = 'light',
  index,
  title,
  eyebrow,
  lead,
}: {
  dict: Dictionary;
  tone?: 'light' | 'dark';
  index?: number;
  title?: string;
  eyebrow?: string;
  lead?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 72%', 'end 55%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  const onDark = tone === 'dark';
  const heading = onDark ? 'text-ivory' : 'text-graphite';
  const body = onDark ? 'text-sand/70' : 'text-graphite-500';
  const line = onDark ? 'bg-ivory/15' : 'bg-graphite/12';
  const fill = onDark ? 'bg-sand' : 'bg-bronze';

  return (
    <div>
      {(eyebrow || title) && (
        <div className="max-w-2xl">
          {eyebrow && (
            <p className={`eyebrow flex items-center gap-3 ${onDark ? 'text-sand' : 'text-bronze'}`}>
              {typeof index === 'number' && (
                <span className="tabular-nums opacity-70">{String(index).padStart(2, '0')}</span>
              )}
              <span aria-hidden className={`h-px w-8 ${onDark ? 'bg-sand/40' : 'bg-bronze/40'}`} />
              {eyebrow}
            </p>
          )}
          {title && <h2 className={`mt-6 text-display-sm ${heading}`}>{title}</h2>}
          {lead && <p className={`mt-6 text-[1.0625rem] leading-relaxed ${body}`}>{lead}</p>}
        </div>
      )}

      <div ref={ref} className="relative mt-16 md:mt-20">
        {/* Track + scroll-linked fill */}
        <div aria-hidden className={`absolute left-0 top-0 hidden h-full w-px md:block ${line}`}>
          <motion.div
            className={`h-full w-full origin-top ${fill}`}
            style={{ scaleY: reduced ? 1 : progress }}
          />
        </div>

        <RevealGroup className="flex flex-col gap-12 md:gap-16 md:pl-12" stagger={0.08}>
          {dict.process.steps.map((step, i) => (
            <RevealItem key={step.title} className="relative grid gap-4 md:grid-cols-12 md:gap-8">
              <span
                aria-hidden
                className={`absolute -left-12 top-2 hidden h-2 w-2 -translate-x-[3.5px] rounded-full md:block ${fill}`}
              />
              <div className="md:col-span-3">
                <span
                  className={`text-[0.6875rem] font-semibold tabular-nums tracking-[0.2em] ${
                    onDark ? 'text-sand/55' : 'text-bronze/70'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="md:col-span-9">
                <h3 className={`font-display text-[1.75rem] font-light leading-tight md:text-[2rem] ${heading}`}>
                  {step.title}
                </h3>
                <p className={`mt-4 max-w-2xl text-[0.9375rem] leading-relaxed md:text-base ${body}`}>
                  {step.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
