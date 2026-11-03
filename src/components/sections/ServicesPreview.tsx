import { ActionLink } from '@/components/ui/ActionLink';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath } from '@/content/site';

/** Condensed service index: group titles and a one-line summary each. */
export function ServicesPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal distance={14}>
            <p className="eyebrow flex items-center gap-3 text-bronze">
              <span className="tabular-nums opacity-70">03</span>
              <span aria-hidden className="h-px w-8 bg-bronze/40" />
              {dict.home.servicesEyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 text-display-sm text-graphite">{dict.home.servicesTitle}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-graphite-500">
              {dict.home.servicesLead}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9">
              <ActionLink href={pathFor('services', locale)} variant="outline">
                {dict.common.viewServices}
              </ActionLink>
            </div>
          </Reveal>

          <div className="mt-14 hidden lg:block">
            <EditorialImage
              src={imagePath('construction-luxe')}
              alt=""
              ratio="16 / 9"
              parallax={5}
              sizes="40vw"
            />
          </div>
        </div>

        <RevealGroup className="lg:col-span-6 lg:col-start-7" stagger={0.07}>
          <ul className="border-t border-graphite/12">
            {dict.services.groups.map((group, index) => (
              <RevealItem as="li" key={group.id} className="border-b border-graphite/12">
                <div className="group flex items-start gap-5 py-6 md:py-7">
                  <span className="mt-1.5 text-[0.6875rem] font-semibold tabular-nums tracking-[0.18em] text-graphite/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-light leading-tight text-graphite md:text-[1.6rem]">
                      {group.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-graphite-500">{group.summary}</p>
                  </div>
                  <span className="mt-2 text-xs tabular-nums text-graphite/30">
                    {group.items.length}
                  </span>
                </div>
              </RevealItem>
            ))}
          </ul>
        </RevealGroup>
      </div>
    </section>
  );
}
