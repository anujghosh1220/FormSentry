import { GripVertical, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react"
import type { FormField, FormDefinition } from "../../types/form"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"

interface FormCanvasProps {
  form: FormDefinition
  selectedFieldId: string | null
  onSelectField: (id: string | null) => void
  onUpdateForm: (updates: Partial<FormDefinition>) => void
  onDeleteField: (id: string) => void
  onDuplicateField: (id: string) => void
  onMoveField: (id: string, direction: "up" | "down") => void
}

export function FormCanvas({
  form,
  selectedFieldId,
  onSelectField,
  onUpdateForm,
  onDeleteField,
  onDuplicateField,
  onMoveField,
}: FormCanvasProps) {
  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order)

  const renderField = (field: FormField) => {
    const isEditing = true

    return (
      <div
        key={field.id}
        className={`group border rounded-lg p-4 bg-[--color-bg-surface] transition-colors ${
          selectedFieldId === field.id
            ? "border-[--color-primary] ring-2 ring-[--color-ring]"
            : "border-[--color-border] hover:border-[--color-primary]/60"
        }`}
        onClick={() => isEditing && onSelectField(field.id)}
      >
        <div className="flex items-start gap-2">
          {isEditing && (
            <GripVertical className="w-5 h-5 text-[--color-text-muted] mt-1 cursor-grab" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-sm font-medium text-[--color-text]">
                {field.label}
                {field.required && <span className="text-[--color-danger] ml-1">*</span>}
              </label>
              {isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveField(field.id, "up")
                    }}
                    className="p-1 hover:bg-[--color-bg-secondary] rounded-lg"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4 text-[--color-text-muted]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveField(field.id, "down")
                    }}
                    className="p-1 hover:bg-[--color-bg-secondary] rounded-lg"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4 text-[--color-text-muted]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicateField(field.id)
                    }}
                    className="p-1 hover:bg-[--color-bg-secondary] rounded-lg"
                    aria-label="Duplicate"
                  >
                    <Copy className="w-4 h-4 text-[--color-text-muted]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteField(field.id)
                    }}
                    className="p-1 hover:bg-[--color-danger]/10 rounded-lg"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-[--color-danger]" />
                  </button>
                </div>
              )}
            </div>
            {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "number" || field.type === "date" ? (
              <input
                type={field.type}
                placeholder={field.placeholder}
                defaultValue={field.defaultValue != null ? String(field.defaultValue) : ""}
                readOnly
                className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg-secondary] text-[--color-text] cursor-not-allowed"
              />
            ) : field.type === "textarea" ? (
              <textarea
                placeholder={field.placeholder}
                defaultValue={field.defaultValue != null ? String(field.defaultValue) : ""}
                readOnly
                rows={3}
                className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg-secondary] text-[--color-text] cursor-not-allowed"
              />
            ) : field.type === "select" ? (
              <select
                defaultValue={field.defaultValue != null ? String(field.defaultValue) : ""}
                disabled
                className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg-secondary] text-[--color-text] cursor-not-allowed"
              >
                {field.options?.map((opt) => (
                  <option key={opt.id} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "radio" ? (
              <div className="space-y-2">
                {field.options?.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt.value}
                      defaultChecked={field.defaultValue === opt.value}
                      readOnly
                      className="text-[--color-primary]"
                    />
                    <span className="text-sm text-[--color-text]">{opt.label}</span>
                  </label>
                ))}
              </div>
            ) : field.type === "checkbox" ? (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={field.defaultValue === true}
                  readOnly
                  className="text-[--color-primary]"
                />
                <span className="text-sm text-[--color-text]">{field.label}</span>
              </label>
            ) : null}
            {field.helpText && (
              <p className="text-xs text-[--color-text-muted] mt-1">{field.helpText}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 space-y-2 p-4 bg-[--color-bg-surface] border border-[--color-border] rounded-lg">
          <Input
            value={form.title}
            onChange={(e) => onUpdateForm({ title: e.target.value })}
            label="Form Title"
            className="text-lg font-semibold"
          />
          <Textarea
            value={form.description || ""}
            onChange={(e) => onUpdateForm({ description: e.target.value })}
            label="Form Description"
            placeholder="Add a description for your form"
            rows={2}
          />
        </div>
        <div className="space-y-4">
          {sortedFields.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[--color-border] rounded-lg bg-[--color-bg-surface]">
              <p className="text-[--color-text-muted]">Add fields from the library to get started</p>
            </div>
          ) : (
            <div className="space-y-3">{sortedFields.map(renderField)}</div>
          )}
        </div>
      </div>
    </div>
  )
}