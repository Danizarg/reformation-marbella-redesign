'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

type EditorialImageProps = {
  src: string;
  alt: string;
  /** CSS aspect ratio for the frame, e.g. `4 / 5`. */
  ratio?: string;
  className?: string;
  imageClassName?: string;
  /** How far the photograph drifts inside its frame, in percent of height. */
  parallax?: number;
  /** Wipe the frame open when it enters the viewport. */
  mask?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  /** Overlay strength, 0–1, for images that sit under text. */
  scrim?: number;
};

/**
 * The single image primitive used across the site: a fixed-ratio frame, an
 * optional wipe on entry and an optional parallax drift. Both motion effects
 * switch off under `prefers-reduced-motion`.
 *
 * The wipe is a cover panel that scales away rather than an animated
 * `clip-path` on the frame: this element already owns a `useScroll` ref for the
 * parallax, and in that combination `whileInView` never fired, which left every
 * framed photograph clipped shut.
 */
export function EditorialImage({
  src,
  alt,
  ratio = '4 / 5',
  className = '',
  imageClassName = '',
  parallax = 0,
  mask = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  quality = 82,
  scrim = 0,
}: EditorialImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const drift = parallax && !reduced ? parallax : 0;
  const y = useTransform(scrollYProgress, [0, 1], [`-${drift}%`, `${drift}%`]);

  const wipe = mask && !reduced;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-limestone ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        className="absolute inset-0"
        // The photograph travels +/-drift% of the frame height, so it must be
        // oversized by drift% on each edge (plus a hair) or the frame shows
        // through at the extremes of the scroll.
        style={drift ? { y, scale: 1 + Math.abs(drift) / 50 + 0.01 } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={quality}
          className={`photo-grade object-cover ${imageClassName}`}
        />
      </motion.div>

      {scrim > 0 && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(28,30,34,${scrim}) 0%, rgba(28,30,34,${
              scrim * 0.45
            }) 45%, rgba(28,30,34,${scrim * 0.12}) 100%)`,
          }}
        />
      )}

      {/* Cover panel: scales away from the bottom edge to uncover the frame.
          It carries no `ref` of its own — the viewport trigger only fires on a
          plain motion element, not on one that also hosts the `useScroll` ref. */}
      {wipe && (
        <motion.div
          aria-hidden
          data-wipe
          className="absolute inset-0 origin-bottom bg-limestone"
          variants={{
            hidden: { scaleY: 1 },
            visible: {
              scaleY: 0,
              transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] as const },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        />
      )}
    </div>
  );
}
