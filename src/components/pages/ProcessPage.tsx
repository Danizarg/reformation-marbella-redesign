import { PageHeader } from '@/components/sections/PageHeader';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { CtaSection } from '@/components/sections/CtaSection';
import { EditorialImage } from '@/components/ui/EditorialImage';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { imagePath } from '@/content/site';

export function ProcessPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <PageHeader
        eyebrow={dict.process.eyebrow}
        title={dict.process.title}
        lead={dict.process.lead}
        image="proyecto-1"
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProcessTimeline dict={dict} tone="light" />
            <p className="mt-16 max-w-2xl border-l-2 border-bronze/40 pl-4 text-xs leading-relaxed text-graphite-500 md:ml-12">
              {dict.process.note}
            </p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32 flex flex-col gap-6">
              <EditorialImage
                src={imagePath('interior-c')}
                alt=""
                ratio="3 / 4"
                parallax={5}
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
              <EditorialImage
                src={imagePath('bano-luxuri')}
                alt=""
                ratio="4 / 3"
                parallax={-5}
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
