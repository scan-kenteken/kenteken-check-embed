import { formatApkInfo, formatCurrency, formatDate, formatEuroClass } from './format'
import type { Field, FieldRow, VehicleResponse } from './types'
import { FIELD_LABELS } from './types'

function readZeZone(data: VehicleResponse): string | null {
  const raw = data.ze_zone ?? data.ze
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (raw && typeof raw === 'object') {
    const label = raw.label ?? raw.status
    if (label?.trim()) return label.trim()
  }
  const vehicleZe = (data.vehicle as Record<string, unknown> | undefined)?.ze_zone
  if (typeof vehicleZe === 'string' && vehicleZe.trim()) return vehicleZe.trim()
  return null
}

function readBrand(data: VehicleResponse): string | null {
  const merk = data.vehicle?.merk?.trim()
  const model = data.vehicle?.model?.trim()
  if (merk && model) return `${merk} ${model}`
  if (merk) return merk
  if (model) return model
  return null
}

function readApk(data: VehicleResponse): Pick<FieldRow, 'value' | 'apkValid'> {
  const apk = data.vehicle?.vervaldatum_apk
  if (!apk) return { value: null }
  const info = formatApkInfo(apk)
  if (!info) return { value: formatDate(apk) }
  return { value: info.display, apkValid: info.valid }
}

function readPrice(data: VehicleResponse): string | null {
  const price = data.vehicle?.catalogusprijs
  if (price == null || Number.isNaN(price)) return null
  return formatCurrency(price)
}

function readEuro(data: VehicleResponse): string | null {
  const euro = data.fuel?.[0]?.euro
  if (euro == null) return null
  return formatEuroClass(euro)
}

type FieldReader = (data: VehicleResponse) => Pick<FieldRow, 'value' | 'apkValid'>

const FIELD_READERS: Record<Field, FieldReader> = {
  brand: (data) => ({ value: readBrand(data) }),
  apk: (data) => readApk(data),
  price: (data) => ({ value: readPrice(data) }),
  euro: (data) => ({ value: readEuro(data) }),
  ze: (data) => ({ value: readZeZone(data) }),
}

export function extractFieldValue(field: Field, data: VehicleResponse): string | null {
  return FIELD_READERS[field](data).value
}

export function buildFieldRows(fields: Field[], data: VehicleResponse): FieldRow[] {
  return fields.map((key) => ({
    key,
    label: FIELD_LABELS[key],
    ...FIELD_READERS[key](data),
  }))
}

export function visibleRows(rows: FieldRow[], layout: 'compact' | 'card'): FieldRow[] {
  if (layout === 'card') return rows
  return rows.filter((row) => row.value !== null)
}
