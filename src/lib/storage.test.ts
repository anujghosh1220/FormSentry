import { describe, it, expect, beforeEach } from "vitest"
import { loadForms, saveForms, exportForm, importForm } from "./storage"

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("saves and loads forms", () => {
    const forms = [
      {
        id: "1",
        title: "Test Form",
        description: "",
        fields: [],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        version: 1,
      },
    ]
    saveForms(forms)
    const loaded = loadForms()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe("1")
  })

  it("exports and imports form", () => {
    const form = {
      id: "1",
      title: "Test Form",
      description: "desc",
      fields: [],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      version: 1,
    }
    const exported = exportForm(form)
    const imported = importForm(exported)
    expect(imported.id).toBe("1")
    expect(imported.title).toBe("Test Form")
  })

  it("rejects invalid import", () => {
    expect(() => importForm("{}")).toThrow()
  })
})

