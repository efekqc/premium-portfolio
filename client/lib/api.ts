/**
 * Typed API client for the FastAPI backend.
 * Works in both Server Components (Node fetch) and Client Components (browser fetch).
 * Add `cache` / `next.revalidate` per call-site to control ISR behaviour.
 */

const BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
).replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Shared types — mirror app/schemas exactly so changes propagate via TS errors.
// ---------------------------------------------------------------------------

export type ImageStatus = 'draft' | 'published' | 'archived';
export type ImageSource = 'original' | 'synthetic' | 'mixed';
export type VariantFormat = 'jpeg' | 'webp' | 'avif' | 'png';
export type VariantSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

export interface TagRead {
  id: string;
  slug: string;
  name: string;
  color_hex: string | null;
}

export interface CategoryRead {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

export interface VariantRead {
  size: VariantSize;
  format: VariantFormat;
  storage_key: string;
  width_px: number;
  height_px: number;
}

export interface ImageRead {
  id: string;
  slug: string;
  title: string;
  alt_text: string;
  caption: string | null;
  description: string | null;
  status: ImageStatus;
  source: ImageSource;
  category: CategoryRead;
  tags: TagRead[];
  variants: VariantRead[];
  storage_key: string;
  mime_type: string;
  file_size_bytes: number;
  width_px: number;
  height_px: number;
  aspect_ratio: string | null;
  blur_hash: string | null;
  dominant_color: string | null;
  exif_data: Record<string, unknown>;
  ai_metadata: Record<string, unknown>;
  is_featured: boolean;
  sort_order: number;
  view_count: number;
  captured_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImageList {
  items: ImageRead[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface ImageListParams {
  page?: number;
  page_size?: number;
  status?: ImageStatus;
  source?: ImageSource;
  category_id?: string;
  category_slug?: string;
  tag_slug?: string;
  is_featured?: boolean;
  search?: string;
}

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { next?: NextFetchRequestConfig },
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, body);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Query-string builder (avoids a dep on qs / URLSearchParams boilerplate)
// ---------------------------------------------------------------------------

function qs(params: Record<string, unknown>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      p.set(k, String(v));
    }
  }
  const str = p.toString();
  return str ? `?${str}` : '';
}

// ---------------------------------------------------------------------------
// API surface
// ---------------------------------------------------------------------------

export const api = {
  categories: {
    list(params?: { featured_only?: boolean; limit?: number }, init?: RequestInit) {
      return apiFetch<CategoryRead[]>(`/categories${qs({ ...params })}`, {
        next: { revalidate: 300 },
        ...init,
      });
    },

    get(lookup: string, init?: RequestInit) {
      return apiFetch<CategoryRead>(`/categories/${lookup}`, {
        next: { revalidate: 300 },
        ...init,
      });
    },
  },

  images: {
    list(params?: ImageListParams, init?: RequestInit) {
      return apiFetch<ImageList>(`/images${qs({ status: 'published', ...params })}`, {
        next: { revalidate: 60 },
        ...init,
      });
    },

    get(lookup: string, init?: RequestInit) {
      return apiFetch<ImageRead>(`/images/${lookup}`, {
        next: { revalidate: 60 },
        ...init,
      });
    },
  },

  tags: {
    list(params?: { search?: string; limit?: number }, init?: RequestInit) {
      return apiFetch<TagRead[]>(`/tags${qs({ ...params })}`, {
        next: { revalidate: 300 },
        ...init,
      });
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a storage_key to a public URL.
 * For local dev this assumes the FastAPI server serves /media/*.
 * Swap the base URL for your CDN / S3 presigned URL when deploying.
 */
export function storageUrl(key: string): string {
  // If the key is already a full URL (e.g. Unsplash CDN, S3 presigned, etc.)
  // pass it straight through. This lets seed data use absolute URLs without
  // any extra configuration.
  if (key.startsWith('http://') || key.startsWith('https://')) return key;

  const mediaBase = (
    process.env.NEXT_PUBLIC_MEDIA_URL ??
    (process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:8000')
  );
  return `${mediaBase}/media/${key}`;
}

/**
 * Pick the best variant URL for a given size preference.
 * Falls back to the original storage_key if no variants exist.
 */
export function variantUrl(
  image: ImageRead,
  size: VariantSize = 'medium',
  format: VariantFormat = 'webp',
): string {
  const match =
    image.variants.find((v) => v.size === size && v.format === format) ??
    image.variants.find((v) => v.size === size) ??
    image.variants[0];

  return match ? storageUrl(match.storage_key) : storageUrl(image.storage_key);
}
