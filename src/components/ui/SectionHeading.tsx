import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Tone = 'dark' | 'light';

/** Numbered eyebrow + display heading + optional lead, used by every section. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  index,
  tone = 'dark',
  align = 'left',
  className = '',
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Two-digit section number shown before the eyebrow. */
  index?: number;
  tone?: Tone;
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
}) {
  const muted = tone === 'light' ? 'text-sand' : 'text-bronze';
  const heading = tone === 'light' ? 'text-ivory' : 'text-graphite';
  const body = tone === 'light' ? 'text-sand/80' : 'text-graphite-500';
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start';

  return (
    <div className={`flex max-w-3xl flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <Reveal distance={14}>
          <p className={`eyebrow flex items-center gap-3 ${muted}`}>
            {typeof index === 'number' && (
              <span className="tabular-nums opacity-70">
                {String(index).padStart(2, '0')}
              </span>
            )}
            <span aria-hidden className={`h-px w-8 ${tone === 'light' ? 'bg-sand/40' : 'bg-bronze/40'}`} />
            {eyebrow}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.06}>
        <h2 className={`mt-6 text-display-sm ${heading}`}>{title}</h2>
      </Reveal>

      {lead && (
        <Reveal delay={0.12}>
          <p className={`mt-6 max-w-2xl text-[1.0625rem] leading-relaxed md:text-lg ${body}`}>{lead}</p>
        </Reveal>
      )}

      {children}
    </div>
  );
}
