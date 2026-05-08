/**
 * Pure-black horizontal divider used between contrasting sections.
 * Default height is 6rem; pass a class override if you need taller.
 */
export function BlackSpacer({
  height = 'h-20 sm:h-24',
}: {
  height?: string;
}) {
  return <div aria-hidden className={`bg-black w-full ${height}`} />;
}
