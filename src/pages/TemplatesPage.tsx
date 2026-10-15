import { useCallback, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Import, LayoutTemplate } from "lucide-react"
import type { FormDefinition } from "../types/form"
import { loadForms, saveForms } from "../lib/storage"
import { Button } from "../components/ui/Button"
import { HoverGlowButton } from "../components/effects/HoverGlowButton"
import {
  TemplateGallery,
  FORMSENTRY_TEMPLATES,
  type TemplateDefinition,
} from "../components/effects/TemplateGallery"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { getFormIcon } from "../lib/formIcons"

export function TemplatesPage() {
  const navigate = useNavigate()
  const [forms, setForms] = useState<FormDefinition[]>(() => loadForms())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openTemplate = useCallback(
    (template: TemplateDefinition) => {
      const built = { ...template.build(), icon: template.icon }
      const next = [...forms, built]
      setForms(next)
      saveForms(next)
      navigate(`/builder/${built.id}`)
    },
    [forms, navigate]
  )

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <LayoutTemplate className="h-3.5 w-3.5" aria-hidden="true" />
          Templates
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Start from a working layout
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Every template is a real form definition with field types and validation rules already wired up.
          Hover a row in the gallery to preview it, click to open it in the builder, or import a form you
          exported earlier.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <HoverGlowButton onClick={() => openTemplate(FORMSENTRY_TEMPLATES[0])}>
            Use “{FORMSENTRY_TEMPLATES[0].label}”
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </HoverGlowButton>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Import className="h-4 w-4" aria-hidden="true" />
            Import form
          </Button>
        </div>
      </header>

      <TemplateGallery onSelectTemplate={openTemplate} />

      <section aria-labelledby="all-templates" className="space-y-4">
        <h2 id="all-templates" className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          All templates
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FORMSENTRY_TEMPLATES.map((template) => {
            const sample = template.build()
            const Icon = getFormIcon(template.icon)
            return (
              <li key={template.id}>
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardHeader>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <CardTitle className="mt-3 text-base">{template.label}</CardTitle>
                    <CardDescription>{sample.description ?? template.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                      {sample.fields.slice(0, 4).map((field) => (
                        <li key={field.id} className="flex items-center justify-between gap-2">
                          <span className="truncate">{field.label}</span>
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                            {field.type}
                          </span>
                        </li>
                      ))}
                      {sample.fields.length > 4 && (
                        <li className="text-muted-foreground/70">
                          +{sample.fields.length - 4} more field{sample.fields.length - 4 === 1 ? "" : "s"}
                        </li>
                      )}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openTemplate(template)}
                    >
                      Use this template
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}

export default TemplatesPage
