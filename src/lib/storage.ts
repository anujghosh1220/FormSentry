import type { FormDefinition, StoredForms } from '../types/form'

const STORAGE_KEY = 'formsentry_forms'
const STORAGE_VERSION = 1

export function loadForms(): FormDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredForms | FormDefinition[]
    if (Array.isArray(parsed)) {
      return parsed
    }
    if (parsed.forms && Array.isArray(parsed.forms)) {
      return parsed.forms
    }
    return []
  } catch (e) {
    console.error('Failed to load forms from localStorage:', e)
    return []
  }
}

export function saveForms(forms: FormDefinition[]): void {
  try {
    const data: StoredForms = {
      forms,
      version: STORAGE_VERSION,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save forms to localStorage:', e)
    throw e
  }
}

export function exportForm(form: FormDefinition): string {
  return JSON.stringify(form, null, 2)
}

export function importForm(json: string): FormDefinition {
  try {
    const parsed = JSON.parse(json) as FormDefinition
    if (!parsed.id || !parsed.title || !Array.isArray(parsed.fields)) {
      throw new Error('Invalid form structure')
    }
    return parsed
  } catch (e) {
    throw new Error('Invalid JSON or form structure')
  }
}

