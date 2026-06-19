import type { Field, Layout, Preset, Theme, WidgetConfig } from './types'
import { DEFAULT_API_BASE, PRESET_FIELDS } from './types'

const PRESETS = new Set<Preset>(['garage', 'dealer', 'fleet', 'full'])
const FIELDS = new Set<Field>(['brand', 'apk', 'price', 'euro', 'ze'])
const LAYOUTS = new Set<Layout>(['compact', 'card'])
const THEMES = new Set<Theme>(['light', 'dark', 'auto'])

export function parseBool(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback
  const v = value.trim().toLowerCase()
  if (v === 'false' || v === '0' || v === 'no') return false
  if (v === 'true' || v === '1' || v === 'yes') return true
  return fallback
}

function parseEnum<T extends string>(value: string | null, set: Set<T>, fallback: T): T {
  const v = (value ?? fallback).trim().toLowerCase() as T
  return set.has(v) ? v : fallback
}

function parseFields(value: string | null, preset: Preset): Field[] {
  if (!value?.trim()) return [...PRESET_FIELDS[preset]]
  const parsed = value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter((part): part is Field => FIELDS.has(part as Field))
  return parsed.length > 0 ? parsed : [...PRESET_FIELDS[preset]]
}

function parseApiBase(value: string | null): string {
  const raw = (value ?? DEFAULT_API_BASE).trim()
  try {
    const url = new URL(raw)
    return url.origin
  } catch {
    return DEFAULT_API_BASE
  }
}

export function readConfig(el: HTMLElement): WidgetConfig {
  const preset = parseEnum(el.getAttribute('preset'), PRESETS, 'garage' as Preset)
  return {
    preset,
    fields: parseFields(el.getAttribute('fields'), preset),
    layout: parseEnum(el.getAttribute('layout'), LAYOUTS, 'card' as Layout),
    theme: parseEnum(el.getAttribute('theme'), THEMES, 'auto' as Theme),
    plate: (el.getAttribute('plate') ?? '').trim(),
    showInput: parseBool(el.getAttribute('show-input'), true),
    linkOut: parseBool(el.getAttribute('link-out'), true),
    attribution: parseBool(el.getAttribute('attribution'), true),
    apiBase: parseApiBase(el.getAttribute('api-base')),
  }
}
