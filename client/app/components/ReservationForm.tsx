'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface FormState {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  party: string;
  notes: string;
}

const DEFAULTS: FormState = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '18:00',
  party: '2',
  notes: '',
};

const RISE = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Reservation request form.  No real backend wiring — submit composes a
 * mailto: link with the form contents and shows a success state.  Drop in
 * a real handler when the booking inbox is online.
 */
export function ReservationForm() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Reservation request — ${form.name} · ${form.date} ${form.time} · party of ${form.party}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        `Date: ${form.date}`,
        `Time: ${form.time}`,
        `Party of: ${form.party}`,
        '',
        `Notes: ${form.notes}`,
      ].join('\n'),
    );
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:hello@atelierlumina.studio?subject=${subject}&body=${body}`;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-accent/20 bg-ink-800 p-8 sm:p-10 text-center"
      >
        <CheckCircle className="h-12 w-12 mx-auto text-accent" strokeWidth={1.5} />
        <h3 className="mt-4 font-display text-2xl sm:text-3xl text-zinc-50">
          Your request is on its way.
        </h3>
        <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          We confirm bookings within 48 hours. If you have not heard from us by
          then, please email{' '}
          <a
            href="mailto:hello@atelierlumina.studio"
            className="text-accent hover:underline"
          >
            hello@atelierlumina.studio
          </a>{' '}
          directly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(DEFAULTS);
          }}
          className="mt-6 text-[11px] uppercase tracking-[0.28em] text-zinc-500 hover:text-accent transition-colors"
        >
          Make another request
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      className="
        rounded-3xl border border-accent/15 bg-ink-800
        p-6 sm:p-10
      "
      noValidate
    >
      <motion.div variants={RISE} className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.32em] text-accent mb-3">
          Request a Booking
        </p>
        <h3 className="font-display font-light text-3xl sm:text-4xl text-zinc-50 leading-tight">
          A table for <span className="italic">two or twelve</span>
          <span className="text-accent">.</span>
        </h3>
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-lg">
          Submit your details below — the form composes an email to our
          reservations inbox. We confirm bookings within 48 hours.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={INPUT}
            placeholder="Your name"
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={INPUT}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={INPUT}
            placeholder="+45 …"
          />
        </Field>

        <Field label="Party of" required>
          <select
            required
            value={form.party}
            onChange={(e) => update('party', e.target.value)}
            className={INPUT}
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n} className="bg-ink-900">
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date" required>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className={INPUT}
          />
        </Field>

        <Field label="Seating" required>
          <select
            required
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
            className={INPUT}
          >
            <option value="18:00" className="bg-ink-900">
              18:00 — early seating
            </option>
            <option value="21:00" className="bg-ink-900">
              21:00 — late seating
            </option>
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Notes (allergies, occasions)">
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className={`${INPUT} resize-none`}
              placeholder="Anything we should know"
            />
          </Field>
        </div>
      </div>

      <motion.div variants={RISE} className="mt-8 flex justify-end">
        <MagneticButton
          type="submit"
          className="
            group inline-flex items-center justify-center gap-2
            px-7 py-4 rounded-full
            bg-accent text-ink-950 font-medium text-sm
            hover:bg-accent-muted hover:scale-[1.03]
            transition-all duration-300
          "
        >
          Send Request
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </MagneticButton>
      </motion.div>
    </motion.form>
  );
}

const INPUT = `
  w-full rounded-xl
  bg-ink-900 border border-accent/15
  px-4 py-3 text-sm text-zinc-100
  placeholder:text-zinc-600
  focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent
  transition-colors
`;

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.label variants={RISE} className="block">
      <span className="block text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-2">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
    </motion.label>
  );
}
