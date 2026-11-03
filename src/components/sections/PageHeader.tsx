import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { imagePath } from '@/content/site';

/** Inner-page masthead: photograph, eyebrow, display title and lead. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  image,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  image: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';

  return (
    <header className="relative isolate overflow-hidden bg-graphite text-ivory">
      <Image
        src={imagePath(image)}
        alt=""
        fill
        priority
        quality={82}
        sizes="100vw"
        className="photo-grade -z-10 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(20,22,25,0.92) 0%, rgba(20,22,25,0.70) 45%, rgba(20,22,25,0.58) 100%)',
        }}
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <div
        className="shell pb-16 md:pb-24"
        style={{ paddingTop: 'calc(var(--header-h) + 5rem)' }}
      >
        <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
          <Reveal distance={14}>
            <p
              className={`eyebrow flex items-center gap-3 text-sand ${
                centered ? 'justify-center' : ''
              }`}
            >
              <span aria-hidden className="hidden h-px w-10 shrink-0 bg-sand/50 sm:block" />
              {eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 text-display text-ivory">{title}</h1>
          </Reveal>

          {lead && (
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-ivory/75 md:text-lg">
                {lead}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}
