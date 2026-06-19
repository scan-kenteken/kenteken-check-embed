export const KENTEKEN_FONT =
  '"Kenteken Smits", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

const FONT_FILE = 'kenteken.woff2'
const CDN_ASSET_BASE = 'https://cdn.scankenteken.nl/kenteken-check/v1/'

function moduleAssetBase(): string | null {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return new URL('.', import.meta.url).href
    }
  } catch {
    /* ignore */
  }
  return null
}

function scriptAssetBase(): string | null {
  const current = document.currentScript
  if (current instanceof HTMLScriptElement && current.src) {
    return current.src.replace(/\/[^/]*$/, '/')
  }

  const embed = document.querySelector('script[src*="embed.js"], script[src*="index.js"]')
  if (embed instanceof HTMLScriptElement && embed.src) {
    return embed.src.replace(/\/[^/]*$/, '/')
  }

  return null
}

export function getEmbedAssetBase(): string {
  return scriptAssetBase() ?? moduleAssetBase() ?? CDN_ASSET_BASE
}

export function kentekenFontFace(base: string): string {
  if (!base) return ''
  const url = `${base}${FONT_FILE}`.replace(/"/g, '\\"')
  return `@font-face{font-family:"Kenteken Smits";src:url("${url}") format("woff2");font-display:swap;font-weight:400;font-style:normal}`
}
