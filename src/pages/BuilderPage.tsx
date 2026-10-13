import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff, Save, Download, Upload } from "lucide-react"
import type { FormDefinition, FormField } from "../types/form"
import { loadForms, saveForms, exportForm, importForm } from "../lib/storage"
import { generateId } from "../lib/id"
import { Button } from "../components/ui/Button"
import { Header } from "../components/layout/Header"
import { FieldLibrary } from "../components/builder/FieldLibrary"
import { FormCanvas } from "../components/builder/FormCanvas"
import { PropertiesPanel } from "../components/builder/PropertiesPanel"

export function BuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormDefinition | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const forms = loadForms()
    const found = forms.find((f) => f.id === id)
    if (found) {
      setForm(found)
    } else {
      navigate("/")
    }
  }, [id, navigate])

  const saveForm = () => {
    if (!form) return
    setIsSaving(true)
    const forms = loadForms()
    const updatedForms = forms.map((f) =>
      f.id === form.id ? { ...form, updatedAt: new Date().toISOString() } : f
    )
    saveForms(updatedForms)
    setTimeout(() => setIsSaving(false), 500)
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-[--color-bg-alt] flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[--color-border]">
          <FieldLibrary onAddField={() => {}} />
        </aside>
        <main className="flex-1 bg-[--color-bg-alt] min-h-[400px]">
          <div className="p-4">Builder</div>
        </main>
        <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-[--color-border]">
          <PropertiesPanel selectedField={null} onUpdateField={() => {}} />
        </aside>
      </div>
    </div>
  )
}

