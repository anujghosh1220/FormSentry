import { useMemo, useState } from "react"
import InteractiveListPreview, {
  type InteractiveListItem,
} from "../ui/interactive-list-preview"
import { templatePreviewImage } from "../../lib/templatePreview"
import {
  createContactUsTemplate,
  createEventRsvpTemplate,
  createFeedbackTemplate,
  createJobApplicationTemplate,
  createNewsletterTemplate,
  createRegistrationTemplate,
} from "../../constants/templates"
import type { FormDefinition } from "../../types/form"
import { cn } from "../../lib/utils"

export interface TemplateDefinition {
  id: string
  label: string
  summary: string
  /** Icon key stored on the form so the dashboard can show it. */
  icon: string
  build: () => FormDefinition
}

export const FORMSENTRY_TEMPLATES: TemplateDefinition[] = [
  {
    id: "contact",
    label: "Contact Us",
    summary: "Name, email, subject, message",
    icon: "mail",
    build: createContactUsTemplate,
  },
  {
    id: "registration",
    label: "Registration",
    summary: "Account signup with password and consent",
    icon: "user",
    build: createRegistrationTemplate,
  },
  {
    id: "feedback",
    label: "Feedback",
    summary: "Rating, category and comments",
    icon: "message",
    build: createFeedbackTemplate,
  },
  {
    id: "job-application",
    label: "Job Application",
    summary: "Role, portfolio, motivation, consent",
    icon: "briefcase",
    build: createJobApplicationTemplate,
  },
  {
    id: "event-rsvp",
    label: "Event RSVP",
    summary: "Attendance, guests, dietary needs",
    icon: "calendar",
    build: createEventRsvpTemplate,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    summary: "Single opt-in with interests",
    icon: "clipboard",
    build: createNewsletterTemplate,
  },
]

export interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplateDefinition) => void
  className?: string
}

/**
 * The interactive template gallery: the Hyperiux-style list where hovering a
 * row slides a GSAP clip-path reveal of that template's layout in behind the
 * text, following the cursor with a smoothed offset.
 */
export function TemplateGallery({ onSelectTemplate, className }: TemplateGalleryProps) {
  const [selectedId, setSelectedId] = useState(FORMSENTRY_TEMPLATES[0].id)

  const items = useMemo<InteractiveListItem[]>(
    () =>
      FORMSENTRY_TEMPLATES.map((template) => {
        const sample = template.build()
        return {
          client: template.label,
          platform: `${sample.fields.length} fields`,
          services: template.summary,
          img: templatePreviewImage(sample.title, sample.description ?? "", sample.fields),
        }
      }),
    []
  )

  const selectedIndex = Math.max(
    0,
    FORMSENTRY_TEMPLATES.findIndex((template) => template.id === selectedId)
  )
  const selected = FORMSENTRY_TEMPLATES[selectedIndex]

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-[#101013] shadow-2xl shadow-black/40",
        className
      )}
      aria-label="Template gallery"
    >
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Templates</p>
          <h2 className="mt-2 font-mono text-xl font-medium tracking-tight text-white text-balance sm:text-2xl">
            Elevating interaction through motion
          </h2>
          <p className="mt-1 font-mono text-xs text-white/60">
            Hover a row to reveal the layout · click to start from it
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelectTemplate(selected)}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-[#111113] transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-[#101013]"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          Use “{selected.label}”
        </button>
      </header>

      <InteractiveListPreview
        items={items}
        bgColor="#101013"
        imageSize={1.05}
        onItemSelect={(index) => {
          const template = FORMSENTRY_TEMPLATES[index]
          if (!template) return
          setSelectedId(template.id)
        }}
        className="text-white"
      />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 font-mono text-[11px] uppercase tracking-widest text-white/60 sm:px-6">
        <span>
          {FORMSENTRY_TEMPLATES.length} templates · selected:{" "}
          <span className="text-white/70">{selected.label}</span>
        </span>
        <span className="flex items-center gap-2">
          <kbd className="rounded-[5px] bg-white/10 px-1.5 py-0.5 font-sans text-[10px] text-white/70">↵</kbd>
          to start
        </span>
      </footer>
    </section>
  )
}

export default TemplateGallery
