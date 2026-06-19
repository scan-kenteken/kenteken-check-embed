export const KENTEKEN_FONT =
  '"Kenteken Smits", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

const FONT_FILE = 'kenteken.woff2'

export function getEmbedAssetBase(): string {
  const script = document.currentScript
  if (script instanceof HTMLScriptElement && script.src) {
    return script.src.replace(/\/[^/]*$/, '/')
  }

  const embed = document.querySelector('script[src*="embed.js"]')
  if (embed instanceof HTMLScriptElement && embed.src) {
    return embed.src.replace(/\/[^/]*$/, '/')
  }

  return ''
}

export function kentekenFontFace(base: string): string {
  if (!base) return ''
  const url = `${base}${FONT_FILE}`.replace(/"/g, '\\"')
  return `@font-face{font-family:"Kenteken Smits";src:url("${url}") format("woff2");font-display:swap;font-weight:400;font-style:normal}`
}
