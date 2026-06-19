import type { Field, Theme, WidgetConfig } from './types'
import { DEFAULT_FIELDS } from './types'

const FIELDS = new Set<Field>(['brand', 'apk', 'price', 'euro'])
const THEMES = new Set<Theme>(['light', 'dark', 'auto'])

function parseBool(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback
  const v = value.trim().toLowerCase()
  if (v === 'false' || v === '0' || v === 'no') return false
  if (v === 'true' || v === '1' || v === 'yes') return true
  return fallback
}

function parseFields(value: string | null): Field[] {
  if (!value?.trim()) return [...DEFAULT_FIELDS]
  const parsed = value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter((part): part is Field => FIELDS.has(part as Field))
  return parsed.length > 0 ? parsed : [...DEFAULT_FIELDS]
}

function parseTheme(value: string | null): Theme {
  const v = (value ?? 'auto').trim().toLowerCase() as Theme
  return THEMES.has(v) ? v : 'auto'
}

export function readConfig(el: HTMLElement): WidgetConfig {
  return {
    fields: parseFields(el.getAttribute('fields')),
    theme: parseTheme(el.getAttribute('theme')),
    plate: (el.getAttribute('plate') ?? '').trim(),
    linkOut: parseBool(el.getAttribute('link-out'), true),
  }
}
