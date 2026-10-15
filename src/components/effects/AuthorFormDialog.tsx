import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { AuthorFormCard, type AuthorFormCardData } from "../ui/author-form-card"

export type { AuthorFormCardData }

export interface AuthorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: { name: string; title: string; icon?: string }
  onSubmit: (data: AuthorFormCardData) => void
  /** Shown as the dialog title; the card keeps its own heading. */
  title?: string
  description?: string
  submitLabel?: string
}

/**
 * Radix dialog wrapper around the author form card, used for both creating a
 * new form and editing an existing one. Radix handles focus trapping and Escape.
 */
export function AuthorFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  title,
  description,
  submitLabel,
}: AuthorFormDialogProps) {
  const isEdit = Boolean(initialData)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-none bg-transparent p-0 shadow-none [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{title ?? (isEdit ? "Edit form" : "Create a new form")}</DialogTitle>
          <DialogDescription>
            {description ??
              "Name the form, add a short description and choose an icon. Everything is stored in this browser."}
          </DialogDescription>
        </DialogHeader>
        <AuthorFormCard
          initialData={initialData}
          onSubmit={(data) => {
            onSubmit(data)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
          heading={isEdit ? "Edit form" : "Author a form"}
          submitLabel={submitLabel ?? (isEdit ? "Save changes" : "Create form")}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AuthorFormDialog
