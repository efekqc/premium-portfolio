/**
 * Soft vertical gradient strip used between sections to blend contrasting
 * backgrounds (forest → sand → forest).  Pure CSS, no JS, GPU-friendly.
 */
interface Props {
  /** Top color hex/css. */
  from: string;
  /** Bottom color hex/css. */
  to: string;
  /** Strip height (defaults to 8rem). */
  height?: string;
  /** Use `aria-hidden` — purely decorative. */
  className?: string;
}

export function SectionFade({
  from,
  to,
  height = '8rem',
  className = '',
}: Props) {
  return (
    <div
      aria-hidden
      className={`relative w-full ${className}`}
      style={{
        height,
        backgroundImage: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
      }}
    />
  );
}
