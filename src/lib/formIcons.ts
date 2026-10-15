import {
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileText,
  Mail,
  MessageSquare,
  Star,
  UserPlus,
} from "lucide-react"

export const FORM_ICON_KEYS = [
  "note",
  "clipboard",
  "mail",
  "user",
  "calendar",
  "message",
  "star",
  "briefcase",
] as const

export type FormIconKey = (typeof FORM_ICON_KEYS)[number]

export const FORM_ICONS: Record<FormIconKey, typeof FileText> = {
  note: FileText,
  clipboard: ClipboardList,
  mail: Mail,
  user: UserPlus,
  calendar: CalendarDays,
  message: MessageSquare,
  star: Star,
  briefcase: Briefcase,
}

export const DEFAULT_FORM_ICON: FormIconKey = "note"

export function getFormIcon(key?: string): typeof FileText {
  return FORM_ICONS[(key as FormIconKey) ?? DEFAULT_FORM_ICON] ?? FORM_ICONS[DEFAULT_FORM_ICON]
}

export function isFormIconKey(key: string): key is FormIconKey {
  return (FORM_ICON_KEYS as readonly string[]).includes(key)
}
