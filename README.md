# Reformation Marbella — website redesign

A complete redesign of the website for **Reformation Marbella**, a construction and
renovation company based in Marbella (Málaga) working across the Costa del Sol.

The original site is a 2014 Webnode template at
<https://reformation9.webnode.es/>. This rebuild keeps its genuine content —
company description, full service catalogue, contact details, service area and
photographic archive — and presents it as a contemporary, bilingual
architectural portfolio.

## Live

| | |
| --- | --- |
| Site | <https://reformation-marbella-redesign.vercel.app> |
| Repository | <https://github.com/Danizarg/reformation-marbella-redesign> |

Pushes to `master` deploy to production automatically. `vercel.json` pins the
Next.js preset: without it Vercel treats the repository as a static site and
serves `NOT_FOUND` on every path.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Motion | Motion (`motion/react`) |
| Images | `next/image`, AVIF/WebP, sourced from the company archive |
| Hosting | Vercel |

## Running locally

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (flat config)
npm run typecheck  # tsc --noEmit
npm run images     # regenerate public/images from the source archive
```

## Internationalisation

Spanish and Russian, matching the original site's two languages.

Routing is `/{locale}/{slug}` with **localised slugs**, so neither audience sees
the other's language in the address bar:

| Page | Spanish | Russian |
| --- | --- | --- |
| Inicio | `/es` | `/ru` |
| Sobre nosotros | `/es/sobre-nosotros` | `/ru/o-kompanii` |
| Servicios | `/es/servicios` | `/ru/uslugi` |
| Proyectos | `/es/proyectos` | `/ru/proekty` |
| Galería | `/es/galeria` | `/ru/galereya` |
| Proceso de trabajo | `/es/proceso-de-trabajo` | `/ru/kak-my-rabotaem` |
| Solicitar presupuesto | `/es/solicitar-presupuesto` | `/ru/zapros-smety` |
| Contacto | `/es/contacto` | `/ru/kontakty` |

- `src/i18n/config.ts` is the single source of truth for locales and slugs.
- `src/i18n/dictionaries/{es,ru}.ts` hold all copy. The Russian dictionary is
  typed against the Spanish one, so a missing key is a build error — this is
  what stops the two languages drifting or mixing.
- `src/proxy.ts` redirects `/` and unprefixed paths to the best locale from the
  `locale` cookie, then `Accept-Language`, then Spanish.
- The language switcher resolves the current path back to a page key and
  rebuilds it in the target language, so switching never drops you on the home
  page or a 404.

All 16 pages (8 × 2 locales) are statically generated.

## Content and imagery policy

This site makes no claims the company has not made itself.

- **Copy** — the "about" text and the service catalogue are the company's own
  wording from the legacy site (Russian originals reproduced, obvious
  typographic slips corrected; Spanish translated where only Russian existed).
- **Process page** — each of the six stages corresponds to something the
  company states about how it works (independent consultation, estimate,
  licensing, in-house execution, finishes, final documentation). A note says so.
- **No invented statistics, testimonials, named client projects, guarantees or
  certifications.** The brief allowed animated counters only for verified
  numbers; none could be verified, so the feature sections are typographic
  instead.
- **Photography** — 35 images recovered from the company's own archive at full
  resolution. They are grouped by *type of work* rather than presented as named
  client commissions, and a note to that effect appears on the Projects and
  Gallery pages.
- **Before/after slider** — the archive contains **no genuine paired
  before/after photographs**. The "before" frame is generated from the finished
  photograph (desaturated, flattened, softened) so the geometry matches. It is
  labelled "Demostración representativa" / "Демонстрационный пример" on the
  control itself, and a fuller disclaimer sits directly beneath it.

Verified business facts used throughout: Marbella (Málaga), Spain;
+34 656 383 848; reformationmarbella@gmail.com; active since 2014; service area
Marbella, Estepona, Sotogrande, Málaga, Fuengirola, Puerto Banús, Costa del Sol.

## The enquiry form

`POST /api/quote` captures name, email, phone, project type, approximate
budget, preferred contact method, location and message.

It has two delivery modes:

1. **With `RESEND_API_KEY` set** — the enquiry is emailed to `QUOTE_INBOX`
   (default `reformationmarbella@gmail.com`) with the sender's address as
   `reply_to`. The form confirms it was sent.
2. **Without it (the default)** — the route returns a fully composed `mailto:`
   and the form opens the visitor's mail client with everything pre-filled,
   also offering WhatsApp and phone. No enquiry is lost either way.

The route trims and length-caps every field, rejects incomplete submissions
(422) and silently absorbs honeypot hits.

Copy `.env.example` to `.env.local` to configure.

## Accessibility and motion

- Every entry animation, parallax drift and the hero crossfade is disabled
  under `prefers-reduced-motion: reduce`.
- Because Motion server-renders its hidden state, a `<noscript>` rule reveals
  all `[data-reveal]` elements and removes the `[data-wipe]` cover panels — the
  site is fully readable with JavaScript off.
- The before/after divider is a real `<input type="range">`, so it works with
  arrow keys, Home/End and screen readers.
- The gallery lightbox traps focus, closes on Escape, moves with arrow keys and
  restores focus to the thumbnail that opened it.
- Form fields use `aria-invalid` and `aria-describedby`; submitting focuses the
  first field with an error.
- Skip link, visible focus rings, landmarks and `aria-current` on the active
  nav item.

## SEO

Per-page titles and descriptions in both languages, canonical URLs, reciprocal
`hreflang` (plus `x-default`), Open Graph image, `GeneralContractor` JSON-LD
built only from verified facts, and a `sitemap.xml` with language alternates.

Set `NEXT_PUBLIC_SITE_URL` to the production origin so canonicals, the sitemap
and Open Graph tags resolve to the right host.
