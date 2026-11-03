import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/i18n/getDictionary';

/**
 * Typography-led feature block. Deliberately not animated counters: no
 * verifiable statistics exist for this company, so the emphasis is on its
 * stated way of working instead of invented numbers.
 */
export function PillarsSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-graphite py-24 text-ivory md:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.home.pillarsEyebrow}
          title={dict.home.pillarsTitle}
          index={2}
          tone="light"
        />

        <RevealGroup className="mt-16 grid gap-px border-t border-ivory/15 md:mt-20 md:grid-cols-3">
          {dict.home.pillars.map((pillar, index) => (
            <RevealItem
              key={pillar.title}
              className="group relative border-b border-ivory/15 py-10 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="eyebrow tabular-nums text-sand/50">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-display text-[1.75rem] font-light leading-tight text-ivory md:text-[2rem]">
                {pillar.title}
              </h3>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-sand/70">{pillar.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
