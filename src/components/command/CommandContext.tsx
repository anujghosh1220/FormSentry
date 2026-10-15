"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { CommandPalette, type CommandPaletteActions } from "./CommandPalette"
import { useCommandShortcut } from "../ui/command-menu-palette"

export interface CommandPaletteContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  /** Pages register the actions their command entries should run. */
  registerActions: (actions: CommandPaletteActions) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null)

/**
 * Owns the ⌘K / Ctrl+K shortcut and the palette's open state, so the trigger
 * in the app shell and the pages that provide actions stay decoupled.
 */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useCommandShortcut()
  const [actions, setActions] = useState<CommandPaletteActions>({})
  const registerActions = useCallback((next: CommandPaletteActions) => setActions(next), [])

  const value = useMemo(() => ({ open, setOpen, registerActions }), [open, setOpen, registerActions])

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} actions={actions} />
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext)
  if (!context) {
    throw new Error("useCommandPalette must be used inside <CommandPaletteProvider />")
  }
  return context
}
