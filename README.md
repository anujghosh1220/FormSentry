# FormSentry

A local-first visual form builder and validation playground built with React 19, TypeScript, Vite and Tailwind CSS v4. Author, edit, duplicate, import/export and preview forms — entirely in the browser, with data stored in `localStorage`. No backend, no sync, no telemetry.

## Design system (Crimson Sentinel)

Raw values live in `:root` and are re-exported to Tailwind through `@theme inline` in `src/index.css`, so both the legacy `bg-[--color-bg-surface]` arbitrary syntax and shadcn-style utilities (`bg-background`, `border-border`, `text-muted-foreground`, `ring-ring`, `bg-primary/20`) resolve from the same palette.

| Token | Value | Usage |
|---|---|---|
| `--color-bg` / `--background` | `#111113` | page background |
| `--color-bg-surface` / `--card` | `#171719` | cards, panels |
| `--color-bg-secondary` / `--muted` | `#202024` | inputs, secondary surfaces |
| `--color-border` | `#303036` | borders, dividers |
| `--color-primary` | `#F04452` | primary actions, focus |
| `--color-text` / `--foreground` | `#F8F7F5` | primary text |
| `--color-text-muted` | `#A1A1AA` | secondary text |

`src/components/ui/Button.tsx` remains the single unified button component (variants `primary | secondary | outline | ghost | danger | success`, sizes `sm | md | lg`) used by every other component in the app.

## Implemented effects

Each component was rebuilt from the supplied 21st.dev source and adapted to FormSentry content and the Crimson palette, keeping the original appearance and animation behaviour.

| Component | Source behaviour | Where it lives |
|---|---|---|
| **Efferd shell** | Persistent sidebar on desktop, Radix `Sheet` on mobile, real routing, recent-forms stack, command-menu trigger, Recharts stats | `src/components/ui/efferd-dashboard.tsx` |
| **Command menu palette** | `cmdk` ranking inside a Radix dialog, ⌘K/Ctrl+K toggle, grouped results, footer hints, live form search and actions | `src/components/ui/command-menu-palette.tsx`, `src/components/command/CommandPalette.tsx`, `CommandContext.tsx` |
| **Ink Orbit features** | Hatched bento page with three live SVG diagrams: team cluster → hub chip → stacking reports (SMIL packets, presence pulses), integrations hub cycling one tool at a time, scrubbable forecast chart with line-draw reveal | `src/components/ui/ink-orbit-features.tsx` |
| **Interactive template gallery** | GSAP clip-path reveal of the hovered template's layout, cursor-following lerp offset, white highlight bar, row text colour transition, stacked fallback on coarse pointers | `src/components/ui/interactive-list-preview.tsx`, `src/components/effects/TemplateGallery.tsx` |
| **Author form card** | Framer Motion spring stagger, avatar + icon picker, labelled fields with tooltip, real create/edit of form metadata | `src/components/ui/author-form-card.tsx`, `src/components/effects/AuthorFormDialog.tsx` |
| **Hover glow button** | Cursor-following radial glow that tracks the pointer across the whole button surface | `src/components/ui/hover-glow-button.tsx`, `src/components/effects/HoverGlowButton.tsx` |
| **Glass fold** | Real WebGL fragment shader (folded glass panes, creases, fresnel rim, screen blend, grain) with all uniforms as props, still frame under reduced motion, CSS fallback when WebGL is unavailable | `src/components/ui/glass-fold/GlassFold.tsx`, `src/components/effects/GlassFold.tsx` |

Template previews are generated as inline SVG data URIs from the real template definitions (`src/lib/templatePreview.ts`), so the gallery hover previews are offline artwork rather than remote images.

## Functionality preserved

- Dashboard listing with search, field-label search, and per-form actions
- Create, rename, duplicate, export, import (JSON round-trip), delete with confirmation
- Six templates: Contact Us, Registration, Feedback, Job Application, Event RSVP, Newsletter
- Three-panel builder: field library, canvas, properties panel (add / delete / duplicate / reorder)
- Nine field types with type-specific validation rules and custom messages
- Live preview page with validation feedback
- `localStorage` persistence under the `formsentry_forms` key
- Routes: `/`, `/templates`, `/features`, `/builder/:id`, `/preview/:id`
- Accessibility: focus-visible rings, keyboard-activatable rows, `prefers-reduced-motion` honoured by every animated component

## Architecture

```
src/
├── App.tsx                      # routes + Efferd shell
├── index.css                    # tokens, @theme inline, tw-animate-css, base layer
├── components/
│   ├── ui/                      # primitives + 21st.dev components
│   │   ├── Button.tsx           # unified button (Crimson Sentinel)
│   │   ├── efferd-dashboard.tsx # app shell (sidebar, top bar, routing)
│   │   ├── ink-orbit-features.tsx
│   │   ├── interactive-list-preview.tsx
│   │   ├── author-form-card.tsx
│   │   ├── hover-glow-button.tsx
│   │   ├── command-menu-palette.tsx
│   │   ├── glass-fold/          # WebGL shader
│   │   ├── dialog.tsx sheet.tsx tooltip.tsx avatar.tsx collapsible.tsx chart.tsx
│   │   └── Card.tsx Input.tsx Label.tsx Textarea.tsx Separator.tsx Skeleton.tsx
│   ├── command/                 # palette + open-state context
│   ├── effects/                 # FormSentry-adapted wrappers
│   └── builder/                 # field library, canvas, properties panel
├── pages/                       # Dashboard, Templates, Features, Builder, Preview
├── lib/                         # storage, id, utils, template previews, form icons
├── constants/templates.ts
├── types/form.ts
└── test/                        # vitest + jsdom integration test
```

## Scripts

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build
npm run test       # Vitest (unit + jsdom integration)
npm run lint       # Oxlint
npx tsc -b         # Type-check only
```

## Verification

```
TypeScript:  0 errors
Oxlint:      0 errors
Vitest:      4 files, 16 tests passed
Production build: successful (dist/assets 59 KB CSS, 1093 KB JS)
Browser:      dashboard, templates, features, builder and preview inspected at
              320–1440px with no horizontal overflow; ⌘K palette, hover reveal,
              cursor glow, author dialog and mobile navigation sheet verified
              interacting with the running app
```

## License

MIT.
