import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal } from '@/components/ui/Reveal';
import { ActionLink } from '@/components/ui/ActionLink';
import { pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath, site } from '@/content/site';

/**
 * Overlapping photography with opposing parallax drift, set against the
 * company's own description of itself.
 */
export function IntroSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative bg-ivory py-24 md:py-36">
      <div className="shell grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="relative md:col-span-6 lg:col-span-5">
          <EditorialImage
            src={imagePath('luxe-casa-interio')}
            alt=""
            ratio="4 / 5"
            parallax={6}
            sizes="(max-width: 768px) 100vw, 40vw"
          />

          {/* Second plate overlaps the first and drifts the other way. */}
          <div className="relative -mt-20 ml-auto w-[62%] md:absolute md:-bottom-20 md:-right-24 md:mt-0 md:w-[58%] lg:-right-28">
            <EditorialImage
              src={imagePath('interior-exterior')}
              alt=""
              ratio="3 / 4"
              parallax={-9}
              sizes="(max-width: 768px) 60vw, 26vw"
              className="shadow-[0_30px_80px_-30px_rgba(28,30,34,0.45)]"
            />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-8 lg:col-start-8">
          <Reveal distance={14}>
            <p className="eyebrow flex items-center gap-3 text-bronze">
              <span className="tabular-nums opacity-70">01</span>
              <span aria-hidden className="h-px w-8 bg-bronze/40" />
              {dict.home.introEyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mt-6 text-display-sm text-graphite">{dict.home.introTitle}</h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 font-display text-2xl font-light leading-snug text-graphite md:text-[1.75rem]">
              {dict.home.introLead}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-graphite-500">
              {dict.home.introBody}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-graphite/10 pt-8">
              <div>
                <dt className="eyebrow text-graphite-300">{dict.common.basedIn}</dt>
                <dd className="mt-2 font-display text-xl text-graphite">
                  {site.location.city}, {site.location.province}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-graphite-300">{dict.common.since}</dt>
                <dd className="mt-2 font-display text-xl text-graphite tabular-nums">
                  {site.foundedYear}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10">
              <ActionLink href={pathFor('about', locale)} variant="outline">
                {dict.home.introCta}
              </ActionLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
