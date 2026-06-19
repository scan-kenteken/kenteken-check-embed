import { formatKenteken, formatKentekenPartial, isKenteken, normalizeKenteken } from 'kenteken-kit'

export const normalizePlate = normalizeKenteken
export const isValidPlate = isKenteken

function dashFallback(normalized: string): string {
  const runs = normalized.match(/[A-Z]+|\d+/g)
  if (!runs) return normalized
  if (runs.length === 3) return runs.join('-')
  return runs.map((run) => run.match(/.{1,2}/g)?.join('-') ?? run).join('-')
}

export function formatPlateInput(raw: string): string {
  const normalized = normalizeKenteken(raw).slice(0, 6)
  if (!normalized) return ''

  const formatted = formatKentekenPartial(normalized)
  if (normalized.length === 6 && !formatted.includes('-')) {
    return dashFallback(normalized)
  }
  return formatted
}

export function formatPlateDisplay(raw: string): string {
  const normalized = normalizeKenteken(raw)
  if (!normalized) return ''
  if (normalized.length === 6) {
    const formatted = formatKenteken(raw)
    return formatted.includes('-') ? formatted : dashFallback(normalized)
  }
  return formatKentekenPartial(raw)
}

export function formatDate(iso: string): string {
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  const [y, m, d] = parts
  if (!y || !m || !d) return iso
  return `${d}-${m}-${y}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatEuroClass(euro: number): string {
  return `Euro ${euro}`
}

export interface ApkInfo {
  display: string
  valid: boolean
}

export function formatApkInfo(iso: string): ApkInfo | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null

  const expiry = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  const now = new Date()
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((expiry - today) / 86_400_000)
  const valid = days >= 0
  const suffix = valid
    ? ` (${days} ${days === 1 ? 'dag' : 'dagen'})`
    : ' (verlopen)'

  return {
    display: `${formatDate(iso)}${suffix}`,
    valid,
  }
}
