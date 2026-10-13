import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { FormDefinition, FormField } from "../types/form"
import { loadForms } from "../lib/storage"
import { validateForm } from "../utils/validation"
import { Button } from "../components/ui/Button"
import { Header } from "../components/layout/Header"

export function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormDefinition | null>(null)
  const [values, setValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const forms = loadForms()
    const found = forms.find((f) => f.id === id)
    if (found) {
      setForm(found)
      const initialValues: Record<string, any> = {}
      found.fields.forEach((f) => {
        if (f.type === "checkbox") initialValues[f.id] = false
        else initialValues[f.id] = ""
      })
      setValues(initialValues)
    } else {
      navigate("/")
    }
  }, [id, navigate])

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
    const initialValues: Record<string, any> = {}
    form.fields.forEach((f) => {
      if (f.type === "checkbox") initialValues[f.id] = false
      else initialValues[f.id] = ""
    })
    setValues(initialValues)
    setErrors({})
    setSubmitted(false)
  }

  const renderField = (field: FormField) => {
    const fieldErrors = errors[field.id] || []
    const isInvalid = fieldErrors.length > 0

    return (
      <div key={field.id} className="space-y-1.5">
        <label className="block text-sm font-medium text-[--color-text]">
          {field.label}
          {field.required && <span className="text-[--color-danger] ml-1">*</span>}
        </label>
        {field.type === "text" || field.type === "email" || field.type === "password" || field.type === "number" || field.type === "date" ? (
          <input
            type={field.type}
            value={values[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 border rounded-lg bg-white ${isInvalid ? "border-[--color-danger]" : "border-[--color-border]"}`}
            aria-invalid={isInvalid ? "true" : "false"}
          />
        ) : field.type === "textarea" ? (
          <textarea
            value={values[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg bg-white ${isInvalid ? "border-[--color-danger]" : "border-[--color-border]"}`}
            aria-invalid={isInvalid ? "true" : "false"}
          />
        ) : field.type === "select" ? (
          <select
            value={values[field.id] || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white ${isInvalid ? "border-[--color-danger]" : "border-[--color-border]"}`}
            aria-invalid={isInvalid ? "true" : "false"}
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
                  checked={values[field.id] === opt.value}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={isInvalid ? "border-[--color-danger]" : ""}
                />
                <span className="text-sm text-[--color-text]">{opt.label}</span>
              </label>
            ))}
          </div>
        ) : field.type === "checkbox" ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={values[field.id] || false}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={isInvalid ? "border-[--color-danger]" : ""}
            />
            <span className="text-sm text-[--color-text]">{field.label}</span>
          </label>
        ) : null}
        {field.helpText && !isInvalid && <p className="text-xs text-[--color-text-muted]">{field.helpText}</p>}
        {isInvalid && (
          <div className="text-xs text-[--color-danger]">
            {fieldErrors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-[--color-bg-alt]">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
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

        <div className="bg-white border border-[--color-border] rounded-lg p-6">
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

