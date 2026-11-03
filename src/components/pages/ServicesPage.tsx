import { PageHeader } from '@/components/sections/PageHeader';
import { CtaSection } from '@/components/sections/CtaSection';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal } from '@/components/ui/Reveal';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath } from '@/content/site';

/** One supporting photograph per service group. */
const GROUP_IMAGE: Record<string, string> = {
  'obra-general': 'casa-5',
  reforma: 'interior-salon',
  proyecto: 'proyecto-1',
  licencias: 'villa-luxe',
  madera: 'sauna-1',
  piscinas: 'piscina-6',
  domotica: 'sala-audiovisual',
};

export function ServicesPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <PageHeader
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        lead={dict.services.lead}
        image="cocina-luxe"
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="shell">
          <p className="max-w-2xl border-l-2 border-bronze/40 pl-4 text-xs leading-relaxed text-graphite-500">
            {dict.services.note}
          </p>

          <div className="mt-16 flex flex-col gap-20 md:gap-28">
            {dict.services.groups.map((group, index) => {
              const flipped = index % 2 === 1;
              return (
                <article
                  key={group.id}
                  id={group.id}
                  className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:gap-14"
                >
                  <div
                    className={`lg:col-span-5 ${flipped ? 'lg:order-2 lg:col-start-8' : 'lg:order-1'}`}
                  >
                    <EditorialImage
                      src={imagePath(GROUP_IMAGE[group.id] ?? 'interior-c')}
                      alt=""
                      ratio="4 / 3"
                      parallax={6}
                      sizes="(max-width: 1024px) 100vw, 38vw"
                    />
                  </div>

                  <div
                    className={`lg:col-span-6 ${
                      flipped ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-7'
                    }`}
                  >
                    <Reveal distance={14}>
                      <p className="eyebrow flex items-center gap-3 text-bronze">
                        <span className="tabular-nums opacity-70">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden className="h-px w-8 bg-bronze/40" />
                        {group.summary}
                      </p>
                    </Reveal>

                    <Reveal delay={0.06}>
                      <h2 className="mt-5 text-display-sm text-graphite">{group.title}</h2>
                    </Reveal>

                    <Reveal delay={0.12}>
                      <ul className="mt-8 grid gap-x-8 gap-y-0 border-t border-graphite/12 sm:grid-cols-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 border-b border-graphite/10 py-3 text-[0.9375rem] leading-snug text-graphite-500"
                          >
                            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bronze/70" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
