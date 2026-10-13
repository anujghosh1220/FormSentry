import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Copy, Trash2, Edit, Download, Upload } from "lucide-react"
import type { FormDefinition } from "../types/form"
import { loadForms, saveForms, exportForm, importForm } from "../lib/storage"
import { generateId } from "../lib/id"
import { Button } from "../components/ui/Button"
import { createContactUsTemplate, createRegistrationTemplate, createFeedbackTemplate } from "../constants/templates"
import { Header } from "../components/layout/Header"

export function DashboardPage() {
  const navigate = useNavigate()
  const [forms, setForms] = useState<FormDefinition[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    setForms(loadForms())
  }, [])

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateForm = () => {
    const now = new Date().toISOString()
    const newForm: FormDefinition = {
      id: generateId(),
      title: "Untitled Form",
      description: "",
      fields: [],
      createdAt: now,
      updatedAt: now,
      version: 1,
    }
    const updatedForms = [...forms, newForm]
    setForms(updatedForms)
    saveForms(updatedForms)
    navigate(`/builder/${newForm.id}`)
  }

  const handleUseTemplate = (templateFn: () => FormDefinition) => {
    const template = templateFn()
    const updatedForms = [...forms, template]
    setForms(updatedForms)
    saveForms(updatedForms)
    navigate(`/builder/${template.id}`)
  }

  const handleDuplicate = (form: FormDefinition) => {
    const now = new Date().toISOString()
    const duplicated: FormDefinition = {
      ...form,
      id: generateId(),
      title: form.title + " (Copy)",
      createdAt: now,
      updatedAt: now,
      fields: form.fields.map((f) => ({ ...f, id: generateId() })),
    }
    const updatedForms = [...forms, duplicated]
    setForms(updatedForms)
    saveForms(updatedForms)
  }

  const handleRename = (form: FormDefinition) => {
    const newTitle = prompt("Enter new form name:", form.title)
    if (newTitle && newTitle.trim()) {
      const updated = forms.map((f) =>
        f.id === form.id ? { ...f, title: newTitle.trim(), updatedAt: new Date().toISOString() } : f
      )
      setForms(updated)
      saveForms(updated)
    }
  }

  const handleDelete = (id: string) => {
    const updated = forms.filter((f) => f.id !== id)
    setForms(updated)
    saveForms(updated)
    setShowConfirmDelete(null)
  }

  const handleExport = (form: FormDefinition) => {
    const data = exportForm(form)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        const imported = importForm(json)
        const now = new Date().toISOString()
        const formWithNewId = {
          ...imported,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          fields: imported.fields.map((f) => ({ ...f, id: generateId() })),
        }
        const updated = [...forms, formWithNewId]
        setForms(updated)
        saveForms(updated)
        alert("Form imported successfully")
      } catch (err) {
        alert("Failed to import form: " + (err as Error).message)
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-[--color-bg-alt]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[--color-text]">Your Forms</h2>
              <p className="text-[--color-text-muted] mt-1">Create, manage, and test your forms</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleCreateForm} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Form
              </Button>
              <label className="cursor-pointer">
                <Button variant="secondary" className="gap-2 pointer-events-none">
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-muted]" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[--color-border] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-[--color-text] mb-3">Quick Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => handleUseTemplate(createContactUsTemplate)}
                className="p-4 bg-white border border-[--color-border] rounded-lg hover:border-[--color-primary] hover:shadow-sm transition-all text-left"
              >
                <div className="font-medium text-[--color-text] mb-1">Contact Us</div>
                <div className="text-sm text-[--color-text-muted]">Contact form with message field</div>
              </button>
              <button
                onClick={() => handleUseTemplate(createRegistrationTemplate)}
                className="p-4 bg-white border border-[--color-border] rounded-lg hover:border-[--color-primary] hover:shadow-sm transition-all text-left"
              >
                <div className="font-medium text-[--color-text] mb-1">Registration</div>
                <div className="text-sm text-[--color-text-muted]">Signup form with validation</div>
              </button>
              <button
                onClick={() => handleUseTemplate(createFeedbackTemplate)}
                className="p-4 bg-white border border-[--color-border] rounded-lg hover:border-[--color-primary] hover:shadow-sm transition-all text-left"
              >
                <div className="font-medium text-[--color-text] mb-1">Feedback</div>
                <div className="text-sm text-[--color-text-muted]">Collect user feedback and ratings</div>
              </button>
            </div>
          </div>

          {filteredForms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-[--color-border]">
              <div className="text-[--color-text-muted] mb-4">
                {searchTerm ? "No forms match your search" : "No forms yet"}
              </div>
              {!searchTerm && (
                <Button onClick={handleCreateForm} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create your first form
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredForms.map((form) => (
                <div key={form.id} className="bg-white border border-[--color-border] rounded-lg hover:shadow-sm transition-shadow">
                  <div className="p-4">
                    <h4 className="font-medium text-[--color-text] mb-1 truncate">{form.title}</h4>
                    <p className="text-xs text-[--color-text-muted] mb-3">
                      Updated {formatDate(form.updatedAt)} • {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => navigate(`/builder/${form.id}`)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleDuplicate(form)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Duplicate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleRename(form)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Rename
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleExport(form)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-[--color-danger] hover:text-[--color-danger]"
                        onClick={() => setShowConfirmDelete(form.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-medium text-[--color-text] mb-2">Delete Form</h3>
            <p className="text-[--color-text-muted] mb-4">
              Are you sure you want to delete this form? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={() => handleDelete(showConfirmDelete)} className="flex-1">
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setShowConfirmDelete(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

