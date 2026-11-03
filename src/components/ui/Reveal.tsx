'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ElementType, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Seconds of delay before this element starts. */
  delay?: number;
  /** Distance travelled on the way in. */
  distance?: number;
  as?: ElementType;
  className?: string;
  once?: boolean;
};

/**
 * Fades and lifts its children into place the first time they enter the
 * viewport. With `prefers-reduced-motion` the content is simply present.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 28,
  as = 'div',
  className,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as 'div'] ?? motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      data-reveal
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.25, margin: '0px 0px -8% 0px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Staggers direct children of a `Reveal`-like container. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as 'div'] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: 0.05 } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** A single item inside a `RevealGroup`. */
export function RevealItem({
  children,
  className,
  distance = 24,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as 'div'] ?? motion.div;

  return (
    <MotionTag
      data-reveal
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
