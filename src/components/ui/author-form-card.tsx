"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Info, X, Check } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"
import { Label } from "./Label"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { FORM_ICON_KEYS, FORM_ICONS, getFormIcon, isFormIconKey } from "../../lib/formIcons"

/* --- Component Props Interface --- */

export interface AuthorFormCardData {
  /** The form's name. */
  name: string
  /** The form's description. */
  title: string
  /** The chosen form icon key. */
  icon: string
}

export interface AuthorFormCardProps {
  initialData?: {
    name: string
    title: string
    icon?: string
  }
  onSubmit: (data: AuthorFormCardData) => void
  onCancel: () => void
  className?: string
  /** Card heading. */
  heading?: string
  /** Card sub-heading. */
  subheading?: string
  /** Label of the primary action. */
  submitLabel?: string
}

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } },
}

function FormGlyph({ icon, className }: { icon: string; className?: string }) {
  const Icon = getFormIcon(icon)
  return React.createElement(Icon, { className, "aria-hidden": true })
}

export const AuthorFormCard: React.FC<AuthorFormCardProps> = ({
  initialData,
  onSubmit,
  onCancel,
  className,
  heading = "Author a form",
  subheading = "Name it, describe it, and pick an icon for your dashboard.",
  submitLabel = "Save Changes",
}) => {
  const [name, setName] = React.useState(initialData?.name ?? "")
  const [title, setTitle] = React.useState(initialData?.title ?? "")
  const [icon, setIcon] = React.useState<string>(
    initialData?.icon && isFormIconKey(initialData.icon) ? initialData.icon : "note"
  )
  const [iconPickerOpen, setIconPickerOpen] = React.useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({ name: name.trim(), title: title.trim(), icon })
  }

  const initials = (name.trim() || "F").slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.15 } },
      }}
      className={cn(
        "relative w-full max-w-lg rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl shadow-black/50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <motion.h3 variants={FADE_IN_VARIANTS} className="text-xl font-semibold tracking-tight text-foreground">
            {heading}
          </motion.h3>
          <motion.p variants={FADE_IN_VARIANTS} className="mt-1 text-[13px] text-muted-foreground">
            {subheading}
          </motion.p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} aria-label="Close" className="-mr-2 -mt-2">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* --- Icon Section --- */}
        <motion.div variants={FADE_IN_VARIANTS} className="flex flex-col items-center gap-3 md:col-span-1">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-dashed border-border bg-muted">
              <AvatarImage src={undefined} alt={name || "Form"} />
              <AvatarFallback className="bg-transparent">
                <span className="flex flex-col items-center gap-1 text-muted-foreground">
                  <FormGlyph icon={icon} className="h-7 w-7 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{initials}</span>
                </span>
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => setIconPickerOpen((open) => !open)}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Choose form icon"
              aria-expanded={iconPickerOpen}
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Form icon</p>
            <p className="text-xs text-muted-foreground">Shown next to the form name</p>
          </div>

          {iconPickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid w-full grid-cols-4 gap-1.5 rounded-lg border border-border bg-background p-2"
              role="group"
              aria-label="Form icon choices"
            >
              {FORM_ICON_KEYS.map((key) => {
                const Icon = FORM_ICONS[key]
                const active = key === icon
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setIcon(key)
                      setIconPickerOpen(false)
                    }}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-md border transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    )}
                    aria-label={`Use ${key} icon`}
                    aria-pressed={active}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </motion.div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIconPickerOpen((open) => !open)}
          >
            Choose icon
          </Button>
        </motion.div>

        {/* --- Form Fields Section --- */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
            <Label htmlFor="author-name">
              Form name <span className="text-destructive">*</span>
            </Label>
            <input
              id="author-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Customer Feedback"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </motion.div>

          <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
            <div className="flex items-center gap-1">
              <Label htmlFor="author-title">Description</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>A short line shown under the form name in your dashboard.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <input
              id="author-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What is this form for?"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </motion.div>

          <motion.div
            variants={FADE_IN_VARIANTS}
            className="rounded-lg border border-border bg-muted/40 p-3 text-[12px] text-muted-foreground"
          >
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              Stored locally
            </p>
            <p className="mt-1">
              Saved straight to this browser's local storage. No account, no sync, no telemetry.
            </p>
          </motion.div>
        </div>

        {/* --- Form Actions --- */}
        <motion.div variants={FADE_IN_VARIANTS} className="flex justify-end gap-3 md:col-span-3">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            {submitLabel}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export { AuthorFormCard as AuthorForm }
export default AuthorFormCard
