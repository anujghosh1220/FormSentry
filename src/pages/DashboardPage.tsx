import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts"
import {
  Copy,
  Download,
  Edit3,
  Eye,
  FilePlus2,
  Import,
  LayoutTemplate,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react"
import type { FormDefinition } from "../types/form"
import { loadForms, saveForms, exportForm, importForm } from "../lib/storage"
import { generateId } from "../lib/id"
import { getFormIcon } from "../lib/formIcons"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/ui/chart"
import { HoverGlowButton } from "../components/effects/HoverGlowButton"
import { GlassFold } from "../components/effects/GlassFold"
import { FeaturesBento } from "../components/effects/FeaturesBento"
import {
  TemplateGallery,
  FORMSENTRY_TEMPLATES,
  type TemplateDefinition,
} from "../components/effects/TemplateGallery"
import { AuthorFormDialog, type AuthorFormCardData } from "../components/effects/AuthorFormDialog"
import { useCommandPalette } from "../components/command/CommandContext"
import { cn } from "../lib/utils"

const chartConfig = {
  fields: { label: "Fields", color: "#F04452" },
  required: { label: "Required", color: "#F04452" },
} satisfies ChartConfig

export function DashboardPage() {
  const navigate = useNavigate()
  const { registerActions } = useCommandPalette()

  const [forms, setForms] = useState<FormDefinition[]>(() => loadForms())
  const [searchTerm, setSearchTerm] = useState("")
  const [authorOpen, setAuthorOpen] = useState(false)
  const [editing, setEditing] = useState<FormDefinition | null>(null)
  const [pendingDelete, setPendingDelete] = useState<FormDefinition | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* refresh the list when the tab regains focus */
  useEffect(() => {
    const onFocus = () => setForms(loadForms())
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  const persist = useCallback((next: FormDefinition[]) => {
    setForms(next)
    saveForms(next)
  }, [])

  const filteredForms = useMemo(
    () =>
      forms
        .filter((form) => {
          const term = searchTerm.trim().toLowerCase()
          if (!term) return true
          return (
            form.title.toLowerCase().includes(term) ||
            (form.description ?? "").toLowerCase().includes(term) ||
            form.fields.some((field) => field.label.toLowerCase().includes(term))
          )
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [forms, searchTerm]
  )

  const stats = useMemo(() => {
    const totalFields = forms.reduce((sum, form) => sum + form.fields.length, 0)
    const requiredFields = forms.reduce(
      (sum, form) => sum + form.fields.filter((field) => field.required || field.validation?.required).length,
      0
    )
    const lastUpdated = forms.reduce<string | null>(
      (latest, form) => (!latest || new Date(form.updatedAt) > new Date(latest) ? form.updatedAt : latest),
      null
    )
    return { totalFields, requiredFields, lastUpdated }
  }, [forms])

  const chartData = useMemo(
    () =>
      [...forms]
        .sort((a, b) => b.fields.length - a.fields.length)
        .slice(0, 6)
        .map((form) => ({
          name: form.title.length > 12 ? `${form.title.slice(0, 11)}…` : form.title,
          fields: form.fields.length,
          required: form.fields.filter((field) => field.required || field.validation?.required).length,
        })),
    [forms]
  )

  /* ------------------------------------------------------------- actions */

  const openTemplate = useCallback(
    (template: TemplateDefinition) => {
      const built = { ...template.build(), icon: template.icon }
      persist([...forms, built])
      navigate(`/builder/${built.id}`)
    },
    [forms, navigate, persist]
  )

  const handleAuthorSubmit = useCallback(
    (data: AuthorFormCardData) => {
      const now = new Date().toISOString()
      if (editing) {
        persist(
          forms.map((form) =>
            form.id === editing.id
              ? { ...form, title: data.name || form.title, description: data.title, icon: data.icon, updatedAt: now }
              : form
          )
        )
      } else {
        const created: FormDefinition = {
          id: generateId(),
          title: data.name || "Untitled form",
          description: data.title,
          icon: data.icon,
          fields: [],
          createdAt: now,
          updatedAt: now,
          version: 1,
        }
        persist([...forms, created])
        navigate(`/builder/${created.id}`)
        return
      }
      setEditing(null)
    },
    [editing, forms, navigate, persist]
  )

  const handleDuplicate = useCallback(
    (form: FormDefinition) => {
      const now = new Date().toISOString()
      const duplicated: FormDefinition = {
        ...form,
        id: generateId(),
        title: `${form.title} (copy)`,
        fields: form.fields.map((field) => ({ ...field, id: generateId() })),
        createdAt: now,
        updatedAt: now,
      }
      persist([...forms, duplicated])
    },
    [forms, persist]
  )

  const handleExport = useCallback((form: FormDefinition) => {
    const blob = new Blob([exportForm(form)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${form.title.replace(/\s+/g, "_").toLowerCase()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleImportFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = importForm(String(event.target?.result))
          persist([...forms.filter((form) => form.id !== imported.id), imported])
          navigate(`/builder/${imported.id}`)
        } catch {
          /* the file is not a FormSentry export; ignore silently in the UI */
        }
      }
      reader.readAsText(file)
    },
    [forms, navigate, persist]
  )

  const confirmDelete = useCallback(() => {
    if (!pendingDelete) return
    persist(forms.filter((form) => form.id !== pendingDelete.id))
    setPendingDelete(null)
  }, [pendingDelete, forms, persist])

  /* --------------------------------------------- command palette actions */

  const openTemplates = useCallback(() => {
    setGalleryOpen(true)
    if (typeof document !== "undefined") {
      document.getElementById("template-gallery")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  const triggerImport = useCallback(() => fileInputRef.current?.click(), [])

  useEffect(() => {
    registerActions({
      onCreateForm: () => {
        setEditing(null)
        setAuthorOpen(true)
      },
      onOpenTemplates: openTemplates,
      onImport: triggerImport,
      onExportAll: () => {
        const blob = new Blob([JSON.stringify({ forms, version: 1 }, null, 2)], {
          type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = "formsentry-forms.json"
        anchor.click()
        URL.revokeObjectURL(url)
      },
      onDuplicate: handleDuplicate,
    })
  }, [registerActions, openTemplates, triggerImport, handleDuplicate, forms])

  /* ------------------------------------------------------------- render */

  return (
    <div className="space-y-10 pb-8">
      {/* ------------------------------------------------------ hero */}
      <GlassFold className="rounded-2xl border border-border">
        <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Local-first form studio
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Build forms that{" "}
            <span className="bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent">
              validate themselves
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
            Author, validate and preview forms entirely in your browser. Templates, rules and JSON
            import/export run offline — nothing ever leaves this device.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <HoverGlowButton
              onClick={() => {
                setEditing(null)
                setAuthorOpen(true)
              }}
              className="shadow-lg shadow-black/30"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Author a form
            </HoverGlowButton>
            <HoverGlowButton
              onClick={openTemplates}
              glowColor="rgba(255, 255, 255, 0.35)"
              variant="outline"
              className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
            >
              <LayoutTemplate className="h-4 w-4" aria-hidden="true" />
              Browse templates
            </HoverGlowButton>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat label="Forms" value={forms.length} />
            <HeroStat label="Fields" value={stats.totalFields} />
            <HeroStat label="Required" value={stats.requiredFields} />
            <HeroStat
              label="Last update"
              value={
                stats.lastUpdated
                  ? new Date(stats.lastUpdated).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"
              }
            />
          </dl>
        </div>
      </GlassFold>

      {/* -------------------------------------------------- features bento */}
      <section aria-labelledby="features-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="features-heading" className="text-xl font-semibold tracking-tight text-foreground">
              How the studio behaves
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three live diagrams: edits flowing through the hub, the local toolchain, and a validation
              forecast.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/features")}>
            Open full section
          </Button>
        </div>
        <FeaturesBento />
      </section>

      {/* ----------------------------------------------- template gallery */}
      <section id="template-gallery" aria-labelledby="templates-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="templates-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Start from a template
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hover a row to slide its layout in behind the text; click a row to open it in the builder.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGalleryOpen((open) => !open)}
            aria-expanded={galleryOpen}
          >
            {galleryOpen ? "Hide gallery" : "Show gallery"}
          </Button>
        </div>
        {galleryOpen && (
          <TemplateGallery
            onSelectTemplate={(template) => {
              setGalleryOpen(false)
              openTemplate(template)
            }}
          />
        )}
      </section>

      {/* ------------------------------------------------------ forms list */}
      <section aria-labelledby="forms-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="forms-heading" className="text-xl font-semibold tracking-tight text-foreground">
              Your forms
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {forms.length} form{forms.length === 1 ? "" : "s"} stored in this browser
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-64">
              <Input
                type="search"
                aria-label="Search forms"
                placeholder="Search forms, fields…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={triggerImport}>
              <Import className="h-4 w-4" aria-hidden="true" />
              Import
            </Button>
            <HoverGlowButton
              size="sm"
              onClick={() => {
                setEditing(null)
                setAuthorOpen(true)
              }}
            >
              <FilePlus2 className="h-4 w-4" aria-hidden="true" />
              New form
            </HoverGlowButton>
          </div>
        </div>

        {forms.length > 0 && chartData.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">Fields per form</h3>
              <p className="text-xs text-muted-foreground">Top {chartData.length} by field count</p>
            </div>
            <ChartContainer config={chartConfig} className="mt-4 h-52 w-full aspect-auto">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillFields" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F04452" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#F04452" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  dataKey="fields"
                  type="monotone"
                  stroke="#F04452"
                  strokeWidth={2}
                  fill="url(#fillFields)"
                  dot={{ r: 2.5, fill: "#F04452", strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {forms.length > 0 && chartData.length > 1 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">Required fields</h3>
              <p className="text-xs text-muted-foreground">Share of each form's rules</p>
            </div>
            <ChartContainer config={chartConfig} className="mt-4 h-44 w-full aspect-auto">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="required" fill="#F04452" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ChartContainer>
          </div>
        )}

        {filteredForms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-medium text-foreground">
              {forms.length === 0 ? "No forms yet" : "No forms match your search"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {forms.length === 0
                ? "Author your first form, or start from one of the templates above."
                : "Try a different name, field label or description."}
            </p>
            {forms.length === 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <HoverGlowButton size="sm" onClick={() => {
                  setEditing(null)
                  setAuthorOpen(true)
                }}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Author a form
                </HoverGlowButton>
                <Button variant="outline" size="sm" onClick={() => openTemplate(FORMSENTRY_TEMPLATES[0])}>
                  Use “{FORMSENTRY_TEMPLATES[0].label}”
                </Button>
              </div>
            )}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredForms.map((form) => {
              const Icon = getFormIcon(form.icon)
              return (
                <li
                  key={form.id}
                  className={cn(
                    "group relative flex min-w-0 flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200",
                    "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-semibold text-foreground">{form.title}</h3>
                      <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">
                        {form.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>{form.fields.length} fields</span>
                    <span aria-hidden="true">·</span>
                    <span>v{form.version}</span>
                    <span aria-hidden="true">·</span>
                    <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/builder/${form.id}`)}
                      aria-label={`Edit ${form.title}`}
                    >
                      <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/preview/${form.id}`)}
                      aria-label={`Preview ${form.title}`}
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Preview
                    </Button>
                    <div className="ml-auto flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(form)
                          setAuthorOpen(true)
                        }}
                        aria-label={`Rename ${form.title}`}
                        title="Rename"
                      >
                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(form)}
                        aria-label={`Duplicate ${form.title}`}
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExport(form)}
                        aria-label={`Export ${form.title}`}
                        title="Export JSON"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPendingDelete(form)}
                        aria-label={`Delete ${form.title}`}
                        title="Delete"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ------------------------------------------------------- dialogs */}

      <AuthorFormDialog
        open={authorOpen}
        onOpenChange={(open: boolean) => {
          setAuthorOpen(open)
          if (!open) setEditing(null)
        }}
        initialData={
          editing ? { name: editing.title, title: editing.description ?? "", icon: editing.icon } : undefined
        }
        onSubmit={handleAuthorSubmit}
      />

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete “{pendingDelete?.title}”?</DialogTitle>
            <DialogDescription>
              This permanently removes the form and its {pendingDelete?.fields.length ?? 0} field
              {(pendingDelete?.fields.length ?? 0) === 1 ? "" : "s"} from this browser's storage. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          handleImportFile(event.target.files?.[0])
          event.target.value = ""
        }}
      />
    </div>
  )
}

function HeroStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-white">{value}</dd>
    </div>
  )
}

export default DashboardPage
