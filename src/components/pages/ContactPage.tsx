import { PageHeader } from '@/components/sections/PageHeader';
import { QuoteForm } from '@/components/sections/QuoteForm';
import { EditorialImage } from '@/components/ui/EditorialImage';
import { Reveal } from '@/components/ui/Reveal';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath, mapsUrl, site } from '@/content/site';

export function ContactPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const rows = [
    { label: dict.contact.companyLabel, value: site.name },
    {
      label: dict.contact.addressLabel,
      value: dict.contact.addressValue,
      href: mapsUrl,
      external: true,
    },
    { label: dict.contact.phoneLabel, value: site.phone.display, href: site.phone.href },
    { label: dict.contact.emailLabel, value: site.email.display, href: site.email.href },
    { label: dict.contact.languagesLabel, value: dict.contact.languagesValue },
  ];

  return (
    <>
      <PageHeader
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        lead={dict.contact.lead}
        image="sauna-y-spa"
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal distance={14}>
              <h2 className="eyebrow text-bronze">{dict.contact.detailsTitle}</h2>
            </Reveal>

            <Reveal delay={0.06}>
              <dl className="mt-8 flex flex-col divide-y divide-graphite/10 border-y border-graphite/12">
                {rows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-6">
                    <dt className="w-44 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-graphite-300">
                      {row.label}
                    </dt>
                    <dd className="text-[0.9375rem] text-graphite">
                      {row.href ? (
                        <a
                          href={row.href}
                          className="link-underline break-all hover:text-bronze"
                          {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={site.phone.href}
                  className="border border-graphite/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition-colors hover:bg-graphite hover:text-ivory"
                >
                  {dict.common.callUs}
                </a>
                <a
                  href={site.phone.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-graphite/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition-colors hover:bg-graphite hover:text-ivory"
                >
                  {dict.common.whatsapp}
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-graphite/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition-colors hover:bg-graphite hover:text-ivory"
                >
                  {dict.contact.mapsLink}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10">
                <p className="eyebrow text-graphite-300">{dict.common.serviceArea}</p>
                <p className="mt-4 text-sm leading-relaxed text-graphite-500">
                  {site.areas.join(' · ')}
                </p>
              </div>
            </Reveal>

            <div className="mt-12">
              <EditorialImage
                src={imagePath('villa-piscina-luxe')}
                alt=""
                ratio="4 / 3"
                parallax={5}
                sizes="(max-width: 1024px) 100vw, 38vw"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal distance={14}>
              <h2 className="eyebrow text-bronze">{dict.contact.formTitle}</h2>
            </Reveal>
            <div className="mt-8">
              <QuoteForm locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
