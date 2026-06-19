import { formatApkInfo, formatCurrency, formatDate, formatEuroClass } from './format'
import type { Field, FieldRow, VehicleResponse } from './types'
import { FIELD_LABELS } from './types'

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
}

export function buildFieldRows(fields: Field[], data: VehicleResponse): FieldRow[] {
  return fields
    .filter((key) => key !== 'link')
    .map((key) => ({
      key,
      label: FIELD_LABELS[key],
      ...FIELD_READERS[key](data),
    }))
}
