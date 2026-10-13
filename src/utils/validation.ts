import type { FormField } from "../types/form"

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateField(field: FormField, value: any): ValidationResult {
  const errors: string[] = []
  const validation = field.validation || {}

  const isEmpty = value === undefined || value === null || value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "string" && value.trim() === "")

  const required = validation.required || field.required

  if (required) {
    if (field.type === "checkbox") {
      if (!value) {
        errors.push(validation.customMessage?.required || field.label + " is required")
      }
    } else if (isEmpty) {
      errors.push(validation.customMessage?.required || field.label + " is required")
    }
  }

  if (isEmpty && !required) {
    return { valid: true, errors: [] }
  }

  if (field.type === "email" && typeof value === "string") {
    if (!EMAIL_REGEX.test(value.trim())) {
      errors.push(validation.customMessage?.email || "Please enter a valid email address")
    }
  }

  if (field.type === "text" || field.type === "password" || field.type === "textarea") {
    const str = String(value)
    if (validation.minLength !== undefined && str.length < validation.minLength) {
      errors.push(validation.customMessage?.minLength || field.label + " must be at least " + validation.minLength + " characters")
    }
    if (validation.maxLength !== undefined && str.length > validation.maxLength) {
      errors.push(validation.customMessage?.maxLength || field.label + " must be at most " + validation.maxLength + " characters")
    }
  }

  if (field.type === "number") {
    const num = Number(value)
    if (isNaN(num)) {
      errors.push("Please enter a valid number")
    } else {
      if (validation.min !== undefined && num < validation.min) {
        errors.push(validation.customMessage?.min || field.label + " must be at least " + validation.min)
      }
      if (validation.max !== undefined && num > validation.max) {
        errors.push(validation.customMessage?.max || field.label + " must be at most " + validation.max)
      }
    }
  }

  if (field.type === "select" || field.type === "radio") {
    if (value === "" || value === undefined || value === null) {
      errors.push(validation.customMessage?.invalidOption || "Please select an option")
    }
  }

  if (field.type === "date") {
    if (typeof value === "string" && value !== "") {
      const d = new Date(value + "T00:00:00")
      if (validation.minDate) {
        const minD = new Date(validation.minDate + "T00:00:00")
        if (d < minD) {
          errors.push(validation.customMessage?.minDate || field.label + " must be on or after " + validation.minDate)
        }
      }
      if (validation.maxDate) {
        const maxD = new Date(validation.maxDate + "T00:00:00")
        if (d > maxD) {
          errors.push(validation.customMessage?.maxDate || field.label + " must be on or before " + validation.maxDate)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateForm(fields: FormField[], values: Record<string, any>): { valid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}
  let valid = true
  for (const field of fields) {
    const result = validateField(field, values[field.id])
    if (!result.valid) {
      errors[field.id] = result.errors
      valid = false
    }
  }
  return { valid, errors }
}

