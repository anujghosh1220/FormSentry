import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  ChevronRight,
  FileStack,
  LayoutDashboard,
  Library,
  Menu,
  Search,
  Sparkles,
  Wand2,
  HardDrive,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { BrandLogo } from "./brand-logo"
import { Button } from "./Button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { TooltipProvider } from "./tooltip"
import { CommandPaletteProvider, useCommandPalette } from "../command/CommandContext"
import { loadForms, saveForms } from "../../lib/storage"
import { generateId } from "../../lib/id"
import { getFormIcon } from "../../lib/formIcons"
import type { FormDefinition } from "../../types/form"

interface NavEntry {
  label: string
  to: string
  icon: typeof LayoutDashboard
  end?: boolean
  description: string
}

const PRIMARY_NAV: NavEntry[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    end: true,
    description: "Every form you have authored",
  },
  {
    label: "Templates",
    to: "/templates",
    icon: Library,
    description: "Start from a working layout",
  },
  {
    label: "Features",
    to: "/features",
    icon: Sparkles,
    description: "How the builder behaves",
  },
]

export interface EfferdDashboardProps {
  children: ReactNode
}

/**
 * The Efferd-style application shell: a persistent sidebar with real routing
 * on desktop, a Radix sheet on mobile, a command-menu trigger in the top bar,
 * and a recent-forms stack that jumps straight into the builder.
 */
export function EfferdDashboard({ children }: EfferdDashboardProps) {
  return (
    <CommandPaletteProvider>
      <TooltipProvider delayDuration={200}>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <TopBar />
          <div className="flex flex-1">
            <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-surface/60 backdrop-blur-sm lg:block">
              <SidebarContent />
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
              <main
                id="main"
                className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
              >
                {children}
              </main>
              <footer className="border-t border-border px-4 py-5 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <BrandLogo height={18} alt="" aria-hidden="true" />
                    Forms stay in this browser. No backend, no sync, no telemetry.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
                    Local storage
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </CommandPaletteProvider>
  )
}

/* ------------------------------------------------------------------ top bar */

function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-border bg-surface p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <Link to="/" className="flex items-center gap-2.5">
        <BrandLogo height={30} className="shrink-0" />
      </Link>

      <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 md:flex">
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <CommandTrigger />
    </header>
  )
}

function CommandTrigger() {
  const { setOpen } = useCommandPalette()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-keyshortcuts="Meta+K Control+K"
        className="ml-auto hidden h-9 w-56 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-left text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:flex lg:w-72"
      >
        <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">Search or jump to…</span>
        <kbd className="rounded-[5px] border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] text-foreground/70">
          ⌘K
        </kbd>
      </button>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto lg:hidden"
        aria-label="Open command menu"
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
    </>
  )
}

/* ------------------------------------------------------------------ sidebar */

function SidebarContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [forms, setForms] = useState<FormDefinition[]>(() => loadForms())

  /* keep the recent-forms stack in step with storage and with other tabs */
  useEffect(() => {
    const sync = () => setForms(loadForms())
    sync()
    window.addEventListener("focus", sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("focus", sync)
      window.removeEventListener("storage", sync)
    }
  }, [location.pathname])

  const recent = useMemo(
    () =>
      [...forms]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [forms]
  )

  const handleCreate = () => {
    const now = new Date().toISOString()
    const created: FormDefinition = {
      id: generateId(),
      title: "Untitled form",
      description: "",
      fields: [],
      createdAt: now,
      updatedAt: now,
      version: 1,
    }
    const next = [...forms, created]
    setForms(next)
    saveForms(next)
    navigate(`/builder/${created.id}`)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Button onClick={handleCreate} className="w-full justify-start gap-2" size="sm">
          <Wand2 className="h-4 w-4" aria-hidden="true" />
          New form
        </Button>
      </div>

      <nav aria-label="Sections" className="px-2">
        <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                    isActive
? "bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate">{item.label}</span>
                <ChevronRight
                  className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-40"
                  aria-hidden="true"
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground">
            <FileStack className="h-3.5 w-3.5" aria-hidden="true" />
            Recent forms
            <span className="ml-auto text-[10px] normal-case tracking-normal text-muted-foreground/70">
              {recent.length}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-1 space-y-0.5">
              {recent.length === 0 && (
                <li className="px-3 py-2 text-[12px] text-muted-foreground">
                  No forms yet. Create one to get started.
                </li>
              )}
              {recent.map((form) => {
                const Icon = getFormIcon(form.icon)
                const active = location.pathname === `/builder/${form.id}`
                return (
                  <li key={form.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/builder/${form.id}`)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] transition-colors",
                        active
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{form.title}</span>
                      <span className="shrink-0 text-[11px] text-muted-foreground/70">
                        {form.fields.length}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="border-t border-border p-3">
        <div className="rounded-lg border border-border bg-background/60 p-3">
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Local only
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {forms.length} form{forms.length === 1 ? "" : "s"} in this browser's storage.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EfferdDashboard
