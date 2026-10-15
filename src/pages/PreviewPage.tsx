import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { FormDefinition, FormField } from "../types/form"
import { loadForms } from "../lib/storage"
import { validateForm } from "../utils/validation"
import { Button } from "../components/ui/Button"

function emptyValuesFor(form: FormDefinition): Record<string, any> {
  const values: Record<string, any> = {}
  form.fields.forEach((f) => {
    values[f.id] = f.type === "checkbox" ? false : ""
  })
  return values
}

export function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = useState<FormDefinition | null>(() => {
    const forms = loadForms()
    return forms.find((f) => f.id === id) || null
  })
  const [values, setValues] = useState<Record<string, any>>(() =>
    form ? emptyValuesFor(form) : {}
  )
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!form) {
    navigate("/")
    return null
  }

  const handleChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
    if (submitted) {
      const validation = validateForm(form!.fields, { ...values, [fieldId]: value })
      setErrors(validation.errors)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    const validation = validateForm(form.fields, values)
    setErrors(validation.errors)
    setSubmitted(true)
    if (validation.valid) {
      setTimeout(() => {
        alert("Form submitted successfully!")
        handleReset()
      }, 100)
    }
  }

  const handleReset = () => {
    if (!form) return
    setValues(emptyValuesFor(form))
    setErrors({})
    setSubmitted(false)
  }

  const renderField = (field: FormField) => {
    const fieldErrors = errors[field.id] || []
    const isInvalid = fieldErrors.length > 0
    const fieldId = field.id

    return (
      <div key={fieldId} className="space-y-1.5">
        <label htmlFor={`preview-${fieldId}`} className="block text-sm font-medium text-[--color-text]">
          {field.label}
          {field.required && <span className="text-[--color-danger] ml-1">*</span>}
        </label>
        {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "number" || field.type === "date" ? (
          <input
            id={`preview-${fieldId}`}
            type={field.type}
            value={values[fieldId] || ""}
            onChange={(e) => handleChange(fieldId, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 border rounded-lg bg-[--color-bg-secondary] text-[--color-text] placeholder-[--color-text-muted] focus:outline-none focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition-colors ${isInvalid ? "border-[--color-danger]" : "border-[--color-border]"}`}
            aria-invalid={isInvalid ? "true" : "false"}
            aria-describedby={isInvalid ? `preview-${fieldId}-error` : field.helpText ? `preview-${fieldId}-help` : undefined}
          />
        ) : field.type === "textarea" ? (
          <textarea
            id={`preview-${fieldId}`}
            value={values[fieldId] || ""}
            onChange={(e) => handleChange(fieldId, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg bg-[--color-bg-secondary] text-[--color-text] placeholder-[--color-text-muted] focus:outline-none focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition-colors ${isInvalid ? "border-[--color-danger]" : "border-[--color-border]"}`}
            aria-invalid={isInvalid ? "true" : "false"}
            aria-describedby={isInvalid ? `preview-${fieldId}-error` : field.helpText ? `preview-${fieldId}-help` : undefined}
          />
        ) : field.type === "select" ? (
          <select
            id={`preview-${fieldId}`}
            value={values[fieldId] || ""}
            onChange={(e) => handleChange(fieldId, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-[--color-bg-secondary] text-[--color-text] focus:outline-none focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition-colors ${isInvalid ? "border-[--color-danger]" : "border-[--color-border]"}`}
            aria-invalid={isInvalid ? "true" : "false"}
            aria-describedby={isInvalid ? `preview-${fieldId}-error` : field.helpText ? `preview-${fieldId}-help` : undefined}
          >
            {field.options?.map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : field.type === "radio" ? (
          <div className="space-y-2" role="radiogroup" aria-labelledby={`preview-${fieldId}`}>
            {field.options?.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={fieldId}
                  value={opt.value}
                  checked={values[fieldId] === opt.value}
                  onChange={(e) => handleChange(fieldId, e.target.value)}
                  className={`rounded-full focus:outline-none focus:ring-2 focus:ring-[--color-ring] ${isInvalid ? "border-[--color-danger]" : ""}`}
                  aria-describedby={isInvalid ? `preview-${fieldId}-error` : undefined}
                />
                <span className="text-sm text-[--color-text]">{opt.label}</span>
              </label>
            ))}
          </div>
        ) : field.type === "checkbox" ? (
          <label className="flex items-center gap-2">
            <input
              id={`preview-${fieldId}`}
              type="checkbox"
              checked={values[fieldId] || false}
              onChange={(e) => handleChange(fieldId, e.target.checked)}
              className={`rounded focus:outline-none focus:ring-2 focus:ring-[--color-ring] ${isInvalid ? "border-[--color-danger]" : ""}`}
              aria-invalid={isInvalid ? "true" : "false"}
              aria-describedby={isInvalid ? `preview-${fieldId}-error` : field.helpText ? `preview-${fieldId}-help` : undefined}
            />
            <span className="text-sm text-[--color-text]">{field.label}</span>
          </label>
        ) : null}
        {field.helpText && !isInvalid && (
          <p id={`preview-${fieldId}-help`} className="text-xs text-[--color-text-muted]">{field.helpText}</p>
        )}
        {isInvalid && (
          <div id={`preview-${fieldId}-error`} className="text-xs text-[--color-danger]">
            {fieldErrors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="pb-4">
      <div className="mx-auto max-w-2xl px-4 py-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/builder/${form.id}`)} className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <div className="bg-[--color-bg-surface] border border-[--color-border] rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[--color-text] mb-2">{form.title}</h1>
            {form.description && <p className="text-[--color-text-muted]">{form.description}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {form.fields
              .sort((a, b) => a.order - b.order)
              .map((field) => renderField(field))}
            <Button type="submit" className="w-full sm:w-auto">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

