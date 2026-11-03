import { NextResponse } from 'next/server';
import { site } from '@/content/site';

export const runtime = 'nodejs';

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  locale?: string;
  projectTypeLabel?: string;
  budgetLabel?: string;
  contactMethodLabel?: string;
  /** Honeypot: real visitors never fill this. */
  company?: string;
};

const LABELS = {
  es: {
    subject: 'Solicitud de presupuesto',
    name: 'Nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    location: 'Localidad',
    projectType: 'Tipo de proyecto',
    budget: 'Presupuesto aproximado',
    contactMethod: 'Contacto preferido',
    message: 'Proyecto',
  },
  ru: {
    subject: 'Запрос сметы',
    name: 'Имя',
    email: 'Электронная почта',
    phone: 'Телефон',
    location: 'Населённый пункт',
    projectType: 'Тип проекта',
    budget: 'Примерный бюджет',
    contactMethod: 'Предпочтительный способ связи',
    message: 'Проект',
  },
} as const;

const clamp = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Silently accept and drop bot submissions.
  if (clamp(body.company, 80)) {
    return NextResponse.json({ delivered: true });
  }

  const locale = body.locale === 'ru' ? 'ru' : 'es';
  const t = LABELS[locale];

  const data = {
    name: clamp(body.name, 120),
    email: clamp(body.email, 160),
    phone: clamp(body.phone, 60),
    location: clamp(body.location, 120),
    projectType: clamp(body.projectTypeLabel, 120),
    budget: clamp(body.budgetLabel, 120),
    contactMethod: clamp(body.contactMethodLabel, 80),
    message: clamp(body.message, 4000),
  };

  if (!data.name || !data.email || !data.message) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 422 });
  }

  const lines = [
    `${t.name}: ${data.name}`,
    `${t.email}: ${data.email}`,
    data.phone && `${t.phone}: ${data.phone}`,
    data.location && `${t.location}: ${data.location}`,
    data.projectType && `${t.projectType}: ${data.projectType}`,
    data.budget && `${t.budget}: ${data.budget}`,
    data.contactMethod && `${t.contactMethod}: ${data.contactMethod}`,
    '',
    `${t.message}:`,
    data.message,
  ].filter(Boolean) as string[];

  const subject = `${t.subject} — ${data.name}`;
  const text = lines.join('\n');
  const inbox = process.env.QUOTE_INBOX || site.email.display;
  const apiKey = process.env.RESEND_API_KEY;

  // Preferred path: deliver by email when a provider is configured.
  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.QUOTE_FROM || 'Reformation Marbella <onboarding@resend.dev>',
          to: [inbox],
          reply_to: data.email,
          subject,
          text,
        }),
      });

      if (response.ok) return NextResponse.json({ delivered: true });
      console.error('Resend rejected the message', response.status);
    } catch (error) {
      console.error('Resend request failed', error);
    }
  }

  // Fallback: hand back a pre-filled message so the enquiry still reaches the
  // company through the visitor's own mail client.
  const mailto = `mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

  return NextResponse.json({ delivered: false, mailto });
}
