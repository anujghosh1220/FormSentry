import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FilePlus2,
  FileText,
  Files,
  LayoutDashboard,
  Library,
  Settings2,
  Upload,
  Eye,
  Copy,
} from "lucide-react"
import type { FormDefinition } from "../../types/form"
import { loadForms, saveForms } from "../../lib/storage"
import {
  CommandGroup,
  CommandItem,
  CommandMenu,
  CommandSeparator,
} from "../ui/command-menu-palette"

export interface CommandPaletteActions {
  onCreateForm?: () => void
  onOpenTemplates?: () => void
  onImport?: () => void
  onExportAll?: () => void
  onDuplicate?: (form: FormDefinition) => void
  onDelete?: (form: FormDefinition) => void
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actions?: CommandPaletteActions
}

interface FormCommand {
  id: string
  label: string
  hint: string
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  keywords: string[]
  run: () => void
}

export function CommandPalette({ open, onOpenChange, actions = {} }: CommandPaletteProps) {
  const [forms, setForms] = useState<FormDefinition[]>([])
  const [lastRun, setLastRun] = useState<string | null>(null)
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setForms(loadForms())
  }, [open])

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  const run = useCallback(
    (label: string, action: () => void) => () => {
      action()
      setLastRun(label)
      close()
    },
    [close]
  )

  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFilePicked = useCallback(
    (file: File | undefined) => {
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(String(event.target?.result)) as FormDefinition
          if (!parsed || !Array.isArray(parsed.fields) || !parsed.title) {
            throw new Error("Invalid form file")
          }
          const existing = loadForms()
          const imported: FormDefinition = {
            ...parsed,
            id: parsed.id || `form_${Date.now().toString(36)}`,
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: parsed.version ?? 1,
          }
          const merged = [...existing.filter((f) => f.id !== imported.id), imported]
          saveForms(merged)
          setForms(merged)
          setLastRun(`Imported "${imported.title}"`)
          navigate(`/builder/${imported.id}`)
        } catch {
          setLastRun("Import failed: invalid form file")
        }
      }
      reader.readAsText(file)
    },
    [navigate]
  )

  const handleExportAll = useCallback(() => {
    const all = loadForms()
    const blob = new Blob([JSON.stringify({ forms: all, version: 1 }, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "formsentry-forms.json"
    anchor.click()
    URL.revokeObjectURL(url)
    setLastRun(`Exported ${all.length} form${all.length === 1 ? "" : "s"}`)
  }, [])

  const navCommands: FormCommand[] = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Go to Dashboard",
        hint: "All forms and recent activity",
        icon: LayoutDashboard,
        shortcut: "G D",
        keywords: ["home", "forms", "dashboard", "overview"],
        run: () => navigate("/"),
      },
    ],
    [navigate]
  )

  const actionCommands: FormCommand[] = useMemo(() => {
    const items: FormCommand[] = []
    if (actions.onCreateForm) {
      items.push({
        id: "create-form",
        label: "Create blank form",
        hint: "Start from an empty canvas",
        icon: FilePlus2,
        shortcut: "⌘N",
        keywords: ["new", "create", "blank", "add", "form"],
        run: actions.onCreateForm,
      })
    }
    if (actions.onOpenTemplates) {
      items.push({
        id: "templates",
        label: "Browse templates",
        hint: "Contact, registration, feedback",
        icon: Library,
        shortcut: "G T",
        keywords: ["template", "gallery", "starter", "preset"],
        run: actions.onOpenTemplates,
      })
    }
    items.push({
      id: "import",
      label: "Import form (JSON)",
      hint: "Load a form from a file",
      icon: Upload,
      keywords: ["import", "upload", "json", "load"],
      run: handleImport,
    })
    items.push({
      id: "export-all",
      label: "Export all forms",
      hint: "Download every form as JSON",
      icon: Files,
      keywords: ["export", "download", "backup", "json"],
      run: handleExportAll,
    })
    return items
  }, [actions, handleImport, handleExportAll])

  const formCommands: FormCommand[] = useMemo(() => {
    if (!forms.length) return []
    const items: FormCommand[] = []
    for (const form of forms.slice(0, 8)) {
      items.push({
        id: `open-${form.id}`,
        label: `Edit ${form.title}`,
        hint: `${form.fields.length} field${form.fields.length === 1 ? "" : "s"}`,
        icon: FileText,
        keywords: ["edit", "open", "builder", form.title.toLowerCase()],
        run: () => navigate(`/builder/${form.id}`),
      })
      items.push({
        id: `preview-${form.id}`,
        label: `Preview ${form.title}`,
        hint: "See the live form",
        icon: Eye,
        keywords: ["preview", "view", "test", form.title.toLowerCase()],
        run: () => navigate(`/preview/${form.id}`),
      })
      if (actions.onDuplicate) {
        items.push({
          id: `duplicate-${form.id}`,
          label: `Duplicate ${form.title}`,
          hint: "Make an editable copy",
          icon: Copy,
          keywords: ["duplicate", "copy", "clone", form.title.toLowerCase()],
          run: () => actions.onDuplicate?.(form),
        })
      }
    }
    return items
  }, [actions, forms, navigate])

  const allCommands = useMemo(
    () => [...navCommands, ...actionCommands, ...formCommands],
    [actionCommands, formCommands, navCommands]
  )

  const renderItem = useCallback(
    (command: FormCommand) => (
      <CommandItem
        key={command.id}
        value={`${command.id} ${command.label} ${command.keywords.join(" ")}`}
        icon={<command.icon />}
        shortcut={command.shortcut}
        hint={command.hint}
        keywords={[command.label, ...command.keywords]}
        onSelect={run(command.label, command.run)}
      >
        {command.label}
      </CommandItem>
    ),
    [run]
  )

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          onFilePicked(event.target.files?.[0])
          event.target.value = ""
        }}
      />

      <CommandMenu
        open={open}
        onOpenChange={onOpenChange}
        placeholder="Search forms, templates and actions…"
        emptyText="No matching commands."
        footer={
          <>
            <span>
              <kbd className="font-sans">↑↓</kbd> move
            </span>
            <span>
              <kbd className="font-sans">↵</kbd> run
            </span>
            <span>
              <kbd className="font-sans">esc</kbd> close
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Settings2 className="size-3" aria-hidden="true" />
              {allCommands.length} commands
            </span>
          </>
        }
      >
        <CommandGroup heading="Go to">{navCommands.map(renderItem)}</CommandGroup>

        {actionCommands.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Actions">{actionCommands.map(renderItem)}</CommandGroup>
          </>
        )}

        {formCommands.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Your forms">{formCommands.map(renderItem)}</CommandGroup>
          </>
        )}
      </CommandMenu>

      <p aria-live="polite" className="sr-only">
        {lastRun ? `Ran ${lastRun}` : ""}
      </p>
    </>
  )
}
