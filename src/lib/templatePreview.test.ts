import { describe, expect, it } from "vitest"
import { templatePreviewImage } from './templatePreview'
import { createContactUsTemplate } from '../constants/templates'
import { FORM_ICON_KEYS, getFormIcon, isFormIconKey } from './formIcons'

describe('templatePreviewImage', () => {
  it('returns an inline svg data uri', () => {
    const uri = templatePreviewImage('Contact Us', 'Say hello', [])
    expect(uri.startsWith('data:image/svg+xml;utf8,')).toBe(true)
    const svg = decodeURIComponent(uri.slice('data:image/svg+xml;utf8,'.length))
    expect(svg).toContain('<svg')
    expect(svg).toContain('Contact Us')
  })

  it('escapes markup in titles', () => {
    const uri = templatePreviewImage('<script>&', 'desc', [])
    const svg = decodeURIComponent(uri.slice('data:image/svg+xml;utf8,'.length))
    expect(svg).not.toContain('<script>')
    expect(svg).toContain('&lt;script&gt;')
  })

  it('renders real template fields', () => {
    const template = createContactUsTemplate()
    const uri = templatePreviewImage(template.title, template.description ?? '', template.fields)
    const svg = decodeURIComponent(uri.slice('data:image/svg+xml;utf8,'.length))
    expect(svg).toContain('Submit')
    expect(template.fields.length).toBeGreaterThan(0)
  })
})

describe('formIcons', () => {
  it('exposes a known set of icon keys', () => {
    expect(FORM_ICON_KEYS.length).toBeGreaterThan(4)
    for (const key of FORM_ICON_KEYS) {
      expect(isFormIconKey(key)).toBe(true)
    }
  })

  it('falls back to the default icon', () => {
    expect(isFormIconKey('nope')).toBe(false)
    expect(getFormIcon('nope')).toBe(getFormIcon())
    expect(getFormIcon(undefined)).toBe(getFormIcon())
  })
})
