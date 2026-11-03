import { Hero } from '@/components/sections/Hero';
import { IntroSection } from '@/components/sections/IntroSection';
import { PillarsSection } from '@/components/sections/PillarsSection';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { ProjectsShowcase } from '@/components/sections/ProjectsShowcase';
import { BeforeAfterSlider } from '@/components/sections/BeforeAfterSlider';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { CtaSection } from '@/components/sections/CtaSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ActionLink } from '@/components/ui/ActionLink';
import { Reveal } from '@/components/ui/Reveal';
import { pathFor, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';

export function HomePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <Hero locale={locale} dict={dict} />
      <IntroSection locale={locale} dict={dict} />
      <PillarsSection dict={dict} />
      <ServicesPreview locale={locale} dict={dict} />
      <ProjectsShowcase locale={locale} dict={dict} />

      <section className="bg-ivory py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow={dict.home.beforeAfterEyebrow}
            title={dict.home.beforeAfterTitle}
            index={5}
          />
          <div className="mt-14">
            <BeforeAfterSlider dict={dict} />
          </div>
        </div>
      </section>

      <section className="bg-graphite py-24 text-ivory md:py-32">
        <div className="shell">
          <ProcessTimeline
            dict={dict}
            tone="dark"
            index={6}
            eyebrow={dict.home.processEyebrow}
            title={dict.home.processTitle}
          />
          <Reveal delay={0.1}>
            <div className="mt-16 md:pl-12">
              <ActionLink href={pathFor('process', locale)} variant="light">
                {dict.nav.process}
              </ActionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
