/**
 * Decorative low-opacity Persian/Iranian rug motif overlay.
 * Tiles via the Tailwind `bg-persian` utility (defined in tailwind.config.ts).
 * Place inside a `relative` parent.
 */
interface Props {
  /** 0–1; defaults to 0.04. */
  opacity?: number;
  /** Override tile size in px (default 80). */
  size?: number;
  className?: string;
}

export function PersianTexture({
  opacity = 0.04,
  size = 80,
  className = '',
}: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-persian ${className}`}
      style={{
        opacity,
        backgroundSize: `${size}px ${size}px`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
