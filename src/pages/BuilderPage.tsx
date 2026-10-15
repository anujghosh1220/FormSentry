import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { FormDefinition, FormField, FieldType } from "../types/form"
import { loadForms, saveForms } from "../lib/storage"
import { generateId } from "../lib/id"
import { FieldLibrary } from "../components/builder/FieldLibrary"
import { FormCanvas } from "../components/builder/FormCanvas"
import { PropertiesPanel } from "../components/builder/PropertiesPanel"

export function BuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormDefinition | null>(() => {
    const forms = loadForms()
    return forms.find((f) => f.id === id) || null
  })
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  useEffect(() => {
    if (!form) {
      navigate("/")
    }
  }, [form, navigate])

  const persist = useCallback(
    (updated: FormDefinition) => {
      setForm(updated)
      const forms = loadForms()
      const updatedForms = forms.map((f) =>
        f.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : f
      )
      saveForms(updatedForms)
    },
    []
  )

  const handleAddField = (fieldData: Partial<FormField> & { type: FieldType }) => {
    if (!form) return
    const newField: FormField = {
      id: fieldData.id || generateId(),
      type: fieldData.type,
      label: fieldData.label || "Field",
      placeholder: fieldData.placeholder,
      helpText: fieldData.helpText,
      required: fieldData.required || false,
      defaultValue: fieldData.defaultValue,
      options: fieldData.options,
      validation: fieldData.validation,
      order: form.fields.length,
    }
    const updated = { ...form, fields: [...form.fields, newField] }
    persist(updated)
    setSelectedFieldId(newField.id)
  }

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!form || !selectedFieldId) return
    const updatedFields = form.fields.map((f) =>
      f.id === selectedFieldId ? { ...f, ...updates } : f
    )
    persist({ ...form, fields: updatedFields })
  }

  const handleDeleteField = (fieldId: string) => {
    if (!form) return
    const updatedFields = form.fields
      .filter((f) => f.id !== fieldId)
      .map((f, index) => ({ ...f, order: index }))
    persist({ ...form, fields: updatedFields })
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
  }

  const handleDuplicateField = (fieldId: string) => {
    if (!form) return
    const field = form.fields.find((f) => f.id === fieldId)
    if (!field) return
    const duplicated: FormField = {
      ...field,
      id: generateId(),
      options: field.options?.map((opt) => ({ ...opt, id: generateId() })),
    }
    const updatedFields = [...form.fields, duplicated].map((f, index) => ({
      ...f,
      order: index,
    }))
    persist({ ...form, fields: updatedFields })
    setSelectedFieldId(duplicated.id)
  }

  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    if (!form) return
    const sorted = [...form.fields].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex((f) => f.id === fieldId)
    if (index === -1) return
    const newIndex = direction === "up" ? Math.max(0, index - 1) : Math.min(sorted.length - 1, index + 1)
    ;[sorted[index], sorted[newIndex]] = [sorted[newIndex], sorted[index]]
    const updatedFields = sorted.map((f, i) => ({ ...f, order: i }))
    persist({ ...form, fields: updatedFields })
  }

  const selectedField = form?.fields.find((f) => f.id === selectedFieldId) || null

  if (!form) return null

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[--color-border] lg:h-[calc(100vh-9rem)]">
      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-64 bg-[--color-bg-surface] border-b lg:border-b-0 lg:border-r border-[--color-border]">
          <FieldLibrary onAddField={handleAddField} />
        </aside>
        <main className="flex-1 bg-[--color-bg] min-h-[400px]">
          <FormCanvas
            form={form}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onUpdateForm={(updates) => persist({ ...form, ...updates })}
            onDeleteField={handleDeleteField}
            onDuplicateField={handleDuplicateField}
            onMoveField={handleMoveField}
          />
        </main>
        <aside className="w-full lg:w-80 bg-[--color-bg-surface] border-t lg:border-t-0 lg:border-l border-[--color-border]">
          <PropertiesPanel selectedField={selectedField} onUpdateField={handleUpdateField} />
        </aside>
      </div>
    </div>
  )
}