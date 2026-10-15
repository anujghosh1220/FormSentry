import { describe, it, expect } from "vitest"
import { validateField } from "./validation"
import type { FormField } from "../types/form"

describe("validation", () => {
  it("validates required fields", () => {
    const field: FormField = {
      id: "1",
      type: "text",
      label: "Name",
      required: true,
      order: 0,
      validation: { required: true },
    }
    expect(validateField(field, "").valid).toBe(false)
    expect(validateField(field, "John").valid).toBe(true)
  })

  it("validates email", () => {
    const field: FormField = {
      id: "1",
      type: "email",
      label: "Email",
      required: true,
      order: 0,
      validation: { required: true },
    }
    expect(validateField(field, "invalid").valid).toBe(false)
    expect(validateField(field, "test@example.com").valid).toBe(true)
  })

  it("allows optional empty email", () => {
    const field: FormField = {
      id: "1",
      type: "email",
      label: "Email",
      required: false,
      order: 0,
    }
    expect(validateField(field, "").valid).toBe(true)
  })

  it("validates min max length", () => {
    const field: FormField = {
      id: "1",
      type: "text",
      label: "Name",
      required: true,
      order: 0,
      validation: { required: true, minLength: 3, maxLength: 5 },
    }
    expect(validateField(field, "ab").valid).toBe(false)
    expect(validateField(field, "abcdef").valid).toBe(false)
    expect(validateField(field, "abc").valid).toBe(true)
    expect(validateField(field, "abcde").valid).toBe(true)
  })

  it("validates number", () => {
    const field: FormField = {
      id: "1",
      type: "number",
      label: "Age",
      required: true,
      order: 0,
      validation: { required: true, min: 18, max: 100 },
    }
    expect(validateField(field, 10).valid).toBe(false)
    expect(validateField(field, 200).valid).toBe(false)
    expect(validateField(field, 25).valid).toBe(true)
  })

  it("validates checkbox", () => {
    const field: FormField = {
      id: "1",
      type: "checkbox",
      label: "Terms",
      required: true,
      order: 0,
      validation: { required: true },
    }
    expect(validateField(field, false).valid).toBe(false)
    expect(validateField(field, true).valid).toBe(true)
  })
})

