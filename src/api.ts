import { API_BASE, type FetchError, type FetchResult, type VehicleResponse } from './types'
import { isValidPlate, normalizePlate } from './format'

export function vehicleUrl(plate: string): string {
  return `${API_BASE}/api/vehicles/${encodeURIComponent(normalizePlate(plate))}`
}

function apiErrorMessage(status: number, body?: string): FetchError {
  const normalized = body?.trim().toLowerCase()

  if (status === 400 || normalized === 'invalid plate') {
    return { kind: 'invalid', message: 'Dit kenteken is ongeldig' }
  }

  if (status === 404) {
    return { kind: 'not_found', message: 'Kenteken niet gevonden' }
  }

  if (status === 429) {
    return { kind: 'rate_limit', message: 'Te veel verzoeken. Probeer het later opnieuw.' }
  }

  return { kind: 'network', message: 'Kon gegevens niet ophalen' }
}

async function readApiError(response: Response): Promise<FetchError> {
  try {
    const data = (await response.json()) as { error?: string }
    return apiErrorMessage(response.status, data.error)
  } catch {
    return apiErrorMessage(response.status)
  }
}

export async function fetchVehicle(plate: string, signal?: AbortSignal): Promise<FetchResult> {
  const norm = normalizePlate(plate)
  if (!isValidPlate(norm)) {
    const incomplete = norm.length < 6
    return {
      ok: false,
      error: {
        kind: 'invalid',
        message: incomplete ? 'Voer een geldig kenteken in' : 'Dit kenteken is ongeldig',
      },
    }
  }

  let response: Response
  try {
    response = await fetch(vehicleUrl(norm), { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    return {
      ok: false,
      error: { kind: 'network', message: 'Kon gegevens niet ophalen' },
    }
  }

  if (!response.ok) {
    return { ok: false, error: await readApiError(response) }
  }

  let data: VehicleResponse
  try {
    data = (await response.json()) as VehicleResponse
  } catch {
    return {
      ok: false,
      error: { kind: 'network', message: 'Kon gegevens niet ophalen' },
    }
  }

  if (!data.vehicle?.merk && !data.vehicle?.model) {
    return { ok: false, error: apiErrorMessage(404) }
  }

  return { ok: true, data }
}
