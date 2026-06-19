export type Field = 'brand' | 'apk' | 'price' | 'euro' | 'link'
export type Theme = 'light' | 'dark' | 'auto'

export interface WidgetConfig {
  fields: Field[]
  theme: Theme
  plate: string
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

export const DEFAULT_FIELDS: Field[] = ['brand', 'apk', 'link']

export const FIELD_LABELS: Record<Field, string> = {
  brand: 'Merk & model',
  apk: 'APK vervaldatum',
  price: 'Catalogusprijs',
  euro: 'Euroklasse',
  link: 'Link naar meer details',
}

export const API_BASE = 'https://api.scankenteken.nl'
