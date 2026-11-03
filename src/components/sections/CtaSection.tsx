import Image from 'next/image';

import { ActionLink } from '@/components/ui/ActionLink';
import { Reveal } from '@/components/ui/Reveal';
import { pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath, site } from '@/content/site';

/** Closing enquiry band over a full-bleed photograph. */
export function CtaSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative isolate overflow-hidden bg-graphite py-28 text-ivory md:py-40">
      <Image
        src={imagePath('villa-piscina-luxe')}
        alt=""
        fill
        quality={80}
        sizes="100vw"
        className="photo-grade -z-10 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(105deg, rgba(20,22,25,0.93) 18%, rgba(20,22,25,0.62) 100%)' }}
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <div className="shell">
        <div className="max-w-2xl">
          <Reveal distance={14}>
            <p className="eyebrow flex items-center gap-3 text-sand">
              <span aria-hidden className="h-px w-10 bg-sand/50" />
              {dict.home.ctaEyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mt-7 text-display text-ivory">{dict.home.ctaTitle}</h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 text-base leading-relaxed text-ivory/75 md:text-lg">
              {dict.home.ctaBody}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ActionLink
                href={pathFor('quote', locale)}
                variant="solid"
                className="!bg-ivory !text-graphite hover:!bg-sand"
              >
                {dict.home.ctaPrimary}
              </ActionLink>
              <ActionLink href={site.email.href} variant="light">
                {dict.home.ctaSecondary}
              </ActionLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ivory/15 pt-8">
              <a
                href={site.phone.href}
                className="link-underline font-display text-2xl text-ivory md:text-3xl"
              >
                {site.phone.display}
              </a>
              <a
                href={site.email.href}
                className="link-underline break-all text-sm text-sand/80 hover:text-ivory"
              >
                {site.email.display}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
