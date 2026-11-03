'use client';

import { useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { ActionButton } from '@/components/ui/ActionLink';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/getDictionary';
import { site } from '@/content/site';

type Status = 'idle' | 'submitting' | 'sent' | 'handoff' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'phone' | 'projectType' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+()\d][\d\s()./-]{5,}$/;

export function QuoteForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const uid = useId();
  const reduced = useReducedMotion();

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [mailtoHref, setMailtoHref] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    contactMethod: 'email',
    location: '',
    message: '',
  });

  const field = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    },
  });

  const labelFor = useMemo(
    () => ({
      projectType: (value: string) =>
        dict.form.projectTypeOptions.find((option) => option.value === value)?.label ?? value,
      budget: (value: string) =>
        dict.form.budgetOptions.find((option) => option.value === value)?.label ?? value,
      contactMethod: (value: string) =>
        dict.form.contactMethodOptions.find((option) => option.value === value)?.label ?? value,
    }),
    [dict.form],
  );

  function validate(): Errors {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = dict.form.validation.name;
    if (!EMAIL_RE.test(values.email.trim())) next.email = dict.form.validation.email;
    if (!values.projectType) next.projectType = dict.form.validation.projectType;
    if (values.message.trim().length < 10) next.message = dict.form.validation.message;

    const phone = values.phone.trim();
    const needsPhone = values.contactMethod === 'phone' || values.contactMethod === 'whatsapp';
    if (needsPhone && !phone) next.phone = dict.form.validation.contactPhone;
    else if (phone && !PHONE_RE.test(phone)) next.phone = dict.form.validation.phone;

    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const first = document.getElementById(`${uid}-${Object.keys(found)[0]}`);
      first?.focus();
      return;
    }

    setStatus('submitting');

    const payload = {
      ...values,
      locale,
      projectTypeLabel: labelFor.projectType(values.projectType),
      budgetLabel: values.budget ? labelFor.budget(values.budget) : '',
      contactMethodLabel: labelFor.contactMethod(values.contactMethod),
    };

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: { delivered?: boolean; mailto?: string } = await response.json();
      if (!response.ok) throw new Error('request failed');

      if (data.delivered) {
        setStatus('sent');
        return;
      }

      // No mail provider configured: hand the visitor a pre-filled message so
      // the enquiry still reaches the company.
      if (data.mailto) {
        setMailtoHref(data.mailto);
        setStatus('handoff');
        window.location.href = data.mailto;
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent' || status === 'handoff') {
    return (
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="border border-graphite/15 bg-limestone/60 p-8 md:p-12"
        role="status"
        aria-live="polite"
      >
        <p className="eyebrow text-bronze">{dict.quote.eyebrow}</p>
        <h3 className="mt-5 font-display text-3xl font-light text-graphite">
          {status === 'sent' ? dict.form.successTitleSent : dict.form.successTitle}
        </h3>
        <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-graphite-500">
          {status === 'sent' ? dict.form.successSent : dict.form.successBody}
        </p>

        {status === 'handoff' && (
          <>
            <p className="mt-6 text-sm text-graphite-500">{dict.form.successAlt}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={mailtoHref}
                className="border border-graphite/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition-colors hover:bg-graphite hover:text-ivory"
              >
                {dict.common.email}
              </a>
              <a
                href={site.phone.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-graphite/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition-colors hover:bg-graphite hover:text-ivory"
              >
                {dict.common.whatsapp}
              </a>
              <a
                href={site.phone.href}
                className="border border-graphite/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition-colors hover:bg-graphite hover:text-ivory"
              >
                {site.phone.display}
              </a>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setValues({
              name: '',
              email: '',
              phone: '',
              projectType: '',
              budget: '',
              contactMethod: 'email',
              location: '',
              message: '',
            });
          }}
          className="link-underline mt-8 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-graphite"
        >
          {dict.form.again}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <div className="grid gap-7 md:grid-cols-2">
        <Field
          id={`${uid}-name`}
          label={dict.form.name}
          required
          error={errors.name}
          input={
            <input
              id={`${uid}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder={dict.form.namePlaceholder}
              className={inputClass(!!errors.name)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${uid}-name-error` : undefined}
              {...field('name')}
            />
          }
          uid={uid}
          name="name"
        />

        <Field
          id={`${uid}-email`}
          label={dict.form.email}
          required
          error={errors.email}
          input={
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={dict.form.emailPlaceholder}
              className={inputClass(!!errors.email)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${uid}-email-error` : undefined}
              {...field('email')}
            />
          }
          uid={uid}
          name="email"
        />

        <Field
          id={`${uid}-phone`}
          label={dict.form.phone}
          hint={dict.form.optional}
          error={errors.phone}
          input={
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={dict.form.phonePlaceholder}
              className={inputClass(!!errors.phone)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
              {...field('phone')}
            />
          }
          uid={uid}
          name="phone"
        />

        <Field
          id={`${uid}-location`}
          label={dict.form.location}
          hint={dict.form.optional}
          input={
            <input
              id={`${uid}-location`}
              name="location"
              type="text"
              placeholder={dict.form.locationPlaceholder}
              className={inputClass(false)}
              {...field('location')}
            />
          }
          uid={uid}
          name="location"
        />

        <Field
          id={`${uid}-projectType`}
          label={dict.form.projectType}
          required
          error={errors.projectType}
          input={
            <select
              id={`${uid}-projectType`}
              name="projectType"
              className={inputClass(!!errors.projectType)}
              aria-invalid={!!errors.projectType}
              aria-describedby={errors.projectType ? `${uid}-projectType-error` : undefined}
              {...field('projectType')}
            >
              <option value="">—</option>
              {dict.form.projectTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
          uid={uid}
          name="projectType"
        />

        <Field
          id={`${uid}-budget`}
          label={dict.form.budget}
          hint={dict.form.optional}
          input={
            <select
              id={`${uid}-budget`}
              name="budget"
              className={inputClass(false)}
              {...field('budget')}
            >
              <option value="">—</option>
              {dict.form.budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
          uid={uid}
          name="budget"
        />
      </div>

      <fieldset className="border-0 p-0">
        <legend className="eyebrow text-graphite-300">{dict.form.contactMethod}</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {dict.form.contactMethodOptions.map((option) => {
            const checked = values.contactMethod === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer border px-5 py-3 text-[0.8125rem] transition-colors duration-300 ${
                  checked
                    ? 'border-graphite bg-graphite text-ivory'
                    : 'border-graphite/20 text-graphite-500 hover:border-graphite/50'
                }`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={option.value}
                  checked={checked}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, contactMethod: event.target.value }));
                    setErrors((current) => ({ ...current, phone: undefined }));
                  }}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field
        id={`${uid}-message`}
        label={dict.form.message}
        required
        error={errors.message}
        input={
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={6}
            placeholder={dict.form.messagePlaceholder}
            className={`${inputClass(!!errors.message)} resize-y`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${uid}-message-error` : undefined}
            {...field('message')}
          />
        }
        uid={uid}
        name="message"
      />

      {status === 'error' && (
        <p role="alert" className="border-l-2 border-red-700/60 pl-4 text-sm text-red-800">
          <strong className="font-semibold">{dict.form.errorTitle}.</strong> {dict.form.errorBody}
        </p>
      )}

      <div className="flex flex-col gap-4 border-t border-graphite/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-graphite-300">
          {dict.quote.responseNote} {dict.form.privacy}
        </p>
        <ActionButton type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? dict.form.submitting : dict.form.submit}
        </ActionButton>
      </div>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return [
    'w-full border-0 border-b bg-transparent px-0 py-3 text-[0.9375rem] text-graphite',
    'placeholder:text-graphite/35 transition-colors duration-300',
    'focus:outline-none focus:border-bronze',
    invalid ? 'border-red-700/70' : 'border-graphite/25 hover:border-graphite/45',
  ].join(' ');
}

function Field({
  id,
  label,
  input,
  error,
  hint,
  required,
  uid,
  name,
}: {
  id: string;
  label: string;
  input: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  uid: string;
  name: string;
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="eyebrow flex items-baseline gap-2 text-graphite-300"
      >
        <span>
          {label}
          {required && <span className="text-bronze"> *</span>}
        </span>
        {hint && <span className="font-normal normal-case tracking-normal opacity-70">({hint})</span>}
      </label>
      <div className="mt-2">{input}</div>
      {error && (
        <p id={`${uid}-${name}-error`} role="alert" className="mt-2 text-xs text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
