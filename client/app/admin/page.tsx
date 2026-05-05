'use client';

/**
 * Basic admin dashboard.
 *
 * Auth: the user pastes their ADMIN_TOKEN once per session.
 * It is kept in React state only — never written to localStorage or cookies.
 * All writes go directly to the FastAPI backend with `Authorization: Bearer <token>`.
 *
 * Note: file upload (binary → storage) is NOT implemented here.
 * This form submits image *metadata* only (storage_key is a path you've already
 * placed on the server / S3). Wire up a multipart upload in Step 7 when the
 * storage pipeline is built.
 */

import { useState, useActionState, type FormEvent } from 'react';
import { CheckCircle, AlertCircle, Lock, Plus, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Minimal typed fetch that injects the bearer token
// ---------------------------------------------------------------------------
async function adminFetch(
  path: string,
  token: string,
  body: unknown,
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: data?.detail ?? `Error ${res.status}` };
    }
    return { ok: true, message: 'Created successfully.' };
  } catch {
    return { ok: false, message: 'Network error — is the API running?' };
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);

  if (!authed) return <TokenGate onSubmit={(t) => { setToken(t); setAuthed(true); }} />;

  return (
    <main className="min-h-dvh bg-ink-950 text-zinc-100">
      <header className="border-b border-ink-700 bg-ink-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 py-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">
            Admin
          </h1>
          <button
            onClick={() => { setToken(''); setAuthed(false); }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-10 space-y-12">
        <CategoryForm token={token} />
        <hr className="border-ink-700" />
        <ImageForm token={token} />
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Token gate
// ---------------------------------------------------------------------------
function TokenGate({ onSubmit }: { onSubmit: (t: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <main className="min-h-dvh bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Lock className="h-8 w-8 text-zinc-600" />
        </div>
        <h1 className="text-center text-lg font-display font-light text-zinc-200 mb-6">
          Admin Access
        </h1>
        <form
          onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSubmit(value.trim()); }}
          className="space-y-4"
        >
          <input
            type="password"
            autoFocus
            placeholder="Paste ADMIN_TOKEN…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputCls}
            required
          />
          <button type="submit" className={primaryBtnCls + ' w-full justify-center'}>
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Category form
// ---------------------------------------------------------------------------
function CategoryForm({ token }: { token: string }) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const fd = new FormData(e.currentTarget);
    const result = await adminFetch('/categories', token, {
      slug: fd.get('slug'),
      name: fd.get('name'),
      description: fd.get('description') || null,
      sort_order: Number(fd.get('sort_order') ?? 0),
      is_featured: fd.get('is_featured') === 'on',
    });
    setStatus(result);
    if (result.ok) (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  return (
    <section>
      <FormHeading icon={<FolderOpen className="h-4 w-4" />} title="New Category" />
      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Slug *" name="slug" placeholder="landscape" required pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" title="Lowercase letters, numbers, hyphens" />
        <Field label="Name *" name="name" placeholder="Landscape" required />
        <div className="sm:col-span-2">
          <Field label="Description" name="description" placeholder="Optional description…" />
        </div>
        <Field label="Sort order" name="sort_order" type="number" placeholder="0" />
        <div className="flex items-end pb-1">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input type="checkbox" name="is_featured" className="accent-accent" />
            Featured
          </label>
        </div>
        <div className="sm:col-span-2 flex items-center gap-4">
          <button type="submit" disabled={loading} className={cn(primaryBtnCls, loading && 'opacity-50 pointer-events-none')}>
            <Plus className="h-4 w-4" /> Create category
          </button>
          <StatusBadge status={status} />
        </div>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Image form
// ---------------------------------------------------------------------------
function ImageForm({ token }: { token: string }) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const fd = new FormData(e.currentTarget);
    const tagIdsRaw = (fd.get('tag_ids') as string) ?? '';
    const result = await adminFetch('/images', token, {
      slug: fd.get('slug'),
      title: fd.get('title'),
      alt_text: fd.get('alt_text'),
      caption: fd.get('caption') || null,
      category_id: fd.get('category_id'),
      storage_key: fd.get('storage_key'),
      mime_type: fd.get('mime_type') || 'image/jpeg',
      file_size_bytes: Number(fd.get('file_size_bytes')),
      width_px: Number(fd.get('width_px')),
      height_px: Number(fd.get('height_px')),
      dominant_color: fd.get('dominant_color') || null,
      blur_hash: fd.get('blur_hash') || null,
      status: fd.get('status') || 'draft',
      source: fd.get('source') || 'original',
      is_featured: fd.get('is_featured') === 'on',
      tag_ids: tagIdsRaw ? tagIdsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [],
    });
    setStatus(result);
    if (result.ok) (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  return (
    <section>
      <FormHeading icon={<ImageIcon className="h-4 w-4" />} title="New Image" />
      <p className="mt-1 text-xs text-zinc-600">
        Submits image metadata. Place the file on storage first; paste its key below.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Slug *" name="slug" placeholder="tokyo-rain-2025" required pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" />
        <Field label="Title *" name="title" placeholder="Tokyo in the rain" required />
        <div className="sm:col-span-2">
          <Field label="Alt text *" name="alt_text" placeholder="Describe the image for screen readers" required />
        </div>
        <div className="sm:col-span-2">
          <Field label="Caption" name="caption" placeholder="Optional visible caption" />
        </div>
        <Field label="Category ID *" name="category_id" placeholder="UUID from /categories" required />
        <Field label="Storage key *" name="storage_key" placeholder="uploads/2025/tokyo-rain.jpg" required />
        <Field label="MIME type" name="mime_type" placeholder="image/jpeg" />
        <Field label="File size (bytes) *" name="file_size_bytes" type="number" placeholder="2048000" required />
        <Field label="Width px *" name="width_px" type="number" placeholder="4000" required />
        <Field label="Height px *" name="height_px" type="number" placeholder="6000" required />
        <Field label="Dominant colour" name="dominant_color" placeholder="#1a1a2e" pattern="^#[0-9A-Fa-f]{6}$" />
        <Field label="BlurHash" name="blur_hash" placeholder="LGF5?xYk^6#M@-5c..." />
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Status</label>
          <select name="status" className={inputCls} defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Source</label>
          <select name="source" className={inputCls} defaultValue="original">
            <option value="original">Original</option>
            <option value="synthetic">Synthetic (AI)</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Field label="Tag IDs (comma-separated UUIDs)" name="tag_ids" placeholder="uuid1, uuid2, …" />
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input type="checkbox" name="is_featured" className="accent-accent" />
            Featured
          </label>
        </div>
        <div className="sm:col-span-2 flex items-center gap-4">
          <button type="submit" disabled={loading} className={cn(primaryBtnCls, loading && 'opacity-50 pointer-events-none')}>
            <Plus className="h-4 w-4" /> Create image
          </button>
          <StatusBadge status={status} />
        </div>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Shared micro-components
// ---------------------------------------------------------------------------
function FormHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-300">
      {icon}
      <h2 className="text-base font-medium">{title}</h2>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  pattern,
  title,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  title?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        title={title}
        className={inputCls}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: { ok: boolean; message: string } | null }) {
  if (!status) return null;
  return (
    <p className={cn('inline-flex items-center gap-1.5 text-xs', status.ok ? 'text-green-400' : 'text-red-400')}>
      {status.ok
        ? <CheckCircle className="h-3.5 w-3.5 shrink-0" />
        : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
      {status.message}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Shared style constants
// ---------------------------------------------------------------------------
const inputCls =
  'w-full rounded-lg bg-ink-800 border border-ink-600 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-transparent transition-colors';

const primaryBtnCls =
  'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-ink-950 text-sm font-medium hover:bg-accent-muted transition-colors';
