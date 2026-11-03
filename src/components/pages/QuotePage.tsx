import { PageHeader } from '@/components/sections/PageHeader';
import { QuoteForm } from '@/components/sections/QuoteForm';
import { Reveal } from '@/components/ui/Reveal';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { site } from '@/content/site';

export function QuotePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <PageHeader
        eyebrow={dict.quote.eyebrow}
        title={dict.quote.title}
        lead={dict.quote.lead}
        image="interior-dormitorio-2"
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <QuoteForm locale={locale} dict={dict} />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <div className="border border-graphite/15 bg-limestone/50 p-8">
                <p className="eyebrow text-bronze">{dict.quote.asideTitle}</p>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-graphite-500">
                  {dict.quote.asideBody}
                </p>

                <div className="mt-8 flex flex-col gap-4 border-t border-graphite/12 pt-6">
                  <a href={site.phone.href} className="link-underline w-fit font-display text-2xl text-graphite">
                    {site.phone.display}
                  </a>
                  <a
                    href={site.email.href}
                    className="link-underline w-fit break-all text-sm text-graphite-500 hover:text-graphite"
                  >
                    {site.email.display}
                  </a>
                  <a
                    href={site.phone.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex w-fit items-center gap-2 border border-graphite/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition-colors hover:bg-graphite hover:text-ivory"
                  >
                    {dict.common.whatsapp}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-8">
                <p className="eyebrow text-graphite-300">{dict.common.serviceArea}</p>
                <p className="mt-4 text-sm leading-relaxed text-graphite-500">
                  {site.areas.join(' · ')}
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
