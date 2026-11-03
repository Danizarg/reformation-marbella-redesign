import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'solid' | 'outline' | 'ghost' | 'light';

const base =
  'group inline-flex items-center justify-center gap-3 whitespace-nowrap text-[0.8125rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  solid: 'bg-graphite px-8 py-4 text-ivory hover:bg-bronze',
  outline:
    'border border-graphite/25 px-8 py-4 text-graphite hover:border-graphite hover:bg-graphite hover:text-ivory',
  light:
    'border border-ivory/35 px-8 py-4 text-ivory hover:border-ivory hover:bg-ivory hover:text-graphite',
  ghost: 'px-0 py-1 text-graphite hover:text-bronze',
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
    >
      &#8594;
    </span>
  );
}

export function ActionLink({
  href,
  children,
  variant = 'solid',
  className = '',
  withArrow = true,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

  const content = (
    <>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={`${base} ${variants[variant]} ${className}`}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {content}
    </Link>
  );
}

export function ActionButton({
  children,
  variant = 'solid',
  className = '',
  withArrow = true,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
} & ComponentProps<'button'>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <span>{children}</span>
      {withArrow && <Arrow />}
    </button>
  );
}
