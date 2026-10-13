import { GripVertical, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react"
import type { FormField, FormDefinition } from "../../types/form"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"

interface FormCanvasProps {
  form: FormDefinition
  selectedFieldId: string | null
  onSelectField: (id: string | null) => void
  onUpdateForm: (updates: Partial<FormDefinition>) => void
  onUpdateField: (field: FormField) => void
  onDeleteField: (id: string) => void
  onDuplicateField: (id: string) => void
  onMoveField: (id: string, direction: "up" | "down") => void
  previewMode?: boolean
}

export function FormCanvas({ form, selectedFieldId, onSelectField, onUpdateForm, previewMode = false }: FormCanvasProps) {
  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order)

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 space-y-2">
          <Input
            value={form.title}
            onChange={(e) => onUpdateForm({ title: e.target.value })}
            label="Form Title"
            className="text-lg font-semibold"
            readOnly={previewMode}
          />
          <Textarea
            value={form.description || ""}
            onChange={(e) => onUpdateForm({ description: e.target.value })}
            label="Form Description"
            placeholder="Add a description for your form"
            rows={2}
            readOnly={previewMode}
          />
        </div>
        <div className="space-y-4">
          {sortedFields.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[--color-border] rounded-lg bg-white">
              <p className="text-[--color-text-muted]">
                {previewMode ? "No fields in this form" : "Add fields from the library to get started"}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-[--color-text-muted]">Fields added</div>
          )}
        </div>
      </div>
    </div>
  )
}

