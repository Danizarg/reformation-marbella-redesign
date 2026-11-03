/** Typographic logotype: display serif over a tracked-out locality line. */
export function Wordmark({
  tone = 'dark',
  className = '',
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const primary = tone === 'light' ? 'text-ivory' : 'text-graphite';
  const secondary = tone === 'light' ? 'text-ivory/60' : 'text-bronze';

  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span
        className={`font-display text-[1.375rem] font-normal tracking-[0.01em] transition-colors duration-500 md:text-[1.5rem] ${primary}`}
      >
        Reformation
      </span>
      <span
        className={`mt-[3px] text-[0.5rem] font-semibold uppercase tracking-[0.42em] transition-colors duration-500 md:text-[0.5625rem] ${secondary}`}
      >
        Marbella
      </span>
    </span>
  );
}
