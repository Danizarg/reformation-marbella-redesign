import { PageHeader } from '@/components/sections/PageHeader';
import { CtaSection } from '@/components/sections/CtaSection';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath, site } from '@/content/site';

export function AboutPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <PageHeader
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        lead={dict.about.lead}
        image="interior-exterior"
      />

      <section className="bg-ivory py-24 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="prose-editorial max-w-2xl">
              {dict.about.paragraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.05}>
                  <p className={index === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[3.5rem] first-letter:leading-[0.82] first-letter:text-bronze' : ''}>
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <blockquote className="mt-14 border-l-2 border-bronze/50 pl-6 font-display text-[1.75rem] font-light leading-snug text-graphite md:text-[2.25rem]">
                {dict.about.quote}
              </blockquote>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <EditorialImage
                src={imagePath('luxury-salon')}
                alt=""
                ratio="4 / 5"
                parallax={5}
                sizes="(max-width: 1024px) 100vw, 38vw"
              />

              <div className="mt-10 border-t border-graphite/12 pt-8">
                <h2 className="eyebrow text-bronze">{dict.about.factsTitle}</h2>
                <dl className="mt-6 flex flex-col divide-y divide-graphite/10">
                  {dict.about.facts.map((fact) => (
                    <div key={fact.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                      <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-graphite-300">
                        {fact.label}
                      </dt>
                      <dd className="text-[0.9375rem] text-graphite">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-graphite-300">{dict.about.factsNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-limestone py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.common.serviceArea}
            title={dict.about.areasTitle}
            lead={dict.about.areasLead}
          />

          <RevealGroup className="mt-14 grid grid-cols-2 gap-px border border-graphite/10 bg-graphite/10 md:grid-cols-4 lg:grid-cols-7">
            {site.areas.map((area) => (
              <RevealItem
                key={area}
                className="flex min-h-28 items-end bg-limestone p-5 transition-colors duration-500 hover:bg-ivory"
              >
                <span className="font-display text-lg leading-tight text-graphite md:text-xl">
                  {area}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
