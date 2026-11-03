import Link from 'next/link';

import { PageHeader } from '@/components/sections/PageHeader';
import { CtaSection } from '@/components/sections/CtaSection';
import { EditorialImage } from '@/components/ui/EditorialImage';
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

export function ProjectsPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <PageHeader
        eyebrow={dict.projects.eyebrow}
        title={dict.projects.title}
        lead={dict.projects.lead}
        image="villa-luxe"
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="shell">
          <p className="max-w-2xl border-l-2 border-bronze/40 pl-4 text-xs leading-relaxed text-graphite-500">
            {dict.projects.imageryNote}
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-28 md:gap-40">
          {dict.projects.categories.map((category, index) => {
            const pool = CATEGORY_MEDIA[category.id] ?? media.interiors;
            const [lead, second, third] = [pool[0], pool[1], pool[2]];
            const flipped = index % 2 === 1;

            return (
              <article key={category.id} className="shell">
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  {/* Caption column */}
                  <div
                    className={`lg:col-span-4 ${
                      flipped ? 'lg:order-2 lg:col-start-9' : 'lg:order-1'
                    }`}
                  >
                    <div className="lg:sticky lg:top-32">
                      <Reveal distance={14}>
                        <p className="eyebrow flex items-center gap-3 text-bronze">
                          <span className="tabular-nums opacity-70">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span aria-hidden className="h-px w-8 bg-bronze/40" />
                          {dict.projects.eyebrow}
                        </p>
                      </Reveal>

                      <Reveal delay={0.06}>
                        <h2 className="mt-5 text-display-sm text-graphite">{category.title}</h2>
                      </Reveal>

                      <Reveal delay={0.12}>
                        <p className="mt-5 text-[1.0625rem] leading-relaxed text-graphite-500">
                          {category.caption}
                        </p>
                      </Reveal>

                      <Reveal delay={0.18}>
                        <Link
                          href={pathFor('gallery', locale)}
                          className="link-underline mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-graphite hover:text-bronze"
                        >
                          {dict.projects.openGallery}
                          <span aria-hidden>&#8594;</span>
                        </Link>
                      </Reveal>
                    </div>
                  </div>

                  {/* Overlapping plates */}
                  <div
                    className={`lg:col-span-7 ${
                      flipped ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-6'
                    }`}
                  >
                    <EditorialImage
                      src={imagePath(lead)}
                      alt={category.title}
                      ratio="16 / 11"
                      parallax={5}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {second && (
                        <EditorialImage
                          src={imagePath(second)}
                          alt=""
                          ratio="3 / 4"
                          parallax={8}
                          sizes="(max-width: 1024px) 50vw, 29vw"
                        />
                      )}
                      {third && (
                        <EditorialImage
                          src={imagePath(third)}
                          alt=""
                          ratio="3 / 4"
                          parallax={-6}
                          sizes="(max-width: 1024px) 50vw, 29vw"
                          className="mt-10"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
