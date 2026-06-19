export type Preset = 'garage' | 'dealer' | 'fleet' | 'full'
export type Field = 'brand' | 'apk' | 'price' | 'euro' | 'ze'
export type Layout = 'compact' | 'card'
export type Theme = 'light' | 'dark' | 'auto'

export interface WidgetConfig {
  preset: Preset
  fields: Field[]
  layout: Layout
  theme: Theme
  plate: string
  showInput: boolean
  linkOut: boolean
  attribution: boolean
  apiBase: string
}

export interface FuelEntry {
  type?: string
  euro?: number
}

export interface VehiclePayload {
  kenteken?: string
  merk?: string
  model?: string
  vervaldatum_apk?: string
  catalogusprijs?: number
  voertuigsoort?: string
}

export interface VehicleResponse {
  kenteken_norm?: string
  vehicle?: VehiclePayload
  fuel?: FuelEntry[]
  ze_zone?: string | { label?: string; status?: string }
  ze?: string | { label?: string; status?: string }
}

export type FetchErrorKind = 'invalid' | 'not_found' | 'rate_limit' | 'network'

export interface FetchError {
  kind: FetchErrorKind
  message: string
}

export type FetchResult =
  | { ok: true; data: VehicleResponse }
  | { ok: false; error: FetchError }

export interface FieldRow {
  key: Field
  label: string
  value: string | null
  apkValid?: boolean
}

export const PRESET_FIELDS: Record<Preset, Field[]> = {
  garage: ['brand', 'apk'],
  dealer: ['brand', 'apk', 'price'],
  fleet: ['brand', 'euro'],
  full: ['brand', 'apk', 'price', 'euro'],
}

export const FIELD_LABELS: Record<Field, string> = {
  brand: 'Merk & model',
  apk: 'APK vervaldatum',
  price: 'Catalogusprijs',
  euro: 'Euroklasse',
  ze: 'ZE-zone',
}

export const DEFAULT_API_BASE = 'https://api.scankenteken.nl'
