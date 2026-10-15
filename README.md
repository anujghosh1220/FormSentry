# FormSentry

**A local-first visual form builder and validation playground.** Author forms in a three-panel canvas, wire up validation rules, preview them live, and keep everything in your browser — no backend, no account, no sync, no telemetry.

Built with React 19, TypeScript, Vite 8, Tailwind CSS v4 and the Crimson Sentinel dark design system.

---

## Table of contents

- [What you can do](#what-you-can-do)
- [The six built-in templates](#the-six-built-in-templates)
- [What you can build](#what-you-can-build)
- [Field types](#field-types)
- [Validation rules](#validation-rules)
- [Pages and routes](#pages-and-routes)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Animated effects and interface work](#animated-effects-and-interface-work)
- [Design system](#design-system)
- [Data model and persistence](#data-model-and-persistence)
- [Project structure](#project-structure)
- [Accessibility and motion](#accessibility-and-motion)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Verification status](#verification-status)

---

## What you can do

**Create forms three ways**

| Method | How |
|---|---|
| **Author from scratch** | *Author a form* → name, description, icon → opens the builder with an empty canvas |
| **Start from a template** | Pick one of the six templates on the Dashboard or Templates page |
| **Import a JSON file** | *Import* on the Dashboard or Templates page, or "Import form (JSON)" from the command palette |

**Manage forms**

- **Rename / edit metadata** — the author card reopens in edit mode (name, description, icon)
- **Duplicate** — creates an independent copy with fresh field IDs, titled `… (copy)`
- **Export** — downloads a single pretty-printed JSON file (`<form-name>.json`)
- **Export all** — the command palette writes every form to one `formsentry-forms.json`
- **Delete** — with a confirmation dialog naming the form and its field count
- **Search** — matches the form title, description **and** field labels
- **Custom icon** — eight choices, stored with the form and shown in the sidebar, cards and editor

**Build and configure**

- Add fields from a library of nine types
- Select a field to edit its label, placeholder, help text and rules
- Add and delete options for dropdowns and radio groups
- Reorder fields (move up / down), duplicate and delete individual fields
- Edit the form title and description inline on the canvas

**Preview and validate**

- The preview page renders the real form and validates on submit
- Errors appear inline under the offending field, with screen-reader-friendly text
- Required, email, length, range and date rules are checked live as you type after the first submit attempt
- *Reset* clears all values and errors
- Radio groups are wrapped in `role="radiogroup"` with a proper accessible name

---

## The six built-in templates

Each template is a complete, real form definition with field types and rules already wired up. Starting one copies it into your forms and opens it in the builder.

| Template | Icon | Fields | What it contains |
|---|---|---|---|
| **Contact Us** | ✉ mail | 4 | Full name (2–100 chars), email, subject (3–150), message (10–1000 chars) — all required |
| **Registration** | 👤 user | 5 | Full name, email, password (min 8), date of birth, terms checkbox — all required |
| **Feedback** | 💬 message | 4 | Optional name, required rating radio (5–1), required category dropdown, required feedback text (5–1000) |
| **Job Application** | 💼 briefcase | 6 | Full name, email, portfolio URL (pattern-checked), required role dropdown, motivation text (20–1200), required processing-consent checkbox |
| **Event RSVP** | 📅 calendar | 6 | Name, email, attending radio (yes/no), guest count (0–5), preferred date, optional dietary notes |
| **Newsletter** | 📋 clipboard | 4 | Optional first name, required email, interests dropdown, required opt-in checkbox |

---

## What you can build

Anything with a form tree of the nine supported field types — contact and support forms, registrations and sign-ups, job applications, surveys and feedback, event RSVPs and guest management, newsletter opt-ins, order and booking requests, internal data-entry tools.

Because every form is plain JSON stored in `localStorage`, anything you build is instantly exportable and shareable as a file, and importable on another machine or browser. The type model and validation engine are deliberately generic, so unusual combinations (a date with a min/max window, a number field with a 0–5 range, a checkbox as an explicit consent gate) work without special cases.

**Privacy stance:** nothing leaves the device. The app makes zero network requests for your data — no API calls, no analytics, no accounts. `localStorage` is the entire persistence layer.

---

## Field types

| Type | Notes |
|---|---|
| `text` | Single-line text |
| `email` | Format-checked against an email pattern |
| `password` | Masked input |
| `number` | Numeric, supports min/max |
| `textarea` | Multi-line, supports min/max length |
| `select` | Dropdown with editable options |
| `radio` | Radio group with editable options |
| `checkbox` | Single boolean, usable as an explicit consent gate |
| `date` | Date picker with min/max date windows |

Every field supports: label, placeholder, help text, required flag, default value, and (for select/radio) a list of options.

---

## Validation rules

Rules are set in the Properties panel and enforced by the custom validation engine in `src/utils/validation.ts`.

| Rule | Applies to | Behaviour |
|---|---|---|
| `required` | all types | Checkbox requires a checked state; other types reject empty/whitespace |
| `email` (implicit) | `email` | Must match the email pattern |
| `minLength` / `maxLength` | `text`, `password`, `textarea` | Character-count bounds |
| `min` / `max` | `number` | Numeric bounds; non-numeric input is rejected |
| `minDate` / `maxDate` | `date` | Inclusive date-window bounds |
| `invalidOption` | `select`, `radio` | An empty/unset option is rejected |
| `pattern` | defined in the model | Available on the schema (the Job Application template uses it for URLs) |

**Custom messages** — every rule accepts an override string (`customMessage.required`, `.email`, `.minLength`, `.maxLength`, `.min`, `.max`, `.minDate`, `.maxDate`, `.pattern`, `.invalidOption`), so error text can read however you want.

Validation runs per field via `validateField` and across the whole form via `validateForm`, which returns a map of field id → error strings.

---

## Pages and routes

| Route | Page | Contents |
|---|---|---|
| `/` | **Dashboard** | GlassFold hero, live stats, the Ink Orbit feature bento, the interactive template gallery, your form cards, and two Recharts charts (fields per form, required fields per form) |
| `/templates` | **Templates** | Full-page version of the gallery plus a card grid listing every template's fields and their types |
| `/features` | **Features** | The feature bento at full width with supporting copy |
| `/builder/:id` | **Builder** | Three-panel editor: field library, canvas, properties panel |
| `/preview/:id` | **Preview** | The live form with real validation feedback |
| anything else | — | Redirects to `/` |

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| <kbd>⌘K</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd> | Open the command menu |
| <kbd>↑</kbd> <kbd>↓</kbd> | Move through command results |
| <kbd>↵</kbd> | Run the highlighted command |
| <kbd>Esc</kbd> | Close the menu or dialog |

The palette understands these groups: **Go to** (Dashboard), **Actions** (create a blank form, browse templates, import JSON, export all), and **Your forms** (edit, preview or duplicate any stored form — up to eight forms, each with keywords). Typing `template` filters it down to the matching entries; typing a form name or field label finds that form.

---

## Animated effects and interface work

Each effect was implemented from the supplied 21st.dev source — not approximated — and integrated into the real app rather than left as a standalone demo.

| Effect | What it actually does | File |
|---|---|---|
| **GlassFold** | A WebGL fragment shader rendering folded panes of glass: a rotation matrix, per-pane creases, an exponential body falloff, a fresnel term, a thin inner rim line, bloom and film grain, screen-blended pane over pane. All parameters (`color1`/`color2`/`color3`, `speed`, `scale`, `noise`) are live props. Warms up from `localStorage`-free local state, DPR-capped at 2, and repaints a single still frame under reduced motion. Used behind the dashboard hero. | `src/components/ui/glass-fold/GlassFold.tsx`, `src/components/effects/GlassFold.tsx` |
| **Ink Orbit features** | A hatched bento page with three live SVG diagrams: a team cluster flowing through a hub chip into a stack of reports that prints a new sheet every 2.8s; an integrations hub that syncs one tool at a time (or cycles automatically) with travelling packets on the connectors; and a forecast chart with a scrubbable crosshair readout plus a line that draws itself when scrolled into view. Presence dots pulse, brackets animate outward on hover, tooltips follow the avatars. | `src/components/ui/ink-orbit-features.tsx` |
| **Interactive template gallery** | A GSAP-driven list: hovering a row slides that template's generated layout in behind the text with a clip-path reveal, the image eases toward the cursor with a lerp offset, a white highlight bar tweens to the hovered row, and the row text flips to black. On coarse pointers (touch) it degrades to a stacked list with inline previews. | `src/components/ui/interactive-list-preview.tsx`, `src/components/effects/TemplateGallery.tsx` |
| **Hover glow button** | A 180px radial gradient parked under the label and translated to the exact pointer position on every `mousemove`, so the glow tracks the cursor across the whole button surface rather than sitting behind a static hover state. | `src/components/ui/hover-glow-button.tsx`, `src/components/effects/HoverGlowButton.tsx` |
| **Author form card** | Framer Motion spring stagger across the card's sections, a dashed icon avatar with a working icon picker, tooltip-hinted labels, and a submit button that stays disabled until the form has a name. Drives real create and edit of form metadata. | `src/components/ui/author-form-card.tsx`, `src/components/effects/AuthorFormDialog.tsx` |
| **Command menu** | `cmdk` ranking and keyboard model inside a Radix dialog for focus trapping and Escape. Groups, shortcuts, hints, a live result count, `⌘K` toggle, and an `aria-live` region announcing the last command run. | `src/components/ui/command-menu-palette.tsx`, `src/components/command/` |
| **Efferd shell** | A persistent sidebar on desktop, a Radix `Sheet` on mobile, real routing with active states, a collapsible recent-forms stack, a command trigger in the top bar, and a storage status footer. | `src/components/ui/efferd-dashboard.tsx` |

**Template preview artwork** is not stock imagery: `src/lib/templatePreview.ts` renders each template's actual field definition into an inline SVG data URI (labelled bars, textarea blocks, dropdown chevrons, radio dots, checkboxes, a submit button), so the gallery's hover previews are generated offline from real data.

---

## Design system

**Crimson Sentinel.** Raw values live in `:root` and are re-exported to Tailwind through `@theme inline`, so both the legacy `bg-[--color-bg-surface]` arbitrary syntax and shadcn-style utilities (`bg-background`, `border-border`, `text-muted-foreground`, `ring-ring`, `bg-primary/20`) resolve from one palette.

| Token | Value | Usage |
|---|---|---|
| `--color-bg` / `--background` | `#111113` | page background |
| `--color-bg-surface` / `--card` | `#171719` | cards, panels |
| `--color-bg-secondary` / `--muted` | `#202024` | inputs, secondary surfaces |
| `--color-border` | `#303036` | borders, dividers |
| `--color-primary` | `#F04452` | primary actions, focus ring |
| `--color-primary-hover` | `#D83240` | primary hover |
| `--color-text` / `--foreground` | `#F8F7F5` | primary text |
| `--color-text-muted` | `#A1A1AA` | secondary text |
| `--color-danger` | `#EF4444` | destructive actions |
| `--color-success` | `#22C55E` | success states |
| `--color-warning` | `#F59E0B` | warnings |
| `--color-ring` | `rgba(240, 68, 82, 0.5)` | focus rings |

**One unified button.** `src/components/ui/Button.tsx` is the single button component used by every other component in the app.

- Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`
- Sizes: `sm` (h-8), `md` (h-9), `lg` (h-10)
- Consistent `rounded-lg`, `gap-2` icon spacing, focus rings with theme-coloured offsets, and disabled states

**Component primitives** (`src/components/ui/`): Button, Card, Input, Label, Textarea, Separator, Skeleton, Dialog, Sheet, Tooltip, Avatar, Collapsible, Chart — plus the seven effect components above.

---

## Data model and persistence

Everything is JSON in `localStorage` under the single key **`formsentry_forms`**, wrapped as `{ forms: FormDefinition[], version: 1 }`.

```ts
type FieldType =
  | 'text' | 'email' | 'password' | 'number' | 'textarea'
  | 'select' | 'radio' | 'checkbox' | 'date'

interface FormDefinition {
  id: string
  title: string
  description?: string
  icon?: string          // one of eight keys
  fields: FormField[]
  createdAt: string      // ISO
  updatedAt: string      // ISO
  version: number
}

interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  defaultValue?: string | number | boolean
  options?: FieldOption[]   // select / radio
  validation?: FieldValidation
  order: number
}
```

`src/lib/storage.ts` exposes `loadForms`, `saveForms`, `exportForm` (pretty-printed JSON string) and `importForm` (validates id, title and a fields array before accepting). `importForm` throws on malformed input rather than half-loading.

Because the schema is plain and self-describing, exported files are portable: import them anywhere FormSentry runs.

---

## Project structure

```
FormSentry/
├── index.html
├── package.json                  # deps and scripts
├── vite.config.ts                # React + Tailwind plugins, vitest config (jsdom)
├── tsconfig*.json
├── .oxlintrc.json                # react, typescript, oxc rule sets
└── src/
    ├── main.tsx                  # React root
    ├── App.tsx                   # routes + Efferd shell
    ├── index.css                 # tokens, @theme inline, tw-animate-css, base + reduced-motion
    ├── types/
    │   └── form.ts               # FieldType, FormField, FormDefinition, StoredForms
    ├── lib/
    │   ├── storage.ts            # localStorage load/save/export/import
    │   ├── storage.test.ts       # unit tests for persistence
    │   ├── id.ts                 # id generation
    │   ├── utils.ts              # cn() class merge (clsx + tailwind-merge)
    │   ├── formIcons.ts          # the eight form icon keys
    │   └── templatePreview.ts    # inline SVG template preview generator
    ├── utils/
    │   ├── validation.ts         # the rule engine
    │   └── validation.test.ts    # unit tests for every rule
    ├── constants/
    │   └── templates.ts          # the six template factories
    ├── components/
    │   ├── ui/                   # primitives + the 21st.dev components
    │   │   ├── Button.tsx        # the unified button
    │   │   ├── efferd-dashboard.tsx          # app shell
    │   │   ├── command-menu-palette.tsx      # cmdk + Radix dialog
    │   │   ├── ink-orbit-features.tsx        # live SVG bento
    │   │   ├── interactive-list-preview.tsx  # GSAP gallery
    │   │   ├── author-form-card.tsx          # Framer Motion card
    │   │   ├── hover-glow-button.tsx         # cursor glow
    │   │   ├── glass-fold/                   # WebGL shader
    │   │   ├── dialog.tsx sheet.tsx tooltip.tsx avatar.tsx
    │   │   ├── collapsible.tsx chart.tsx
    │   │   └── Card.tsx Input.tsx Label.tsx Textarea.tsx Separator.tsx Skeleton.tsx
    │   ├── command/              # CommandPalette + open-state context
    │   ├── effects/              # FormSentry-adapted wrappers
    │   └── builder/              # FieldLibrary, FormCanvas, PropertiesPanel
    ├── pages/
    │   ├── DashboardPage.tsx     # hero, bento, gallery, forms list, charts
    │   ├── TemplatesPage.tsx
    │   ├── FeaturesPage.tsx
    │   ├── BuilderPage.tsx       # three-panel editor
    │   └── PreviewPage.tsx       # live form + validation
    └── test/
        ├── setup.ts              # jest-dom matchers
        └── app.integration.test.tsx   # jsdom test of shell + author flow
```

---

## Accessibility and motion

- **Reduced motion** — a global `prefers-reduced-motion` block neutralises CSS animation and transitions; the Ink Orbit reveal, flowing packets, pulses and sheet-print animation disable themselves; the GlassFold shader paints one still frame and repaints only on resize; the GSAP gallery skips the cursor parallax and fades previews instead of clipping them.
- **Keyboard** — every interactive element is reachable; gallery rows are focusable and activate on <kbd>Enter</kbd>/<kbd>Space</kbd>; the palette is fully keyboard-driven; dialogs trap focus and close on <kbd>Esc</kbd>.
- **Contrast** — focus-visible rings throughout, `aria-invalid` and `aria-describedby` wiring on inputs, `role="radiogroup"` with accessible names, an `aria-live` region for command results, and labelled icon-only buttons.
- **Responsive** — verified at 320, 390, 640, 768, 1024, 1280 and 1440px with no horizontal overflow; the sidebar swaps to a sheet below 1024px and the builder's three panels stack on narrow screens.

---

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server (http://localhost:5173 — 5174 if taken)
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

No environment variables, no API keys and no configuration files are needed.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b` then `vite build` |
| `npm run preview` | Serve the built `dist/` |
| `npm run test` | Vitest watch mode |
| `npm run test:ui` | Vitest browser UI |
| `npm run lint` | Oxlint |
| `npx tsc -b` | Type-check only |

---

## Technology stack

| Category | Technology |
|---|---|
| Runtime | Browser, client-only SPA |
| Framework | React 19 |
| Language | TypeScript 6 (strict-ish, `erasableSyntaxOnly`, `noUnusedLocals`) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| Charts | Recharts 3 |
| Animation | GSAP 3, Framer Motion 14 |
| WebGL | Raw WebGL 1 (no 3D library) |
| Primitives | Radix UI (dialog, tooltip, avatar, collapsible, separator, slot, label) |
| Command palette | cmdk |
| Testing | Vitest 5 + Testing Library + jsdom |
| Linting | Oxlint |
| Persistence | Browser `localStorage` |

---

## Verification status

Latest run:

```
TypeScript (npx tsc -b)      0 errors
Oxlint (npm run lint)        0 errors
Vitest (npm run test)        4 files, 16 tests passed
Production build             successful
                            dist/assets ~59 KB CSS, ~1093 KB JS (~340 KB gzipped)
```

The test suite covers the validation engine (every rule type), localStorage round-trips, the template preview generator, the icon registry, and a jsdom integration test that renders the whole app and walks the author-dialog → create-form flow end to end.

The app was also inspected in a real browser (headless Chrome, driven over the DevTools protocol) across seven viewport widths, where the glass shader canvas, GSAP hover reveal, cursor-following glow, command palette and author dialog were all confirmed to be live and interactive.

---

## License

MIT.
