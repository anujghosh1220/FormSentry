import type { FormField, FieldType } from "../types/form"

/**
 * Renders a miniature of a form definition as an inline SVG data URI, so the
 * template gallery hover previews are real, offline-generated artwork instead
 * of remote images.
 */
export function templatePreviewImage(
  title: string,
  description: string,
  fields: FormField[]
): string {
  const W = 300
  const H = 400
  const crsm = "#F04452"
  const parts: string[] = []

  parts.push(
    `<rect width="${W}" height="${H}" fill="#0d0d10"/>`,
    `<rect width="${W}" height="4" fill="${crsm}"/>`,
    `<text x="20" y="38" fill="#F8F7F5" font-family="sans-serif" font-size="16" font-weight="700">${esc(title)}</text>`,
    `<text x="20" y="54" fill="#8b8b93" font-family="sans-serif" font-size="9">${esc(truncate(description, 46))}</text>`
  )

  let y = 78
  for (const field of fields.slice(0, 6)) {
    parts.push(`<rect x="20" y="${y}" width="54" height="4" rx="2" fill="#3f3f48"/>`)
    y += 10
    parts.push(control(field.type, y))
    y += controlHeight(field.type) + 14
  }

  parts.push(
    `<rect x="${W / 2 - 45}" y="${Math.min(y, H - 34)}" width="90" height="22" rx="6" fill="${crsm}"/>`,
    `<text x="${W / 2}" y="${Math.min(y, H - 34) + 15}" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="10" font-weight="600">Submit</text>`
  )

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    parts.join("") +
    `</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function control(type: FieldType, y: number): string {
  const x = 20
  const w = W_PAD
  switch (type) {
    case "textarea":
      return [
        `<rect x="${x}" y="${y}" width="${w}" height="42" rx="6" fill="#15151a" stroke="#2c2c33"/>`,
        `<rect x="${x + 10}" y="${y + 10}" width="150" height="3" rx="1.5" fill="#3a3a44"/>`,
        `<rect x="${x + 10}" y="${y + 20}" width="120" height="3" rx="1.5" fill="#3a3a44"/>`,
      ].join("")
    case "select":
      return [
        `<rect x="${x}" y="${y}" width="${w}" height="22" rx="6" fill="#15151a" stroke="#2c2c33"/>`,
        `<rect x="${x + 10}" y="${y + 9}" width="70" height="3" rx="1.5" fill="#3a3a44"/>`,
        `<path d="M${x + w - 18} ${y + 9}l4 4 4-4" fill="none" stroke="#8b8b93" stroke-width="1.4" stroke-linecap="round"/>`,
      ].join("")
    case "radio":
      return [
        `<rect x="${x}" y="${y}" width="${w}" height="36" rx="6" fill="#15151a" stroke="#2c2c33"/>`,
        `<circle cx="${x + 16}" cy="${y + 12}" r="5" fill="none" stroke="${crsmColor()}" stroke-width="1.6"/>`,
        `<circle cx="${x + 16}" cy="${y + 12}" r="2" fill="${crsmColor()}"/>`,
        `<rect x="${x + 28}" y="${y + 10}" width="96" height="3" rx="1.5" fill="#3a3a44"/>`,
        `<circle cx="${x + 16}" cy="${y + 26}" r="5" fill="none" stroke="#3a3a44" stroke-width="1.6"/>`,
        `<rect x="${x + 28}" y="${y + 24}" width="72" height="3" rx="1.5" fill="#3a3a44"/>`,
      ].join("")
    case "checkbox":
      return [
        `<rect x="${x}" y="${y}" width="${w}" height="22" rx="6" fill="#15151a" stroke="#2c2c33"/>`,
        `<rect x="${x + 10}" y="${y + 6}" width="10" height="10" rx="3" fill="${crsmColor()}"/>`,
        `<path d="M${x + 12.5} ${y + 11}l2 2 3.5-4" fill="none" stroke="#0d0d10" stroke-width="1.4" stroke-linecap="round"/>`,
        `<rect x="${x + 28}" y="${y + 9}" width="128" height="3" rx="1.5" fill="#3a3a44"/>`,
      ].join("")
    case "date":
      return [
        `<rect x="${x}" y="${y}" width="${w}" height="22" rx="6" fill="#15151a" stroke="#2c2c33"/>`,
        `<rect x="${x + 10}" y="${y + 9}" width="60" height="3" rx="1.5" fill="#3a3a44"/>`,
        `<rect x="${x + w - 26}" y="${y + 6}" width="16" height="11" rx="2" fill="none" stroke="#8b8b93" stroke-width="1.2"/>`,
      ].join("")
    default:
      return [
        `<rect x="${x}" y="${y}" width="${w}" height="22" rx="6" fill="#15151a" stroke="#2c2c33"/>`,
        `<rect x="${x + 10}" y="${y + 9}" width="84" height="3" rx="1.5" fill="#3a3a44"/>`,
      ].join("")
  }
}

const W_PAD = 260

function crsmColor(): string {
  return "#F04452"
}

function controlHeight(type: FieldType): number {
  switch (type) {
    case "textarea":
      return 42
    case "radio":
      return 36
    default:
      return 22
  }
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}
