import { PageHeader } from '@/components/sections/PageHeader';
import { GalleryGrid } from '@/components/sections/GalleryGrid';
import { CtaSection } from '@/components/sections/CtaSection';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

export function GalleryPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <PageHeader
        eyebrow={dict.gallery.eyebrow}
        title={dict.gallery.title}
        lead={dict.gallery.lead}
        image="salon"
      />

      <section className="bg-ivory py-16 md:py-24">
        <div className="shell">
          <GalleryGrid dict={dict} />
          <p className="mt-12 max-w-2xl border-l-2 border-bronze/40 pl-4 text-xs leading-relaxed text-graphite-500">
            {dict.projects.imageryNote}
          </p>
        </div>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
