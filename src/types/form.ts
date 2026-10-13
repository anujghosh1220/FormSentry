export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  minDate?: string
  maxDate?: string
  pattern?: string
  customMessage?: {
    required?: string
    email?: string
    minLength?: string
    maxLength?: string
    min?: string
    max?: string
    minDate?: string
    maxDate?: string
    pattern?: string
    invalidOption?: string
  }
}

export interface FieldOption {
  id: string
  label: string
  value: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  defaultValue?: string | number | boolean
  options?: FieldOption[]
  validation?: FieldValidation
  order: number
}

export interface FormDefinition {
  id: string
  title: string
  description?: string
  fields: FormField[]
  createdAt: string
  updatedAt: string
  version: number
}

export interface StoredForms {
  forms: FormDefinition[]
  version: number
}

