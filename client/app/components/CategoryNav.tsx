'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryRead } from '@/lib/api';

interface Props {
  categories: CategoryRead[];
  activeSlug: string | undefined;
}

/**
 * Client component — updates `?category=` in the URL without a full page
 * reload.  The parent RSC re-fetches with the new param via Next.js RSC diff.
 * `useTransition` keeps the current UI interactive while the new data streams in.
 */
export function CategoryNav({ categories, activeSlug }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page'); // reset pagination on filter change
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const pills: Array<{ label: string; slug: string | null }> = [
    { label: 'All', slug: null },
    ...categories.map((c) => ({ label: c.name, slug: c.slug })),
  ];

  return (
    <nav
      aria-label="Filter by category"
      className={cn(
        'flex flex-wrap gap-2 transition-opacity duration-300',
        isPending && 'opacity-50 pointer-events-none',
      )}
    >
      {pills.map(({ label, slug }) => {
        const isActive = slug === (activeSlug ?? null);
        return (
          <button
            key={slug ?? '__all'}
            onClick={() => navigate(slug)}
            aria-pressed={isActive}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              isActive
                ? 'bg-accent text-ink-950 border-accent'
                : 'bg-transparent text-zinc-400 border-ink-600 hover:border-ink-500 hover:text-zinc-200',
            )}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
